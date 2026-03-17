from datetime import datetime
from beanie import Document
from pydantic import EmailStr, Field

class Feedback(Document):
    name: str
    email: EmailStr
    message: str
    date: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "feedback"