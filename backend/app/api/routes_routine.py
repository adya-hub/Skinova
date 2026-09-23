"""
Personalized Skincare Routine Builder Routes.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any
from ..agent.tools import routine_tool
from ..data.storage import get_profile

router = APIRouter(prefix="/routine", tags=["Routine Builder"])

class RoutineBuildRequest(BaseModel):
    skin_type: Optional[str] = None
    concern: Optional[str] = None
    user_id: Optional[str] = "demo_user"

@router.post("/build")
def build_routine(req: RoutineBuildRequest):
    profile = get_profile(req.user_id)
    skin_type = req.skin_type or profile.get("skin_type", "Combination")
    concern = req.concern or profile.get("primary_concern", "Acne-prone")

    routine = routine_tool.execute(skin_type=skin_type, concern=concern)
    return {
        "success": True,
        "skin_type": skin_type,
        "concern": concern,
        "routine": routine
    }
