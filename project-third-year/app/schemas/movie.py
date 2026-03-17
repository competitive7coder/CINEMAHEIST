from typing import List, Optional
from pydantic import BaseModel

class MovieBase(BaseModel):
    id: int
    title: str
    poster_path: Optional[str] = None

class MovieDetail(MovieBase):
    overview: str
    release_date: Optional[str] = None
    vote_average: float
    genres: List[dict]
    videos: Optional[dict] = None
    credits: Optional[dict] = None