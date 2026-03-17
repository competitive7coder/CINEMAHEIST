from fastapi import APIRouter
from app.api.v1.endpoints import auth, movies, users, profile, activity, feedback

api_router = APIRouter()

# Linking all our endpoint files
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(movies.router, prefix="/movies", tags=["Movies"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(profile.router, prefix="/profile", tags=["Profile"])
api_router.include_router(activity.router, prefix="/activity", tags=["Activity"])
api_router.include_router(feedback.router, prefix="/feedback", tags=["Feedback"])