from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from beanie.operators import Or
from app.models.user import User
from app.models.notification import Notification
from app.security import get_current_user
from app.socket_manager import sio

router = APIRouter()

@router.get("")
async def get_notifications(current_user: User = Depends(get_current_user)):
    user_id_str = str(current_user.id)
    
    # Fetch recent 20 notifications (either global or for this user)
    db_notifications = await Notification.find(
        Or(Notification.user_id == None, Notification.user_id == user_id_str)
    ).sort(-Notification.timestamp).limit(20).to_list()
    
    results = []
    for n in db_notifications:
        is_read = n.is_read
        if n.user_id is None:
            is_read = user_id_str in n.read_by
            
        results.append({
            "id": str(n.id),
            "message": n.message,
            "link": n.link,
            "is_read": is_read,
            "timestamp": n.timestamp.isoformat(),
            "user_id": n.user_id
        })
        
    return results

@router.put("/read/{notification_id}")
async def mark_as_read(
    notification_id: str,
    current_user: User = Depends(get_current_user)
):
    from bson import ObjectId
    try:
        n = await Notification.get(ObjectId(notification_id))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid notification ID")
        
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    user_id_str = str(current_user.id)
    
    # Check authorization (must be either global or explicitly for this user)
    if n.user_id is not None and n.user_id != user_id_str:
        raise HTTPException(status_code=403, detail="Not authorized to read this notification")
        
    if n.user_id is None:
        if user_id_str not in n.read_by:
            n.read_by.append(user_id_str)
    else:
        n.is_read = True
        
    await n.save()
    return {"msg": "Notification marked as read"}

@router.post("/broadcast")
async def broadcast_notification(
    message: str,
    link: str = None,
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin privileges required")
        
    n = Notification(
        message=message,
        link=link
    )
    await n.insert()
    
    payload = {
        "id": str(n.id),
        "message": n.message,
        "link": n.link,
        "is_read": False,
        "timestamp": n.timestamp.isoformat(),
        "user_id": None
    }
    
    # Broadcast in real-time to all connected sockets
    await sio.emit("new_notification", payload)
    
    return {"msg": "Notification broadcasted successfully", "notification": payload}


@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin privileges required")
        
    from bson import ObjectId
    try:
        n = await Notification.get(ObjectId(notification_id))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid notification ID")
        
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    await n.delete()
    await sio.emit("delete_notification", {"id": notification_id})
    return {"msg": "Notification deleted successfully"}
