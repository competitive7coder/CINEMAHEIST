from fastapi import APIRouter, status, HTTPException
from app.models.feedback import Feedback
from pydantic import BaseModel, EmailStr

router = APIRouter()

# Schema for incoming feedback
class FeedbackCreate(BaseModel):
    name: str
    email: EmailStr
    message: str

@router.post("/send", status_code=status.HTTP_201_CREATED)
async def send_feedback(feedback_in: FeedbackCreate):
    """
    Receives feedback from the frontend and saves it to the database.
    Matches your Express 'POST /' logic.
    """
    try:
        new_feedback = Feedback(
            name=feedback_in.name,
            email=feedback_in.email,
            message=feedback_in.message
        )
        # Save to MongoDB via Beanie
        await new_feedback.insert()
        
        return {"msg": "Thank you! Your feedback has been received."}
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail="An error occurred while saving feedback."
        )

@router.get("/all")
async def get_all_feedback():
    """
    Admin route (optional) to view all submitted feedback.
    Sorted by newest first.
    """
    feedbacks = await Feedback.find_all().sort("-date").to_list()
    return feedbacks