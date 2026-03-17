from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

class MongoDB:
    client: AsyncIOMotorClient = None

# We create a single instance to be used across the app
db_client = MongoDB()

def get_db():
    """Returns the default database instance from the client."""
    if db_client.client:
        return db_client.client.get_default_database()
    return None