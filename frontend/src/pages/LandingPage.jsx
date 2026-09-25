import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Eye,
  Cpu,
  HelpCircle,
  CheckCircle2,
  Droplets,
  Sun,
  Layers,
  Zap,
  Activity,
  Compass,
  FlaskConical,
  Microscope,
  Check
} from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import Skinova3DHero from '../components/Skinova3DHero';
import SkinLayer3DExplorer from '../components/SkinLayer3DExplorer';
import Molecule3DViewer from '../components/Molecule3DViewer';

export default function LandingPage() {
  const { navigate } = useApp();
  const [activeLabTab, setActiveLabTab] = useState('layers'); // 'layers' | 'molecules'
  const [selectedHotspotData, setSelectedHotspotData] = useState(null);

  const steps = [
    {
      step: '01',
      title: 'Upload a Clear Skin Image',
      desc: 'Take or upload a high-resolution photo with balanced natural lighting and minimal filters.',
      icon: Eye
    },
    {
      step: '02',
      title: 'Share Your Skin Profile',
      desc: 'Tell Skinova your skin type, primary concerns, breakout frequency, and current routine.',
      icon: Layers
    },
    {
      step: '03',
      title: 'AI Multi-Agent 3D Analysis',
      desc: 'Our vision and knowledge tools assess visible indicators like redness, oiliness, texture, and congestion in 3D.',
      icon: Cpu
    },
    {
      step: '04',
      title: 'Receive Your Skinova Report',
      desc: 'Explore non-diagnostic observations, active ingredient education, and an AM/PM regimen.',
      icon: CheckCircle2
    },
    {
      step: '05',
      title: 'Ask Skinova Follow-ups',
      desc: 'Chat directly with Skinova to ask about ingredient pairings, skin barrier care, or product advice.',
      icon: HelpCircle
    }
  ];

  const pillars = [
    {
      title: 'Uncertainty-Aware Language',
      desc: 'Skinova reports visible cutaneous indicators rather than asserting definitive medical diagnoses.',
      badge: 'Responsible AI'
    },
    {
      title: 'RAG Knowledge Grounding',
      desc: 'Responses are cross-referenced with peer-reviewed dermatological literature and evidence-based science.',
      badge: 'Evidence-Based'
    },
    {
      title: 'Clinical Safety Guardrails',
      desc: 'Automated red-flag detection advises immediate evaluation from board-certified dermatologists for severe symptoms.',
      badge: 'Safety-First'
    },
    {
      title: 'Zero-Retention Privacy',
      desc: 'Your facial photos are processed securely with optional one-click erasure of all images and data.',
      badge: 'Privacy by Design'
    }
  ];

  return (
    <div className="page-wrapper aurora-hero-bg">
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Medical Disclaimer Banner */}
        <MedicalDisclaimer />

        {/* ========================================================
            HERO SECTION: High-Impact Split Layout with 3D Canvas
            ======================================================== */}
        <section style={{ padding: '30px 0 60px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'center'
            }}
          >
            {/* Left Column: Headlines & Actions */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-primary-border)',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 14px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: 'var(--color-primary)',
                  marginBottom: '20px',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <span className="live-radar-dot" />
                <span>Next-Gen 3D Dermal Intelligence</span>
                <span style={{ background: 'var(--color-primary-light)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '11px' }}>
                  AI Core 2.0
                </span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 4vw, 3.4rem)',
                  fontWeight: 800,
                  lineHeight: 1.12,
                  letterSpacing: '-0.03em',
                  marginBottom: '20px',
                  color: 'var(--color-text-main)'
                }}
              >
                Meet Skinova — <br />
                <span className="gradient-text-emerald">AI Skincare Intelligence</span> with Interactive 3D
              </h1>

              <p
                style={{
                  fontSize: '16.5px',
                  lineHeight: 1.6,
                  color: 'var(--color-text-muted)',
                  marginBottom: '32px',
                  maxWidth: '540px'
                }}
              >
                Analyze visible cutaneous characteristics, explore 3D cellular layers, inspect active molecules, and receive scientifically grounded skincare guidance.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '36px' }}>
                <button
                  onClick={() => navigate('analyze')}
                  className="btn btn-primary btn-lg"
                  style={{
                    boxShadow: '0 4px 18px rgba(45, 90, 70, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <Sparkles size={18} />
                  Analyze My Skin
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => navigate('profile')}
                  className="btn btn-secondary btn-lg"
                >
                  Create Skin Profile
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('interactive-3d-lab');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn btn-soft btn-lg"
                  style={{ fontWeight: 600 }}
                >
                  <Compass size={17} />
                  Explore 3D Lab
                </button>
              </div>

              {/* Telemetry Snapshot Ticker */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: '20px'
                }}
              >
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary)' }}>14+</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Cutaneous Markers</div>
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-accent)' }}>3D WebGL</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Biometric Engine</div>
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-emerald-text)' }}>100%</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Zero Data Retention</div>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Holographic Model Viewer */}
            <div>
              <Skinova3DHero
                onHotspotClick={(hotspot) => setSelectedHotspotData(hotspot)}
              />
            </div>
          </div>
        </section>

        {/* ========================================================
            SAMPLE ANALYSIS SNAPSHOT (Holographic Preview)
            ======================================================== */}
        <section style={{ margin: '20px 0 50px' }}>
          <div
            className="feature-card-3d"
            style={{
              padding: '28px',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAF7 100%)',
              border: '1px solid var(--color-primary-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="brand-icon" style={{ width: '40px', height: '40px' }}>
                  <Sparkles size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700 }}>Skinova Visual Analysis Engine</h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Calibrated multi-indicator cutaneous scan</p>
                </div>
              </div>
              <span className="badge badge-primary">
                <Activity size={13} /> Sample Analysis Snapshot
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div style={{ background: 'var(--color-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Breakout Indicators</div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-amber-text)' }}>Moderate</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '4px' }}>Scattered follicular congestion in T-zone</div>
              </div>

              <div style={{ background: 'var(--color-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Surface Oiliness</div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-blue-text)' }}>Elevated T-Zone</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '4px' }}>Localized forehead & nose shine</div>
              </div>

              <div style={{ background: 'var(--color-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Visible Redness</div>
                <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-rose-text)' }}>Mild</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '4px' }}>Superficial peri-nasal erythema</div>
              </div>
            </div>

            <div
              style={{
                background: 'var(--color-primary-light)',
                padding: '14px 20px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13.5px',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <span>
                ✨ <strong>Skinova Suggestion:</strong> Niacinamide 3% + Salicylic Acid 1-2% on alternating evenings for follicular clearance.
              </span>
              <button
                onClick={() => navigate('analyze')}
                className="btn btn-primary btn-sm"
              >
                Scan Your Skin Now
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================
            DEDICATED 3D LAB SECTION (Interactive Graphics)
            ======================================================== */}
        <section id="interactive-3d-lab" style={{ padding: '40px 0 60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span
              className="badge"
              style={{
                background: 'linear-gradient(135deg, #1B4D3E, #2D5A46)',
                color: '#58FFC4',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginBottom: '12px'
              }}
            >
              <Sparkles size={13} /> INTERACTIVE 3D DERMAL LAB
            </span>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '14px' }}>
              Explore Skin Layers & Active Chemistry in 3D
            </h2>
            <p style={{ maxWidth: '640px', margin: '0 auto', fontSize: '15px' }}>
              Rotate 3D cross-sections of the skin barrier or inspect molecular structures of key skincare actives to understand how treatments work under the surface.
            </p>

            {/* Lab Switcher Tabs */}
            <div style={{ display: 'inline-flex', gap: '8px', marginTop: '24px', background: 'var(--color-surface)', padding: '6px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-xs)' }}>
              <button
                onClick={() => setActiveLabTab('layers')}
                className={`btn btn-sm ${activeLabTab === 'layers' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)', padding: '8px 18px' }}
              >
                <Layers size={15} /> 3D Skin Layer Explorer
              </button>
              <button
                onClick={() => setActiveLabTab('molecules')}
                className={`btn btn-sm ${activeLabTab === 'molecules' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)', padding: '8px 18px' }}
              >
                <FlaskConical size={15} /> 3D Bioactive Molecules
              </button>
            </div>
          </div>

          {/* Render Active 3D Component */}
          <div style={{ maxWidth: '940px', margin: '0 auto' }}>
            {activeLabTab === 'layers' ? (
              <SkinLayer3DExplorer />
            ) : (
              <Molecule3DViewer initialMolecule="salicylic" />
            )}
          </div>
        </section>

        {/* ========================================================
            HOW SKINOVA WORKS (5 High-Tech Steps)
            ======================================================== */}
        <section id="how-it-works" style={{ padding: '40px 0 60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="badge badge-primary" style={{ marginBottom: '12px' }}>Intuitive Flow</span>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '14px' }}>How Skinova Works</h2>
            <p style={{ maxWidth: '620px', margin: '0 auto', fontSize: '15px' }}>
              From initial photo assessment to evidence-based skincare guidance, Skinova keeps you informed at every step.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '20px' }}>
            {steps.map((st) => {
              const IconComponent = st.icon;
              return (
                <div key={st.step} className="feature-card-3d" style={{ position: 'relative' }}>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 800,
                      color: 'var(--color-accent)',
                      marginBottom: '14px',
                      letterSpacing: '0.06em'
                    }}
                  >
                    STEP {st.step}
                  </div>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'var(--color-primary-light)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px'
                    }}
                  >
                    <IconComponent size={22} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{st.title}</h3>
                  <p style={{ fontSize: '13px', lineHeight: 1.55 }}>{st.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================
            PILLARS / TRUST SECTION
            ======================================================== */}
        <section style={{ padding: '30px 0 50px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge badge-emerald" style={{ marginBottom: '12px' }}>Responsible AI Engineering</span>
            <h2 style={{ fontSize: '2.1rem', marginBottom: '12px' }}>Built on Scientific Trust & Patient Safety</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto' }}>
              We believe AI in healthcare and wellness must be transparent, non-diagnostic, and scientifically accountable.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {pillars.map((p, i) => (
              <div key={i} className="feature-card-3d">
                <span className="badge badge-primary" style={{ marginBottom: '14px' }}>{p.badge}</span>
                <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>{p.title}</h3>
                <p style={{ fontSize: '13.5px', lineHeight: 1.55 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================
            CALL TO ACTION BANNER
            ======================================================== */}
        <section style={{ margin: '40px 0 20px' }}>
          <div
            className="glass-card-3d"
            style={{
              background: 'linear-gradient(135deg, #1B3F30 0%, #2D5A46 50%, #3B725A 100%)',
              color: 'white',
              textAlign: 'center',
              padding: '50px 30px',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 20px 45px rgba(27, 63, 48, 0.35)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '240px',
                height: '240px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(88, 255, 196, 0.2) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />

            <h2 style={{ color: 'white', fontSize: '2.4rem', marginBottom: '14px' }}>
              Understand Your Skin. Make Smarter Choices.
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.88)', maxWidth: '580px', margin: '0 auto 28px', fontSize: '15.5px' }}>
              Begin your personalized skin analysis today and receive educational insights tailored to your skin profile in interactive 3D.
            </p>
            <button
              onClick={() => navigate('analyze')}
              className="btn btn-secondary btn-lg"
              style={{ fontWeight: 700, color: 'var(--color-primary)', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' }}
            >
              Analyze My Skin Now
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
