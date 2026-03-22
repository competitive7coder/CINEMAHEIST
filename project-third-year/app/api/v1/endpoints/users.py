from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime
from app.models.user import User
from app.security import get_current_user
from app.schemas.user import UserOut
from app.cache.redis import delete_cache

router = APIRouter()


# ---------------------------------------------------
# GET WATCHLIST
# ---------------------------------------------------
@router.get("/watchlist", response_model=List[int])
async def get_watchlist(current_user: User = Depends(get_current_user)):
    """
    Get all movie IDs in the user's watchlist
    """
    return current_user.watchlist


# ---------------------------------------------------
# ADD TO WATCHLIST
# ---------------------------------------------------
@router.post("/watchlist/{movie_id}")
async def add_to_watchlist(
    movie_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Adds a movie to the watchlist
    """

    if movie_id in current_user.watchlist:
        return {
            "msg": "Movie already in watchlist",
            "watchlist": current_user.watchlist
        }

    current_user.watchlist.append(movie_id)

    # Store timestamp for Contribution 1 — Temporal Watchlist Decay
    if current_user.watchlist_timestamps is None:
        current_user.watchlist_timestamps = {}
    current_user.watchlist_timestamps[str(movie_id)] = datetime.utcnow()

    await current_user.save()

    # Invalidate ALL recommendation cache keys for this user
    from app.cache.redis import delete_pattern
    await delete_pattern(f"user:recs:{str(current_user.id)}:*")

    return {
        "msg": "Movie added to watchlist",
        "watchlist": current_user.watchlist
    }


# ---------------------------------------------------
# REMOVE FROM WATCHLIST
# ---------------------------------------------------
@router.delete("/watchlist/{movie_id}")
async def remove_from_watchlist(
    movie_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Removes a movie from watchlist
    """

    if movie_id not in current_user.watchlist:
        raise HTTPException(status_code=404, detail="Movie not in watchlist")

    current_user.watchlist.remove(movie_id)

    # Remove timestamp when movie is removed from watchlist
    if current_user.watchlist_timestamps:
        current_user.watchlist_timestamps.pop(str(movie_id), None)

    await current_user.save()

    # Invalidate ALL recommendation cache keys for this user
    from app.cache.redis import delete_pattern
    user_id = str(current_user.id)
    await delete_pattern(f"user:recs:{user_id}:*")

    return {
        "msg": "Movie removed from watchlist",
        "watchlist": current_user.watchlist
    }


# ---------------------------------------------------
# GET WATCHLIST WITH FULL MOVIE DATA 
# ---------------------------------------------------
@router.get("/watchlist/full")
async def get_watchlist_full(current_user: User = Depends(get_current_user)):
    import asyncio
    import httpx
    from app.config import settings
    from app.cache.redis import get_cache, set_cache, MOVIE_DETAIL_TTL

    ids = current_user.watchlist or []
    if not ids:
        return []

    TMDB_BASE = "https://api.themoviedb.org/3"

    async def fetch_one(movie_id: int, client: httpx.AsyncClient):
        cache_key = f"movie:details:{movie_id}"
        cached = await get_cache(cache_key)
        if cached:
            return cached
        try:
            res = await client.get(
                f"{TMDB_BASE}/movie/{movie_id}",
                params={"api_key": settings.TMDB_API_KEY,
                        "append_to_response": "videos,credits"},
            )
            if res.status_code != 200:
                return None
            data = res.json()
            if data.get("title") and data.get("poster_path"):
                await set_cache(cache_key, data, MOVIE_DETAIL_TTL)
                return data
            return None
        except Exception:
            return None

    # Fetch ALL in parallel with one shared httpx client
    async with httpx.AsyncClient(timeout=15.0) as client:
        results = await asyncio.gather(
            *[fetch_one(mid, client) for mid in ids],
            return_exceptions=True
        )

    return [r for r in results if isinstance(r, dict) and r]


# ---------------------------------------------------
# CHECK WATCHLIST
# ---------------------------------------------------
@router.get("/watchlist/check/{movie_id}")
async def check_watchlist(
    movie_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Check if movie is already in watchlist
    """

    return {
        "isInWatchlist": movie_id in current_user.watchlist
    }



@router.get("/me", response_model=UserOut)
async def get_current_user_info(current_user: User = Depends(get_current_user)):

    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "username": current_user.username,
        "watchlist": current_user.watchlist
    }