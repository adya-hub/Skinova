"""
Skinova AI Agent Orchestrator.
Coordinates user input, dynamic tool selection, RAG retrieval, Gemini LLM (with fallback),
safety verification, and response synthesis.
"""

import os
import logging
from typing import Dict, Any, List, Optional
from ..config import GEMINI_API_KEY, DISCLAIMER_TEXT
from .tools import (
    vision_tool,
    profile_tool,
    rag_tool,
    ingredient_tool,
    routine_tool,
    safety_tool
)
from .safety_guardrail import safety_guardrail

logger = logging.getLogger("skinova.agent.orchestrator")

class SkinovaAgent:
    def __init__(self):
        self.api_key = GEMINI_API_KEY
        self.has_gemini = bool(self.api_key and len(self.api_key) > 5)
        self.gemini_client = None
        if self.has_gemini:
            try:
                from google import genai
                self.gemini_client = genai.Client(api_key=self.api_key)
                logger.info("[SkinovaAgent] Google GenAI Client successfully initialized.")
            except Exception as e:
                logger.warning("[SkinovaAgent] Google GenAI Client initialization failed: %s. Using internal engine.", e)
                self.has_gemini = False
        else:
            logger.info("[SkinovaAgent] Running with built-in intelligent clinical reasoning engine.")

    def decide_and_execute_tools(
        self,
        query: str,
        image_bytes: Optional[bytes] = None,
        profile: Optional[Dict[str, Any]] = None,
        user_id: str = "demo_user"
    ) -> Dict[str, Any]:
        """
        Determines which tools to call and aggregates their findings.
        Flow: AI Agent -> SkinProfileRetrievalTool (database) -> Safety -> RAG -> Formulation.
        """
        tool_results = {}
        tool_logs = []

        logger.info("[SkinovaAgent] Deciding and executing tools for query: '%s'", query)

        # 1. Safety Check (High Priority)
        safety_res = safety_tool.execute(query)
        tool_results["safety"] = safety_res
        is_flag = safety_res.get("has_red_flags", False)
        tool_logs.append({
            "tool": "SafetyRedFlagCheckerTool",
            "status": "Warning" if is_flag else "Clear",
            "summary": "Detected potential red flags" if is_flag else "No acute red-flag symptoms found"
        })
        logger.info("[SkinovaAgent] SafetyRedFlagCheckerTool status: %s", "Warning" if is_flag else "Clear")

        # 2. Skin Profile Tool (Always executed to retrieve from database)
        # Flow: AI Agent -> SkinProfileRetrievalTool -> database/storage
        target_profile_input = profile if profile is not None else user_id
        profile_res = profile_tool.execute(target_profile_input)
        tool_results["profile"] = profile_res
        db_profile = profile_res.get("profile", {})
        skin_type = db_profile.get("skin_type", "Combination")
        concern = db_profile.get("primary_concern", "Breakouts")
        tool_logs.append({
            "tool": "SkinProfileRetrievalTool",
            "status": "Success",
            "summary": f"Retrieved profile from database: {skin_type} skin ({concern})"
        })
        logger.info("[SkinovaAgent] SkinProfileRetrievalTool retrieved profile for '%s': %s / %s", user_id, skin_type, concern)

        # 3. Vision Tool (if image provided)
        if image_bytes:
            vision_res = vision_tool.execute(image_bytes)
            tool_results["vision"] = vision_res
            tool_logs.append({
                "tool": "SkinImageAnalysisTool",
                "status": "Success" if vision_res.get("success") else "Error",
                "summary": f"Analyzed image clarity and extracted visible skin indicators ({vision_res.get('dimensions', 'N/A')})"
            })
            logger.info("[SkinovaAgent] SkinImageAnalysisTool executed: %s", vision_res.get("quality_status"))

        # 4. Ingredient Checker Tool (if query mentions active ingredients or compounds)
        known_keywords = [
            "retinol", "salicylic", "niacinamide", "hyaluronic", "benzoyl", "vitamin c",
            "ceramide", "azelaic", "ingredient", "bha", "aha", "exfoliant", "actives", "acid"
        ]
        if any(kw in query.lower() for kw in known_keywords):
            ing_res = ingredient_tool.execute(query)
            tool_results["ingredient"] = ing_res
            analyzed_count = len(ing_res.get("ingredients_analyzed", []))
            tool_logs.append({
                "tool": "IngredientCheckerTool",
                "status": "Success",
                "summary": f"Analyzed compatibility for {analyzed_count} active ingredients"
            })
            logger.info("[SkinovaAgent] IngredientCheckerTool executed for %d actives", analyzed_count)

        # 5. Routine Generator Tool (if query asks for routine, regimen, or steps)
        if any(w in query.lower() for w in ["routine", "regimen", "morning", "night", "build", "steps"]):
            routine_res = routine_tool.execute(skin_type, concern)
            tool_results["routine"] = routine_res
            tool_logs.append({
                "tool": "RoutineGeneratorTool",
                "status": "Success",
                "summary": f"Formulated customized AM/PM routine for {skin_type} / {concern}"
            })
            logger.info("[SkinovaAgent] RoutineGeneratorTool executed for %s / %s", skin_type, concern)

        # 6. RAG Knowledge Base Retrieval (Always run to ground response in peer-reviewed science)
        rag_res = rag_tool.execute(query, top_k=3)
        tool_results["rag"] = rag_res
        tool_logs.append({
            "tool": "RAGKnowledgeBaseTool",
            "status": "Success",
            "summary": f"Retrieved {len(rag_res)} verified educational literature citations"
        })
        logger.info("[SkinovaAgent] RAGKnowledgeBaseTool retrieved %d citations", len(rag_res))

        return {
            "results": tool_results,
            "logs": tool_logs
        }

    def run(
        self,
        user_message: str,
        image_bytes: Optional[bytes] = None,
        user_profile: Optional[Dict[str, Any]] = None,
        user_id: Optional[str] = "demo_user",
        chat_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Orchestrates full agent workflow:
        1. Tool execution (SkinProfileRetrievalTool from database, Safety, RAG, etc.)
        2. Red-flag override check
        3. LLM synthesis (Gemini or intelligent agent engine)
        4. Safety sanitization
        """
        uid = user_id or "demo_user"
        logger.info(">>> [SkinovaAgent.run] Processing user query: '%s' (user_id: '%s')", user_message, uid)

        # Step 1: Execute required tools
        tool_data = self.decide_and_execute_tools(user_message, image_bytes, user_profile, uid)
        tool_results = tool_data["results"]
        tool_logs = tool_data["logs"]

        # Step 2: Red Flag Emergency Check
        if tool_results.get("safety", {}).get("has_red_flags"):
            safety_output = tool_results["safety"]["advisory"]
            logger.warning("[SkinovaAgent] Red-flag emergency symptoms detected in user message.")
            return {
                "response": safety_output,
                "tool_logs": tool_logs,
                "citations": [],
                "disclaimer": DISCLAIMER_TEXT,
                "is_red_flag": True
            }

        # Step 3: Check if Gemini is live or use intelligent agent fallback engine
        citations = [
            {"title": doc["title"], "source": doc["source"], "category": doc["category"]}
            for doc in tool_results.get("rag", [])
        ]

        active_profile = tool_results.get("profile", {}).get("profile", user_profile or {})

        if self.has_gemini and self.gemini_client:
            try:
                logger.info("[SkinovaAgent] Invoking Gemini LLM (gemini-2.0-flash)...")
                response_text = self._call_gemini(user_message, tool_results, chat_history)
                logger.info("[SkinovaAgent] Gemini LLM generated response successfully (%d chars).", len(response_text))
            except Exception as e:
                logger.warning("[SkinovaAgent] Gemini API call error: %s. Falling back to internal engine.", e)
                response_text = self._agent_reasoning_engine(user_message, tool_results, active_profile)
        else:
            logger.info("[SkinovaAgent] Synthesizing response via intelligent agent reasoning engine...")
            response_text = self._agent_reasoning_engine(user_message, tool_results, active_profile)

        # Step 4: Guardrail Sanitization
        sanitized_response = safety_guardrail.sanitize_diagnostic_language(response_text)
        logger.info("[SkinovaAgent] Agent workflow complete. Output generated successfully.")

        return {
            "response": sanitized_response,
            "tool_logs": tool_logs,
            "citations": citations,
            "disclaimer": DISCLAIMER_TEXT,
            "is_red_flag": False
        }

    def _call_gemini(
        self,
        user_message: str,
        tool_results: Dict[str, Any],
        chat_history: Optional[List[Dict[str, str]]] = None
    ) -> str:
        """
        Sends grounded tool context to Gemini 1.5/2.0 Flash.
        """
        system_instruction = (
            "You are Skinova, an empathetic, scientifically grounded AI Skin Health Assistant. "
            "Your purpose is skin health analysis and skincare education. "
            "CRITICAL MEDICAL RULES:\n"
            "- NEVER provide a medical diagnosis or claim to replace a dermatologist.\n"
            "- Use uncertainty-aware language: 'visible indicators consistent with...', 'observations suggest...'.\n"
            "- Avoid prescription medications. Recommend over-the-counter supportive ingredients.\n"
            "- If concerning symptoms are mentioned, advise in-person clinical evaluation.\n"
            "- Keep your tone warm, elegant, clear, and reassuring."
        )

        rag_context = "\n\n".join([
            f"Source [{doc['title']} - {doc['source']}]:\n{doc['content']}"
            for doc in tool_results.get("rag", [])
        ])

        profile_summary = tool_results.get("profile", {}).get("profile_summary", "No profile specified")
        
        prompt = f"""
System Knowledge & Context:
User Profile: {profile_summary}

Grounded Skincare Literature:
{rag_context}

Tool Results:
- Ingredient Analysis: {tool_results.get('ingredient', 'None')}
- Routine Recommendation: {tool_results.get('routine', 'None')}

User Query:
{user_message}

Please provide a helpful, clear, and caring response as Skinova.
"""
        response = self.gemini_client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt,
            config={'system_instruction': system_instruction}
        )
        return response.text

    def _agent_reasoning_engine(
        self,
        user_message: str,
        tool_results: Dict[str, Any],
        profile: Optional[Dict[str, Any]]
    ) -> str:
        """
        Intelligent deterministic reasoning engine for tool-grounded responses
        when an external API key is not present or when API call fails.
        """
        msg_lower = user_message.lower()
        parts = []

        prof = profile or {}
        st = prof.get("skin_type") or "Combination"
        pc = prof.get("primary_concern") or "Breakouts"
        routine = prof.get("current_routine") or "Cleanser and moisturizer"

        # 1. Greeting / Introductory Queries
        if any(w in msg_lower for w in ["hello", "hi", "hey", "who are you", "what can you do"]):
            return (
                f"Hello! I'm **Skinova**, your AI skin health and education assistant. "
                f"I've retrieved your **{st}** skin profile from your account context.\n\n"
                "I'm here to help you understand visible skin characteristics, explore active ingredient compatibility, "
                "build supportive daily morning and evening regimens, and make evidence-based skincare choices.\n\n"
                "You can ask me questions such as:\n"
                "- *'What is a safe solution for acne in dry skin?'*\n"
                "- *'Can I layer Niacinamide with Salicylic Acid?'*\n"
                "- *'How can I repair my skin barrier after over-exfoliating?'*"
            )

        # 2. Specific Topic: Acne in Dry Skin (Classic Dermatological Dilemma)
        if ("acne" in msg_lower or "breakout" in msg_lower or "pimple" in msg_lower) and \
           ("dry" in msg_lower or "dehydrat" in msg_lower or "flak" in msg_lower or "tight" in msg_lower or "dry" in st.lower()):
            parts.append("### Managing Acne in Dry Skin: The Dermatological Balancing Act\n")
            parts.append(
                "Treating acne when your skin is dry or compromised requires a dual strategy: "
                "gently clearing follicular congestion without stripping the stratum corneum's essential lipid barrier. "
                "Conventional acne products can exacerbate **Transepidermal Water Loss (TEWL)**, leading to micro-cracking, "
                "rebound inflammation, and more persistent breakouts.\n"
            )

            parts.append("#### 🌿 1. Gentle, Non-Stripping Active Clearing")
            parts.append(
                "- **Azelaic Acid (5–10%)**: Exceptionally well-tolerated on dry skin. It normalizes follicular keratinization, "
                "reduces *C. acnes* bacteria, and visibly calms blemish erythema without drying or peeling.\n"
                "- **Low-Dose Salicylic Acid (0.5–1% BHA)**: Lipophilic to penetrate sebum-clogged pores, but should be used "
                "prudently (2 to 3 evenings per week only, not twice daily).\n"
                "- **Niacinamide (2–4%)**: Modulates surface sebum, reinforces epidermal barrier lipids, and soothes redness.\n"
            )

            parts.append("#### 💧 2. Barrier Restoration & Moisture Sealing")
            parts.append(
                "- **Hydrating Non-Foaming Cleanser**: Switch from harsh sulfate foaming cleansers to a gentle lotion or cream cleanser with Glycerin and Ceramides.\n"
                "- **Multi-Weight Hyaluronic Acid**: Apply to damp skin immediately after cleansing to attract water into the upper stratum corneum.\n"
                "- **Physiological Lipid Moisturizer**: Use creams formulated with **Ceramides (NP, AP, EOP)**, Cholesterol, and Squalane to replenish the mortar between corneocytes.\n"
            )

            parts.append("#### 🛡️ 3. The 'Sandwich' / Buffering Technique")
            parts.append(
                "If using an exfoliating active, apply a thin layer of ceramide moisturizer *before* your active, let it absorb, "
                "then apply your treatment, followed by a second layer of moisturizer. This cushions dry skin from irritation while maintaining efficacy.\n"
            )

            parts.append(f"**Connecting with your database profile ({st} skin / Primary Concern: {pc})**:")
            parts.append(
                f"Your profile indicates a current routine of *'{routine}'*. "
                "To target acne without flaking, ensure your hydrators are layered before any active acids, "
                "and maintain consistent broad-spectrum SPF 30+ daily to prevent post-inflammatory dark marks (PIH)."
            )

            parts.append("\n*Feel free to ask for a customized morning/night routine schedule for dry, breakout-prone skin!*")
            return "\n\n".join(parts)

        # 3. Ingredient Compatibility Query
        if "ingredient" in tool_results:
            ing_data = tool_results["ingredient"]
            analyzed = ing_data.get("ingredients_analyzed", [])
            conflicts = ing_data.get("conflicts_detected", [])
            synergies = ing_data.get("synergies_detected", [])

            parts.append("### Skinova's Active Ingredient Breakdown\n")
            if analyzed:
                for item in analyzed:
                    parts.append(
                        f"**{item['name']}** (*{item['category']}*)\n"
                        f"- **Key Benefits**: {item['benefits']}\n"
                        f"- **Irritation Profile**: {item['irritation_risk']}\n"
                        f"- **Best Practice**: {item['best_practice']}\n"
                    )

            if conflicts:
                parts.append("#### ⚠️ Compatibility Considerations")
                for c in conflicts:
                    parts.append(f"- **{c['pair']}** ({c['severity']}): {c['reason']}")

            if synergies:
                parts.append("#### ✨ Synergistic Pairings")
                for s in synergies:
                    parts.append(f"- **{s['pair']}**: {s['benefit']}")

            guidance = ing_data.get("general_guidance", "Introduce one active at a time and patch test.")
            parts.append(f"\n*{guidance}*")
            return "\n".join(parts)

        # 4. Routine Request
        if "routine" in tool_results:
            routine_data = tool_results["routine"]
            am = routine_data.get("morning_routine", [])
            pm = routine_data.get("night_routine", [])

            parts.append("### Your Personalized Skinova Regimen\n")
            parts.append("#### ☀️ Morning Routine (Protection & Hydration)")
            for step in am:
                parts.append(f"**Step {step['step']}: {step['category']}** — {step['product']}\n*{step['rationale']}*")

            parts.append("\n#### 🌙 Evening Routine (Clearing & Barrier Recovery)")
            for step in pm:
                parts.append(f"**Step {step['step']}: {step['category']}** — {step['product']}\n*{step['rationale']}*")

            tip = routine_data.get("expert_tip", "Consistency over intensity: allow 4-6 weeks for skin turnover.")
            parts.append(f"\n💡 **Skinova Tip**: {tip}")
            return "\n".join(parts)

        # 5. General Query Grounded with RAG Literature
        rag_docs = tool_results.get("rag", [])
        if rag_docs:
            primary_doc = rag_docs[0]
            parts.append(f"Based on dermatological research on **{primary_doc['category']}**:\n")
            parts.append(primary_doc["content"])
            
            pc_clean = pc.lower() if pc else "skin concerns"
            parts.append(
                f"\n\n**Connecting with your database profile ({st} / {pc})**: "
                f"Prioritize gentle non-stripping cleansers and barrier-first hydration. "
                f"Introducing active ingredients slowly helps preserve epidermal integrity while targeting {pc_clean}."
            )

            parts.append("\n\n*Feel free to ask follow-up questions about specific products, layering, or gentle alternatives!*")
            return "\n".join(parts)

        return (
            f"I've retrieved your **{st}** skin profile from your account. "
            "To give you the most targeted advice, let me know if you are experiencing specific visible issues "
            "(such as dryness, breakouts, or redness), or if you'd like a custom morning/evening routine."
        )

# Agent Singleton
skinova_agent = SkinovaAgent()
