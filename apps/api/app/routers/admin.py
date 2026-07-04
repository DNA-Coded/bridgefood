from fastapi import APIRouter

router = APIRouter()

@router.get("/audit-logs")
async def list_audit_logs():
    return {
        "status": "success",
        "data": []
    }
