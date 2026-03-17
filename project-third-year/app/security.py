from datetime import datetime, timedelta
from typing import Any, Union, Optional
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.config import settings
from app.models.user import User
import logging

# Keep passlib quiet
logging.getLogger("passlib").setLevel(logging.ERROR)

# Initialize the hashing engine
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# This tells FastAPI to look for the token in the "Authorization: Bearer <token>" header
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

# --- TOKEN GENERATION ---

def create_access_token(subject: Union[str, Any]) -> str:
    """
    Creates a JWT. Matches your frontend payload expectation: { user: { id: "..." } }
    """
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {
        "exp": expire,
        "user": {"id": str(subject)} 
    }
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)
    return encoded_jwt

# --- PASSWORD HASHING ---

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Checks if plain text password matches hashed password."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hashes a password for registration."""
    return pwd_context.hash(password)

# --- TOKEN VERIFICATION (The Missing Guard) ---

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """
    Decodes the JWT token and returns the current user.
    If the token is invalid or expired, it throws a 401 error.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode the JWT
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM]
        )
        # Your token structure is {"user": {"id": "..."}}
        user_data = payload.get("user")
        if user_data is None:
            raise credentials_exception
            
        user_id: str = user_data.get("id")
        if user_id is None:
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception

    # Fetch user from MongoDB (using Beanie)
    user = await User.get(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
        
    return user