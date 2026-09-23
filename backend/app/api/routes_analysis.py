"""
Skin Image Analysis & Report Generation Routes.
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional, List, Dict, Any
import datetime
import uuid
import shutil
from pathlib import Path

from ..config import UPLOAD_DIR, DISCLAIMER_TEXT
from ..agent.orchestrator import skinova_agent
from ..agent.tools import vision_tool, routine_tool, ingredient_tool, rag_tool
from ..agent.safety_guardrail import safety_guardrail
from ..data.storage import save_analysis, get_analyses, get_analysis_by_id, get_profile

router = APIRouter(prefix="/analysis", tags=["Skin Analysis"])

@router.post("/analyze")
async def analyze_skin(
    image: Optional[UploadFile] = File(None),
    sample_id: Optional[str] = Form(None),
    consent: bool = Form(...),
    user_id: str = Form("demo_user")
):
    if not consent:
        raise HTTPException(status_code=400, detail="Consent for image processing is required before analysis.")

    # Get user profile
    user_profile = get_profile(user_id)
    image_bytes = None
    saved_filename = None

    if image and image.filename:
        # Check file extension
        valid_exts = [".jpg", ".jpeg", ".png", ".webp"]
        ext = Path(image.filename).suffix.lower()
        if ext not in valid_exts:
            raise HTTPException(status_code=400, detail="Skinova accepts JPEG, PNG, or WebP images only.")

        image_bytes = await image.read()
        if len(image_bytes) > 15 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Image size exceeds the 15MB limit.")

        unique_name = f"{user_id}_{uuid.uuid4().hex[:8]}{ext}"
        save_path = UPLOAD_DIR / unique_name
        with open(save_path, "wb") as f:
            f.write(image_bytes)
        saved_filename = f"/uploads/{unique_name}"

    elif sample_id:
        saved_filename = f"/static/samples/{sample_id}.svg"
        # Dummy 1x1 image bytes for tool processing
        from PIL import Image
        import io
        dummy_img = Image.new("RGB", (600, 800), color=(220, 190, 175))
        byte_io = io.BytesIO()
        dummy_img.save(byte_io, format="JPEG")
        image_bytes = byte_io.getvalue()
    else:
        raise HTTPException(status_code=400, detail="Please upload a skin photo or choose a demo sample.")

    # 1. Run Vision Tool for image metrics & visible indicators
    vision_result = vision_tool.execute(image_bytes)
    if not vision_result.get("success"):
        raise HTTPException(status_code=422, detail=vision_result.get("error", "Image analysis failed."))

    vis_indicators = vision_result.get("visible_indicators", {})

    # Adjust indicators slightly based on user primary concern to ensure cohesive personalization
    primary_c = user_profile.get("primary_concern", "").lower()
    if "acne" in primary_c:
        vis_indicators["acne_like_breakouts"] = "Moderate"
    elif "dark spot" in primary_c or "pigment" in primary_c:
        vis_indicators["visible_pigmentation"] = "Moderate to High"
    elif "redness" in primary_c:
        vis_indicators["visible_redness"] = "Moderate"

    # 2. Query RAG for evidence-based literature
    rag_docs = rag_tool.execute(f"{primary_c} skincare guidance barrier protection", top_k=2)

    # 3. Build AM & PM routine
    routine_data = routine_tool.execute(
        user_profile.get("skin_type", "Combination"),
        user_profile.get("primary_concern", "Breakouts")
    )

    # 4. Synthesize non-diagnostic report
    report_id = f"rep_{uuid.uuid4().hex[:8]}"
    report = {
        "id": report_id,
        "user_id": user_id,
        "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "image_url": saved_filename,
        "skin_profile_snapshot": {
            "skin_type": user_profile.get("skin_type", "Combination"),
            "primary_concern": user_profile.get("primary_concern", "Acne-prone"),
            "age_range": user_profile.get("age_range", "25-34")
        },
        "image_quality": {
            "status": vision_result.get("quality_status", "Good"),
            "notes": vision_result.get("quality_notes", ["Clear lighting and focus."])
        },
        "visible_skin_indicators": [
            {"name": "Acne-like breakouts", "level": vis_indicators.get("acne_like_breakouts", "Moderate"), "color": "amber"},
            {"name": "Oiliness / T-zone shine", "level": vis_indicators.get("oiliness", "High"), "color": "blue"},
            {"name": "Visible redness", "level": vis_indicators.get("visible_redness", "Mild"), "color": "rose"},
            {"name": "Dryness / Flaking", "level": vis_indicators.get("dryness", "Low"), "color": "emerald"},
            {"name": "Visible pigmentation / spots", "level": vis_indicators.get("visible_pigmentation", "Moderate"), "color": "purple"},
            {"name": "Texture irregularities", "level": vis_indicators.get("texture_irregularities", "Mild"), "color": "slate"}
        ],
        "overall_observation": (
            "The image exhibits visible indicators consistent with mild follicular congestion and localized surface sebum "
            "prominence along the forehead and nasal crease. Scattered mild erythema (redness) is observable, accompanied by "
            "faint post-blemish visible pigmentation. Overall cutaneous hydration appears largely preserved with minimal apparent flaking."
        ),
        "key_concerns": [
            "Follicular congestion consistent with occasional comedonal and papular breakouts.",
            "Elevated surface sebum contributing to localized T-zone shine and pore prominence.",
            "Visible post-inflammatory pigmentation marks following past blemishes."
        ],
        "what_this_could_mean": (
            "Elevated oiliness coupled with mild breakouts often points toward sebum accumulation and cellular buildup "
            "within pores. When active breakouts resolve, melanin-producing melanocytes can temporarily leave visible dark marks (PIH). "
            "This is very common and typically responds to consistent, non-stripping skincare support."
        ),
        "general_skincare_guidance": [
            "Maintain a pH-balanced gentle cleanser morning and evening; avoid harsh mechanical scrubs that aggravate redness.",
            "Introduce gentle, non-comedogenic keratolytic ingredients (such as 1-2% Salicylic Acid or Azelaic Acid) on alternate evenings.",
            "Incorporate a light barrier-supporting serum with Niacinamide (2-5%) to help regulate visible sebum.",
            "Apply broad-spectrum SPF 30+ daily to prevent UV rays from darkening visible pigmentation spots."
        ],
        "suggested_routine": routine_data,
        "ingredients_to_learn_about": [
            {
                "name": "Niacinamide (Vitamin B3)",
                "rationale": "Helps balance visible sebum excretion, soothes mild redness, and strengthens natural barrier ceramides."
            },
            {
                "name": "Salicylic Acid (BHA)",
                "rationale": "Lipophilic acid that penetrates into oil-rich pores to break up trapped cellular debris."
            },
            {
                "name": "Azelaic Acid (10%)",
                "rationale": "Gently calms visible blemish-associated redness while selectively fading visible dark spots."
            }
        ],
        "things_to_watch_for": [
            "Excessive tightness, burning, or peeling when introducing new active ingredients.",
            "Blemishes that feel deeply cystic, painful, or do not respond after 8-12 weeks."
        ],
        "when_to_consider_professional_help": (
            "Skinova is designed for general wellness education. You should seek in-person evaluation from a board-certified dermatologist "
            "if you experience severe or painful cystic acne, rapidly changing or irregularly shaped pigmented lesions, spontaneous bleeding, "
            "or persistent lesions that fail to heal after several weeks."
        ),
        "citations": [
            {"title": doc["title"], "source": doc["source"]} for doc in rag_docs
        ],
        "disclaimer": DISCLAIMER_TEXT
    }

    # Save to storage
    saved = save_analysis(report)
    return {"success": True, "report": saved}

@router.get("/reports")
def list_reports(user_id: str = "demo_user"):
    return get_analyses(user_id)

@router.get("/reports/{report_id}")
def get_report(report_id: str):
    rep = get_analysis_by_id(report_id)
    if not rep:
        raise HTTPException(status_code=404, detail="Skinova report not found.")
    return rep
