"""
Persistent local file storage for Skinova AI.
Manages user profiles, analysis history, routines, and user privacy data deletion.
"""

import json
import uuid
import shutil
from pathlib import Path
from typing import Dict, Any, List, Optional
from ..config import STORAGE_DIR, UPLOAD_DIR

PROFILES_FILE = STORAGE_DIR / "profiles.json"
ANALYSES_FILE = STORAGE_DIR / "analyses.json"
PROGRESS_FILE = STORAGE_DIR / "progress.json"

def _load_json(file_path: Path, default: Any) -> Any:
    if file_path.exists():
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return default
    return default

def _save_json(file_path: Path, data: Any):
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

# Initial seed data for demo profile
DEFAULT_PROFILE = {
    "user_id": "demo_user",
    "name": "Alex Morgan",
    "email": "alex.morgan@example.com",
    "age_range": "25-34",
    "skin_type": "Combination",
    "primary_concern": "Acne-like breakouts",
    "secondary_concerns": ["Visible dark spots", "Mild redness around nose"],
    "current_routine": "Gentle foam cleanser, hyaluronic serum, lightweight moisturizer",
    "products_used": ["CeraVe Foaming Cleanser", "The Ordinary Hyaluronic Acid 2% + B5", "Neutrogena Hydro Boost"],
    "breakout_frequency": "1-2 times per month (hormonal or stress-related)",
    "sun_exposure": "Moderate (outdoor walks 3-4 days/week)",
    "lifestyle_notes": "Works in an air-conditioned office; drinks 2L water daily",
    "created_at": "2026-09-20T10:00:00Z"
}

def get_profile(user_id: str = "demo_user") -> Dict[str, Any]:
    profiles = _load_json(PROFILES_FILE, {})
    return profiles.get(user_id, DEFAULT_PROFILE)

def save_profile(user_id: str, profile_data: Dict[str, Any]) -> Dict[str, Any]:
    profiles = _load_json(PROFILES_FILE, {})
    current = profiles.get(user_id, DEFAULT_PROFILE).copy()
    current.update(profile_data)
    current["user_id"] = user_id
    profiles[user_id] = current
    _save_json(PROFILES_FILE, profiles)
    return current

def save_analysis(analysis_data: Dict[str, Any]) -> Dict[str, Any]:
    analyses = _load_json(ANALYSES_FILE, [])
    analysis_id = analysis_data.get("id") or f"rep_{uuid.uuid4().hex[:8]}"
    analysis_data["id"] = analysis_id
    analyses.insert(0, analysis_data)
    _save_json(ANALYSES_FILE, analyses)
    return analysis_data

def get_analyses(user_id: str = "demo_user") -> List[Dict[str, Any]]:
    analyses = _load_json(ANALYSES_FILE, [])
    return [a for a in analyses if a.get("user_id", "demo_user") == user_id]

def get_analysis_by_id(analysis_id: str) -> Optional[Dict[str, Any]]:
    analyses = _load_json(ANALYSES_FILE, [])
    for a in analyses:
        if a.get("id") == analysis_id:
            return a
    return None

def get_progress_entries(user_id: str = "demo_user") -> List[Dict[str, Any]]:
    entries = _load_json(PROGRESS_FILE, [])
    user_entries = [e for e in entries if e.get("user_id", "demo_user") == user_id]
    if not user_entries:
        # Default starter milestones for realistic progress tracking demo
        default_entries = [
            {
                "id": "prog_1",
                "user_id": user_id,
                "week_label": "Week 1 (Baseline)",
                "date": "2026-08-15",
                "visible_breakouts": "Moderate",
                "visible_oiliness": "High",
                "visible_redness": "Moderate",
                "notes": "Starting gentle routine with Niacinamide and Salicylic Acid 2x weekly.",
                "image_preview": "/static/samples/sample_face_1.svg"
            },
            {
                "id": "prog_2",
                "user_id": user_id,
                "week_label": "Week 2",
                "date": "2026-08-29",
                "visible_breakouts": "Moderate",
                "visible_oiliness": "Moderate",
                "visible_redness": "Mild",
                "notes": "Reduced surface shine in T-zone; no new flaking reported.",
                "image_preview": "/static/samples/sample_face_2.svg"
            },
            {
                "id": "prog_3",
                "user_id": user_id,
                "week_label": "Week 4",
                "date": "2026-09-12",
                "visible_breakouts": "Mild",
                "visible_oiliness": "Moderate",
                "visible_redness": "Mild",
                "notes": "Visible breakout frequency diminished; post-blemish marks fading slowly with daily SPF.",
                "image_preview": "/static/samples/sample_face_3.svg"
            }
        ]
        _save_json(PROGRESS_FILE, default_entries)
        return default_entries
    return user_entries

def add_progress_entry(entry: Dict[str, Any]) -> Dict[str, Any]:
    entries = _load_json(PROGRESS_FILE, [])
    entry["id"] = entry.get("id") or f"prog_{uuid.uuid4().hex[:6]}"
    entries.append(entry)
    _save_json(PROGRESS_FILE, entries)
    return entry

def delete_user_data(user_id: str) -> Dict[str, Any]:
    """
    Privacy feature: completely deletes all uploaded images and stored records for this user.
    """
    profiles = _load_json(PROFILES_FILE, {})
    if user_id in profiles:
        del profiles[user_id]
        _save_json(PROFILES_FILE, profiles)

    analyses = _load_json(ANALYSES_FILE, [])
    remaining_analyses = [a for a in analyses if a.get("user_id") != user_id]
    _save_json(ANALYSES_FILE, remaining_analyses)

    progress = _load_json(PROGRESS_FILE, [])
    remaining_progress = [p for p in progress if p.get("user_id") != user_id]
    _save_json(PROGRESS_FILE, remaining_progress)

    # Clean up uploaded files directory
    user_upload_pattern = f"{user_id}_*"
    deleted_count = 0
    for f in UPLOAD_DIR.glob(user_upload_pattern):
        try:
            f.unlink()
            deleted_count += 1
        except Exception:
            pass

    return {
        "success": True,
        "message": f"Successfully deleted all stored profile records, analyses, and {deleted_count} uploaded photos for {user_id}.",
        "user_id": user_id
    }
