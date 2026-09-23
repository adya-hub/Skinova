import React from 'react';
import { Sparkles, Cpu, BookOpen, ShieldCheck, Layers, GitBranch, ArrowRight } from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

export default function AboutPage() {
  const toolsList = [
    {
      name: 'SkinImageAnalysisTool',
      purpose: 'Multimodal computer vision pipeline that checks image illumination and focal sharpness, then extracts uncertainty-calibrated visible indicators (breakouts, oiliness, redness, pigment).'
    },
    {
      name: 'SkinProfileRetrievalTool',
      purpose: 'Retrieves user skin type, age group, breakout frequency, and lifestyle factors to inject personalized context into the agent reasoning loop.'
    },
    {
      name: 'RAGKnowledgeBaseTool',
      purpose: 'Indexes peer-reviewed dermatological educational documents via BM25/vector term-frequency retrieval to cite evidence-based literature.'
    },
    {
      name: 'IngredientCheckerTool',
      purpose: 'Evaluates active ingredient chemistry, identifying synergistic pairs (e.g. Niacinamide + HA) and flag potential conflicts (e.g. Retinol + Benzoyl Peroxide).'
    },
    {
      name: 'RoutineGeneratorTool',
      purpose: 'Formulates structured, step-by-step Morning and Evening regimens with dermatological rationales for each product category.'
    },
    {
      name: 'SafetyRedFlagCheckerTool',
      purpose: 'High-priority clinical guardrail that scans observations and user descriptions for emergency red flags (bleeding, rapid growth, acute pain, infection), advising immediate physician evaluation.'
    }
  ];

  return (
    <div className="page-wrapper">
      <div className="container-narrow">
        <MedicalDisclaimer />

        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '10px' }}>Platform Architecture</span>
          <h1 style={{ fontSize: '2.3rem', marginBottom: '10px' }}>About Skinova AI</h1>
          <p style={{ maxWidth: '620px', margin: '0 auto', fontSize: '15px' }}>
            Built as a modern, practical AI engineering project demonstrating multi-agent workflows, multimodal computer vision, RAG knowledge retrieval, and safety guardrails.
          </p>
        </div>

        {/* Mission Statement Card */}
        <div className="card" style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '12px', color: 'var(--color-primary)' }}>
            "Understand Your Skin. Make Smarter Choices."
          </h2>
          <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: 'var(--color-text-main)', marginBottom: '16px' }}>
            The global skincare ecosystem is saturated with conflicting marketing claims, aggressive actives, and confusing ingredient lists. 
            Skinova AI was conceived to give individuals clear, scientifically grounded, and uncertainty-aware skin education.
          </p>
          <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
            We explicitly reject the dangerous notion of "AI doctors." Skinova never claims to diagnose disease or prescribe medications. 
            Instead, it acts as an evidence-based education companion that translates visible surface characteristics into practical, safe skincare routines.
          </p>
        </div>

        {/* Agentic Architecture Section */}
        <div className="card" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Cpu size={20} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: '19px' }}>AI Agent Architecture</h3>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
            Skinova does not use a single monolithic LLM prompt. Instead, requests flow through an agent orchestrator that dynamically selects specialized modular tools:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {toolsList.map((t, idx) => (
              <div key={idx} style={{ background: 'var(--color-bg)', padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                <strong style={{ fontSize: '14.5px', color: 'var(--color-text-main)', display: 'block', marginBottom: '4px' }}>
                  🔧 {t.name}
                </strong>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  {t.purpose}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Highlights for AI Portfolio */}
        <div className="card">
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Engineering Highlights</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div style={{ background: 'var(--color-bg)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <strong style={{ fontSize: '13.5px', display: 'block', color: 'var(--color-text-main)' }}>Multimodal Vision</strong>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Clarity checks & feature extraction</span>
            </div>
            <div style={{ background: 'var(--color-bg)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <strong style={{ fontSize: '13.5px', display: 'block', color: 'var(--color-text-main)' }}>RAG Grounding</strong>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>BM25 term retrieval & literature citations</span>
            </div>
            <div style={{ background: 'var(--color-bg)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <strong style={{ fontSize: '13.5px', display: 'block', color: 'var(--color-text-main)' }}>Safety Guardrails</strong>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Red-flag detection & non-diagnostic phrasing</span>
            </div>
            <div style={{ background: 'var(--color-bg)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <strong style={{ fontSize: '13.5px', display: 'block', color: 'var(--color-text-main)' }}>FastAPI & React</strong>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Async modular micro-services architecture</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
