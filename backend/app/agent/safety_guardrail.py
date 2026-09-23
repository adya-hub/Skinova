"""
Dedicated Safety and Medical Guardrails for Skinova AI.
Enforces non-diagnostic language, detects critical red flags, and appends clinical advisories.
"""

import re
from typing import Dict, Any, List, Tuple
from ..config import DISCLAIMER_TEXT

# Severe red flags that trigger immediate clinical advisory
RED_FLAG_PATTERNS = [
    (r"\b(bleed|bleeding|blood|ooz(ing|e)|weep(ing|e))\b", "Signs of spontaneous bleeding or weeping lesions require prompt in-person clinical evaluation."),
    (r"\b(rapid(ly)?\s*(grow|chang(ing|ed)|spread|darken))\b", "Rapidly changing, growing, or darkening lesions should be examined directly by a board-certified dermatologist."),
    (r"\b(severe|excruciat(ing)?|intense|unbearable)\s*(pain|burn|ache)\b", "Severe or escalating pain is not typical for routine skincare concerns and requires immediate medical attention."),
    (r"\b(pus|abscess|fever|chills|swollen lymph|red streak)\b", "Signs of bacterial or systemic cutaneous infection (pus, fever, spreading red streaks) require urgent medical care."),
    (r"\b(mole|melanoma|asymmetric|irregular border|black lesion)\b", "Irregular, asymmetric, or highly pigmented dark lesions should always be screened clinically under a dermatoscope."),
    (r"\b(swelling in lips|difficulty breath|anaphyla|throat swell)\b", "Symptoms involving airway, lips, or acute widespread swelling indicate a medical emergency. Call emergency services immediately.")
]

# Diagnostic words that must be translated into uncertainty-aware observations
DIAGNOSTIC_REPLACEMENTS = [
    (r"\byou have acne\b", "visible indicators consistent with acne-like breakouts"),
    (r"\byou have eczema\b", "visible characteristics resembling dry, reactive skin with barrier compromise"),
    (r"\byou have rosacea\b", "visible persistent facial redness and cutaneous reactivity"),
    (r"\byou have melasma\b", "visible bilateral patchy hyperpigmentation"),
    (r"\bwe diagnose\b", "our visual analysis observed"),
    (r"\bmedical treatment\b", "supportive skincare routine"),
    (r"\bprescription\b", "dermatologist-guided regimen")
]

class SafetyGuardrail:
    @staticmethod
    def scan_for_red_flags(text: str) -> Tuple[bool, List[str]]:
        """
        Scans user text or image observations for urgent red-flag symptoms.
        Returns (is_red_flag, warnings_list)
        """
        flags = []
        for pattern, warning in RED_FLAG_PATTERNS:
            if re.search(pattern, text, re.IGNORECASE):
                flags.append(warning)
        return len(flags) > 0, flags

    @staticmethod
    def sanitize_diagnostic_language(text: str) -> str:
        """
        Rewrites definitive diagnostic assertions into uncertainty-aware educational observations.
        """
        sanitized = text
        for pattern, replacement in DIAGNOSTIC_REPLACEMENTS:
            sanitized = re.sub(pattern, replacement, sanitized, flags=re.IGNORECASE)
        return sanitized

    @staticmethod
    def format_safety_response(red_flags: List[str]) -> str:
        """
        Builds a high-priority safety response advising professional consultation.
        """
        advisory = (
            "⚠️ **IMPORTANT HEALTHCARE ADVISORY: Potential Red-Flag Symptoms Detected**\n\n"
            "Skinova detected mentions or visual indicators of symptoms that should **not** be managed with over-the-counter skincare products:\n"
        )
        for flag in red_flags:
            advisory += f"- {flag}\n"
        
        advisory += (
            "\nSkinova is an AI educational assistant, **not a medical diagnostic tool or a physician**. "
            "Please schedule an evaluation with a board-certified dermatologist or contact an urgent healthcare provider "
            "for a comprehensive in-person clinical assessment.\n\n"
            f"> *{DISCLAIMER_TEXT}*"
        )
        return advisory

safety_guardrail = SafetyGuardrail()
