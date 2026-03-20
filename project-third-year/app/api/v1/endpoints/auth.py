import secrets
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, status, Body, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.models.user import User
from app.schemas.user import UserCreate, UserOut
from app.schemas.token import Token
from app.security import get_password_hash, verify_password, create_access_token
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

    token = create_access_token(subject=user.id)

    return {
        "access_token": token,
        "token": token,
        "token_type": "bearer"
    }


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