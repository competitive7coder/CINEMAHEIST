import asyncio
import httpx
import time
import json
from fastapi import APIRouter, HTTPException, Query, Depends, Request
from fastapi.responses import StreamingResponse
from typing import Optional, AsyncGenerator
from app.config import settings
from app.models.user import User
from app.security import get_current_user
import datetime
from app.ml.engine import get_recommendations
from app.cache.redis import (
    get_cache, set_cache, delete_cache,
    MOVIE_DETAIL_TTL, TRENDING_TTL, HOMEPAGE_TTL, RECOMMENDATIONS_TTL,
)


router = APIRouter()

TMDB_BASE_URL = "https://api.themoviedb.org/3"

# ---------------------------------------------------
# CACHE + RATE LIMIT PROTECTION
# ---------------------------------------------------
homepage_cache = {"data": None, "expires": 0}
CACHE_TTL = 60 * 60 * 6   # 6 hours — genre data barely changes

_short_cache: dict = {}
SHORT_TTL = 60 * 5         # 5 minutes for trending/now-playing/top-rated

# LAYER 1 — In-flight deduplication
# If 50 users request /trending at the same moment cache is cold,
# only ONE real TMDB call is made — rest wait for that same result.
_in_flight: dict = {}

# LAYER 2 — Global TMDB rate limiter (50 req/s limit)
# A semaphore caps concurrent outgoing TMDB calls.
import asyncio as _asyncio
_tmdb_semaphore = _asyncio.Semaphore(10)  # max 10 concurrent TMDB calls

def _get_cache(key: str):
    entry = _short_cache.get(key)
    if entry and entry["expires"] > time.time():
        return entry["data"]
    return None

def _set_cache(key: str, data, ttl: int = SHORT_TTL):
    _short_cache[key] = {"data": data, "expires": time.time() + ttl}


# ---------------------------------------------------
# TMDB HELPER
# ---------------------------------------------------
async def fetch_tmdb(endpoint: str, params: Optional[dict] = None, client: Optional[httpx.AsyncClient] = None):

    params = params or {}
    params["api_key"] = settings.TMDB_API_KEY

    _owns_client = False
    if client is None:
        client = httpx.AsyncClient(base_url=TMDB_BASE_URL, timeout=httpx.Timeout(20.0))
        _owns_client = True

    try:
        # LAYER 2: semaphore limits concurrent TMDB calls to 10
        async with _tmdb_semaphore:
            # LAYER 3: auto-retry on 429 Rate Limited — wait and retry once
            for attempt in range(3):
                try:
                    res = await client.get(endpoint, params=params)

                    if res.status_code == 429:
                        # TMDB tells us how long to wait via Retry-After header
                        retry_after = int(res.headers.get("Retry-After", 2))
                        print(f"[TMDB] Rate limited on {endpoint} — retrying in {retry_after}s (attempt {attempt+1})")
                        await asyncio.sleep(retry_after)
                        continue

                    res.raise_for_status()
                    return res.json()

                except httpx.RequestError:
                    if attempt == 2:
                        raise
                    await asyncio.sleep(1)

            raise HTTPException(status_code=429, detail="TMDB rate limit exceeded — please try again shortly")

    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="TMDB unavailable")

    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="TMDB error")

    finally:
        if _owns_client:
            await client.aclose()


# ---------------------------------------------------
# TRENDING
# ---------------------------------------------------
@router.get("/trending")
async def get_trending(media_type: str = "movie", time_window: str = "day"):
    key = f"trending:{media_type}:{time_window}"
    cached = _get_cache(key)
    if cached: return cached

    # LAYER 1: if another request is already fetching this, wait for it
    if key in _in_flight:
        return await _in_flight[key]

    future = asyncio.get_running_loop().create_future()
    _in_flight[key] = future
    try:
        data = await fetch_tmdb(f"/trending/{media_type}/{time_window}")
        _set_cache(key, data)
        future.set_result(data)
        return data
    except Exception as e:
        future.set_exception(e)
        raise
    finally:
        _in_flight.pop(key, None)


# ---------------------------------------------------
# SEARCH
# ---------------------------------------------------
@router.get("/search")
async def search_movies(
    query: str = Query(..., min_length=1),
    page: int = 1,
    year: Optional[int] = None,        # frontend sends ?year=2023
):
    params = {
        "query": query,
        "page": page,
        "include_adult": False,
        "language": "en-US",
    }
    if year:
        params["primary_release_year"] = year  # TMDB's actual param name

    return await fetch_tmdb("/search/movie", params)


# ---------------------------------------------------
# MOVIE DETAILS
# ---------------------------------------------------
@router.get("/details/{movie_id}")
async def get_movie_details(movie_id: int):
    cache_key = f"movie:details:{movie_id}"
    cached = await get_cache(cache_key)
    if cached:
        return cached

    data = await fetch_tmdb(
        f"/movie/{movie_id}",
        {"append_to_response": "videos,credits,recommendations"}
    )
    await set_cache(cache_key, data, MOVIE_DETAIL_TTL)
    return data


# ---------------------------------------------------
# GENRE MOVIES
# ---------------------------------------------------
@router.get("/genre/{genre_id}")
async def get_movies_by_genre(
    genre_id: int,
    page: int = 1,
    sort_by: str = "popularity.desc",
    year: Optional[int] = None,
):

    params = {
        "with_genres": genre_id,
        "page": page,
        "sort_by": sort_by,
    }

    if year:
        params["primary_release_year"] = year

    return await fetch_tmdb("/discover/movie", params)


# ---------------------------------------------------
# NOW PLAYING
# ---------------------------------------------------
@router.get("/now-playing")
async def now_playing(page: int = 1):
    key = f"now_playing:{page}"
    cached = _get_cache(key)
    if cached: return cached

    if key in _in_flight:
        return await _in_flight[key]

    future = asyncio.get_running_loop().create_future()
    _in_flight[key] = future
    try:
        data = await fetch_tmdb("/movie/now_playing", {"page": page})
        result = data.get("results", [])
        _set_cache(key, result)
        future.set_result(result)
        return result
    except Exception as e:
        future.set_exception(e)
        raise
    finally:
        _in_flight.pop(key, None)


# ---------------------------------------------------
# TOP RATED
# ---------------------------------------------------
@router.get("/top-rated-in")
async def top_rated_movies(page: int = 1):
    key = f"top_rated:{page}"
    cached = _get_cache(key)
    if cached: return cached

    if key in _in_flight:
        return await _in_flight[key]

    future = asyncio.get_running_loop().create_future()
    _in_flight[key] = future
    try:
        data = await fetch_tmdb("/movie/top_rated", {"page": page})
        result = data.get("results", [])
        _set_cache(key, result)
        future.set_result(result)
        return result
    except Exception as e:
        future.set_exception(e)
        raise
    finally:
        _in_flight.pop(key, None)


# ---------------------------------------------------
# MOVIE TRAILER  (language-aware with fallback chain)
# ---------------------------------------------------
@router.get("/{movie_id}/videos")
async def get_movie_videos(
    movie_id: int,
    language: str = Query("en", description="Preferred trailer language, e.g. en, hi, ta, te"),
):
    data = await fetch_tmdb(f"/movie/{movie_id}/videos")
    videos = data.get("results", [])

    def pick_trailer(lang: str):
        """Return best YouTube trailer for a given iso_639_1 language."""
        return next(
            (
                v for v in videos
                if v.get("type") == "Trailer"
                and v.get("site") == "YouTube"
                and v.get("iso_639_1") == lang
            ),
            None,
        )

    # 1️⃣  Try user-requested language first
    trailer = pick_trailer(language)

    # 2️⃣  Fallback → English trailer
    if not trailer and language != "en":
        trailer = pick_trailer("en")

    # 3️⃣  Last resort → any YouTube trailer regardless of language
    if not trailer:
        trailer = next(
            (v for v in videos if v.get("site") == "YouTube"),
            None,
        )

    if not trailer:
        return {"key": None, "language": None}

    return {
        "key": trailer["key"],
        "language": trailer.get("iso_639_1"),   # lets frontend know which lang was served
        "name": trailer.get("name"),
    }


# ---------------------------------------------------
# USER ML RECOMMENDATIONS (Dashboard)
# ---------------------------------------------------
@router.get("/recommendations/user")
async def get_user_recommendations(
    current_user: User = Depends(get_current_user)
):
    try:
        if not current_user:
            return []

        watchlist_ids = [int(mid) for mid in (current_user.watchlist or [])]

        # ✅ Empty watchlist check FIRST — always return [] if no watchlist
        if not watchlist_ids:
            return []

        # No Redis cache for recommendations — ML engine is fast enough
        # and caching causes stale results when watchlist changes
        user_id_str = str(current_user.id)
        raw_ts = current_user.watchlist_timestamps or {}
        watchlist_timestamps = {
            int(k): v for k, v in raw_ts.items()
            if isinstance(v, datetime.datetime)
        }

        recommendations = get_recommendations(
            watchlist_ids=watchlist_ids,
            user_id=user_id_str,
            watchlist_timestamps=watchlist_timestamps or None,
        )
        print(f"[DEBUG] watchlist_ids sent to ML: {watchlist_ids}")
        print(f"[DEBUG] ML returned: {[r['title'] for r in recommendations[:20]]}")

        if not recommendations:
            return []

        async def fetch_details(movie_id: int):
            # Always fetch fresh from TMDB for recommendations
            try:
                return await fetch_tmdb(f"/movie/{movie_id}")
            except Exception:
                return None

        results = await asyncio.gather(
            *[fetch_details(m["id"]) for m in recommendations],
            return_exceptions=True
        )
        final = [r for r in results if isinstance(r, dict)]

        return final

    except Exception as e:
        print("Recommendation endpoint error:", e)
        return []





# ---------------------------------------------------
# RECOMMENDATIONS # movie page
# ---------------------------------------------------
@router.get("/recommendations/{movie_id}")
async def get_movie_recommendations(movie_id: int):
    try:
        async with httpx.AsyncClient(base_url=TMDB_BASE_URL, timeout=httpx.Timeout(20.0)) as client:
            # Fetch recommendations + similar in parallel
            rec_data, sim_data = await asyncio.gather(
                fetch_tmdb(f"/movie/{movie_id}/recommendations", {"language": "en-US", "page": 1}, client),
                fetch_tmdb(f"/movie/{movie_id}/similar",        {"language": "en-US", "page": 1}, client),
            )

        rec     = rec_data.get("results", [])
        similar = sim_data.get("results", [])

        # Merge and deduplicate by id
        seen = set()
        merged = []
        for m in rec + similar:
            if m["id"] not in seen:
                seen.add(m["id"])
                merged.append(m)

        return merged[:20]

    except Exception as e:
        print("Recommendation error:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch recommendations")




# ---------------------------------------------------
# HOMEPAGE SECTIONS (CACHED + PARALLEL)
# ---------------------------------------------------

SECTIONS = {
    "Trending Now":    None,
    "Action Packed":   28,
    "Science Fiction": 878,
    "Romantic Movies": 10749,
    "Thriller Tales":  53,
    "Adventure":       12,
    "Animation":       16,
    "Comedy Movies":   35,
    "Crime":           80,
    "Drama":           18,
    "Horror Flicks":   27,
}


async def _fetch_section(name: str, genre_id):
    """Fetch one section from TMDB and return (name, movies)."""
    try:
        if genre_id is None:
            data = await fetch_tmdb("/trending/movie/week")
            return name, data.get("results", [])[:10]

        data = await fetch_tmdb(
            "/discover/movie",
            {
                "with_genres": genre_id,
                "sort_by": "popularity.desc",
                "vote_count.gte": 100,
            },
        )
        movies = data.get("results", [])
        filtered = [m for m in movies if genre_id in (m.get("genre_ids") or [])]
        return name, filtered[:10]
    except Exception:
        return name, []


@router.get("/homepage-sections")
async def get_homepage_sections():
    """
    Returns cached JSON when warm.
    On cold start, fetches all sections in parallel and caches the result.
    """
    now = time.time()
    if homepage_cache["data"] and homepage_cache["expires"] > now:
        return homepage_cache["data"]

    results = dict(
        await asyncio.gather(
            *[_fetch_section(name, gid) for name, gid in SECTIONS.items()]
        )
    )

    homepage_cache["data"] = results
    homepage_cache["expires"] = now + CACHE_TTL
    return results


# ---------------------------------------------------
# HOMEPAGE SECTIONS — STREAMING (first load fast)
# ---------------------------------------------------
@router.get("/homepage-sections/stream")
async def stream_homepage_sections():
    """
    SSE endpoint: emits each section as soon as its TMDB call resolves.
    Frontend renders rows one-by-one instead of waiting for all 11 calls.
    Falls back to cache if already warm — emits all sections instantly.
    Format per event:  data: {"name": "...", "movies": [...]}\n\n
    """
    now = time.time()

    # If cache is warm, stream all sections immediately from memory
    if homepage_cache["data"] and homepage_cache["expires"] > now:
        async def from_cache() -> AsyncGenerator[str, None]:
            for name, movies in homepage_cache["data"].items():
                payload = json.dumps({"name": name, "movies": movies})
                yield f"data: {payload}\n\n"
            yield 'data: {"done": true}\n\n'
        return StreamingResponse(from_cache(), media_type="text/event-stream")

    # Cold start: fire all TMDB calls simultaneously, yield each as it finishes
    async def stream_live() -> AsyncGenerator[str, None]:
        collected = {}
        tasks = {
            asyncio.create_task(_fetch_section(name, gid)): name
            for name, gid in SECTIONS.items()
        }

        pending = set(tasks.keys())
        while pending:
            done, pending = await asyncio.wait(pending, return_when=asyncio.FIRST_COMPLETED)
            for task in done:
                name, movies = task.result()
                collected[name] = movies
                payload = json.dumps({"name": name, "movies": movies})
                yield f"data: {payload}\n\n"

        # Cache the full result once all sections are in
        homepage_cache["data"] = collected
        homepage_cache["expires"] = time.time() + CACHE_TTL
        yield 'data: {"done": true}\n\n'

    return StreamingResponse(stream_live(), media_type="text/event-stream")