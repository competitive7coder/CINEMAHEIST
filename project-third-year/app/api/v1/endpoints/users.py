from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime
from app.models.user import User
from app.security import get_current_user
from app.schemas.user import UserOut

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
    # Key must be string because MongoDB dict keys are strings
    if current_user.watchlist_timestamps is None:
        current_user.watchlist_timestamps = {}
    current_user.watchlist_timestamps[str(movie_id)] = datetime.utcnow()

    await current_user.save()

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

    return {
        "msg": "Movie removed from watchlist",
        "watchlist": current_user.watchlist
    }


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