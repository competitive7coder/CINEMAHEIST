from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.user import User
from app.models.activity import Activity
from app.models.feedback import Feedback
from app.config import settings

async def init_db():
    """
    Initializes the MongoDB connection and Beanie ODM.
    Uses the MONGO_URI from the .env file.
    """
    # 1. Initialize the Motor Client
    client = AsyncIOMotorClient(settings.MONGO_URI)
    
    # 2. Get the database name from the URI
    # If the URI is 'mongodb://host/dbname', this returns 'dbname'
    try:
        # This is the safest way to get the DB defined in your string
        db_name = client.get_default_database().name
    except Exception:
        # Fallback: If no DB name is in the string, we default to 'CinemaHeist'
        db_name = "CinemaHeist"

    database = client[db_name]

    # 3. Initialize Beanie with the specific database and models
    await init_beanie(
        database=database,
        document_models=[
            User,
            Activity,
            Feedback
        ]
    )
    
    print(f"Connected to MongoDB Database: {db_name}")