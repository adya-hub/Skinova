"""
Chat Routes for Skinova AI Assistant ("Ask Skinova").
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from ..agent.orchestrator import skinova_agent
from ..data.storage import get_profile, get_analyses

router = APIRouter(prefix="/chat", tags=["Ask Skinova Chat"])

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = "demo_user"
    history: Optional[List[ChatMessage]] = None
    report_id: Optional[str] = None

@router.post("/send")
def chat_with_skinova(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    # Load user profile
    profile = get_profile(req.user_id)

    # Format history if provided
    formatted_history = []
    if req.history:
        for m in req.history:
            formatted_history.append({"role": m.role, "content": m.content})

    # Run Skinova agent
    result = skinova_agent.run(
        user_message=req.message,
        image_bytes=None,
        user_profile=profile,
        chat_history=formatted_history
    )

    return {
        "success": True,
        "reply": result["response"],
        "tool_logs": result["tool_logs"],
        "citations": result["citations"],
        "disclaimer": result["disclaimer"],
        "is_red_flag": result["is_red_flag"]
    }
