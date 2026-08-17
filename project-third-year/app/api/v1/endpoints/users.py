from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime
import asyncio
import httpx
from app.models.user import User
from app.security import get_current_user
from app.schemas.user import UserOut
from app.config import settings
# Redis not used in users.py  watchlist/full always fetches fresh

router = APIRouter()


# GET WATCHLIST
@router.get("/watchlist", response_model=List[int])
async def get_watchlist(current_user: User = Depends(get_current_user)):
    """
    Get all movie IDs in the user's watchlist
    """
    return current_user.watchlist


# ADD TO WATCHLIST
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

    # Store timestamp for Contribution 1  Temporal Watchlist Decay
    if current_user.watchlist_timestamps is None:
        current_user.watchlist_timestamps = {}
    current_user.watchlist_timestamps[str(movie_id)] = datetime.utcnow()

    await current_user.save()

    # No recommendation cache to invalidate  recs are never cached

    return {
        "msg": "Movie added to watchlist",
        "watchlist": current_user.watchlist
    }


# REMOVE FROM WATCHLIST
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

    # No recommendation cache to invalidate  recs are never cached

    return {
        "msg": "Movie removed from watchlist",
        "watchlist": current_user.watchlist
    }


# GET WATCHLIST WITH FULL MOVIE DATA (Dashboard optimized)
@router.get("/watchlist/full")
async def get_watchlist_full(current_user: User = Depends(get_current_user)):
    ids = current_user.watchlist or []
    if not ids:
        return []

    # Cap at 50  prevents runaway parallel TMDB calls
    ids = ids[:50]

    TMDB_BASE = "https://api.themoviedb.org/3"

    async def fetch_one(movie_id: int, client: httpx.AsyncClient):
        # Always fetch fresh  no Redis cache to avoid stale data
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
                return data
            return None
        except Exception:
            return None

    # Fetch ALL in parallel with one shared httpx client
    async with httpx.AsyncClient(timeout=20.0) as client:
        results = await asyncio.gather(
            *[fetch_one(mid, client) for mid in ids],
            return_exceptions=True
        )

    return [r for r in results if isinstance(r, dict) and r]


# CHECK WATCHLIST
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
        "id":              str(current_user.id),
        "email":           current_user.email,
        "username":        current_user.username,
        "watchlist":       current_user.watchlist or [],
        "bio":             getattr(current_user, "bio", "") or "",
        "profile_picture": getattr(current_user, "profile_picture", "") or "",
        "is_admin":        getattr(current_user, "is_admin", False),
    }


# GET USER ANALYTICS
@router.get("/me/analytics")
async def get_user_analytics(current_user: User = Depends(get_current_user)):
    from app.models.activity import Activity
    from datetime import timedelta, date
    from collections import Counter

    # 1. Fetch watchlist items to build genre distribution
    watchlist_movies = await get_watchlist_full(current_user)
    
    genres_counter = Counter()
    for movie in watchlist_movies:
        if isinstance(movie, dict) and "genres" in movie:
            for g in movie["genres"]:
                genres_counter[g.get("name", "Unknown")] += 1

    genre_distribution = [
        {"name": name, "count": count}
        for name, count in genres_counter.most_common(5)
    ]

    # Favorite genre
    favorite_genre = genre_distribution[0]["name"] if genre_distribution else "None"

    # 2. Fetch recent activities for this user
    activities = await Activity.find(Activity.user_id.id == current_user.id).to_list()
    
    total_interactions = len(activities)

    # Weekly activity trend (last 7 days)
    today = date.today()
    last_7_days = [today - timedelta(days=i) for i in range(6, -1, -1)]
    daily_activity_counts = {d.strftime("%Y-%m-%d"): 0 for d in last_7_days}

    for act in activities:
        act_date = act.timestamp.date()
        date_str = act_date.strftime("%Y-%m-%d")
        if date_str in daily_activity_counts:
            daily_activity_counts[date_str] += 1

    weekly_activity = [
        {"date": d_str, "count": daily_activity_counts[d_str]}
        for d_str in sorted(daily_activity_counts.keys())
    ]

    # Calculate watch time (watchlist count * 120 mins average + 2 mins per trailer click)
    watchlist_time = len(current_user.watchlist) * 120
    trailer_activities = sum(1 for act in activities if act.action_type == "trailer_watch")
    estimated_watch_time = watchlist_time + (trailer_activities * 2)

    return {
        "summary": {
            "totalWatchlist": len(current_user.watchlist),
            "totalInteractions": total_interactions,
            "favoriteGenre": favorite_genre,
            "estimatedWatchTimeMins": estimated_watch_time
        },
        "genreDistribution": genre_distribution,
        "weeklyActivity": weekly_activity
    }