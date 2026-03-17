from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    # This matches the { user: { id: "..." } } structure
    user_id: Optional[str] = None