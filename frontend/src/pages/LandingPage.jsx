import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, ShieldCheck, Eye, Cpu, HelpCircle, CheckCircle2, Droplets, Sun, Layers } from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

export default function LandingPage() {
  const { navigate } = useApp();

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
      title: 'AI Multi-Agent Analysis',
      desc: 'Our vision and knowledge tools assess visible indicators like redness, oiliness, texture, and congestion.',
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
    <div className="page-wrapper">
      <div className="container">
        {/* Medical Disclaimer Banner */}
        <MedicalDisclaimer />

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-pill">
            <Sparkles size={15} />
            <span>Introducing Skinova AI · Skincare Intelligence</span>
          </div>

          <h1 className="hero-title">
            Meet Skinova — Your <span>AI Skin Health</span> Assistant
          </h1>

          <p className="hero-subtitle">
            Analyze visible skin characteristics, understand your concerns, and get personalized skincare guidance powered by AI.
          </p>

          <div className="hero-ctas">
            <button
              onClick={() => navigate('profile')}
              className="btn btn-soft btn-lg"
            >
              Create Your Skin Profile
            </button>
            <button
              onClick={() => navigate('analyze')}
              className="btn btn-primary btn-lg"
            >
              Analyze My Skin
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-secondary btn-lg"
            >
              How It Works
            </button>
          </div>

          {/* Elegant Visual Card Preview (AI + Skincare) */}
          <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'center' }}>
            <div
              className="card"
              style={{
                maxWidth: '780px',
                width: '100%',
                padding: '28px',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #F9FAF7 100%)',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="brand-icon" style={{ width: '38px', height: '38px' }}>
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Skinova Visual Analysis Engine</h3>
                    <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>Calibrated multi-indicator cutaneous scan</p>
                  </div>
                </div>
                <span className="badge badge-primary">Sample Analysis Snapshot</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: 'var(--color-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Breakout Indicators</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-amber-text)' }}>Moderate</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--color-text-light)', marginTop: '4px' }}>Scattered follicular congestion</div>
                </div>

                <div style={{ background: 'var(--color-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Surface Oiliness</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-blue-text)' }}>Elevated T-Zone</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--color-text-light)', marginTop: '4px' }}>Localized forehead & nose shine</div>
                </div>

                <div style={{ background: 'var(--color-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Visible Redness</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-rose-text)' }}>Mild</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--color-text-light)', marginTop: '4px' }}>Superficial peri-nasal flush</div>
                </div>
              </div>

              <div style={{ background: 'var(--color-primary-light)', padding: '14px 18px', borderRadius: 'var(--radius-md)', fontSize: '13.5px', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>✨ <strong>Skinova Suggestion:</strong> Niacinamide 3% + Salicylic Acid 1-2% on alternating evenings.</span>
                <button
                  onClick={() => navigate('analyze')}
                  className="btn btn-primary btn-sm"
                  style={{ marginLeft: '12px' }}
                >
                  Try With Your Photo
                </button>
              </div>
            </div>
          </div>

          {/* Create Your Profile on Skinova Spotlight */}
          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
            <div
              className="card card-hover"
              style={{
                maxWidth: '780px',
                width: '100%',
                padding: '22px 28px',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F2F7F4 100%)',
                border: '1px solid var(--color-primary-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Layers size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '3px' }}>Create Your Profile on Skinova</h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    Share your skin type, concerns, and routine so Skinova can personalize every analysis and recommendation.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('profile')}
                className="btn btn-primary"
              >
                Create Skin Profile →
              </button>
            </div>
          </div>
        </section>

        {/* How Skinova Works (5 Steps) */}
        <section id="how-it-works" style={{ padding: '60px 0' }}>
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
                <div key={st.step} className="card card-hover" style={{ position: 'relative' }}>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: 'var(--color-accent)',
                      marginBottom: '14px',
                      letterSpacing: '0.05em'
                    }}
                  >
                    STEP {st.step}
                  </div>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
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

        {/* Pillars / Trust Section */}
        <section style={{ padding: '50px 0 30px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge badge-emerald" style={{ marginBottom: '12px' }}>Responsible AI Engineering</span>
            <h2 style={{ fontSize: '2.1rem', marginBottom: '12px' }}>Built on Scientific Trust & Patient Safety</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto' }}>
              We believe AI in healthcare and wellness must be transparent, non-diagnostic, and scientifically accountable.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {pillars.map((p, i) => (
              <div key={i} className="card">
                <span className="badge badge-primary" style={{ marginBottom: '14px' }}>{p.badge}</span>
                <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>{p.title}</h3>
                <p style={{ fontSize: '13.5px', lineHeight: 1.55 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Ready to start CTA Banner */}
        <section style={{ margin: '60px 0 20px' }}>
          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, #2D5A46 0%, #3B725A 100%)',
              color: 'white',
              textAlign: 'center',
              padding: '50px 30px',
              borderRadius: 'var(--radius-xl)'
            }}
          >
            <h2 style={{ color: 'white', fontSize: '2.3rem', marginBottom: '14px' }}>
              Understand Your Skin. Make Smarter Choices.
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.85)', maxWidth: '580px', margin: '0 auto 28px', fontSize: '15px' }}>
              Begin your personalized skin analysis today and receive educational insights tailored to your skin profile.
            </p>
            <button
              onClick={() => navigate('analyze')}
              className="btn btn-secondary btn-lg"
              style={{ fontWeight: 700, color: 'var(--color-primary)' }}
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
