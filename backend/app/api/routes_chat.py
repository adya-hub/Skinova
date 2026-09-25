"""
Chat Routes for Skinova AI Assistant ("Ask Skinova").
Flow: Frontend -> /api/chat/send -> AI agent -> SkinProfileRetrievalTool (database) -> LLM -> Response
"""

import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from ..agent.orchestrator import skinova_agent

logger = logging.getLogger("skinova.api.chat")

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

    user_id = req.user_id or "demo_user"
    logger.info(">>> [POST /api/chat/send] Received query from user '%s': '%s'", user_id, req.message)

    # Format history if provided
    formatted_history = []
    if req.history:
        for m in req.history:
            formatted_history.append({"role": m.role, "content": m.content})

    try:
        # Run Skinova agent:
        # The agent autonomously invokes SkinProfileRetrievalTool, queries the database,
        # aggregates RAG knowledge, passes context to the LLM, and formats the output.
        result = skinova_agent.run(
            user_message=req.message,
            image_bytes=None,
            user_profile=None,
            user_id=user_id,
            chat_history=formatted_history
        )

        logger.info("<<< [POST /api/chat/send] Successfully generated response for user '%s'", user_id)

        return {
            "success": True,
            "reply": result["response"],
            "tool_logs": result["tool_logs"],
            "citations": result["citations"],
            "disclaimer": result["disclaimer"],
            "is_red_flag": result["is_red_flag"]
        }

    except Exception as e:
        logger.error("[POST /api/chat/send] Unhandled error during agent execution: %s", e, exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Skinova Agent execution error: {str(e)}"
        )
