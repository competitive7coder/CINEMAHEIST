from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from app.models.user import User
from app.security import get_current_user, get_password_hash, verify_password
from app.utils.cloudinary import upload_image
from app.schemas.user import UserOut

router = APIRouter()


def serialize_user(user: User) -> dict:
    return {
        "id":              str(user.id),
        "email":           user.email,
        "username":        user.username,
        "bio":             getattr(user, "bio", "") or "",
        "profile_picture": getattr(user, "profile_picture", "") or "",
        "watchlist":       user.watchlist or [],
    }


@router.get("/me")
async def get_my_profile(current_user: User = Depends(get_current_user)):
    return serialize_user(current_user)


@router.put("/update")
async def update_profile(
    name: str = Form(None),
    bio: str = Form(None),
    profile_picture: UploadFile = File(None),
    current_user: User = Depends(get_current_user)
):
    if name:
        current_user.username = name
    if bio is not None:
        current_user.bio = bio
    if profile_picture:
        image_bytes = await profile_picture.read()
        image_url = await upload_image(image_bytes, folder="streamhub_profiles")
        if not image_url:
            raise HTTPException(status_code=500, detail="Failed to upload image to Cloudinary")
        current_user.profile_picture = image_url

    await current_user.save()
    return serialize_user(current_user)


@router.put("/update-name")
async def update_name(
    name: str = Form(...),
    current_user: User = Depends(get_current_user)
):
    if not name or len(name.strip()) < 2:
        raise HTTPException(status_code=422, detail="Name must be at least 2 characters")
    current_user.username = name.strip()
    await current_user.save()
    return serialize_user(current_user)


@router.put("/bio")
async def update_bio(
    bio: str = Form(""),
    current_user: User = Depends(get_current_user)
):
    current_user.bio = bio.strip()
    await current_user.save()
    return serialize_user(current_user)


@router.put("/update-password")
async def update_password(
    current_password: str = Form(...),
    new_password: str = Form(...),
    current_user: User = Depends(get_current_user)
):
    if not verify_password(current_password, current_user.password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if len(new_password) < 8:
        raise HTTPException(status_code=422, detail="New password must be at least 8 characters")
    current_user.password = get_password_hash(new_password)
    await current_user.save()
    return {"msg": "Password updated successfully"}


@router.put("/update-avatar")
async def update_avatar(
    profile_picture: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    image_bytes = await profile_picture.read()
    image_url = await upload_image(image_bytes, folder="streamhub_profiles")
    if not image_url:
        raise HTTPException(status_code=500, detail="Failed to upload image to Cloudinary")
    current_user.profile_picture = image_url
    await current_user.save()
    return serialize_user(current_user)


@router.delete("/delete-account")
async def delete_account(
    password: str = Form(...),
    current_user: User = Depends(get_current_user)
):
    if not verify_password(password, current_user.password):
        raise HTTPException(status_code=400, detail="Incorrect password")

    from app.models.activity import Activity
    await Activity.find(Activity.user_id.id == current_user.id).delete()
    await current_user.delete()
    return {"msg": "Account deleted successfully"}