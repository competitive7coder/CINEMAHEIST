import re
import secrets
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, status, Body, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.models.user import User
from app.schemas.user import UserCreate, UserOut
from app.schemas.token import Token
from app.security import get_password_hash, verify_password, create_access_token, create_refresh_token
from app.config import settings
from jose import jwt, JWTError
from app.utils.email import send_reset_email

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(request_data: dict = Body(...)):
    data = request_data.get("formData", request_data)

    email    = data.get("email", "").strip().lower()
    username = (data.get("name") or data.get("username", "")).strip()
    password = data.get("password", "")

    if not email:
        raise HTTPException(status_code=422, detail="Email is required")
    if not username:
        raise HTTPException(status_code=422, detail="Username is required")
    if not password:
        raise HTTPException(status_code=422, detail="Password is required")
    if len(password) < 8:
        raise HTTPException(status_code=422, detail="Password must be at least 8 characters")
    if not re.search(r"[A-Z]", password):
        raise HTTPException(status_code=422, detail="Password must contain an uppercase letter")
    if not re.search(r"[0-9]", password):
        raise HTTPException(status_code=422, detail="Password must contain a number")
    if len(username) < 2:
        raise HTTPException(status_code=422, detail="Username must be at least 2 characters")

    user_exists = await User.find_one(User.email == email)
    if user_exists:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        username=username,
        email=email,
        password=get_password_hash(password)
    )
    await new_user.insert()
    return {"msg": "User registered successfully"}


@router.post("/login")
@limiter.limit("5/minute")
async def login(request: Request, credentials: dict = Body(...)):
    data  = credentials.get("formData", credentials)
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        raise HTTPException(status_code=422, detail="Email and password are required")

    user = await User.find_one(User.email == email)
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token": access_token,
        "token_type": "bearer"
    }


@router.post("/refresh")
async def refresh(payload: dict = Body(...)):
    ref_token = payload.get("refresh_token")
    if not ref_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        decoded = jwt.decode(
            ref_token,
            settings.JWT_SECRET,
            algorithms=[settings.ALGORITHM]
        )
        user_data = decoded.get("user")
        if not user_data or not user_data.get("id"):
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        
        user_id = user_data.get("id")
        user = await User.get(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Issue new access + refresh tokens (rotation)
        new_access = create_access_token(subject=user.id)
        new_refresh = create_refresh_token(subject=user.id)
        return {
            "access_token": new_access,
            "refresh_token": new_refresh,
            "token": new_access,
        }
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Expired or invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.post("/forgot-password")
async def forgot_password(data: dict = Body(...)):
    inner_data = data.get("formData", data)
    email = inner_data.get("email", "").strip().lower()

    user = await User.find_one(User.email == email)
    if not user:
        return {"msg": "If an account exists, a reset link has been sent."}

    token = secrets.token_hex(20)
    user.reset_password_token = token
    user.reset_password_expires = datetime.utcnow() + timedelta(hours=1)
    await user.save()

    await send_reset_email(user.email, token)
    return {"msg": "If an account exists, a reset link has been sent."}


@router.post("/reset-password/{token}")
async def reset_password(token: str, password_data: dict = Body(...)):
    inner_data   = password_data.get("formData", password_data)
    new_password = inner_data.get("password") or inner_data.get("new_password", "")

    if not new_password or len(new_password) < 8:
        raise HTTPException(status_code=422, detail="Password must be at least 8 characters")

    user = await User.find_one(
        User.reset_password_token == token,
        User.reset_password_expires > datetime.utcnow()
    )

    if not user:
        raise HTTPException(status_code=400, detail="Token is invalid or has expired")

    user.password = get_password_hash(new_password)
    user.reset_password_token = None
    user.reset_password_expires = None
    await user.save()

    return {"msg": "Password reset successful"}