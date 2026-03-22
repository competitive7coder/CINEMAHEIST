from fastapi import APIRouter, Depends, status
from app.models.activity import Activity
from app.models.user import User
from app.security import get_current_user
from typing import Optional
from pydantic import BaseModel
from app.socket_manager import sio

router = APIRouter()


class ActivityCreate(BaseModel):
    action_type: str       # must match what Dashboard.js checks: see ACTION_TYPES below
    movie_id: int
    movie_title: str
    movie_poster_path: Optional[str] = None


# Single source of truth for action type strings.
# Keep these in sync with Dashboard.js socket listener.
ACTION_TYPES = {
    "added_to_watchlist",
    "removed_from_watchlist",
    "trailer_watch",
    "search_click",       # fired when user opens a movie detail page
    "watchlist_view",     # fired when user views watchlist
}


@router.post("/log", status_code=status.HTTP_201_CREATED)
async def log_activity(
    activity_in: ActivityCreate,
    current_user: User = Depends(get_current_user)
):
    """
    Logs a new user action and emits a real-time socket event
    to the user's private room so their Dashboard updates instantly.
    """
    if activity_in.action_type not in ACTION_TYPES:
        # Gracefully accept unknown types rather than crashing —
        # just won't trigger a special UI handler on the client.
        pass

    new_activity = Activity(
        user_id=current_user,
        action_type=activity_in.action_type,
        movie_id=activity_in.movie_id,
        movie_title=activity_in.movie_title,
        movie_poster_path=activity_in.movie_poster_path,
    )
    await new_activity.insert()

    payload = {
        "id": str(new_activity.id),
        "action_type": activity_in.action_type,
        "movie_id": activity_in.movie_id,
        "movie_title": activity_in.movie_title,
        "movie_poster_path": activity_in.movie_poster_path,
        "timestamp": new_activity.timestamp.isoformat(),
    }

    # Emit only to this user's private room
    await sio.emit("activity_update", payload, room=str(current_user.id))

    return {"msg": "Activity logged successfully", "data": payload}


@router.get("/history")
async def get_user_activity(current_user: User = Depends(get_current_user)):
    """
    Fetches the last 20 activities for the logged-in user, sorted by most recent.
    """
    activities = await Activity.find(
        Activity.user_id.id == current_user.id
    ).sort("-timestamp").limit(20).to_list()

    return activities


@router.delete("/history")
async def clear_history(current_user: User = Depends(get_current_user)):
    """
    Deletes all activity logs for the current user.
    """
    await Activity.find(Activity.user_id.id == current_user.id).delete()
    return {"msg": "Activity history cleared"}