"""
expand_dataset.py — Expand movies_enriched.csv from 969 to 10,000+ movies
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Does everything in one script:
  Phase 1 — Discovers new TMDB movie IDs via /discover/movie
  Phase 2 — Enriches each with full metadata (cast, director, keywords...)
  Phase 3 — Merges with existing movies_enriched.csv (no duplicates)

HOW TO RUN:
  cd app/ml

  # Test with small batch first (adds ~100 movies, ~1 minute):
  python expand_dataset.py --target 1100

  # Full run (10,000 movies total, ~30-40 minutes):
  python expand_dataset.py --target 10000

  # Expand further any time:
  python expand_dataset.py --target 20000

RESUME SUPPORT:
  Safe to interrupt and re-run — already-enriched movies are skipped.

REQUIREMENTS:
  pip install requests pandas tqdm python-dotenv
  TMDB_API_KEY must be set in app/.env
"""

import os
import sys
import time
import argparse
import requests
import pandas as pd
from pathlib import Path
from tqdm import tqdm
from dotenv import load_dotenv

# .env is in app/ — one level up from app/ml/
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

# ── Config ────────────────────────────────────────────────────────────────────
TMDB_API_KEY = os.getenv("TMDB_API_KEY", "")
BASE_URL     = "https://api.themoviedb.org/3"
OUTPUT_CSV   = Path(__file__).parent / "movies_enriched.csv"
MAX_CAST     = 5
MAX_KEYWORDS = 10
SLEEP_S      = 0.04    # 25 req/s — safely under TMDB 40/s rate limit

# ── Discovery strategies ──────────────────────────────────────────────────────
# Multiple strategies so results are diverse (not just popular blockbusters)
DISCOVER_STRATEGIES = [
    # Sort-based
    {"sort_by": "popularity.desc",   "vote_count.gte": 100, "language": "en-US"},
    {"sort_by": "vote_average.desc", "vote_count.gte": 500, "language": "en-US"},
    {"sort_by": "revenue.desc",      "vote_count.gte": 100, "language": "en-US"},

    # By genre
    {"with_genres": 28,   "sort_by": "vote_count.desc", "vote_count.gte": 50},  # Action
    {"with_genres": 35,   "sort_by": "vote_count.desc", "vote_count.gte": 50},  # Comedy
    {"with_genres": 18,   "sort_by": "vote_count.desc", "vote_count.gte": 50},  # Drama
    {"with_genres": 27,   "sort_by": "vote_count.desc", "vote_count.gte": 50},  # Horror
    {"with_genres": 878,  "sort_by": "vote_count.desc", "vote_count.gte": 50},  # Sci-Fi
    {"with_genres": 53,   "sort_by": "vote_count.desc", "vote_count.gte": 50},  # Thriller
    {"with_genres": 10749,"sort_by": "vote_count.desc", "vote_count.gte": 50},  # Romance
    {"with_genres": 16,   "sort_by": "vote_count.desc", "vote_count.gte": 50},  # Animation
    {"with_genres": 80,   "sort_by": "vote_count.desc", "vote_count.gte": 50},  # Crime
    {"with_genres": 14,   "sort_by": "vote_count.desc", "vote_count.gte": 50},  # Fantasy
    {"with_genres": 12,   "sort_by": "vote_count.desc", "vote_count.gte": 50},  # Adventure
    {"with_genres": 36,   "sort_by": "vote_count.desc", "vote_count.gte": 30},  # History
    {"with_genres": 10752,"sort_by": "vote_count.desc", "vote_count.gte": 30},  # War

    # By decade
    {"primary_release_date.gte": "1980-01-01",
     "primary_release_date.lte": "1989-12-31",
     "sort_by": "vote_count.desc", "vote_count.gte": 50},
    {"primary_release_date.gte": "1990-01-01",
     "primary_release_date.lte": "1999-12-31",
     "sort_by": "vote_count.desc", "vote_count.gte": 50},
    {"primary_release_date.gte": "2000-01-01",
     "primary_release_date.lte": "2009-12-31",
     "sort_by": "vote_count.desc", "vote_count.gte": 50},
    {"primary_release_date.gte": "2010-01-01",
     "primary_release_date.lte": "2019-12-31",
     "sort_by": "vote_count.desc", "vote_count.gte": 50},
    {"primary_release_date.gte": "2020-01-01",
     "primary_release_date.lte": "2026-12-31",
     "sort_by": "vote_count.desc", "vote_count.gte": 20},

    # International cinema
    {"with_original_language": "ko", "sort_by": "vote_average.desc", "vote_count.gte": 100},
    {"with_original_language": "ja", "sort_by": "vote_average.desc", "vote_count.gte": 100},
    {"with_original_language": "fr", "sort_by": "vote_average.desc", "vote_count.gte": 100},
    {"with_original_language": "hi", "sort_by": "vote_average.desc", "vote_count.gte": 100},
    {"with_original_language": "es", "sort_by": "vote_average.desc", "vote_count.gte": 100},
    {"with_original_language": "de", "sort_by": "vote_average.desc", "vote_count.gte": 100},
    {"with_original_language": "it", "sort_by": "vote_average.desc", "vote_count.gte": 100},
]

GENRE_NAMES = {
    28:"Action", 35:"Comedy", 18:"Drama", 27:"Horror", 878:"Sci-Fi",
    53:"Thriller", 10749:"Romance", 16:"Animation", 80:"Crime",
    14:"Fantasy", 12:"Adventure", 36:"History", 10752:"War",
}


# =============================================================================
# PHASE 1 — DISCOVER
# =============================================================================

def discover_ids(session: requests.Session, existing_ids: set, need: int) -> list:
    """
    Discover new TMDB movie IDs we don't have yet.
    Cycles through strategies until we collect enough new IDs.
    """
    new_ids = []
    seen    = set(existing_ids)

    print(f"\n{'─' * 55}")
    print(f"  Phase 1 — Discovering {need:,} new movie IDs")
    print(f"  (skipping {len(existing_ids):,} already in your dataset)")
    print(f"{'─' * 55}\n")

    for strategy in DISCOVER_STRATEGIES:
        if len(new_ids) >= need:
            break

        params = {**strategy, "api_key": TMDB_API_KEY}
        label  = _label(strategy)

        for page in range(1, 500):
            if len(new_ids) >= need:
                break
            try:
                res = session.get(
                    f"{BASE_URL}/discover/movie",
                    params={**params, "page": page},
                    timeout=10,
                )
                if res.status_code == 429:
                    print(f"\n  ⚠️  Rate limited — sleeping 12s...")
                    time.sleep(12)
                    continue
                if res.status_code != 200:
                    break

                data    = res.json()
                results = data.get("results", [])
                if not results:
                    break

                for m in results:
                    mid = m.get("id")
                    if mid and mid not in seen:
                        new_ids.append(mid)
                        seen.add(mid)

                if page >= min(data.get("total_pages", 1), 500):
                    break

                time.sleep(SLEEP_S)

            except Exception as e:
                print(f"\n  ⚠️  {label} p{page}: {e}")
                break

        print(f"  ✓ {label:<40} total new: {len(new_ids):,}")

    print(f"\n  Discovered {len(new_ids):,} new IDs")
    return new_ids[:need]


def _label(s: dict) -> str:
    if "with_genres" in s:
        return f"Genre={GENRE_NAMES.get(s['with_genres'], s['with_genres'])}"
    if "with_original_language" in s:
        return f"Language={s['with_original_language'].upper()}"
    if "primary_release_date.gte" in s:
        return f"Decade={s['primary_release_date.gte'][:4]}s"
    return f"Sort={s.get('sort_by','?')}"


# =============================================================================
# PHASE 2 — ENRICH
# =============================================================================

def fetch_movie(session: requests.Session, movie_id: int) -> dict | None:
    """Fetch movie details + credits + keywords in one TMDB API call."""
    try:
        res = session.get(
            f"{BASE_URL}/movie/{movie_id}",
            params={
                "api_key":            TMDB_API_KEY,
                "append_to_response": "credits,keywords",
                "language":           "en-US",
            },
            timeout=10,
        )
        if res.status_code == 404:
            return None
        if res.status_code == 429:
            print(f"\n  ⚠️  Rate limited — sleeping 12s...")
            time.sleep(12)
            return fetch_movie(session, movie_id)
        res.raise_for_status()
        return res.json()
    except requests.RequestException as e:
        print(f"\n  ⚠️  Failed {movie_id}: {e}")
        return None


def parse_movie(data: dict) -> dict | None:
    """
    Extract enriched fields from TMDB API response.
    Returns None if movie has insufficient data (quality gate).
    """
    if not data.get("title"):
        return None
    if not data.get("genres"):
        return None
    if (data.get("vote_count") or 0) < 10:
        return None  # too few votes — unreliable for ML

    genres   = ";".join(g["name"] for g in data.get("genres", []))
    cast     = data.get("credits", {}).get("cast", [])
    top_cast = ";".join(
        c["name"] for c in sorted(cast, key=lambda x: x.get("order", 99))[:MAX_CAST]
    )
    crew      = data.get("credits", {}).get("crew", [])
    directors = [c["name"] for c in crew if c.get("job") == "Director"]
    director  = directors[0] if directors else ""
    kws_raw   = data.get("keywords", {}).get("keywords", [])
    keywords  = ";".join(k["name"] for k in kws_raw[:MAX_KEYWORDS])
    overview  = (data.get("overview") or "").replace("\n", " ").strip()
    release   = data.get("release_date", "")
    year      = int(release[:4]) if release and len(release) >= 4 else 0

    return {
        "id":           int(data["id"]),
        "title":        data.get("title", ""),
        "genres":       genres,
        "cast":         top_cast,
        "director":     director,
        "keywords":     keywords,
        "overview":     overview,
        "vote_average": float(data.get("vote_average") or 0),
        "vote_count":   int(data.get("vote_count")   or 0),
        "popularity":   float(data.get("popularity")  or 0),
        "release_year": year,
        "runtime":      int(data.get("runtime")       or 0),
    }


def enrich_ids(session: requests.Session, new_ids: list) -> pd.DataFrame:
    """Fetch and parse metadata for each discovered movie ID."""
    mins = max(1, len(new_ids) // 400)
    print(f"\n{'─' * 55}")
    print(f"  Phase 2 — Enriching {len(new_ids):,} movies")
    print(f"  Estimated time: ~{mins} minute(s)")
    print(f"{'─' * 55}\n")

    results = []
    skipped = 0

    for movie_id in tqdm(new_ids, desc="  Enriching", unit="movie"):
        data = fetch_movie(session, movie_id)
        if data:
            parsed = parse_movie(data)
            if parsed:
                results.append(parsed)
            else:
                skipped += 1
        else:
            skipped += 1
        time.sleep(SLEEP_S)

    print(f"\n  ✓ Enriched: {len(results):,}  |  Skipped (no data): {skipped:,}")
    return pd.DataFrame(results) if results else pd.DataFrame()


# =============================================================================
# PHASE 3 — MERGE + SAVE
# =============================================================================

def merge_and_save(new_df: pd.DataFrame, existing_df: pd.DataFrame) -> pd.DataFrame:
    """Merge new movies into existing CSV, deduplicate, save."""
    if existing_df.empty:
        final = new_df.copy()
    else:
        final = pd.concat([existing_df, new_df], ignore_index=True)

    final = final.drop_duplicates(subset="id").reset_index(drop=True)

    # Ensure numeric columns are clean
    for col in ["vote_average", "vote_count", "popularity", "release_year", "runtime"]:
        if col in final.columns:
            final[col] = pd.to_numeric(final[col], errors="coerce").fillna(0)

    final.to_csv(OUTPUT_CSV, index=False)
    return final


# =============================================================================
# MAIN
# =============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Expand CinemaHeist movie dataset via TMDB API"
    )
    parser.add_argument(
        "--target", type=int, default=10000,
        help="Target total movie count (default: 10000)"
    )
    args = parser.parse_args()

    # Validate API key
    if not TMDB_API_KEY or TMDB_API_KEY == "YOUR_KEY_HERE":
        print("\n❌ TMDB_API_KEY not found in your .env file")
        print("   Add this line to app/.env:")
        print("   TMDB_API_KEY=your_actual_key_here")
        print("   Get a free key at: https://www.themoviedb.org/settings/api")
        sys.exit(1)

    # Load existing enriched CSV
    if OUTPUT_CSV.exists():
        existing_df  = pd.read_csv(OUTPUT_CSV).drop_duplicates(subset="id")
        existing_ids = set(existing_df["id"].tolist())
    else:
        existing_df  = pd.DataFrame()
        existing_ids = set()

    current = len(existing_ids)
    need    = max(0, args.target - current)

    print(f"\n{'=' * 55}")
    print(f"  CinemaHeist — Dataset Expander")
    print(f"{'=' * 55}")
    print(f"  Current : {current:,} movies")
    print(f"  Target  : {args.target:,} movies")
    print(f"  Need    : {need:,} more")
    print(f"{'=' * 55}")

    if need <= 0:
        print(f"\n✅ Already at target ({current:,} movies).")
        print(f"   To expand more: python expand_dataset.py --target {args.target + 5000}")
        return

    session = requests.Session()

    # Phase 1 — Discover new IDs
    new_ids = discover_ids(session, existing_ids, need)
    if not new_ids:
        print("\n⚠️  No new movie IDs found. Check TMDB_API_KEY.")
        return

    # Phase 2 — Enrich
    new_df = enrich_ids(session, new_ids)
    if new_df.empty:
        print("\n⚠️  Enrichment returned no results.")
        return

    # Phase 3 — Merge + Save
    print(f"\n{'─' * 55}")
    print(f"  Phase 3 — Merging and saving...")
    print(f"{'─' * 55}")
    final_df = merge_and_save(new_df, existing_df)

    print(f"""
{'=' * 55}
  ✅  COMPLETE
{'=' * 55}
  Before  : {current:,} movies
  Added   : {len(new_df):,} new movies
  After   : {len(final_df):,} movies
  Saved   : {OUTPUT_CSV}
{'=' * 55}

  NEXT STEPS:
  1. Restart FastAPI server (uvicorn main:app --reload)
  2. engine.py auto-loads expanded dataset on next request
  3. To expand more: python expand_dataset.py --target 20000
{'=' * 55}
""")


if __name__ == "__main__":
    main()