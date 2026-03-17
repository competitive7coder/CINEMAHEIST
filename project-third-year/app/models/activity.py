from datetime import datetime
from typing import Optional
from beanie import Document, Link
from pydantic import Field
from app.models.user import User

class Activity(Document):
    user_id: Link[User] 
    action_type: str    
    movie_id: int
    movie_title: str
    movie_poster_path: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.utcnow())

    class Settings:
        name = "activities"