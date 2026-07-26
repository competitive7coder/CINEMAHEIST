from typing import Optional, List, Dict
from datetime import datetime
from beanie import Document, Indexed
from pydantic import EmailStr, Field

class User(Document):
    username: str
    email: EmailStr = Field(unique=True)  # Indexed makes searches by email very fast
    password: str
    watchlist: List[int] = []                    # List of TMDB Movie IDs
    watchlist_timestamps: Dict[str, datetime] = {} # {movie_id: added_at} for temporal decay
    profile_picture: Optional[str] = ""
    bio: Optional[str] = ""
    is_admin: bool = False
    
    # Password Reset Fields
    reset_password_token: Optional[str] = None
    reset_password_expires: Optional[datetime] = None

    class Settings:
        name = "users" # The collection name in MongoDB