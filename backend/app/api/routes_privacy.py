"""
Privacy & Data Governance Routes for Skinova AI.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from ..data.storage import delete_user_data

router = APIRouter(prefix="/privacy", tags=["Privacy & Data Governance"])

class DeleteDataRequest(BaseModel):
    user_id: Optional[str] = "demo_user"
    confirmation: bool

@router.post("/delete-data")
def purge_user_data(req: DeleteDataRequest):
    if not req.confirmation:
        return {"success": False, "message": "Confirmation is required to delete all uploaded images and profile data."}
    
    result = delete_user_data(req.user_id)
    return result

@router.get("/policy-summary")
def get_privacy_summary():
    return {
        "encryption": "TLS/HTTPS in transit, AES-256 for persistent assets",
        "data_retention": "Uploaded facial photos are stored in ephemeral private storage and can be permanently purged at any time.",
        "third_party_sharing": "Never sold, rented, or utilized for public training without explicit patient consent.",
        "medical_disclaimer": "Skinova is strictly an educational tool and does not generate HIPAA-covered electronic protected health records (ePHI)."
    }
