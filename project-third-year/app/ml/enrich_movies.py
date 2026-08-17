import os
import time
import requests
import pandas as pd
from pathlib import Path
from tqdm import tqdm
from dotenv import load_dotenv

# .env is in app/  one level up from app/ml/
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

#  Config 
TMDB_API_KEY = os.getenv("TMDB_API_KEY", "")
BASE_URL     = "https://api.themoviedb.org/3"
INPUT_CSV    = Path(__file__).parent / "movies.csv"
OUTPUT_CSV   = Path(__file__).parent / "movies_enriched.csv"
MAX_CAST     = 5    # top N actors to include
MAX_KEYWORDS = 10   # top N keywords to include
SLEEP_MS     = 50   # ms between requests  stays well under TMDB 40 req/s limit


def fetch_movie(session: requests.Session, movie_id: int) -> dict | None:
    """Fetch full movie details + credits + keywords in one call."""
    try:
        res = session.get(
            f"{BASE_URL}/movie/{movie_id}",
            params={
                "api_key":              TMDB_API_KEY,
                "append_to_response":   "credits,keywords",
                "language":             "en-US",
            },
            timeout=10,
        )
        if res.status_code == 404:
            return None   # movie not found  skip silently
        if res.status_code == 429:
            print(f"\n️  Rate limited — sleeping 10s...")
            time.sleep(10)
            return fetch_movie(session, movie_id)  # retry
        res.raise_for_status()
        return res.json()

    except requests.RequestException as e:
        print(f"\n️  Failed {movie_id}: {e}")
        return None


def parse_movie(data: dict) -> dict:
    """Extract the fields we care about from TMDB response."""

    # Genres  semicolon separated (matches existing CSV format)
    genres = ";".join(g["name"] for g in data.get("genres", []))

    # Top cast  most billed actors
    cast = data.get("credits", {}).get("cast", [])
    top_cast = ";".join(
        c["name"] for c in sorted(cast, key=lambda x: x.get("order", 99))[:MAX_CAST]
    )

    # Director from crew
    crew = data.get("credits", {}).get("crew", [])
    directors = [c["name"] for c in crew if c.get("job") == "Director"]
    director = directors[0] if directors else ""

    # Keywords  thematic tags like "time travel", "heist", "superhero"
    keywords_raw = data.get("keywords", {}).get("keywords", [])
    keywords = ";".join(k["name"] for k in keywords_raw[:MAX_KEYWORDS])

    # Overview  movie description
    overview = (data.get("overview") or "").replace("\n", " ").strip()

    # Release year
    release_date = data.get("release_date", "")
    release_year = int(release_date[:4]) if release_date and len(release_date) >= 4 else 0

    return {
        "id":            data["id"],
        "title":         data.get("title", ""),
        "genres":        genres,
        "cast":          top_cast,
        "director":      director,
        "keywords":      keywords,
        "overview":      overview,
        "vote_average":  data.get("vote_average", 0.0),
        "vote_count":    data.get("vote_count",   0),     # CHANGE 7: for Bayesian re-ranking
        "popularity":    data.get("popularity",   0.0),
        "release_year":  release_year,
        "runtime":       data.get("runtime",      0),     # CHANGE 8: metadata completeness
        "original_language": data.get("original_language", "en"),
    }


def main():
    if not TMDB_API_KEY or TMDB_API_KEY == "YOUR_KEY_HERE":
        print(" Set TMDB_API_KEY env var first:  export TMDB_API_KEY=your_key")
        return

    # Load existing CSV  deduplicate IDs
    df = pd.read_csv(INPUT_CSV).drop_duplicates(subset="id")
    print(f" Loaded {len(df)} unique movies from {INPUT_CSV}")

    # Resume support  skip already-fetched movies if output exists
    already_done = set()
    if OUTPUT_CSV.exists():
        existing = pd.read_csv(OUTPUT_CSV)
        already_done = set(existing["id"].tolist())
        print(f" Resuming — {len(already_done)} already enriched, {len(df) - len(already_done)} remaining")

    todo = df[~df["id"].isin(already_done)]

    if todo.empty:
        print(" All movies already enriched!")
        return

    results = []
    session = requests.Session()

    for _, row in tqdm(todo.iterrows(), total=len(todo), desc="Enriching"):
        data = fetch_movie(session, int(row["id"]))
        if data:
            results.append(parse_movie(data))
        time.sleep(SLEEP_MS / 1000)

    if not results:
        print("️  No new data fetched")
        return

    new_df = pd.DataFrame(results)

    # Append to existing enriched CSV if it exists
    if OUTPUT_CSV.exists():
        existing = pd.read_csv(OUTPUT_CSV)
        final_df = pd.concat([existing, new_df], ignore_index=True)
    else:
        final_df = new_df

    final_df.to_csv(OUTPUT_CSV, index=False)
    print(f"\n Saved {len(final_df)} enriched movies  {OUTPUT_CSV}")
    print(f"\nColumns: {final_df.columns.tolist()}")
    print(f"\nSample:\n{final_df.head(2).to_string()}")


if __name__ == "__main__":
    main()