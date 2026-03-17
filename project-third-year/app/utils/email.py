import httpx
from app.config import settings

async def send_reset_email(email_to: str, token: str):
    """
    Sends a password reset email using Brevo API.
    Replaces the logic in your emailService.js.
    """
    url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "accept": "application/json",
        "api-key": settings.BREVO_API_KEY,
        "content-type": "application/json"
    }
    
    # This URL points back to your React Frontend
    reset_url = f"{settings.CLIENT_URL}/reset-password/{token}"
    
    payload = {
        "sender": {"email": settings.SEND_FROM_EMAIL, "name": "StreamHub Support"},
        "to": [{"email": email_to}],
        "subject": "StreamHub - Password Reset Request",
        "htmlContent": f"""
            <html>
                <body>
                    <h1>Reset Your Password</h1>
                    <p>You requested a password reset. Click the link below to set a new password:</p>
                    <a href="{reset_url}" style="padding: 10px 20px; background-color: #e50914; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    <p>This link will expire in 1 hour.</p>
                </body>
            </html>
        """
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, headers=headers, json=payload)
            return response.status_code == 201
        except Exception as e:
            print(f"Email Send Error: {e}")
            return False