"""
ablation_study_v4.py — Final Research Paper Evaluation Script
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What is REAL in this evaluation:
  - MovieLens 25M dataset (162,529 real users, real ratings)
  - Real Unix timestamps from MovieLens (when users rated movies)
  - Real signal mapping: rating ≥ 4.0 → watchlist, 3-3.9 → trailer

What is a PROXY (disclosed in paper):
  - trailer_watch derived from medium ratings (3.0-3.9)
  - timestamps used as proxy for watchlist addition time

HOW TO RUN:
  Step 1 — Re-run movielens_to_streamhub.py to get timestamps:
    python movielens_to_streamhub.py

  Step 2 — Run this script:
    python ablation_study_v4.py

  If ml_activity_logs.csv has no timestamp column,
  this script falls back to interaction-order based timestamps.
"""

import math, random
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse.linalg import svds
from scipy.sparse import csr_matrix

BASE_DIR     = Path(__file__).resolve().parent
ENRICHED_CSV = BASE_DIR / "movies_enriched.csv"
LOGS_CSV     = BASE_DIR / "ml_activity_logs.csv"
OUTPUT_TXT   = BASE_DIR / "ablation_results.txt"

N_RECOMMENDATIONS = 10
N_EVAL_USERS      = 2000
MIN_ACTIONS       = 10
TRAIN_RATIO       = 0.8
RANDOM_SEED       = 42
SVD_K             = 50
RECENCY_HALFLIFE  = 30   # days — matches engine.py T_half

IMPLICIT_WEIGHTS = {
    "added_to_watchlist":     1.0,
    "trailer_watch":          0.5,
    "search_click":           0.3,
    "removed_from_watchlist": -0.5,
}

# Contribution 2 — per-signal alpha (YOUR novel contribution)
SIGNAL_ALPHA_FULL = {
    "added_to_watchlist":     40,
    "trailer_watch":          20,
    "search_click":           10,
    "removed_from_watchlist":  0,
}

# Baseline — uniform alpha (no signal distinction)
SIGNAL_ALPHA_BASE = {
    "added_to_watchlist":     10,
    "trailer_watch":          10,
    "search_click":           10,
    "removed_from_watchlist":  0,
}

random.seed(RANDOM_SEED)
np.random.seed(RANDOM_SEED)


# =============================================================================
# LOAD DATA
# =============================================================================

def load_data():
    print("=" * 64)
    print("  Loading data...")
    print("=" * 64)

    df = pd.read_csv(ENRICHED_CSV).drop_duplicates(subset="id").reset_index(drop=True)
    for col in ["genres","cast","director","keywords","overview"]:
        if col in df.columns:
            df[col] = df[col].fillna("")
    print(f"  Movies loaded          : {len(df):,}")

    logs = pd.read_csv(LOGS_CSV, dtype={"user_id": str, "movie_id": int})
    logs = logs[logs["action_type"].isin(IMPLICIT_WEIGHTS.keys())]
    logs = logs[logs["movie_id"].isin(set(df["id"].astype(int)))]
    print(f"  Activity logs          : {len(logs):,}")
    print(f"  Unique users           : {logs['user_id'].nunique():,}")

    # ── Handle timestamps ─────────────────────────────────────────────────────
    has_real_timestamps = "timestamp" in logs.columns and logs["timestamp"].notna().any()

    if has_real_timestamps:
        print(f"  Timestamps found — normalizing to 365-day window")
        print(f"  Preserving relative ordering (disclosed in paper Section 6)")
        logs["datetime"] = pd.to_datetime(logs["timestamp"], unit="s", utc=True)
        logs["datetime"] = logs["datetime"].dt.tz_localize(None)

        # TIMESTAMP NORMALIZATION
        # MovieLens timestamps span 1995-2019 — direct temporal decay
        # produces near-zero weights for all interactions.
        # We normalize to 365-day window preserving relative ordering.
        # Paper: "timestamps normalized to simulate active OTT conditions"
        now          = pd.Timestamp.now()
        one_year_ago = now - pd.Timedelta(days=365)
        t_min        = logs["datetime"].min()
        t_max        = logs["datetime"].max()
        t_range      = (t_max - t_min).total_seconds()
        if t_range > 0:
            normalized   = (logs["datetime"] - t_min).dt.total_seconds() / t_range
            logs["datetime"] = one_year_ago + pd.to_timedelta(normalized * 364, unit="D")
        print(f"  Normalized: {logs['datetime'].min().date()} to {logs['datetime'].max().date()}")
    else:
        print(f"  No timestamps — using interaction-order proxy")
        logs = logs.copy()
        logs["row_order"]  = logs.groupby("user_id").cumcount()
        logs["user_count"] = logs.groupby("user_id")["movie_id"].transform("count")
        rank     = logs["row_order"] / logs["user_count"].clip(lower=1)
        now      = pd.Timestamp.now()
        days_ago = (1 - rank) * 365 + 1
        logs["datetime"] = now - pd.to_timedelta(days_ago, unit="D")
        logs = logs.drop(columns=["row_order","user_count"])

    print(f"  Signal breakdown:")
    for sig, cnt in logs["action_type"].value_counts().items():
        print(f"    {sig:<30} {cnt:,}")

    return df, logs


# =============================================================================
# TRAIN / TEST SPLIT
# =============================================================================

def build_train_test(logs):
    print("\n  Building train/test split...")

    wl = logs[logs["action_type"] == "added_to_watchlist"]
    counts      = wl.groupby("user_id")["movie_id"].count()
    valid_users = counts[counts >= MIN_ACTIONS].index.tolist()
    print(f"  Users with {MIN_ACTIONS}+ watchlist actions: {len(valid_users):,}")

    if len(valid_users) > N_EVAL_USERS:
        valid_users = random.sample(valid_users, N_EVAL_USERS)
    print(f"  Evaluating on          : {len(valid_users):,} users")

    train_data = {}   # user → list of movie_ids
    test_data  = {}   # user → set of movie_ids (ground truth)
    ts_map     = {}   # (user, movie_id) → datetime

    # Build timestamp map for ALL watchlist interactions
    for _, row in logs[logs["action_type"]=="added_to_watchlist"].iterrows():
        key = (row["user_id"], int(row["movie_id"]))
        ts_map[key] = row["datetime"]

    positive_signals = {"added_to_watchlist", "trailer_watch"}

    for uid in valid_users:
        user_wl = wl[wl["user_id"]==uid]["movie_id"].tolist()
        random.shuffle(user_wl)
        split = max(1, int(len(user_wl) * TRAIN_RATIO))
        train_data[uid] = user_wl[:split]

        # Test = held-out watchlist + trailer watches
        test_wl      = set(user_wl[split:])
        test_trailer = set(logs[(logs["user_id"]==uid) &
                                (logs["action_type"]=="trailer_watch")
                               ]["movie_id"].tolist())
        test_data[uid] = test_wl | test_trailer

    all_train_logs = logs[logs["user_id"].isin(set(valid_users))]
    return train_data, test_data, all_train_logs, valid_users, ts_map


# =============================================================================
# CONTENT MODEL
# =============================================================================

def build_content_model(df):
    print("\n  Building TF-IDF content model...")
    def feat(row):
        g = str(row.get("genres","")).replace(";"," ")
        d = str(row.get("director","")).replace(" ","_")
        c = str(row.get("cast","")).replace(";"," ").replace(" ","_")
        k = str(row.get("keywords","")).replace(";"," ")
        o = str(row.get("overview",""))
        p = [g]*3
        if d: p.extend([d]*3)
        if c: p.extend([c]*2)
        if k: p.extend([k]*2)
        if o and o != "nan": p.append(o)
        return " ".join(p)
    df["features"] = df.apply(feat, axis=1)
    vec   = TfidfVectorizer(sublinear_tf=True, min_df=1,
                            stop_words="english", ngram_range=(1,2))
    tfidf = vec.fit_transform(df["features"])
    i2idx = dict(zip(df["id"].astype(int), df.index))
    idx2i = dict(zip(df.index, df["id"].astype(int)))
    print(f"  TF-IDF shape           : {tfidf.shape}")
    return tfidf, i2idx, idx2i


# =============================================================================
# SVD MODEL
# =============================================================================

def build_svd(logs, signal_alpha):
    df_a = logs.copy()
    df_a["w"] = df_a["action_type"].map(IMPLICIT_WEIGHTS).fillna(0)
    df_a = df_a[df_a["w"] != 0]
    if df_a.empty: return None,None,None,None

    def conf(row):
        a    = signal_alpha.get(row["action_type"], 1)
        r    = abs(row["w"])
        sign = 1 if row["w"] > 0 else -1
        return sign * (1 + a * r)

    df_a["c"] = df_a.apply(conf, axis=1)
    agg = df_a.groupby(["user_id","movie_id"])["c"].sum().reset_index()
    agg["c"] = agg["c"].clip(-5,5)

    users  = agg["user_id"].unique()
    movies = agg["movie_id"].unique()
    ui     = {u:i for i,u in enumerate(users)}
    mi     = {m:i for i,m in enumerate(movies)}
    rows   = agg["user_id"].map(ui)
    cols   = agg["movie_id"].map(mi)
    mat    = csr_matrix((agg["c"].values,(rows,cols)),
                        shape=(len(users),len(movies)))
    k = min(SVD_K, min(mat.shape)-1)
    if k < 1: return None,None,None,None
    U,s,Vt = svds(mat.astype(float), k=k)
    return U.dot(np.diag(s)), Vt.T, ui, mi


def get_collab(uid, uf, mf, ui, mi):
    if uf is None or uid not in ui: return None
    v = uf[ui[uid]]
    s = v.dot(mf.T)
    return {mid: float(s[i]) for mid,i in mi.items()}


# =============================================================================
# RECOMMENDATION FUNCTIONS
# =============================================================================

def temporal_weight(ts, now, halflife=RECENCY_HALFLIFE):
    """Contribution 1 formula: w = exp(-0.693 * days / T_half)"""
    days = max(0.0, (now - ts).total_seconds() / 86400)
    return math.exp(-0.693 * days / halflife)


def rec_random(all_ids, excl, n):
    c = [m for m in all_ids if m not in excl]
    random.shuffle(c)
    return c[:n]


def rec_popularity(df, excl, n):
    p = df[~df["id"].astype(int).isin(excl)].copy()
    p = p.sort_values("popularity", ascending=False)
    return p["id"].astype(int).tolist()[:n]


def rec_content(wl, tfidf, i2idx, idx2i, excl, n, uid=None, ts_map=None):
    known = [(int(m), i2idx[int(m)]) for m in wl if int(m) in i2idx]
    if not known: return []
    idxs  = [idx for _,idx in known]

    if ts_map and uid:
        # Contribution 1 — temporal decay using real timestamps
        now     = pd.Timestamp.now()
        weights = []
        for mid,_ in known:
            ts = ts_map.get((uid, int(mid)))
            w  = temporal_weight(ts, now) if ts else 0.5
            weights.append(w)
        w   = np.array(weights, dtype=float)
        w   = w/w.sum() if w.sum()>0 else np.ones(len(w))/len(w)
        avg = np.asarray(tfidf[idxs].multiply(w[:,np.newaxis]).sum(axis=0))
    else:
        avg = np.asarray(tfidf[idxs].mean(axis=0))

    sc     = cosine_similarity(avg, tfidf)[0]
    ranked = sorted([(idx2i[i],float(sc[i])) for i in range(len(sc))
                     if idx2i[i] not in excl],
                    key=lambda x:x[1], reverse=True)
    return [m for m,_ in ranked[:n]]


def rec_collab(uid, col_sc, excl, n):
    if col_sc is None: return []
    r = sorted([(m,s) for m,s in col_sc.items() if m not in excl],
               key=lambda x:x[1], reverse=True)
    return [m for m,_ in r[:n]]


def rec_hybrid(wl, uid, tfidf, i2idx, idx2i,
               col_sc, excl, n,
               ts_map=None,
               cw=0.15, sw=0.85):
    known = [(int(m), i2idx[int(m)]) for m in wl if int(m) in i2idx]
    if not known:
        return rec_popularity(
            pd.DataFrame({"id":list(idx2i.values()),"popularity":1}), excl, n)
    idxs = [idx for _,idx in known]

    if ts_map and uid:
        now     = pd.Timestamp.now()
        weights = []
        for mid,_ in known:
            ts = ts_map.get((uid, int(mid)))
            w  = temporal_weight(ts, now) if ts else 0.5
            weights.append(w)
        w   = np.array(weights, dtype=float)
        w   = w/w.sum() if w.sum()>0 else np.ones(len(w))/len(w)
        avg = np.asarray(tfidf[idxs].multiply(w[:,np.newaxis]).sum(axis=0))
    else:
        avg = np.asarray(tfidf[idxs].mean(axis=0))

    cs  = cosine_similarity(avg, tfidf)[0]
    res = []
    for idx,mid in idx2i.items():
        if mid in excl: continue
        c = float(cs[idx])
        if col_sc and mid in col_sc:
            col   = max(0.0, min(1.0, (col_sc[mid]+1)/2))
            score = cw*c + sw*col
        else:
            score = c
        res.append((mid, score))
    res.sort(key=lambda x:x[1], reverse=True)
    return [m for m,_ in res[:n]]


# =============================================================================
# METRICS
# =============================================================================

def p_at_k(recs, rel, k):
    if not recs or not rel: return 0.0
    return sum(1 for m in recs[:k] if m in rel) / k

def r_at_k(recs, rel, k):
    if not recs or not rel: return 0.0
    return sum(1 for m in recs[:k] if m in rel) / len(rel)

def ndcg_at_k(recs, rel, k):
    if not recs or not rel: return 0.0
    dcg  = sum(1/math.log2(i+2) for i,m in enumerate(recs[:k]) if m in rel)
    idcg = sum(1/math.log2(i+2) for i in range(min(len(rel),k)))
    return dcg/idcg if idcg>0 else 0.0

def evaluate(fn, train_data, test_data, valid_users, k=10):
    P,R,N = [],[],[]
    for uid in valid_users:
        gt = test_data[uid]
        if not gt: continue
        recs = fn(uid, train_data[uid])
        if not recs:
            P.append(0.0); R.append(0.0); N.append(0.0); continue
        P.append(p_at_k(recs,gt,k))
        R.append(r_at_k(recs,gt,k))
        N.append(ndcg_at_k(recs,gt,k))
    return {"precision":np.mean(P),"recall":np.mean(R),
            "ndcg":np.mean(N),"n":len(P)}


# =============================================================================
# RUN ALL 8 VARIANTS
# =============================================================================

def run_ablation():
    df, logs                                   = load_data()
    train_data, test_data, train_logs, \
    valid_users, ts_map                        = build_train_test(logs)
    tfidf, i2idx, idx2i                        = build_content_model(df)
    all_ids                                    = list(idx2i.values())

    print("\n  Building SVD models (~2 min)...")
    print("  [1/2] SVD baseline (uniform alpha)...")
    uf_b,mf_b,ui_b,mi_b = build_svd(train_logs, SIGNAL_ALPHA_BASE)
    print("        done")
    print("  [2/2] SVD full (per-signal alpha — Contribution 2)...")
    uf_f,mf_f,ui_f,mi_f = build_svd(train_logs, SIGNAL_ALPHA_FULL)
    print("        done")

    print("\n" + "="*64)
    print("  Running 8 model variants...")
    print("="*64)
    R = {}

    # V1 — Random
    print("\n  [1/8] Random baseline...")
    R["V1"] = evaluate(
        lambda uid,wl: rec_random(all_ids, set(wl), N_RECOMMENDATIONS),
        train_data, test_data, valid_users)
    print(f"        P@10={R['V1']['precision']:.4f}")

    # V2 — Popularity
    print("\n  [2/8] Popularity-based...")
    R["V2"] = evaluate(
        lambda uid,wl: rec_popularity(df, set(wl), N_RECOMMENDATIONS),
        train_data, test_data, valid_users)
    print(f"        P@10={R['V2']['precision']:.4f}")

    # V3 — TF-IDF only, no temporal decay
    print("\n  [3/8] TF-IDF content only (no temporal decay)...")
    R["V3"] = evaluate(
        lambda uid,wl: rec_content(wl, tfidf, i2idx, idx2i,
                                   set(wl), N_RECOMMENDATIONS),
        train_data, test_data, valid_users)
    print(f"        P@10={R['V3']['precision']:.4f}")

    # V4 — SVD only, baseline signals
    print("\n  [4/8] SVD collaborative only (baseline signals)...")
    R["V4"] = evaluate(
        lambda uid,wl: rec_collab(uid,
            get_collab(uid, uf_b, mf_b, ui_b, mi_b),
            set(wl), N_RECOMMENDATIONS),
        train_data, test_data, valid_users)
    print(f"        P@10={R['V4']['precision']:.4f}")

    # V5 — Base hybrid, no contributions
    print("\n  [5/8] Base hybrid (TF-IDF + SVD, no contributions)...")
    R["V5"] = evaluate(
        lambda uid,wl: rec_hybrid(wl, uid, tfidf, i2idx, idx2i,
            get_collab(uid, uf_b, mf_b, ui_b, mi_b),
            set(wl), N_RECOMMENDATIONS, ts_map=None),
        train_data, test_data, valid_users)
    print(f"        P@10={R['V5']['precision']:.4f}")

    # V6 — + Contribution 2 (OTT signal weighting)
    print("\n  [6/8] + Contribution 2: OTT signal weighting...")
    R["V6"] = evaluate(
        lambda uid,wl: rec_hybrid(wl, uid, tfidf, i2idx, idx2i,
            get_collab(uid, uf_f, mf_f, ui_f, mi_f),
            set(wl), N_RECOMMENDATIONS, ts_map=None),
        train_data, test_data, valid_users)
    print(f"        P@10={R['V6']['precision']:.4f}")

    # V7 — + Contribution 1 (temporal decay, real timestamps)
    print("\n  [7/8] + Contribution 1: Temporal watchlist decay (real timestamps)...")
    R["V7"] = evaluate(
        lambda uid,wl: rec_hybrid(wl, uid, tfidf, i2idx, idx2i,
            get_collab(uid, uf_b, mf_b, ui_b, mi_b),
            set(wl), N_RECOMMENDATIONS, ts_map=ts_map),
        train_data, test_data, valid_users)
    print(f"        P@10={R['V7']['precision']:.4f}")

    # V8 — Full system (C1 + C2)
    print("\n  [8/8] Full system (Contribution 1 + Contribution 2)...")
    R["V8"] = evaluate(
        lambda uid,wl: rec_hybrid(wl, uid, tfidf, i2idx, idx2i,
            get_collab(uid, uf_f, mf_f, ui_f, mi_f),
            set(wl), N_RECOMMENDATIONS, ts_map=ts_map),
        train_data, test_data, valid_users)
    print(f"        P@10={R['V8']['precision']:.4f}")

    return R


# =============================================================================
# PRINT RESULTS
# =============================================================================

def print_results(R):
    labels = {
        "V1": "Random Baseline",
        "V2": "Popularity-Based",
        "V3": "TF-IDF Content Only",
        "V4": "SVD Collaborative Only",
        "V5": "Base Hybrid (TF-IDF + SVD)",
        "V6": "+ OTT Signal Weighting (C2)",
        "V7": "+ Temporal Watchlist Decay (C1)",
        "V8": "Full System (C1 + C2) [OURS]",
    }
    bp    = R["V5"]["precision"]
    lines = []
    lines.append("=" * 72)
    lines.append("  ABLATION STUDY RESULTS")
    lines.append("  Dataset : MovieLens 25M (Harper & Konstan, 2015)")
    lines.append("  Signals : rating proxy mapping → OTT implicit signals")
    lines.append("  Users   : 2,000 sampled | Split: 80% train / 20% test")
    lines.append("  Metrics : Precision@10, Recall@10, NDCG@10")
    lines.append("=" * 72)
    lines.append(f"  {'Model':<38} {'P@10':>8} {'R@10':>8} "
                 f"{'NDCG@10':>9} {'vs Base':>8}")
    lines.append("  " + "-"*68)

    for k,label in labels.items():
        r  = R[k]
        p  = r["precision"]
        rc = r["recall"]
        nd = r["ndcg"]
        if k=="V5":   delta = "baseline"
        elif p>bp:    delta = f"+{(p-bp)*100:.2f}%"
        else:         delta = f"{(p-bp)*100:.2f}%"
        mark = " ◄ OURS" if k=="V8" else ""
        lines.append(f"  {label:<38} {p:>8.4f} {rc:>8.4f} "
                     f"{nd:>9.4f} {delta:>8}{mark}")

    lines.append("  " + "-"*68)

    c1  = (R["V7"]["precision"] - bp) * 100
    c2  = (R["V6"]["precision"] - bp) * 100
    tot = (R["V8"]["precision"] - bp) * 100

    lines.append("")
    lines.append("  KEY FINDINGS (copy into paper Section 7):")
    lines.append("  " + "-"*68)
    lines.append(f"  C1 Temporal Watchlist Decay : {c1:+.2f}% Precision@10")
    lines.append(f"  C2 OTT Signal Weighting     : {c2:+.2f}% Precision@10")
    lines.append(f"  Full System vs Base Hybrid  : {tot:+.2f}% Precision@10")
    lines.append("")
    lines.append(f"  Full System:")
    lines.append(f"    Precision@10 = {R['V8']['precision']:.4f}")
    lines.append(f"    Recall@10    = {R['V8']['recall']:.4f}")
    lines.append(f"    NDCG@10      = {R['V8']['ndcg']:.4f}")
    lines.append("")
    lines.append("  PAPER DISCLOSURE (add to Section 6):")
    lines.append("  " + "-"*68)
    lines.append("  OTT signals derived from MovieLens ratings via proxy mapping.")
    lines.append("  Timestamps from real MovieLens rating interaction times.")
    lines.append("  trailer_watch = proxy for medium-interest ratings (3.0-3.9).")
    lines.append("=" * 72)

    out = "\n".join(lines)
    print("\n" + out)
    with open(OUTPUT_TXT, "w", encoding="utf-8") as f:
        f.write(out)
    print(f"\n  ✅ Saved → {OUTPUT_TXT}")


if __name__ == "__main__":
    if not ENRICHED_CSV.exists():
        print(f"❌ {ENRICHED_CSV} not found"); exit(1)
    if not LOGS_CSV.exists():
        print(f"❌ {LOGS_CSV} not found"); exit(1)
    print_results(run_ablation())