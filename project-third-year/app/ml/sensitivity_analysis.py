"""
sensitivity_analysis.py — Hyperparameter Sensitivity Analysis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tests:
  1. T_half sensitivity: 7, 14, 30, 60, 90 days
  2. Alpha sensitivity: low, medium, high, very-high configurations

This produces Table V for the research paper showing that
results are stable across hyperparameter choices.

HOW TO RUN:
  cd app/ml
  python sensitivity_analysis.py
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
OUTPUT_TXT   = BASE_DIR / "sensitivity_results.txt"

N_RECOMMENDATIONS = 10
N_EVAL_USERS      = 1000   # smaller for speed
MIN_ACTIONS       = 10
TRAIN_RATIO       = 0.8
RANDOM_SEED       = 42
SVD_K             = 50

IMPLICIT_WEIGHTS = {
    "added_to_watchlist":     1.0,
    "trailer_watch":          0.5,
    "search_click":           0.3,
    "removed_from_watchlist": -0.5,
}

random.seed(RANDOM_SEED)
np.random.seed(RANDOM_SEED)

#  Sensitivity configurations 

# T_half values to test (days)
T_HALF_VALUES = [7, 14, 30, 60, 90]

# Alpha configurations to test
ALPHA_CONFIGS = {
    "Low (5/3/1)":       {"added_to_watchlist": 5,  "trailer_watch": 3,  "search_click": 1,  "removed_from_watchlist": 0},
    "Medium (20/10/5)":  {"added_to_watchlist": 20, "trailer_watch": 10, "search_click": 5,  "removed_from_watchlist": 0},
    "High (40/20/10)":   {"added_to_watchlist": 40, "trailer_watch": 20, "search_click": 10, "removed_from_watchlist": 0},
    "Very High (80/40/20)":{"added_to_watchlist":80,"trailer_watch": 40, "search_click": 20, "removed_from_watchlist": 0},
    "Uniform (10/10/10)":{"added_to_watchlist": 10, "trailer_watch": 10, "search_click": 10, "removed_from_watchlist": 0},
}


# DATA LOADING

def load_data():
    print("Loading data...")
    df = pd.read_csv(ENRICHED_CSV).drop_duplicates(subset="id").reset_index(drop=True)
    for col in ["genres","cast","director","keywords","overview"]:
        if col in df.columns:
            df[col] = df[col].fillna("")

    logs = pd.read_csv(LOGS_CSV, dtype={"user_id": str, "movie_id": int})
    logs = logs[logs["action_type"].isin(IMPLICIT_WEIGHTS.keys())]
    logs = logs[logs["movie_id"].isin(set(df["id"].astype(int)))]

    # Normalize timestamps to 365-day window
    has_ts = "timestamp" in logs.columns and logs["timestamp"].notna().any()
    if has_ts:
        logs["datetime"] = pd.to_datetime(logs["timestamp"], unit="s", utc=True)
        logs["datetime"] = logs["datetime"].dt.tz_localize(None)
        now          = pd.Timestamp.now()
        one_year_ago = now - pd.Timedelta(days=365)
        t_min = logs["datetime"].min()
        t_max = logs["datetime"].max()
        t_range = (t_max - t_min).total_seconds()
        if t_range > 0:
            normalized = (logs["datetime"] - t_min).dt.total_seconds() / t_range
            logs["datetime"] = one_year_ago + pd.to_timedelta(normalized * 364, unit="D")
    else:
        logs = logs.copy()
        logs["row_order"]  = logs.groupby("user_id").cumcount()
        logs["user_count"] = logs.groupby("user_id")["movie_id"].transform("count")
        rank     = logs["row_order"] / logs["user_count"].clip(lower=1)
        now      = pd.Timestamp.now()
        days_ago = (1 - rank) * 365 + 1
        logs["datetime"] = now - pd.to_timedelta(days_ago, unit="D")
        logs = logs.drop(columns=["row_order","user_count"])

    print(f"  Movies: {len(df):,} | Logs: {len(logs):,}")
    return df, logs


def build_train_test(logs):
    wl = logs[logs["action_type"] == "added_to_watchlist"]
    counts = wl.groupby("user_id")["movie_id"].count()
    valid_users = counts[counts >= MIN_ACTIONS].index.tolist()
    if len(valid_users) > N_EVAL_USERS:
        valid_users = random.sample(valid_users, N_EVAL_USERS)

    train_data, test_data, ts_map = {}, {}, {}

    for _, row in logs[logs["action_type"]=="added_to_watchlist"].iterrows():
        ts_map[(row["user_id"], int(row["movie_id"]))] = row["datetime"]

    for uid in valid_users:
        user_wl = wl[wl["user_id"]==uid]["movie_id"].tolist()
        random.shuffle(user_wl)
        split = max(1, int(len(user_wl) * TRAIN_RATIO))
        train_data[uid] = user_wl[:split]
        test_wl = set(user_wl[split:])
        test_trailer = set(logs[(logs["user_id"]==uid) &
                                (logs["action_type"]=="trailer_watch")
                               ]["movie_id"].tolist())
        test_data[uid] = test_wl | test_trailer

    all_train_logs = logs[logs["user_id"].isin(set(valid_users))]
    return train_data, test_data, all_train_logs, valid_users, ts_map


def build_content_model(df):
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
    return tfidf, i2idx, idx2i


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


def temporal_weight(ts, now, halflife):
    days = max(0.0, (now - ts).total_seconds() / 86400)
    return math.exp(-0.693 * days / halflife)


def rec_hybrid(wl, uid, tfidf, i2idx, idx2i, col_sc, excl, n,
               ts_map=None, halflife=30, cw=0.15, sw=0.85):
    known = [(int(m), i2idx[int(m)]) for m in wl if int(m) in i2idx]
    if not known: return []
    idxs = [idx for _,idx in known]

    if ts_map and uid:
        now = pd.Timestamp.now()
        weights = []
        for mid,_ in known:
            ts = ts_map.get((uid, int(mid)))
            w  = temporal_weight(ts, now, halflife) if ts else 0.5
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


def p_at_k(recs, rel, k):
    if not recs or not rel: return 0.0
    return sum(1 for m in recs[:k] if m in rel) / k

def ndcg_at_k(recs, rel, k):
    if not recs or not rel: return 0.0
    dcg  = sum(1/math.log2(i+2) for i,m in enumerate(recs[:k]) if m in rel)
    idcg = sum(1/math.log2(i+2) for i in range(min(len(rel),k)))
    return dcg/idcg if idcg>0 else 0.0

def evaluate(fn, train_data, test_data, valid_users, k=10):
    P, N = [], []
    for uid in valid_users:
        gt = test_data[uid]
        if not gt: continue
        recs = fn(uid, train_data[uid])
        if not recs:
            P.append(0.0); N.append(0.0); continue
        P.append(p_at_k(recs, gt, k))
        N.append(ndcg_at_k(recs, gt, k))
    return {"precision": np.mean(P), "ndcg": np.mean(N)}


# RUN SENSITIVITY ANALYSIS

def run_sensitivity():
    df, logs = load_data()
    train_data, test_data, train_logs, valid_users, ts_map = build_train_test(logs)
    tfidf, i2idx, idx2i = build_content_model(df)

    print(f"\nEvaluating on {len(valid_users):,} users...")

    #  EXPERIMENT 1: T_half sensitivity 
    print("\n" + "="*60)
    print("  EXPERIMENT 1: T_half Sensitivity")
    print("  (Fixed alpha: High 40/20/10, varying half-life)")
    print("="*60)

    ALPHA_FIXED = {"added_to_watchlist": 40, "trailer_watch": 20,
                   "search_click": 10, "removed_from_watchlist": 0}

    print("  Building SVD model...")
    uf, mf, ui, mi = build_svd(train_logs, ALPHA_FIXED)
    print("  Done")

    thalf_results = {}
    for thalf in T_HALF_VALUES:
        print(f"\n  T_half = {thalf} days...", end=" ")
        result = evaluate(
            lambda uid, wl, th=thalf: rec_hybrid(
                wl, uid, tfidf, i2idx, idx2i,
                get_collab(uid, uf, mf, ui, mi),
                set(wl), N_RECOMMENDATIONS,
                ts_map=ts_map, halflife=th
            ),
            train_data, test_data, valid_users
        )
        thalf_results[thalf] = result
        print(f"P@10={result['precision']:.4f}  NDCG@10={result['ndcg']:.4f}")

    #  EXPERIMENT 2: Alpha sensitivity 
    print("\n" + "="*60)
    print("  EXPERIMENT 2: Alpha Configuration Sensitivity")
    print("  (Fixed T_half=30 days, varying alpha values)")
    print("="*60)

    alpha_results = {}
    for config_name, alpha_config in ALPHA_CONFIGS.items():
        print(f"\n  Alpha config: {config_name}...")
        print("  Building SVD...", end=" ")
        uf_a, mf_a, ui_a, mi_a = build_svd(train_logs, alpha_config)
        print("done")

        result = evaluate(
            lambda uid, wl, uf=uf_a, mf=mf_a, ui=ui_a, mi=mi_a: rec_hybrid(
                wl, uid, tfidf, i2idx, idx2i,
                get_collab(uid, uf, mf, ui, mi),
                set(wl), N_RECOMMENDATIONS,
                ts_map=ts_map, halflife=30
            ),
            train_data, test_data, valid_users
        )
        alpha_results[config_name] = result
        print(f"  P@10={result['precision']:.4f}  NDCG@10={result['ndcg']:.4f}")

    return thalf_results, alpha_results


# PRINT RESULTS

def print_results(thalf_results, alpha_results):
    lines = []
    lines.append("=" * 68)
    lines.append("  SENSITIVITY ANALYSIS RESULTS")
    lines.append("  For Research Paper Table V")
    lines.append("=" * 68)

    lines.append("")
    lines.append("  EXPERIMENT 1: T_half Sensitivity (alpha fixed: 40/20/10)")
    lines.append("  " + "-"*60)
    lines.append(f"  {'T_half (days)':<20} {'P@10':>10} {'NDCG@10':>12} {'Notes'}")
    lines.append("  " + "-"*60)
    for thalf, r in thalf_results.items():
        note = "<-- Paper uses this" if thalf == 30 else ""
        lines.append(f"  {str(thalf)+' days':<20} {r['precision']:>10.4f} {r['ndcg']:>12.4f}  {note}")
    lines.append("  " + "-"*60)

    lines.append("")
    lines.append("  EXPERIMENT 2: Alpha Configuration Sensitivity (T_half fixed: 30 days)")
    lines.append("  " + "-"*60)
    lines.append(f"  {'Alpha Config':<25} {'P@10':>10} {'NDCG@10':>12} {'Notes'}")
    lines.append("  " + "-"*60)
    for config, r in alpha_results.items():
        note = "<-- Paper uses this" if "40/20/10" in config else ""
        lines.append(f"  {config:<25} {r['precision']:>10.4f} {r['ndcg']:>12.4f}  {note}")
    lines.append("  " + "-"*60)

    # Find variance
    thalf_p = [r["precision"] for r in thalf_results.values()]
    alpha_p  = [r["precision"] for r in alpha_results.values()]

    lines.append("")
    lines.append("  KEY FINDING FOR PAPER:")
    lines.append("  " + "-"*60)
    lines.append(f"  T_half P@10 range : {min(thalf_p):.4f} to {max(thalf_p):.4f} "
                 f"(variance = {max(thalf_p)-min(thalf_p):.4f})")
    lines.append(f"  Alpha  P@10 range : {min(alpha_p):.4f} to {max(alpha_p):.4f} "
                 f"(variance = {max(alpha_p)-min(alpha_p):.4f})")
    lines.append("")
    if max(thalf_p) - min(thalf_p) < 0.05:
        lines.append("  STABLE: T_half results are consistent across all values tested.")
        lines.append("  Write in paper: 'Results are robust to T_half choice'")
    if max(alpha_p) - min(alpha_p) < 0.05:
        lines.append("  STABLE: Alpha results are consistent across all configurations.")
        lines.append("  Write in paper: 'Results are robust to alpha configuration'")
    lines.append("=" * 68)

    out = "\n".join(lines)
    print("\n" + out)
    with open(OUTPUT_TXT, "w", encoding="utf-8") as f:
        f.write(out)
    print(f"\n  Saved -> {OUTPUT_TXT}")


if __name__ == "__main__":
    if not ENRICHED_CSV.exists():
        print(f" {ENRICHED_CSV} not found"); exit(1)
    if not LOGS_CSV.exists():
        print(f" {LOGS_CSV} not found"); exit(1)
    thalf_results, alpha_results = run_sensitivity()
    print_results(thalf_results, alpha_results)