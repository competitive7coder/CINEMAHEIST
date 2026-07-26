from fastapi import APIRouter, Depends, HTTPException, status, Body
from app.models.user import User
from app.models.activity import Activity
from app.security import get_current_admin
from app.schemas.user import UserOut
from typing import List

router = APIRouter()

@router.get("/users", response_model=List[UserOut])
async def get_all_users(
    current_admin: User = Depends(get_current_admin)
):
    """
    List all registered users.
    """
    users = await User.find_all().to_list()
    result = []
    for u in users:
        result.append({
            "id":              str(u.id),
            "email":           u.email,
            "username":        u.username,
            "watchlist":       u.watchlist or [],
            "bio":             getattr(u, "bio", "") or "",
            "profile_picture": getattr(u, "profile_picture", "") or "",
            "is_admin":        getattr(u, "is_admin", False),
        })
    return result

@router.put("/users/{user_id}/toggle-admin")
async def toggle_admin_status(
    user_id: str,
    current_admin: User = Depends(get_current_admin)
):
    """
    Promote or demote a user's admin privileges.
    """
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if str(user.id) == str(current_admin.id):
        raise HTTPException(status_code=400, detail="Cannot toggle your own admin status")
    
    user.is_admin = not getattr(user, "is_admin", False)
    await user.save()
    return {"msg": f"User admin status changed to {user.is_admin}", "is_admin": user.is_admin}

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    current_admin: User = Depends(get_current_admin)
):
    """
    Delete a user account and purge all their logged activities.
    """
    user = await User.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if str(user.id) == str(current_admin.id):
        raise HTTPException(status_code=400, detail="Cannot delete your own admin account")
    
    # Delete associated activities
    await Activity.find(Activity.user_id.id == user.id).delete()
    await user.delete()
    return {"msg": "User account and activities deleted successfully"}

@router.get("/activity")
async def get_system_activity(
    current_admin: User = Depends(get_current_admin)
):
    """
    Retrieve global system-wide activity logs.
    """
    activities = await Activity.find_all().sort("-timestamp").limit(100).to_list()
    result = []
    for act in activities:
        user_id = str(act.user_id.ref.id) if hasattr(act.user_id, 'ref') else str(act.user_id)
        user = await User.get(user_id)
        result.append({
            "id": str(act.id),
            "username": user.username if user else "Unknown User",
            "email": user.email if user else "",
            "action_type": act.action_type,
            "movie_id": act.movie_id,
            "movie_title": act.movie_title,
            "movie_poster_path": act.movie_poster_path,
            "timestamp": act.timestamp.isoformat()
        })
    return result
