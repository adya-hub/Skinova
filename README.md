# Skinova AI 🌿

> **"Understand Your Skin. Make Smarter Choices."**

Skinova AI is a production-grade, AI-powered **skin health analysis and skincare education assistant**. It allows users to securely upload skin/face photos, input a personalized skin profile, and receive an uncertainty-aware analysis of visible skin characteristics, scientific ingredient breakdowns, and custom morning/night routines.

---

## ⚠️ Important Healthcare & Medical Disclaimer

> **Skinova AI provides educational information and visible characteristic observations based on images and user input. It does NOT diagnose skin disease, prescribe medication, or replace a board-certified dermatologist.**  
> All reports use calibrated uncertainty language (*"Visible indicators consistent with acne-like breakouts"*), accompanied by automated clinical red-flag guardrails recommending professional in-person medical care for concerning symptoms (bleeding, rapid lesion changes, severe pain, infection signs).

---

## 🏛️ AI Agent Architecture

Unlike static chatbots that pass user prompts directly to a single LLM call, Skinova AI operates as an **autonomous multi-tool agent**:

```
                       ┌───────────────────────────────┐
                       │          User Input           │
                       └───────────────┬───────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │       Skinova AI Agent        │
                       │         (Orchestrator)        │
                       └───────┬───────────────┬───────┘
                               │               │
      ┌────────────────────────┴─┐   ┌─────────┴─────────────────────┐
      │   SkinImageAnalysisTool   │   │     RAGKnowledgeBaseTool      │
      │  (Resolution, Lighting,  │   │   (BM25 Semantic Retrieval    │
      │   Colorimetry, Features)  │   │  over Curated Skincare Docs)  │
      └──────────────────────────┘   └───────────────────────────────┘
                               │               │
      ┌────────────────────────┴─┐   ┌─────────┴─────────────────────┐
      │  IngredientCheckerTool   │   │  SafetyRedFlagCheckerTool     │
      │ (Synergies & Conflicts)  │   │   (Emergency Symptom Filter)  │
      └──────────────────────────┘   └───────────────────────────────┘
                               │               │
                               ▼               ▼
                       ┌───────────────────────────────┐
                       │     LLM / Reasoning Engine    │
                       │    (Gemini 2.0 Flash / Agent) │
                       └───────────────┬───────────────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │   Sanitized, Cited Response   │
                       └───────────────────────────────┘
```

### Modular Tools
1. **`SkinImageAnalysisTool`**: Analyzes lighting, focus, exposure, and computes visible indicators (Breakouts, Oiliness, Redness, Dryness, Pigmentation, Texture).
2. **`SkinProfileRetrievalTool`**: Injects user skin type, concerns, age range, breakout frequency, and current routine into the reasoning loop.
3. **`RAGKnowledgeBaseTool`**: Retrieves peer-reviewed educational literature (Acne, Barrier Repair, TEWL, Hyperpigmentation, SPF, Active Compatibility) with source citations.
4. **`IngredientCheckerTool`**: Analyzes multi-active combinations (e.g. Retinol + BHA, Vitamin C + Ceramides), flags irritants, and suggests cautious introduction protocols.
5. **`RoutineGeneratorTool`**: Generates AM and PM structured steps (Cleanse, Treat, Moisturize, Protect) with scientific rationales for each product category.
6. **`SafetyRedFlagCheckerTool`**: Automated clinical filter screening for severe symptoms requiring immediate dermatologist or emergency evaluation.

---

## 🌟 Key Application Features

1. **Modern Wellness UI**: Calm, trustworthy sage green/ivory aesthetic (`#2D5A46`, `#F8F9F6`), custom typography (Plus Jakarta Sans), responsive cards, and zero distracting neon elements.
2. **Interactive 5-Step Workflow**: Image upload, profile configuration, multi-stage animated processing, visual report generation, and AI follow-up chat.
3. **Uncertainty-Aware Visual Dashboard**: Meters for visible breakout tendencies, surface oiliness, erythema, dryness, and pigmentation without claiming diagnostic scores.
4. **"Ask Skinova" AI Chat**: Interactive assistant with suggested prompt pills, conversation history, transparent tool execution badges, and scientific literature citations.
5. **Ingredient Synergy Matrix**: Compatibility analysis and product label OCR simulation.
6. **Personalized AM/PM Routine Builder**: Step-by-step regimens customized to specific skin types and concerns.
7. **Visual Progress Tracking**: Multi-week timeline (Week 1, Week 2, Week 4, Week 8) with side-by-side photo comparison and indicator trend deltas.
8. **Data Privacy & Erasure**: Ephemeral photo retention with one-click data deletion.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Backend Setup
```bash
# Navigate to project root
cd "Skin Agent"

# Install python dependencies (if not already installed)
pip install fastapi uvicorn pydantic httpx pillow python-multipart python-dotenv google-genai

# (Optional) Set your Gemini API key in .env
# If omitted, Skinova executes smoothly using its built-in intelligent reasoning engine
cp .env.example .env

# Start the FastAPI server on port 8000
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```

### 2. Frontend Setup
```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Visit **`http://localhost:5173`** in your browser to experience Skinova AI!

---

## 📁 Repository Structure

```
Skin Agent/
├── backend/
│   ├── app/
│   │   ├── agent/
│   │   │   ├── orchestrator.py      # SkinovaAgent orchestrator
│   │   │   ├── tools.py             # Modular agent tools
│   │   │   └── safety_guardrail.py  # Red-flag & non-diagnostic guardrails
│   │   ├── rag/
│   │   │   ├── knowledge_data.py    # Curated clinical skincare docs
│   │   │   └── retriever.py         # BM25 / token matching RAG retriever
│   │   ├── api/
│   │   │   ├── routes_auth.py       # Auth & Profile endpoints
│   │   │   ├── routes_analysis.py   # Multi-stage image analysis
│   │   │   ├── routes_chat.py       # "Ask Skinova" chat endpoint
│   │   │   ├── routes_ingredients.py# Ingredient checker & OCR
│   │   │   ├── routes_routine.py    # AM/PM routine builder
│   │   │   ├── routes_progress.py   # Skin progress tracking
│   │   │   └── routes_privacy.py    # Privacy & data erasure
│   │   ├── data/
│   │   │   └── storage.py           # Local persistence store
│   │   ├── config.py                # Environment configuration
│   │   └── main.py                  # FastAPI application entrypoint
│   ├── static/samples/              # Verified sample skin images
│   └── uploads/                     # Ephemeral user uploads
├── frontend/
│   ├── src/
│   │   ├── components/              # Navbar, Footer, MedicalDisclaimer
│   │   ├── context/                 # AppContext global state
│   │   ├── pages/                   # 13 Application Views & Pages
│   │   ├── services/api.js          # Unified API client
│   │   ├── index.css                # Healthcare/wellness design system
│   │   └── App.jsx                  # Main application router
│   ├── index.html                   # HTML template with Google Fonts
│   └── vite.config.js               # Vite config with backend proxy
├── .env.example
└── README.md
```
