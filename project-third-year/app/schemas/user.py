from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, AliasChoices

class UserCreate(BaseModel):
    email: EmailStr
    # This allows 'name' (from React) to be used as 'username' (Backend)
    username: str = Field(validation_alias=AliasChoices('username', 'name'))
    password: str = Field(..., min_length=6)

    class Config:
        # Prevents 422 error when React sends 'retypePassword' or 'formData' wrapper
        extra = "ignore" 
        populate_by_name = True

class UserOut(BaseModel):
    id: str
    email: EmailStr
    username: str
    watchlist: List[int] = []
    profile_picture: Optional[str] = ""
    bio: Optional[str] = ""
    is_admin: bool = False

    class Config:
        from_attributes = True