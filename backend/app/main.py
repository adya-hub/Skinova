"""
Main FastAPI Application Entrypoint for Skinova AI.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from .config import APP_NAME, APP_TAGLINE, DISCLAIMER_TEXT, UPLOAD_DIR, BASE_DIR
from .api.routes_auth import router as auth_router
from .api.routes_analysis import router as analysis_router
from .api.routes_chat import router as chat_router
from .api.routes_ingredients import router as ingredients_router
from .api.routes_routine import router as routine_router
from .api.routes_progress import router as progress_router
from .api.routes_privacy import router as privacy_router

app = FastAPI(
    title=APP_NAME,
    description=f"{APP_TAGLINE} | Educational Skincare & AI Vision Assistant",
    version="1.0.0"
)

# CORS Middleware for modern web frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for uploads & demo samples
static_dir = BASE_DIR / "static"
static_dir.mkdir(parents=True, exist_ok=True)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Include API Routers
app.include_router(auth_router, prefix="/api")
app.include_router(analysis_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(ingredients_router, prefix="/api")
app.include_router(routine_router, prefix="/api")
app.include_router(progress_router, prefix="/api")
app.include_router(privacy_router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": APP_NAME,
        "tagline": APP_TAGLINE,
        "disclaimer": DISCLAIMER_TEXT,
        "agent": "SkinovaAgent v1.0",
        "tools_ready": [
            "SkinImageAnalysisTool",
            "SkinProfileRetrievalTool",
            "RAGKnowledgeBaseTool",
            "IngredientCheckerTool",
            "RoutineGeneratorTool",
            "SafetyRedFlagCheckerTool"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
