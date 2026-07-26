import asyncio
import os
import pandas as pd
import httpx
from dotenv import load_dotenv
from pathlib import Path

# Load env variables
BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(BASE_DIR / "app" / ".env")

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
CSV_PATH = Path(__file__).resolve().parent / "movies_enriched.csv"

async def fetch_language(client, movie_id):
    try:
        url = f"https://api.themoviedb.org/3/movie/{movie_id}"
        res = await client.get(url, params={"api_key": TMDB_API_KEY})
        if res.status_code == 200:
            return movie_id, res.json().get("original_language", "en")
        return movie_id, "en"
    except Exception:
        return movie_id, "en"

async def main():
    if not TMDB_API_KEY:
        print("Error: TMDB_API_KEY is not set in .env")
        return

    if not CSV_PATH.exists():
        print(f"Error: CSV file not found at {CSV_PATH}")
        return

    print("Loading movies CSV...")
    df = pd.read_csv(CSV_PATH)
    
    if "original_language" in df.columns:
        print("Column 'original_language' already exists in CSV!")
        return

    print(f"Migrating {len(df)} movies in parallel. Fetching languages...")
    
    movie_ids = df["id"].tolist()
    languages = {}
    
    batch_size = 80
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        for i in range(0, len(movie_ids), batch_size):
            batch = movie_ids[i:i+batch_size]
            tasks = [fetch_language(client, mid) for mid in batch]
            results = await asyncio.gather(*tasks)
            for mid, lang in results:
                languages[mid] = lang
            print(f"Progress: {min(i+batch_size, len(movie_ids))}/{len(movie_ids)} fetched...")
            await asyncio.sleep(0.1) # Small delay between batches

    df["original_language"] = df["id"].map(languages).fillna("en")
    
    print("Saving migrated CSV back to disk...")
    df.to_csv(CSV_PATH, index=False)
    print("Migration complete!")

if __name__ == "__main__":
    asyncio.run(main())
