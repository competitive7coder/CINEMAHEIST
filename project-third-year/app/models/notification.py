from datetime import datetime
from typing import Optional, List
from beanie import Document
from pydantic import Field

class Notification(Document):
    user_id: Optional[str] = None  # None for global broadcast, otherwise specific user ID
    message: str
    link: Optional[str] = None
    is_read: bool = False
    read_by: List[str] = []
    timestamp: datetime = Field(default_factory=lambda: datetime.utcnow())

    class Settings:
        name = "notifications"
