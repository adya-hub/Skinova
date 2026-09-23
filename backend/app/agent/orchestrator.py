"""
Skinova AI Agent Orchestrator.
Coordinates user input, dynamic tool selection, RAG retrieval, Gemini LLM (with fallback),
safety verification, and response synthesis.
"""

import os
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

class SkinovaAgent:
    def __init__(self):
        self.api_key = GEMINI_API_KEY
        self.has_gemini = bool(self.api_key and len(self.api_key) > 5)
        self.gemini_client = None
        if self.has_gemini:
            try:
                from google import genai
                self.gemini_client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"[SkinovaAgent] Warning: Google GenAI Client initialization failed: {e}")
                self.has_gemini = False

    def decide_and_execute_tools(
        self,
        query: str,
        image_bytes: Optional[bytes] = None,
        profile: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Determines which tools to call and aggregates their findings.
        """
        tool_results = {}
        tool_logs = []

        # 1. Safety Check (High Priority)
        safety_res = safety_tool.execute(query)
        tool_results["safety"] = safety_res
        tool_logs.append({
            "tool": "SafetyRedFlagCheckerTool",
            "status": "Warning" if safety_res["has_red_flags"] else "Clear",
            "summary": "Detected potential red flags" if safety_res["has_red_flags"] else "No acute red-flag symptoms found"
        })

        # 2. Vision Tool (if image provided)
        if image_bytes:
            vision_res = vision_tool.execute(image_bytes)
            tool_results["vision"] = vision_res
            tool_logs.append({
                "tool": "SkinImageAnalysisTool",
                "status": "Success" if vision_res.get("success") else "Error",
                "summary": f"Analyzed image clarity and extracted visible skin indicators ({vision_res.get('dimensions', 'N/A')})"
            })

        # 3. Profile Tool (if profile provided)
        if profile:
            profile_res = profile_tool.execute(profile)
            tool_results["profile"] = profile_res
            tool_logs.append({
                "tool": "SkinProfileRetrievalTool",
                "status": "Success",
                "summary": f"Loaded context for {profile.get('skin_type', 'Combination')} skin"
            })

        # 4. Ingredient Checker Tool (if query mentions common ingredients)
        known_keywords = ["retinol", "salicylic", "niacinamide", "hyaluronic", "benzoyl", "vitamin c", "ceramide", "azelaic", "ingredient", "bha", "aha"]
        if any(kw in query.lower() for kw in known_keywords):
            ing_res = ingredient_tool.execute(query)
            tool_results["ingredient"] = ing_res
            tool_logs.append({
                "tool": "IngredientCheckerTool",
                "status": "Success",
                "summary": f"Analyzed compatibility for {len(ing_res.get('ingredients_analyzed', []))} actives"
            })

        # 5. Routine Generator Tool (if query mentions routine or build)
        if any(w in query.lower() for w in ["routine", "regimen", "morning", "night", "build", "steps"]):
            skin_type = (profile or {}).get("skin_type", "Combination")
            concern = (profile or {}).get("primary_concern", "Acne")
            routine_res = routine_tool.execute(skin_type, concern)
            tool_results["routine"] = routine_res
            tool_logs.append({
                "tool": "RoutineGeneratorTool",
                "status": "Success",
                "summary": f"Formulated customized AM/PM routine for {skin_type} / {concern}"
            })

        # 6. RAG Knowledge Base Retrieval (Always run to ground response)
        rag_res = rag_tool.execute(query, top_k=2)
        tool_results["rag"] = rag_res
        tool_logs.append({
            "tool": "RAGKnowledgeBaseTool",
            "status": "Success",
            "summary": f"Retrieved {len(rag_res)} verified educational literature citations"
        })

        return {
            "results": tool_results,
            "logs": tool_logs
        }

    def run(
        self,
        user_message: str,
        image_bytes: Optional[bytes] = None,
        user_profile: Optional[Dict[str, Any]] = None,
        chat_history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Orchestrates full agent workflow:
        1. Tool execution
        2. Red-flag override
        3. LLM synthesis (Gemini or intelligent agent engine)
        4. Safety sanitization
        """
        # Step 1: Execute required tools
        tool_data = self.decide_and_execute_tools(user_message, image_bytes, user_profile)
        tool_results = tool_data["results"]
        tool_logs = tool_data["logs"]

        # Step 2: Red Flag Emergency Check
        if tool_results.get("safety", {}).get("has_red_flags"):
            safety_output = tool_results["safety"]["advisory"]
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

        if self.has_gemini and self.gemini_client:
            try:
                response_text = self._call_gemini(user_message, tool_results, chat_history)
            except Exception as e:
                print(f"[SkinovaAgent] Gemini API call error: {e}. Falling back to internal engine.")
                response_text = self._agent_reasoning_engine(user_message, tool_results, user_profile)
        else:
            response_text = self._agent_reasoning_engine(user_message, tool_results, user_profile)

        # Step 4: Guardrail Sanitization
        sanitized_response = safety_guardrail.sanitize_diagnostic_language(response_text)

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
        when an external API key is not present.
        """
        msg_lower = user_message.lower()
        parts = []

        # Greeting / Tone
        if any(w in msg_lower for w in ["hello", "hi", "hey", "who are you", "what can you do"]):
            return (
                "Hello! I'm **Skinova**, your AI skin health and education assistant. "
                "I'm here to help you understand your visible skin characteristics, explore active ingredients, "
                "build supportive daily routines, and make smarter skincare choices. "
                "\n\nYou can ask me about your skin analysis, how to safely layer ingredients (like Retinol and BHA), "
                "or why your skin might be experiencing excess oiliness or redness."
            )

        # Ingredient Analysis Query
        if "ingredient" in tool_results:
            ing_data = tool_results["ingredient"]
            analyzed = ing_data.get("ingredients_analyzed", [])
            conflicts = ing_data.get("conflicts_detected", [])
            synergies = ing_data.get("synergies_detected", [])

            parts.append("### Skinova's Ingredient Breakdown\n")
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

            parts.append(f"\n*{ing_data.get('general_guidance')}*")
            return "\n".join(parts)

        # Routine Request
        if "routine" in tool_results:
            routine_data = tool_results["routine"]
            am = routine_data.get("morning_routine", [])
            pm = routine_data.get("night_routine", [])

            parts.append("### Your Personalized Skinova Routine\n")
            parts.append("#### ☀️ Morning Routine (Protection & Hydration)")
            for step in am:
                parts.append(f"**Step {step['step']}: {step['category']}** — {step['product']}\n*{step['rationale']}*")

            parts.append("\n#### 🌙 Evening Routine (Clearing & Barrier Recovery)")
            for step in pm:
                parts.append(f"**Step {step['step']}: {step['category']}** — {step['product']}\n*{step['rationale']}*")

            parts.append(f"\n💡 **Skinova Tip**: {routine_data.get('expert_tip')}")
            return "\n".join(parts)

        # General Query Grounded with RAG
        rag_docs = tool_results.get("rag", [])
        if rag_docs:
            primary_doc = rag_docs[0]
            parts.append(f"Based on dermatological research on **{primary_doc['category']}**:\n")
            parts.append(primary_doc["content"])
            
            if profile:
                st = profile.get("skin_type", "Combination")
                pc = profile.get("primary_concern", "Breakouts")
                parts.append(
                    f"\n\n**Connecting with your profile ({st} / {pc})**: "
                    f"Prioritize gentle non-stripping cleansers and lightweight hydration. "
                    f"Introducing active ingredients slowly helps preserve your skin barrier while targeting {pc.lower()}."
                )

            parts.append("\n\n*Feel free to ask follow-up questions about specific products, layering, or gentle alternatives!*")
            return "\n".join(parts)

        return (
            "I've analyzed your question against our skincare educational knowledge base. "
            "To give you the most accurate guidance, let me know your skin type, what products you currently use, "
            "or whether you are looking for morning vs. evening routine recommendations."
        )

# Agent Singleton
skinova_agent = SkinovaAgent()
