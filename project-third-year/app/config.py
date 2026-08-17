from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / ".env"

class Settings(BaseSettings):
    # App General Settings
    PROJECT_NAME: str = "CinemaHeist API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # MongoDB (From your .env)
    MONGO_URI: str
    
    # Security
    JWT_SECRET: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days
    ADMIN_SECRET_KEY: str
    
    # TMDB API
    TMDB_API_KEY: str
    
    # Email (Brevo)
    BREVO_API_KEY: str
    SEND_FROM_EMAIL: str
    CLIENT_URL: str
    
    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    # Upstash Redis (cache layer)
    UPSTASH_REDIS_REST_URL:   str = ""   # https://powerful-spaniel-80991.upstash.io
    UPSTASH_REDIS_REST_TOKEN: str = ""   #  token from Upstash dashboard

    # Configuration to read the .env file
    model_config = SettingsConfigDict(
        env_file=ENV_PATH, 
        env_file_encoding="utf-8", 
        extra="ignore"
    )

settings = Settings()