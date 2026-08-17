"""
movielens_to_CinemaHeist.py — Convert MovieLens 25M  CinemaHeist activity logs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What this script does:
  1. Loads MovieLens ratings.csv (25M ratings, 162k users)
  2. Cross-references links.csv to get TMDB movie IDs
  3. Filters to only movies in YOUR movies_enriched.csv
  4. Maps star ratings  OTT implicit signals (your paper's Contribution 2)
  5. Saves ml_activity_logs.csv — ready to feed into engine.py

Rating  OTT Signal Mapping (your paper's novel contribution):
   (≥ 4.0)  added_to_watchlist  (weight 1.0, alpha=40)
     (3.0–3.9)  trailer_watch      (weight 0.5, alpha=20)
      (< 3.0)   removed_from_watchlist (weight -0.5)

Academic justification (cite in paper):
  "Following Hu et al. (2008), we derive implicit feedback from explicit
   ratings by treating high ratings as strong positive signals and low
   ratings as negative signals. We extend this approach by mapping rating
   tiers to OTT-specific signal types rather than a single implicit score."

HOW TO RUN:
  Step 1 — Download MovieLens 25M:
    https://grouplens.org/datasets/movielens/25m/
    Unzip to: app/ml/movielens/
    Need:     movies.csv, ratings.csv, links.csv

  Step 2 — Run this script:
    cd app/ml
    python movielens_to_CinemaHeist.py

  Step 3 — Load in main.py startup (code shown at bottom of this file)

OUTPUT FILES:
  ml_activity_logs.csv  — activity logs for SVD training
  ml_stats.txt          — dataset statistics for your paper
"""

import os
import sys
import pandas as pd
from pathlib import Path

#  Paths 
BASE_DIR      = Path(__file__).resolve().parent
ML_DIR        = BASE_DIR / "movielens"
ENRICHED_CSV  = BASE_DIR / "movies_enriched.csv"
OUTPUT_LOGS   = BASE_DIR / "ml_activity_logs.csv"
OUTPUT_STATS  = BASE_DIR / "ml_stats.txt"

ML_RATINGS    = ML_DIR / "ratings.csv"
ML_LINKS      = ML_DIR / "links.csv"
ML_MOVIES     = ML_DIR / "movies.csv"

#  Rating  OTT Signal mapping 
# This IS Contribution 2 of your paper
# Maps MovieLens explicit ratings to OTT implicit feedback signals
def rating_to_signal(rating: float) -> str | None:
    if rating >= 4.0:
        return "added_to_watchlist"    # strong positive  watchlist save
    elif rating >= 3.0:
        return "trailer_watch"         # moderate interest  trailer engagement
    elif rating >= 1.0:
        return "removed_from_watchlist" # negative  explicit rejection
    return None


def main():
    print("=" * 60)
    print("  MovieLens 25M  CinemaHeist Activity Logs")
    print("=" * 60)

    #  Check files exist 
    missing = []
    if not ML_RATINGS.exists():
        missing.append(f"   {ML_RATINGS}")
    if not ML_LINKS.exists():
        missing.append(f"   {ML_LINKS}")
    if not ENRICHED_CSV.exists():
        missing.append(f"   {ENRICHED_CSV}")

    if missing:
        print("\nMissing files:")
        for m in missing: print(m)
        print("""
How to fix:
  1. Download MovieLens 25M from:
     https://grouplens.org/datasets/movielens/25m/

  2. Unzip and place files at:
     app/ml/movielens/ratings.csv
     app/ml/movielens/links.csv
     app/ml/movielens/movies.csv
""")
        sys.exit(1)

    print("\n Loading your movies_enriched.csv...")
    enriched    = pd.read_csv(ENRICHED_CSV, usecols=["id"])
    your_tmdb   = set(enriched["id"].astype(int).tolist())
    print(f"   Your dataset: {len(your_tmdb):,} movies")

    print("\n Loading MovieLens links.csv...")
    links = pd.read_csv(ML_LINKS, dtype={"movieId": int, "tmdbId": "Int64"})
    links = links.dropna(subset=["tmdbId"])
    links["tmdbId"] = links["tmdbId"].astype(int)

    # Keep only MovieLens movies that exist in YOUR enriched dataset
    links_filtered = links[links["tmdbId"].isin(your_tmdb)]
    valid_ml_ids   = set(links_filtered["movieId"].tolist())
    print(f"   MovieLens movies matched to your dataset: {len(valid_ml_ids):,}")

    if len(valid_ml_ids) == 0:
        print("\n No overlap found between MovieLens and your movies.")
        print("   Make sure movies_enriched.csv has TMDB IDs in the 'id' column.")
        sys.exit(1)

    print("\n Loading MovieLens ratings.csv (25M rows — ~30 seconds)...")
    print("   (filtering as we load to save memory)")

    # Load in chunks to handle 25M rows efficiently
    chunk_size = 500_000
    kept_chunks = []
    total_raw   = 0

    for chunk in pd.read_csv(
        ML_RATINGS,
        chunksize=chunk_size,
        dtype={"userId": int, "movieId": int, "rating": float},
        usecols=["userId", "movieId", "rating", "timestamp"],
    ):
        total_raw  += len(chunk)
        filtered    = chunk[chunk["movieId"].isin(valid_ml_ids)]
        if not filtered.empty:
            kept_chunks.append(filtered)

        # Progress
        print(f"   Processed {total_raw:,} rows, kept {sum(len(c) for c in kept_chunks):,}...",
              end="\r")

    print()
    ratings = pd.concat(kept_chunks, ignore_index=True)
    print(f"   Raw ratings for your movies: {len(ratings):,}")
    print(f"   Unique users: {ratings['userId'].nunique():,}")

    print("\n Mapping MovieLens IDs  TMDB IDs...")
    ml_to_tmdb = dict(zip(links_filtered["movieId"], links_filtered["tmdbId"]))
    ratings["movie_id"] = ratings["movieId"].map(ml_to_tmdb)
    ratings = ratings.dropna(subset=["movie_id"])
    ratings["movie_id"] = ratings["movie_id"].astype(int)

    print("\n Mapping ratings  OTT implicit signals...")
    print("    (≥4.0)  added_to_watchlist")
    print("      (3.0-3.9)  trailer_watch")
    print("       (<3.0)   removed_from_watchlist")

    ratings["action_type"] = ratings["rating"].apply(rating_to_signal)
    ratings = ratings.dropna(subset=["action_type"])

    # Prefix user IDs with "ml_" so they don't clash with your real users
    ratings["user_id"] = "ml_" + ratings["userId"].astype(str)

    activity_logs = ratings[["user_id", "movie_id", "action_type", "timestamp"]].copy()
    activity_logs = activity_logs.drop_duplicates()

    print(f"\n Saving {len(activity_logs):,} activity logs...")
    activity_logs.to_csv(OUTPUT_LOGS, index=False)
    print(f"   Saved  {OUTPUT_LOGS}")

    signal_counts = activity_logs["action_type"].value_counts()
    user_count    = activity_logs["user_id"].nunique()
    movie_count   = activity_logs["movie_id"].nunique()

    stats = f"""
MovieLens  CinemaHeist Dataset Statistics
(Include these numbers in your research paper)
{'=' * 50}

Dataset:
  Total activity logs    : {len(activity_logs):,}
  Unique users           : {user_count:,}
  Unique movies          : {movie_count:,}
  Your movie coverage    : {movie_count}/{len(your_tmdb)} ({movie_count/len(your_tmdb)*100:.1f}%)

Signal Distribution (Contribution 2):
  added_to_watchlist     : {signal_counts.get('added_to_watchlist', 0):,}
  trailer_watch          : {signal_counts.get('trailer_watch', 0):,}
  removed_from_watchlist : {signal_counts.get('removed_from_watchlist', 0):,}

Sparsity:
  Matrix density         : {len(activity_logs) / (user_count * movie_count) * 100:.4f}%
  Avg actions per user   : {len(activity_logs) / user_count:.1f}
  Avg actions per movie  : {len(activity_logs) / movie_count:.1f}

Source:
  F. Maxwell Harper and Joseph A. Konstan. 2015.
  The MovieLens Datasets: History and Context.
  ACM Transactions on Interactive Intelligent Systems, 5(4):19.
{'=' * 50}
"""
    print(stats)

    with open(OUTPUT_STATS, "w", encoding="utf-8") as f:
        f.write(stats)
    print(f"   Stats saved  {OUTPUT_STATS}")

    #  Usage instructions 
    print(f"""
{'=' * 60}
   DONE
{'=' * 60}

  NEXT STEP — Load in main.py startup:

  Add this to your train_ml() function in main.py:

  ─────────────────────────────────────────────────────
  from pathlib import Path
  import pandas as pd

  async def train_ml():
      await asyncio.sleep(3)
      try:
          # Load real user activity from MongoDB
          activities = await Activity.find_all().to_list()
          real_logs  = [
              {{
                  "user_id":     str(a.user_id.id),
                  "movie_id":    a.movie_id,
                  "action_type": a.action_type,
              }}
              for a in activities
          ]

          # Load MovieLens simulated activity
          ml_logs_path = Path("app/ml/ml_activity_logs.csv")
          if ml_logs_path.exists():
              ml_df   = pd.read_csv(ml_logs_path)
              ml_logs = ml_df.to_dict("records")
              print(f"[ML] Loaded {{len(ml_logs):,}} MovieLens activity logs")
          else:
              ml_logs = []

          # Combine both  real users + MovieLens users
          all_logs = real_logs + ml_logs
          build_collaborative_model(all_logs)

      except Exception as e:
          print(f"[ML] Startup training failed: {{e}}")
  ─────────────────────────────────────────────────────

  This gives your SVD model 162,000 users of training data
  while still incorporating your real users on top.
{'=' * 60}
""")


if __name__ == "__main__":
    main()