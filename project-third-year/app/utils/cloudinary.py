import asyncio
import cloudinary
import cloudinary.uploader
from app.config import settings

# Configure Cloudinary credentials from your .env
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

async def upload_image(file_bytes, folder="streamhub_profiles"):
    """
    Uploads an image to Cloudinary and returns the secure URL.
    Runs the synchronous Cloudinary SDK in a thread pool to avoid blocking
    the async event loop.
    """
    try:
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None,
            lambda: cloudinary.uploader.upload(
                file_bytes,
                folder=folder,
                resource_type="image",
                transformation=[
                    {"width": 400, "height": 400, "crop": "fill", "gravity": "face"}
                ]
            )
        )
        return result.get("secure_url")
    except Exception as e:
        print(f"Cloudinary Upload Error: {e}")
        return None