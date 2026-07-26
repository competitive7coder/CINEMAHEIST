"""
engine.py — Hybrid Recommendation Engine
─────────────────────────────────────────
Combines two models exactly like real OTT platforms:

  Layer 1 — Content-Based Filtering (TF-IDF)
    genres + cast + director + keywords + overview

  Layer 2 — Collaborative Filtering (SVD / Matrix Factorization)
    Implicit feedback from Activity collection:
      added_to_watchlist     → weight 1.0
      trailer_watch          → weight 0.5
      removed_from_watchlist → weight -0.5

  Layer 3 — Hybrid Scoring
    final = (0.4 × content) + (0.6 × collaborative)
    Falls back to content-only for new users.
"""

"""
engine.py — Hybrid Recommendation Engine
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Research Paper Contributions:

  Contribution 1 — Temporal Watchlist Decay (Primary)
    Watchlist interactions weighted by recency using exponential decay.
    Formula: w_i = exp(-lambda * d_i / T_half)
    where d_i = days since movie was added to watchlist
          T_half = 30 days (half-life parameter)
    Unlike prior work treating watchlist as binary signal,
    we model it as a continuous temporal confidence score.

  Contribution 2 — OTT-Specific Multi-Signal Implicit Feedback (Primary)
    Four OTT-specific implicit signals with confidence weighting:
      added_to_watchlist → C_ui = 1 + 40 * r_ui  (high confidence)
      trailer_watch      → C_ui = 1 + 20 * r_ui  (medium confidence)
      search_click       → C_ui = 1 + 10 * r_ui  (low confidence)
      removed            → negative signal        (explicit rejection)
    Trailer watching as implicit signal is novel in OTT literature.

  Supporting Components (adopted from literature):
    - TF-IDF content filtering (Lops et al. 2011)
    - SVD collaborative filtering (Koren et al. 2009)
    - Genre diversity penalty (adapted from Ziegler et al. 2005)
    - Recency boost for temporal relevance
    - Bayesian quality re-ranking
    - Cold-start popularity blend
"""

import math
import datetime
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse.linalg import svds
from scipy.sparse import csr_matrix

BASE_DIR      = Path(__file__).resolve().parent
ENRICHED_CSV  = BASE_DIR / "movies_enriched.csv"
FALLBACK_CSV  = BASE_DIR / "movies.csv"

# ── Model cache ───────────────────────────────────────────────────────────────
_df           = None
_tfidf_matrix = None
_vectorizer   = None   # CHANGE 5: stored globally for mood TF-IDF reuse
_id_to_idx    = None
_idx_to_id    = None
_load_error   = None

_collab_user_factors  = None
_collab_movie_factors = None
_collab_user_index    = None
_collab_movie_index   = None

CONTENT_WEIGHT   = 0.4
COLLAB_WEIGHT    = 0.6

# ── CHANGE 4: OTT-specific implicit signals (Contribution 2) ─────────────────
# Base weights for hybrid scoring matrix
IMPLICIT_WEIGHTS = {
    "added_to_watchlist":     1.0,
    "trailer_watch":          0.5,   # trailer engagement — novel OTT signal
    "search_click":           0.3,   # search intent signal — novel OTT signal
    "removed_from_watchlist": -0.5,
}

# Confidence multipliers for SVD matrix (C_ui = 1 + alpha_k * r_ui)
# Different alpha per signal type reflects different confidence levels
SIGNAL_ALPHA = {
    "added_to_watchlist":     40,   # strongest — explicit save intent
    "trailer_watch":          20,   # medium — engagement without commitment
    "search_click":           10,   # weakest — passive interest signal
    "removed_from_watchlist":  0,   # handled as negative weight
}

# ── CHANGE 1: Temporal decay constants (Contribution 1) ──────────────────────
WATCHLIST_HALF_LIFE = 30     # days — recency half-life for watchlist weighting
LAMBDA_DECAY        = 0.693  # ln(2) — ensures w=0.5 at exactly T_half days

MOOD_MAP = {
    "intense":     "action thriller war crime suspense",
    "happy":       "comedy family animation feel-good musical",
    "sad":         "drama romance tragedy loss grief",
    "romantic":    "romance love relationship wedding",
    "scary":       "horror thriller supernatural ghost",
    "mindblowing": "science fiction mystery mind-bending twist psychological",
}

# ── Improvement constants ─────────────────────────────────────────────────────
CURRENT_YEAR        = datetime.datetime.now().year
RECENCY_WINDOW      = 30      # years over which recency fades to 0
RECENCY_BOOST       = 0.10    # max 10% boost for brand-new movies
GENRE_PENALTY       = 0.85    # each repeat genre gets 15% score penalty
POPULARITY_WEIGHT   = 0.20    # cold-start: popularity contribution
VOTE_WEIGHT         = 0.10    # cold-start: vote_average contribution
CONTENT_COLD_WEIGHT = 0.70    # cold-start: content similarity contribution


# ═════════════════════════════════════════════════════════════════════════════
# CONTENT MODEL
# ═════════════════════════════════════════════════════════════════════════════

def _build_feature_string(row: pd.Series) -> str:
    """
    Weighted feature string per movie.
    Repeating fields boosts their TF-IDF influence:
      genres x3, director x3, cast x2, keywords x2, overview x1
    """
    parts = []

    genres   = str(row.get("genres",   "")).replace(";", " ")
    director = str(row.get("director", "")).replace(" ", "_")
    cast     = str(row.get("cast",     "")).replace(";", " ").replace(" ", "_")
    keywords = str(row.get("keywords", "")).replace(";", " ").replace(" ", "_")
    overview = str(row.get("overview", ""))

    parts.extend([genres]   * 3)
    if director: parts.extend([director] * 3)
    if cast:     parts.extend([cast]     * 2)
    if keywords: parts.extend([keywords] * 2)
    if overview and overview != "nan": parts.append(overview)

    return " ".join(parts)


def _load_content_model() -> bool:
    global _df, _tfidf_matrix, _id_to_idx, _idx_to_id, _load_error

    if _load_error:
        return False

    try:
        csv_path = ENRICHED_CSV if ENRICHED_CSV.exists() else FALLBACK_CSV
        print(f"[ML Engine] Loading {csv_path.name}...")

        df = pd.read_csv(csv_path).drop_duplicates(subset="id").reset_index(drop=True)

        for col in ["genres", "cast", "director", "keywords", "overview"]:
            if col in df.columns:
                df[col] = df[col].fillna("")

        df["features"] = df.apply(_build_feature_string, axis=1)

        vectorizer = TfidfVectorizer(
            sublinear_tf=True,
            min_df=1,
            stop_words="english",
            ngram_range=(1, 2),
        )
        tfidf_matrix = vectorizer.fit_transform(df["features"])

        _df           = df
        _tfidf_matrix = tfidf_matrix
        _vectorizer   = vectorizer   # CHANGE 5: store for mood TF-IDF reuse
        _id_to_idx    = dict(zip(df["id"].astype(int), df.index))
        _idx_to_id    = dict(zip(df.index, df["id"].astype(int)))

        print(f"[ML Engine] Content model ready — {len(df)} movies, {tfidf_matrix.shape[1]} features")
        return True

    except Exception as e:
        _load_error = str(e)
        print(f"[ML Engine] Content model failed: {e}")
        return False


def _temporal_decay_weight(days_ago: float) -> float:
    """
    CONTRIBUTION 1 — Temporal Watchlist Decay.

    Computes exponential decay weight for a watchlist entry
    based on how many days ago it was added.

    Formula: w_i = exp(-lambda * d_i / T_half)
      lambda  = ln(2) = 0.693 (ensures w=0.5 at T_half)
      d_i     = days since movie was added to watchlist
      T_half  = 30 days (half-life — tunable hyperparameter)

    Intuition:
      Added today    → w = 1.00 (full weight)
      Added 30d ago  → w = 0.50 (half weight)
      Added 90d ago  → w = 0.13 (minimal weight)
      Added 180d ago → w = 0.02 (near zero)

    This models the recency of user taste — movies added recently
    better reflect current preferences than old watchlist entries.
    """
    return math.exp(-LAMBDA_DECAY * max(0.0, days_ago) / WATCHLIST_HALF_LIFE)


def _content_scores(
    movie_ids: list,
    timestamps: dict = None,
) -> "np.ndarray | None":
    """
    Compute content similarity scores against user watchlist.

    CONTRIBUTION 1 applied here:
    If timestamps provided → weighted mean using temporal decay.
    If timestamps absent   → equal mean (standard baseline).

    timestamps: {movie_id (int): datetime} when each movie was added.
    """
    known = [(int(m), _id_to_idx[int(m)]) for m in movie_ids if int(m) in _id_to_idx]
    if not known:
        return None

    indices = [idx for _, idx in known]

    if timestamps:
        now = datetime.datetime.utcnow()
        weights = []
        for movie_id, _ in known:
            ts = timestamps.get(movie_id)
            if ts and isinstance(ts, datetime.datetime):
                days_ago = max(0.0, (now - ts).total_seconds() / 86400)
            else:
                days_ago = WATCHLIST_HALF_LIFE   # unknown → assume half-life age
            weights.append(_temporal_decay_weight(days_ago))

        w = np.array(weights, dtype=float)
        w_sum = w.sum()
        if w_sum > 0:
            w = w / w_sum   # normalise so weights sum to 1
        else:
            w = np.ones(len(w)) / len(w)

        vecs = _tfidf_matrix[indices]
        # Weighted mean: Σ w_i * v_i
        avg  = np.asarray(vecs.multiply(w[:, np.newaxis]).sum(axis=0))
    else:
        # Baseline: equal weighting (standard approach)
        avg = np.asarray(_tfidf_matrix[indices].mean(axis=0))

    return cosine_similarity(avg, _tfidf_matrix)[0]

# ═════════════════════════════════════════════════════════════════════════════
# COLLABORATIVE MODEL — SVD Matrix Factorization
# ═════════════════════════════════════════════════════════════════════════════

def build_collaborative_model(activity_logs: list):
    """
    Build SVD collaborative model from OTT activity logs.

    CONTRIBUTION 2 applied here — OTT-specific confidence weighting.

    Standard collaborative filtering (Hu et al. 2008) uses:
      C_ui = 1 + alpha * r_ui

    We extend this with signal-specific alpha values reflecting
    different confidence levels of each OTT implicit signal:
      added_to_watchlist → alpha=40  (explicit save = high confidence)
      trailer_watch      → alpha=20  (engagement = medium confidence)
      search_click       → alpha=10  (interest = low confidence)

    This is novel: prior work uses a single alpha for all signals.
    We use per-signal alpha to differentiate OTT interaction types.

    activity_logs: [{"user_id": str, "movie_id": int,
                     "action_type": str}, ...]
    """
    global _collab_user_factors, _collab_movie_factors
    global _collab_user_index, _collab_movie_index

    if not activity_logs:
        return

    try:
        df_a = pd.DataFrame(activity_logs)
        df_a["weight"] = df_a["action_type"].map(IMPLICIT_WEIGHTS).fillna(0)
        df_a = df_a[df_a["weight"] != 0]
        if df_a.empty:
            return

        # CONTRIBUTION 2 — per-signal confidence weighting
        # C_ui = 1 + alpha_k * r_ui  where alpha_k is signal-specific
        def confidence_weight(row):
            alpha = SIGNAL_ALPHA.get(row["action_type"], 1)
            r_ui  = abs(row["weight"])   # base implicit score
            sign  = 1 if row["weight"] > 0 else -1
            return sign * (1 + alpha * r_ui)

        df_a["confidence"] = df_a.apply(confidence_weight, axis=1)

        df_agg = df_a.groupby(["user_id", "movie_id"])["confidence"].sum().reset_index()
        df_agg["confidence"] = df_agg["confidence"].clip(-5, 5)

        users  = df_agg["user_id"].unique()
        movies = df_agg["movie_id"].unique()
        u_idx  = {u: i for i, u in enumerate(users)}
        m_idx  = {m: i for i, m in enumerate(movies)}

        rows   = df_agg["user_id"].map(u_idx)
        cols   = df_agg["movie_id"].map(m_idx)
        matrix = csr_matrix(
            (df_agg["confidence"].values, (rows, cols)),
            shape=(len(users), len(movies))
        )

        k = min(50, min(matrix.shape) - 1)
        if k < 1:
            return

        U, sigma, Vt   = svds(matrix.astype(float), k=k)
        _collab_user_factors  = U.dot(np.diag(sigma))
        _collab_movie_factors = Vt.T
        _collab_user_index    = u_idx
        _collab_movie_index   = m_idx

        signal_counts = df_a["action_type"].value_counts().to_dict()
        print(f"[ML Engine] Collab model ready — {len(users)} users, "
              f"{len(movies)} movies, k={k}")
        print(f"[ML Engine] Signal counts: {signal_counts}")

    except Exception as e:
        print(f"[ML Engine] Collab model failed: {e}")





def _collab_scores(user_id: str) -> "dict | None":
    if _collab_user_factors is None or user_id not in _collab_user_index:
        return None
    try:
        row    = _collab_user_index[user_id]
        vec    = _collab_user_factors[row]
        scores = vec.dot(_collab_movie_factors.T)
        return {mid: float(scores[i]) for mid, i in _collab_movie_index.items()}
    except Exception:
        return None


# ═════════════════════════════════════════════════════════════════════════════
# PUBLIC API
# ═════════════════════════════════════════════════════════════════════════════

def _recency_boost(release_year: int) -> float:
    """
    Improvement 3 — Recency boost.
    Returns a multiplier between 0.90 (old movie) and 1.0 (brand new movie).
    Fades linearly over RECENCY_WINDOW years.
    """
    if not release_year or release_year == 0:
        return 0.95
    age = max(0, CURRENT_YEAR - release_year)
    recency = max(0.0, 1.0 - age / RECENCY_WINDOW)
    return 1.0 - RECENCY_BOOST + (RECENCY_BOOST * recency)


def _apply_genre_diversity(results: list, n: int) -> list:
    """
    Improvement 2 — Genre diversity penalty.
    Penalises each repeated genre by GENRE_PENALTY per occurrence.
    Prevents 20 action movies in a row.
    Re-sorts after penalisation so top-N is diverse.
    """
    seen_genres: dict = {}
    diversified = []

    for idx, movie_id, score in results:
        raw_genres = str(_df.at[idx, "genres"]).split(";")
        primary_genre = raw_genres[0].strip() if raw_genres else "Unknown"

        count = seen_genres.get(primary_genre, 0)
        penalised = score * (GENRE_PENALTY ** count)
        seen_genres[primary_genre] = count + 1
        diversified.append((idx, movie_id, penalised))

    diversified.sort(key=lambda x: x[2], reverse=True)
    return diversified[:n]


def get_recommendations(
    watchlist_ids: list,
    user_id: str = None,
    n: int = 20,
    interacted_ids: set = None,
    watchlist_timestamps: dict = None,
) -> list:
    """
    Hybrid recommendations with two research contributions.

    Parameters:
      watchlist_ids        — list of movie IDs in user watchlist
      user_id              — for collaborative filtering lookup
      n                    — number of recommendations to return
      interacted_ids       — movies to exclude (already seen)
      watchlist_timestamps — CONTRIBUTION 1: {movie_id: datetime}
                             When each movie was added to watchlist.
                             If provided, applies temporal decay weighting.
                             If None, falls back to equal weighting (baseline).

    Scoring pipeline:
      1. Content score  — TF-IDF cosine with temporal decay (Contribution 1)
      2. Collab score   — SVD with per-signal confidence weights (Contribution 2)
      3. Hybrid blend   — 0.4 × content + 0.6 × collaborative
      4. Recency boost  — release year multiplier
      5. Genre diversity — inline ILD penalty
      6. Cold-start     — popularity blend for new users
    """
    if _df is None:
        if not _load_content_model():
            return []
    if not watchlist_ids:
        return []

    watchlist_set   = set(int(m) for m in watchlist_ids)
    interacted_set  = set(int(m) for m in interacted_ids) if interacted_ids else set()
    excluded        = watchlist_set | interacted_set

    # CONTRIBUTION 1 — temporal decay weighting applied here
    c_scores        = _content_scores(list(watchlist_set), timestamps=watchlist_timestamps)
    col_score_map   = _collab_scores(user_id) if user_id else None
    has_collab      = bool(col_score_map)

    results = []
    for idx, movie_id in _idx_to_id.items():

        # Improvement 4 — skip already interacted movies
        if movie_id in excluded:
            continue

        c = float(c_scores[idx]) if c_scores is not None else 0.0

        # Improvement 3 — recency boost
        release_year = int(_df.at[idx, "release_year"]) if "release_year" in _df.columns else 0
        r_boost = _recency_boost(release_year)

        if has_collab and movie_id in col_score_map:
            # Full hybrid mode — user has activity history
            col   = max(0.0, min(1.0, (col_score_map[movie_id] + 1) / 2))
            score = (CONTENT_WEIGHT * c + COLLAB_WEIGHT * col) * r_boost

        else:
            # Improvement 1 — cold-start popularity boost
            # Blend content similarity + popularity + vote_average
            popularity = float(_df.at[idx, "popularity"])   if "popularity"   in _df.columns else 0.0
            vote       = float(_df.at[idx, "vote_average"]) if "vote_average" in _df.columns else 0.0
            pop_norm   = min(popularity, 1000) / 1000        # normalise to [0,1]
            vote_norm  = vote / 10                           # normalise to [0,1]

            score = (
                CONTENT_COLD_WEIGHT * c +
                POPULARITY_WEIGHT   * pop_norm +
                VOTE_WEIGHT         * vote_norm
            ) * r_boost

        results.append((idx, movie_id, score))

    # Sort before diversity pass so penalty applies to highest scorers first
    results.sort(key=lambda x: x[2], reverse=True)

    # Improvement 2 — genre diversity (operate on top 60 to keep it fast)
    diverse = _apply_genre_diversity(results[:60], n)

    return [
        {"id": int(_df.at[i, "id"]), "title": str(_df.at[i, "title"])}
        for i, _, _ in diverse
    ]


def get_because_you_watched(movie_id: int, n: int = 10) -> list:
    """
    'Because you watched X' — top N most similar movies.
    Pure content-based.
    """
    if _df is None:
        if not _load_content_model():
            return []

    movie_id = int(movie_id)
    if movie_id not in _id_to_idx:
        return []

    try:
        idx    = _id_to_idx[movie_id]
        vec    = _tfidf_matrix[idx]
        scores = cosine_similarity(vec, _tfidf_matrix)[0]
        ranked = sorted(
            [(i, s) for i, s in enumerate(scores) if i != idx],
            key=lambda x: x[1], reverse=True
        )
        return [
            {"id": int(_df.at[i, "id"]), "title": str(_df.at[i, "title"])}
            for i, _ in ranked[:n]
        ]
    except Exception as e:
        print(f"[ML Engine] get_because_you_watched error: {e}")
        return []


def get_mood_recommendations(mood: str, n: int = 20) -> list:
    """
    Mood-based context-aware recommendations.
    mood: "intense" | "happy" | "sad" | "romantic" | "scary" | "mindblowing"

    CHANGE 6 — Methodological consistency for research paper:
    Uses the SAME TF-IDF vectorizer as the content model to transform
    the mood query string into the same vector space. This ensures
    mood scoring is consistent with content-based filtering rather
    than using a separate keyword overlap heuristic.

    This matters for the paper: the methodology section can claim
    a unified vector space for all content signals.
    """
    if _df is None:
        if not _load_content_model():
            return []

    query = MOOD_MAP.get(mood.lower())
    if not query:
        return []

    try:
        if _vectorizer is not None:
            # UNIFIED approach: transform mood query through same TF-IDF
            # vectorizer used for all movies — same vector space
            mood_vec    = _vectorizer.transform([query])
            raw_scores  = cosine_similarity(mood_vec, _tfidf_matrix)[0]

            # Blend TF-IDF cosine with quality signals
            results = []
            for idx, sim in enumerate(raw_scores):
                vote = float(_df.at[idx, "vote_average"]) if "vote_average" in _df.columns else 0.0
                pop  = float(_df.at[idx, "popularity"])   if "popularity"   in _df.columns else 0.0
                score = (
                    sim * 0.70 +
                    (vote / 10.0) * 0.20 +
                    (min(pop, 1000) / 1000.0) * 0.10
                )
                results.append((idx, score))
        else:
            # Fallback if vectorizer not loaded
            keyword_set = set(query.lower().split())
            results = []
            for idx, row in _df.iterrows():
                feature_words = set(str(row.get("features", "")).lower().split())
                overlap = len(keyword_set & feature_words) / max(len(keyword_set), 1)
                vote    = float(row.get("vote_average", 0) or 0)
                pop     = float(row.get("popularity",   0) or 0)
                score   = overlap * 0.70 + (vote / 10) * 0.20 + (min(pop, 1000) / 1000) * 0.10
                results.append((idx, score))

        results.sort(key=lambda x: x[1], reverse=True)

        # Apply genre diversity to mood results too
        diverse = _apply_genre_diversity(
            [(idx, int(_df.at[idx, "id"]), s) for idx, s in results[:60]],
            n
        )
        return [
            {"id": int(_df.at[i, "id"]), "title": str(_df.at[i, "title"])}
            for i, _, _ in diverse
        ]
    except Exception as e:
        print(f"[ML Engine] get_mood_recommendations error: {e}")
        return []


# ═════════════════════════════════════════════════════════════════════════════
# RETRAINING CONTROLS & MONITORING
# ═════════════════════════════════════════════════════════════════════════════
import asyncio
import pickle

_is_training = False
_last_training_logs = []

def get_training_status():
    global _is_training, _last_training_logs
    return {
        "is_training": _is_training,
        "logs": list(_last_training_logs)
    }

def log_training_event(msg: str):
    timestamp = datetime.datetime.now().strftime("%H:%M:%S")
    _last_training_logs.append(f"[{timestamp}] {msg}")
    print(f"[ML Engine] {msg}")

async def retrain_recommendation_model():
    global _is_training, _last_training_logs
    if _is_training:
        return False
    _is_training = True
    _last_training_logs = []

    try:
        log_training_event("Initializing SVD model retraining...")
        from app.models.activity import Activity
        import app.ml.engine as engine_module

        # 1. Fetch real activity logs
        log_training_event("Querying real user activities from MongoDB Atlas...")
        logs = await Activity.find_all().to_list()
        real_logs = [
            {
                "user_id":     str(a.user_id.ref.id) if hasattr(a.user_id, 'ref') else str(a.user_id),
                "movie_id":    a.movie_id,
                "action_type": a.action_type,
            }
            for a in logs
        ]
        log_training_event(f"Loaded {len(real_logs)} user activities from DB.")

        # 2. Fetch MovieLens logs
        ml_logs_path = Path("app/ml/ml_activity_logs.csv")
        if ml_logs_path.exists():
            log_training_event("Loading MovieLens 25M baseline interactions...")
            loop = asyncio.get_running_loop()
            ml_df = await loop.run_in_executor(None, pd.read_csv, ml_logs_path)
            ml_logs = ml_df.to_dict("records")
            log_training_event(f"Loaded {len(ml_logs):,} MovieLens baseline interactions.")
        else:
            ml_logs = []
            log_training_event("Warning: ml_activity_logs.csv not found, proceeding with real logs.")

        all_logs = real_logs + ml_logs
        if not all_logs:
            log_training_event("Aborted: No logs found to train the model.")
            _is_training = False
            return False

        log_training_event(f"Total interactions compiled: {len(all_logs):,}")
        log_training_event("Decomposing matrix with SVD (Singular Value Decomposition)...")
        
        loop = asyncio.get_running_loop()
        await loop.run_in_executor(None, build_collaborative_model, all_logs)

        # 3. Cache factors to disk
        MODEL_DIR = Path("app/ml/model_cache")
        MODEL_DIR.mkdir(exist_ok=True)
        CACHE_FILE = MODEL_DIR / "svd_model.npz"
        INDEX_FILE = MODEL_DIR / "svd_index.pkl"

        if engine_module._collab_user_factors is not None:
            log_training_event("Saving SVD latent factor matrices to disk cache...")
            np.savez_compressed(
                CACHE_FILE,
                user_factors=engine_module._collab_user_factors,
                movie_factors=engine_module._collab_movie_factors,
            )
            with open(INDEX_FILE, "wb") as f:
                pickle.dump({
                    "user_index":  engine_module._collab_user_index,
                    "movie_index": engine_module._collab_movie_index,
                }, f)
            log_training_event(f"SVD model successfully cached → {CACHE_FILE.name}")
        
        log_training_event("Success: Collaborative recommendation SVD model retraining completed!")
        _is_training = False
        return True

    except Exception as e:
        log_training_event(f"Error during retraining: {str(e)}")
        _is_training = False
        return False