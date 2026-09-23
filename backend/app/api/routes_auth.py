"""
Authentication and Skin Profile Routes for Skinova AI.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from ..data.storage import get_profile, save_profile

router = APIRouter(prefix="/auth", tags=["Authentication & Profile"])

class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    age_range: Optional[str] = None
    skin_type: Optional[str] = None
    primary_concern: Optional[str] = None
    secondary_concerns: Optional[List[str]] = None
    current_routine: Optional[str] = None
    products_used: Optional[List[str]] = None
    breakout_frequency: Optional[str] = None
    sun_exposure: Optional[str] = None
    lifestyle_notes: Optional[str] = None

@router.post("/login")
def login(req: LoginRequest):
    # Modular demo authentication
    if not req.email:
        raise HTTPException(status_code=400, detail="Email is required")
    profile = get_profile("demo_user")
    return {
        "success": True,
        "token": "sk_demo_token_98374",
        "user": {
            "id": profile.get("user_id", "demo_user"),
            "name": profile.get("name", "Alex Morgan"),
            "email": req.email,
        },
        "profile": profile
    }

@router.post("/signup")
def signup(req: SignupRequest):
    if not req.email or not req.name:
        raise HTTPException(status_code=400, detail="Name and email are required")
    new_profile = save_profile("demo_user", {
        "name": req.name,
        "email": req.email
    })
    return {
        "success": True,
        "token": "sk_demo_token_98374",
        "user": {
            "id": "demo_user",
            "name": req.name,
            "email": req.email
        },
        "profile": new_profile
    }

@router.get("/profile")
def get_user_profile(user_id: str = "demo_user"):
    return get_profile(user_id)

@router.put("/profile")
def update_user_profile(req: ProfileUpdateRequest, user_id: str = "demo_user"):
    data = req.model_dump(exclude_unset=True)
    updated = save_profile(user_id, data)
    return {"success": True, "profile": updated}
