import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env if present
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
STORAGE_DIR = BASE_DIR / "app" / "data" / "filestore"
STORAGE_DIR.mkdir(parents=True, exist_ok=True)

UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY", "")
PORT = int(os.getenv("PORT", "8000"))
HOST = os.getenv("HOST", "0.0.0.0")

# App metadata
APP_NAME = "Skinova AI"
APP_TAGLINE = "Understand Your Skin. Make Smarter Choices."
DISCLAIMER_TEXT = (
    "Skinova provides AI-generated educational information based on the information and "
    "images you provide. It is not a medical diagnosis and does not replace advice from a "
    "qualified healthcare professional."
)
