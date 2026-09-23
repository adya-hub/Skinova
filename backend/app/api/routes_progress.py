"""
Skin Visual Progress Tracking Routes.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import datetime
from ..data.storage import get_progress_entries, add_progress_entry

router = APIRouter(prefix="/progress", tags=["Progress Tracking"])

class NewProgressEntryRequest(BaseModel):
    user_id: Optional[str] = "demo_user"
    week_label: str
    visible_breakouts: str
    visible_oiliness: str
    visible_redness: str
    notes: Optional[str] = ""
    image_preview: Optional[str] = "/static/samples/sample_face_3.svg"

@router.get("/entries")
def get_user_progress(user_id: str = "demo_user"):
    entries = get_progress_entries(user_id)
    return {
        "success": True,
        "entries": entries,
        "summary": {
            "initial_state": "Week 1: Acne-like breakouts (Moderate), Oiliness (High), Redness (Moderate)",
            "current_state": "Week 4: Acne-like breakouts (Mild), Oiliness (Moderate), Redness (Mild)",
            "observation_delta": "Visual reduction in localized surface oiliness and visible redness around blemish sites."
        }
    }

@router.post("/entries")
def create_progress_entry(req: NewProgressEntryRequest):
    entry = {
        "user_id": req.user_id,
        "week_label": req.week_label,
        "date": datetime.date.today().isoformat(),
        "visible_breakouts": req.visible_breakouts,
        "visible_oiliness": req.visible_oiliness,
        "visible_redness": req.visible_redness,
        "notes": req.notes,
        "image_preview": req.image_preview
    }
    saved = add_progress_entry(entry)
    return {"success": True, "entry": saved}
