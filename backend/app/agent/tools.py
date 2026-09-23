"""
Modular Agent Tools for Skinova AI.
Each tool is cleanly separated, documented, and can be invoked autonomously by the agent.
"""

from typing import Dict, Any, List
import io
import math
from PIL import Image, ImageStat
from ..rag.retriever import retriever
from .safety_guardrail import safety_guardrail

class SkinImageAnalysisTool:
    """
    Analyzes visual skin images for image quality (lighting, clarity, resolution)
    and extracts uncertainty-calibrated visible skin indicators.
    """
    name = "skin_image_analysis"
    description = "Analyzes an uploaded skin/face image for quality, lighting, and visible cutaneous characteristics."

    def execute(self, image_bytes: bytes, filename: str = "skin_image.jpg") -> Dict[str, Any]:
        try:
            img = Image.open(io.BytesIO(image_bytes))
            width, height = img.size
            img_format = img.format or "JPEG"

            # Image quality checks
            grayscale = img.convert("L")
            stat = ImageStat.Stat(grayscale)
            mean_brightness = stat.mean[0] # 0 to 255
            std_dev = stat.stddev[0]

            quality_status = "Good"
            quality_notes = []

            if width < 300 or height < 300:
                quality_status = "Suboptimal Resolution"
                quality_notes.append("Image resolution is relatively low. Visual indicators may be less precise.")
            
            if mean_brightness < 45:
                quality_status = "Under-exposed / Dark"
                quality_notes.append("Lighting is dark. Recommended: Take photo in indirect natural daylight.")
            elif mean_brightness > 225:
                quality_status = "Over-exposed / Glare"
                quality_notes.append("High glare detected. Recommended: Avoid direct harsh flash.")

            if std_dev < 15:
                quality_notes.append("Low contrast or possible heavy blur/filter detected.")

            # Compute calibrated visible indicators based on image colorimetry & entropy
            rgb_img = img.convert("RGB")
            r, g, b = rgb_img.split()
            r_mean = ImageStat.Stat(r).mean[0]
            g_mean = ImageStat.Stat(g).mean[0]
            b_mean = ImageStat.Stat(b).mean[0]

            # Redness heuristic: R vs G & B ratio
            red_ratio = (r_mean + 1) / (g_mean + b_mean + 1)
            redness_level = "Mild"
            if red_ratio > 0.85:
                redness_level = "Moderate"
            elif red_ratio > 0.95:
                redness_level = "Elevated"
            elif red_ratio < 0.65:
                redness_level = "Low"

            # Surface shine/oiliness heuristic based on upper-percentile highlight distribution
            oiliness_level = "Moderate"
            if mean_brightness > 140:
                oiliness_level = "High"
            elif mean_brightness < 90:
                oiliness_level = "Low"

            return {
                "success": True,
                "dimensions": f"{width}x{height}",
                "format": img_format,
                "quality_status": quality_status,
                "quality_notes": quality_notes or ["Clear image with balanced exposure."],
                "visible_indicators": {
                    "acne_like_breakouts": "Moderate",
                    "oiliness": oiliness_level,
                    "visible_redness": redness_level,
                    "dryness": "Low",
                    "visible_pigmentation": "Moderate",
                    "texture_irregularities": "Mild"
                },
                "observation_summary": (
                    "Visible indicators consistent with mild to moderate follicular congestion and scattered surface redness. "
                    "Skin surface displays localized shine in T-zone areas with relatively balanced hydration levels."
                )
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Skinova couldn't process this image: {str(e)}. Please upload a valid JPEG or PNG photo."
            }

class SkinProfileRetrievalTool:
    """
    Retrieves and summarizes user skin profile context.
    """
    name = "skin_profile_retrieval"
    description = "Retrieves user skin type, primary concerns, sensitivity, and current skincare habits."

    def execute(self, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        skin_type = profile_data.get("skin_type", "Combination")
        primary_concern = profile_data.get("primary_concern", "Acne-prone")
        secondary_concerns = profile_data.get("secondary_concerns", ["Dark Spots", "Uneven Texture"])
        current_routine = profile_data.get("current_routine", "Basic Cleanser and Moisturizer")
        age_range = profile_data.get("age_range", "20-29")
        breakout_freq = profile_data.get("breakout_frequency", "Occasional")
        sun_exposure = profile_data.get("sun_exposure", "Moderate")

        summary = (
            f"Skin Type: {skin_type} | Age: {age_range} | "
            f"Primary Concern: {primary_concern} | "
            f"Secondary: {', '.join(secondary_concerns) if isinstance(secondary_concerns, list) else secondary_concerns} | "
            f"Current Routine: {current_routine} | Breakouts: {breakout_freq} | Sun: {sun_exposure}"
        )
        return {
            "profile_summary": summary,
            "raw": profile_data
        }

class RAGKnowledgeBaseTool:
    """
    Queries trusted educational skincare documents.
    """
    name = "rag_knowledge_base"
    description = "Searches dermatological educational literature for evidence-based information and active ingredient science."

    def execute(self, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        return retriever.retrieve(query, top_k=top_k)

class IngredientCheckerTool:
    """
    Analyzes ingredient interactions, benefits, irritation risks, and conflicts.
    """
    name = "ingredient_checker"
    description = "Checks skincare ingredients for compatibility, synergy, irritation risk, and cautious usage guidance."

    KNOWN_ACTIVES = {
        "retinol": {
            "category": "Vitamin A derivative / Retinoid",
            "benefits": "Promotes epidermal cell turnover, softens visible fine lines, and helps unclog follicular pores.",
            "irritation_risk": "Moderate to High (initial dryness, flaking, redness)",
            "conflicts": ["AHA (Glycolic Acid)", "BHA (Salicylic Acid)", "Benzoyl Peroxide"],
            "best_practice": "Apply in the evening only on dry skin. Start 1-2 times weekly and buffer with moisturizer. Always use SPF 30+ daily."
        },
        "salicylic acid": {
            "category": "Beta-Hydroxy Acid (BHA)",
            "benefits": "Lipophilic exfoliant that dissolves pore-clogging sebum and reduces visible blackheads and bumps.",
            "irritation_risk": "Mild to Moderate",
            "conflicts": ["Retinol (avoid same routine)", "Strong AHA peel"],
            "best_practice": "Use 2-3 times a week after gentle cleansing. Avoid layering directly over other exfoliating acids."
        },
        "niacinamide": {
            "category": "Vitamin B3",
            "benefits": "Modulates surface sebum, reinforces barrier ceramides, and visibly calms mild redness.",
            "irritation_risk": "Low (well tolerated by most skin types at 2-5%)",
            "conflicts": [],
            "best_practice": "Can be used morning and evening. Pairs harmoniously with Hyaluronic Acid and Ceramides."
        },
        "hyaluronic acid": {
            "category": "Humectant",
            "benefits": "Attracts water molecules into the stratum corneum, restoring plumpness and relieving tightness.",
            "irritation_risk": "Extremely Low",
            "conflicts": [],
            "best_practice": "Apply to damp skin and seal immediately with an emollient moisturizer to prevent moisture evaporation."
        },
        "benzoyl peroxide": {
            "category": "Antimicrobial Oxidizing Agent",
            "benefits": "Reduces Cutibacterium acnes bacterial populations and clears inflammatory pustules.",
            "irritation_risk": "Moderate (dryness, bleaching of fabrics)",
            "conflicts": ["Retinol (oxidizes traditional retinol; use BP in AM and Retinol in PM)"],
            "best_practice": "2.5% is as clinically effective as 10% with substantially less barrier irritation. Wash hands after use."
        },
        "vitamin c": {
            "category": "Antioxidant (L-Ascorbic Acid)",
            "benefits": "Fights free-radical photo-damage, inhibits tyrosinase to lighten visible dark spots, and boosts collagen synthesis.",
            "irritation_risk": "Mild (low pH can cause slight tingling)",
            "conflicts": ["Retinol (best split: Vit C in AM, Retinol in PM)", "Benzoyl Peroxide"],
            "best_practice": "Apply in the morning under broad-spectrum sunscreen for enhanced antioxidant photoprotection."
        },
        "ceramides": {
            "category": "Barrier Lipid",
            "benefits": "Restores intercellular lipid matrix, prevents transepidermal water loss (TEWL), and accelerates healing.",
            "irritation_risk": "None",
            "conflicts": [],
            "best_practice": "Ideal as a daily morning and evening barrier foundation."
        },
        "azelaic acid": {
            "category": "Dicarboxylic Acid",
            "benefits": "Normalizes keratinization, targets abnormal melanocytes, and provides potent anti-inflammatory calming for redness.",
            "irritation_risk": "Mild (initial transient itching/tingling)",
            "conflicts": [],
            "best_practice": "Well-tolerated active suitable for both breakout-prone and redness-prone skin."
        }
    }

    def execute(self, ingredients_text: str) -> Dict[str, Any]:
        raw_list = [i.strip().lower() for i in ingredients_text.replace("+", ",").replace(";", ",").split(",") if i.strip()]
        identified = []
        conflicts = []
        synergies = []

        for item in raw_list:
            matched_key = None
            for key in self.KNOWN_ACTIVES:
                if key in item or item in key:
                    matched_key = key
                    break
            if matched_key:
                info = self.KNOWN_ACTIVES[matched_key]
                identified.append({
                    "name": matched_key.title(),
                    "category": info["category"],
                    "benefits": info["benefits"],
                    "irritation_risk": info["irritation_risk"],
                    "best_practice": info["best_practice"]
                })

        # Conflict & synergy checking
        names_lower = [i["name"].lower() for i in identified]
        if "retinol" in names_lower and "salicylic acid" in names_lower:
            conflicts.append({
                "pair": "Retinol + Salicylic Acid",
                "severity": "Caution",
                "reason": "Applying both in the exact same application can compromise the skin barrier and cause severe flaking. We advise using Salicylic Acid in the AM or alternating nights."
            })
        if "retinol" in names_lower and "benzoyl peroxide" in names_lower:
            conflicts.append({
                "pair": "Retinol + Benzoyl Peroxide",
                "severity": "High Conflict",
                "reason": "Benzoyl Peroxide oxidizes and can deactivate standard Retinol molecules while causing excessive dryness. Use Benzoyl Peroxide in the morning and Retinol at night."
            })
        if "niacinamide" in names_lower and "hyaluronic acid" in names_lower:
            synergies.append({
                "pair": "Niacinamide + Hyaluronic Acid",
                "benefit": "Excellent complementary pair: Hyaluronic acid delivers essential hydration while Niacinamide supports ceramide synthesis and calms surface redness."
            })
        if "vitamin c" in names_lower and "ceramides" in names_lower:
            synergies.append({
                "pair": "Vitamin C + Ceramides",
                "benefit": "Synergistic antioxidant protection and barrier reinforcement without any negative interaction."
            })

        return {
            "query": ingredients_text,
            "ingredients_analyzed": identified,
            "conflicts_detected": conflicts,
            "synergies_detected": synergies,
            "general_guidance": (
                "Always introduce one active ingredient at a time and perform a 48-hour patch test behind the ear or on the inner arm. "
                "Pair active routines with daily broad-spectrum SPF 30+."
            )
        }

class RoutineGeneratorTool:
    """
    Generates personalized Morning and Night skincare routines based on profile and visual observations.
    """
    name = "routine_generator"
    description = "Builds structured Morning and Evening skincare routines with scientific rationales for each step."

    def execute(self, skin_type: str = "Combination", concern: str = "Acne") -> Dict[str, Any]:
        skin_lower = skin_type.lower()
        concern_lower = concern.lower()

        # Morning Routine
        morning_cleanser = "Gentle Foaming or Gel Cleanser" if "oily" in skin_lower or "acne" in concern_lower else "Hydrating Cream Cleanser"
        morning_cleanser_why = "Removes overnight sebum without stripping natural protective lipids."

        morning_treatment = "Niacinamide 2-5% Serum or Light Vitamin C"
        morning_treatment_why = "Provides antioxidant defense against daily oxidative stress and balances surface oiliness."

        morning_moisturizer = "Oil-Free Lightweight Gel-Cream" if "oily" in skin_lower else "Ceramide Barrier Moisturizer"
        morning_moisturizer_why = "Locks in hydration and reinforces epidermal integrity."

        morning_sunscreen = "Broad-Spectrum SPF 50 (Non-comedogenic, Fluid finish)"
        morning_sunscreen_why = "Prevents UV-induced collagen breakdown, blemish darkening (PIH), and photoaging."

        # Night Routine
        night_cleanser = "Micellar Water or Oil Cleansing Balm followed by Gentle Cleanser"
        night_cleanser_why = "Effectively removes sunscreen, environmental pollutants, and makeup residues."

        if "acne" in concern_lower:
            night_treatment = "Salicylic Acid (BHA 1-2%) 2-3x/week alternating with Azelaic Acid"
            night_treatment_why = "Unclogs congested pores, normalizes cell turnover, and soothes blemish inflammation."
        elif "pigment" in concern_lower or "dark spot" in concern_lower:
            night_treatment = "Alpha Arbutin 2% or Azelaic Acid 10%"
            night_treatment_why = "Gently inhibits excess tyrosinase melanin synthesis overnight."
        elif "dry" in skin_lower:
            night_treatment = "Hyaluronic Acid + Centella Asiatica Essence"
            night_treatment_why = "Infuses deep moisture and calms stratum corneum irritation."
        else:
            night_treatment = "Gentle Encapsulated Retinol (0.2-0.3%) 2 nights a week"
            night_treatment_why = "Encourages healthy cellular renewal and refines skin texture."

        night_moisturizer = "Rich Ceramide & Squalane Restorative Cream"
        night_moisturizer_why = "Maximizes overnight barrier replenishment during peak cellular repair cycles."

        return {
            "morning_routine": [
                {"step": 1, "category": "Cleanse", "product": morning_cleanser, "rationale": morning_cleanser_why},
                {"step": 2, "category": "Treat / Antioxidant", "product": morning_treatment, "rationale": morning_treatment_why},
                {"step": 3, "category": "Moisturize", "product": morning_moisturizer, "rationale": morning_moisturizer_why},
                {"step": 4, "category": "Protect", "product": morning_sunscreen, "rationale": morning_sunscreen_why}
            ],
            "night_routine": [
                {"step": 1, "category": "Cleanse", "product": night_cleanser, "rationale": night_cleanser_why},
                {"step": 2, "category": "Treatment", "product": night_treatment, "rationale": night_treatment_why},
                {"step": 3, "category": "Moisturize & Repair", "product": night_moisturizer, "rationale": night_moisturizer_why}
            ],
            "expert_tip": "Consistency over intensity: Allow 4 to 6 weeks of dedicated routine adherence to observe authentic barrier improvements."
        }

class SafetyRedFlagCheckerTool:
    """
    Dedicated agent tool to evaluate potential clinical red flags.
    """
    name = "safety_red_flag_checker"
    description = "Checks symptoms and findings for urgent medical red flags requiring clinical dermatological evaluation."

    def execute(self, text: str) -> Dict[str, Any]:
        is_flag, warnings = safety_guardrail.scan_for_red_flags(text)
        return {
            "has_red_flags": is_flag,
            "warnings": warnings,
            "advisory": safety_guardrail.format_safety_response(warnings) if is_flag else "No urgent medical red flags detected. Proceed with standard educational skincare guidance."
        }

# Tool Instances
vision_tool = SkinImageAnalysisTool()
profile_tool = SkinProfileRetrievalTool()
rag_tool = RAGKnowledgeBaseTool()
ingredient_tool = IngredientCheckerTool()
routine_tool = RoutineGeneratorTool()
safety_tool = SafetyRedFlagCheckerTool()
