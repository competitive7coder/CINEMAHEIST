import asyncio
from datetime import datetime, timedelta
from typing import Any, Union
from jose import jwt, JWTError
import bcrypt
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from app.config import settings
from app.models.user import User
import logging

logging.getLogger("passlib").setLevel(logging.ERROR)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

def create_access_token(subject: Union[str, Any]) -> str:
    # Short-lived access token: 15 minutes
    expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode = {
        "exp": expire,
        "user": {"id": str(subject)}
    }
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)

def create_refresh_token(subject: Union[str, Any]) -> str:
    # Long-lived refresh token: 7 days (10080 minutes)
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES or 10080)
    to_encode = {
        "exp": expire,
        "user": {"id": str(subject)},
        "type": "refresh"
    }
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)

def get_password_hash(password: str) -> str:
    # Synchronous version — used only where async is not possible
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(rounds=10)).decode("utf-8")

async def get_password_hash_async(password: str) -> str:
    # Runs bcrypt in a thread pool so the event loop stays free
    loop = asyncio.get_running_loop()  # For Python 3.10+
    hashed = await loop.run_in_executor(
        None,
        lambda: bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(rounds=10)).decode("utf-8")
    )
    return hashed

async def verify_password_async(plain_password: str, hashed_password: str) -> bool:
    # Same for login verification
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(
        None,
        lambda: bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    )

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Synchronous version kept for backward compatibility
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM]
        )
        user_data = payload.get("user")
        if user_data is None:
            raise credentials_exception
        user_id: str = user_data.get("id")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await User.get(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

async def get_current_admin(
    request: Request,
    current_user: User = Depends(get_current_user)
) -> User:
    if not getattr(current_user, "is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    
    admin_key = request.headers.get("X-Admin-Secret-Key")
    if not admin_key or admin_key != settings.ADMIN_SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or missing admin security key"
        )
        
    return current_user