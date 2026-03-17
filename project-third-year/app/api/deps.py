from fastapi import Header, HTTPException, status
from jose import jwt, JWTError
from pydantic import ValidationError
from app.models.user import User
from app.config import settings

async def get_current_user(x_auth_token: str = Header(None)):
    """
    Dependency to validate the JWT from the 'x-auth-token' header.
    Matches your React axios interceptor logic.
    """
    # 1. Check if the header exists
    if not x_auth_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No authentication token found in 'x-auth-token' header",
        )

    try:
        # 2. Decode the JWT token
        payload = jwt.decode(
            x_auth_token, 
            settings.JWT_SECRET, 
            algorithms=[settings.ALGORITHM]
        )
        
        # 3. Extract the user ID (stored in 'sub' by convention)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: User ID missing",
            )
            
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials/Token expired",
        )

    # 4. Find the user in MongoDB using Beanie
    user = await User.get(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found"
        )
        
    return user