from fastapi import APIRouter

router = APIRouter()

@router.get("/me")
async def get_current_user_profile():
    return {
        "status": "success",
        "data": {
            "id": "usr_donor101",
            "email": "coordinator@ngo.org",
            "name": "Sarah Jenkins",
            "role": "RECEIVER",
            "phone": "+1 555-0199",
            "is_verified": True
        }
    }
