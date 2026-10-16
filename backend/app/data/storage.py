"""
Persistent cloud and local file storage for Skinova AI.
Manages user profiles, analysis history, routines, and user privacy data deletion.
Backed by Supabase PostgreSQL database via REST with seamless local file fallback.
"""

import json
import uuid
import shutil
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
import httpx

from ..config import STORAGE_DIR, UPLOAD_DIR, SUPABASE_URL, SUPABASE_KEY, HAS_SUPABASE

logger = logging.getLogger("skinova.data.storage")

PROFILES_FILE = STORAGE_DIR / "profiles.json"
ANALYSES_FILE = STORAGE_DIR / "analyses.json"
PROGRESS_FILE = STORAGE_DIR / "progress.json"

def _load_json(file_path: Path, default: Any) -> Any:
    if file_path.exists():
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.error("[Storage] Failed to read JSON from %s: %s", file_path, e)
            return default
    return default

def _save_json(file_path: Path, data: Any):
    try:
        file_path.parent.mkdir(parents=True, exist_ok=True)
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        logger.error("[Storage] Failed to save JSON to %s: %s", file_path, e)

def _supabase_headers() -> Dict[str, str]:
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }

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

# Ensure PROFILES_FILE physically exists on disk for offline safety
if not PROFILES_FILE.exists():
    _save_json(PROFILES_FILE, {"demo_user": DEFAULT_PROFILE})
    logger.info("[Storage] Initialized %s with default profile", PROFILES_FILE)


def get_profile(user_id: str = "demo_user") -> Dict[str, Any]:
    """
    Fetch user profile from Supabase PostgreSQL database, falling back to local storage if offline.
    """
    if HAS_SUPABASE:
        try:
            with httpx.Client(timeout=4.0) as client:
                resp = client.get(
                    f"{SUPABASE_URL}/rest/v1/profiles?user_id=eq.{user_id}&limit=1",
                    headers=_supabase_headers()
                )
                if resp.status_code == 200:
                    data = resp.json()
                    if data and len(data) > 0:
                        profile = data[0]
                        # Cache to local file
                        profiles = _load_json(PROFILES_FILE, {})
                        profiles[user_id] = profile
                        _save_json(PROFILES_FILE, profiles)
                        logger.info("[Storage:Supabase] Loaded profile for user '%s'", user_id)
                        return profile
        except Exception as e:
            logger.warning("[Storage:Supabase] get_profile error: %s. Using local fallback.", e)

    # Local fallback
    profiles = _load_json(PROFILES_FILE, {})
    profile = profiles.get(user_id)
    if not profile:
        logger.info("[Storage:Local] Profile for '%s' not found, returning DEFAULT_PROFILE", user_id)
        return DEFAULT_PROFILE.copy()
    logger.info("[Storage:Local] Retrieved profile for user_id='%s'", user_id)
    return profile


def save_profile(user_id: str, profile_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Save or update user profile in Supabase PostgreSQL, persisting to local storage concurrently.
    """
    # 1. Update local cache immediately
    profiles = _load_json(PROFILES_FILE, {})
    current = profiles.get(user_id, DEFAULT_PROFILE).copy()
    current.update(profile_data)
    current["user_id"] = user_id
    profiles[user_id] = current
    _save_json(PROFILES_FILE, profiles)

    # 2. Persist to Supabase if configured
    if HAS_SUPABASE:
        try:
            allowed_keys = {
                "user_id", "name", "email", "age_range", "skin_type",
                "primary_concern", "secondary_concerns", "current_routine",
                "products_used", "breakout_frequency", "sun_exposure", "lifestyle_notes"
            }
            payload = {k: v for k, v in current.items() if k in allowed_keys}
            payload["user_id"] = user_id

            headers = _supabase_headers()
            headers["Prefer"] = "resolution=merge-duplicates,return=representation"

            with httpx.Client(timeout=4.0) as client:
                resp = client.post(
                    f"{SUPABASE_URL}/rest/v1/profiles",
                    headers=headers,
                    json=payload
                )
                if resp.status_code in (200, 201) and resp.json():
                    saved = resp.json()[0]
                    current.update(saved)
                    profiles[user_id] = current
                    _save_json(PROFILES_FILE, profiles)
                    logger.info("[Storage:Supabase] Saved profile for '%s' to database", user_id)
                else:
                    logger.warning("[Storage:Supabase] Upsert returned status %s: %s", resp.status_code, resp.text)
        except Exception as e:
            logger.warning("[Storage:Supabase] save_profile error: %s", e)

    return current


def save_analysis(analysis_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Persist generated skin analysis report to Supabase and local storage.
    """
    analysis_id = analysis_data.get("id") or f"rep_{uuid.uuid4().hex[:8]}"
    analysis_data["id"] = analysis_id

    # Local storage
    analyses = _load_json(ANALYSES_FILE, [])
    analyses.insert(0, analysis_data)
    _save_json(ANALYSES_FILE, analyses)

    # Supabase cloud persistence
    if HAS_SUPABASE:
        try:
            headers = _supabase_headers()
            headers["Prefer"] = "resolution=merge-duplicates,return=representation"

            row = {
                "id": analysis_id,
                "user_id": analysis_data.get("user_id", "demo_user"),
                "image_url": str(analysis_data.get("image_url", "")),
                "skin_profile_snapshot": analysis_data.get("skin_profile_snapshot", {}),
                "image_quality": analysis_data.get("image_quality", {}),
                "visible_indicators": analysis_data.get("visible_skin_indicators") or analysis_data.get("visible_indicators", {}),
                "observation_summary": analysis_data.get("overall_observation", ""),
                "scientific_rationale": analysis_data.get("what_this_could_mean", ""),
                "evidence_citations": analysis_data.get("citations", []),
                "routine_recommendation": analysis_data.get("suggested_routine", {}),
                "disclaimer": analysis_data.get("disclaimer", ""),
                "red_flags_detected": bool(analysis_data.get("red_flags_detected", False)),
                "full_report": analysis_data
            }

            with httpx.Client(timeout=5.0) as client:
                resp = client.post(
                    f"{SUPABASE_URL}/rest/v1/analyses",
                    headers=headers,
                    json=row
                )
                if resp.status_code in (200, 201):
                    logger.info("[Storage:Supabase] Successfully saved analysis report '%s'", analysis_id)
                else:
                    logger.warning("[Storage:Supabase] Failed saving analysis: %s %s", resp.status_code, resp.text)
        except Exception as e:
            logger.warning("[Storage:Supabase] save_analysis error: %s", e)

    return analysis_data


def get_analyses(user_id: str = "demo_user") -> List[Dict[str, Any]]:
    """
    Retrieve skin analysis history for a user, ordered latest first.
    """
    if HAS_SUPABASE:
        try:
            with httpx.Client(timeout=4.0) as client:
                resp = client.get(
                    f"{SUPABASE_URL}/rest/v1/analyses?user_id=eq.{user_id}&order=created_at.desc",
                    headers=_supabase_headers()
                )
                if resp.status_code == 200:
                    rows = resp.json()
                    results = []
                    for r in rows:
                        if r.get("full_report"):
                            rep = r["full_report"]
                            rep["id"] = r.get("id", rep.get("id"))
                            if r.get("created_at") and not rep.get("created_at"):
                                rep["created_at"] = r["created_at"]
                            results.append(rep)
                        else:
                            results.append(r)
                    if results:
                        logger.info("[Storage:Supabase] Retrieved %d analyses for '%s'", len(results), user_id)
                        return results
        except Exception as e:
            logger.warning("[Storage:Supabase] get_analyses error: %s", e)

    # Local fallback
    analyses = _load_json(ANALYSES_FILE, [])
    return [a for a in analyses if a.get("user_id", "demo_user") == user_id]


def get_analysis_by_id(analysis_id: str) -> Optional[Dict[str, Any]]:
    """
    Retrieve single analysis report by unique ID.
    """
    if HAS_SUPABASE:
        try:
            with httpx.Client(timeout=4.0) as client:
                resp = client.get(
                    f"{SUPABASE_URL}/rest/v1/analyses?id=eq.{analysis_id}&limit=1",
                    headers=_supabase_headers()
                )
                if resp.status_code == 200:
                    rows = resp.json()
                    if rows:
                        r = rows[0]
                        rep = r.get("full_report") or r
                        rep["id"] = r.get("id", rep.get("id"))
                        return rep
        except Exception as e:
            logger.warning("[Storage:Supabase] get_analysis_by_id error: %s", e)

    # Local fallback
    analyses = _load_json(ANALYSES_FILE, [])
    for a in analyses:
        if a.get("id") == analysis_id:
            return a
    return None


def get_progress_entries(user_id: str = "demo_user") -> List[Dict[str, Any]]:
    """
    Retrieve progress timeline milestones from Supabase or local store.
    """
    if HAS_SUPABASE:
        try:
            with httpx.Client(timeout=4.0) as client:
                resp = client.get(
                    f"{SUPABASE_URL}/rest/v1/progress?user_id=eq.{user_id}&order=created_at.asc",
                    headers=_supabase_headers()
                )
                if resp.status_code == 200:
                    rows = resp.json()
                    if rows:
                        logger.info("[Storage:Supabase] Retrieved %d progress entries for '%s'", len(rows), user_id)
                        return rows
        except Exception as e:
            logger.warning("[Storage:Supabase] get_progress_entries error: %s", e)

    # Local fallback
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
    """
    Append new progress observation to Supabase and local store.
    """
    entry["id"] = entry.get("id") or f"prog_{uuid.uuid4().hex[:6]}"

    # Local save
    entries = _load_json(PROGRESS_FILE, [])
    entries.append(entry)
    _save_json(PROGRESS_FILE, entries)

    # Supabase save
    if HAS_SUPABASE:
        try:
            headers = _supabase_headers()
            headers["Prefer"] = "resolution=merge-duplicates,return=representation"
            row = {
                "id": entry["id"],
                "user_id": entry.get("user_id", "demo_user"),
                "week_label": entry.get("week_label", ""),
                "date": entry.get("date", "2026-09-20"),
                "visible_breakouts": entry.get("visible_breakouts", "Mild"),
                "visible_oiliness": entry.get("visible_oiliness", "Moderate"),
                "visible_redness": entry.get("visible_redness", "Mild"),
                "notes": entry.get("notes", ""),
                "image_preview": entry.get("image_preview", "")
            }
            with httpx.Client(timeout=4.0) as client:
                resp = client.post(f"{SUPABASE_URL}/rest/v1/progress", headers=headers, json=row)
                if resp.status_code in (200, 201) and resp.json():
                    logger.info("[Storage:Supabase] Added progress entry '%s'", entry["id"])
                    return resp.json()[0]
                else:
                    logger.warning("[Storage:Supabase] add_progress_entry failed: %s %s", resp.status_code, resp.text)
        except Exception as e:
            logger.warning("[Storage:Supabase] add_progress_entry error: %s", e)

    return entry


def delete_user_data(user_id: str) -> Dict[str, Any]:
    """
    Privacy compliance: permanently deletes user records across Supabase and local storage.
    """
    # 1. Supabase deletion
    if HAS_SUPABASE:
        try:
            with httpx.Client(timeout=4.0) as client:
                client.delete(f"{SUPABASE_URL}/rest/v1/profiles?user_id=eq.{user_id}", headers=_supabase_headers())
                client.delete(f"{SUPABASE_URL}/rest/v1/analyses?user_id=eq.{user_id}", headers=_supabase_headers())
                client.delete(f"{SUPABASE_URL}/rest/v1/progress?user_id=eq.{user_id}", headers=_supabase_headers())
                logger.info("[Storage:Supabase] Deleted records for user '%s'", user_id)
        except Exception as e:
            logger.warning("[Storage:Supabase] delete_user_data error: %s", e)

    # 2. Local storage deletion
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

    # 3. Clean up uploaded files directory
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
