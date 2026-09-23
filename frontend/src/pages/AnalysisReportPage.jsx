import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Sparkles, MessageSquare, ArrowRight, ShieldAlert, CheckCircle, Droplets, Sun, Moon, Info, AlertTriangle, BookOpen } from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

export default function AnalysisReportPage() {
  const { currentReport, setCurrentReport, pageParams, navigate } = useApp();
  const [report, setReport] = useState(currentReport);
  const [loading, setLoading] = useState(!currentReport);

  useEffect(() => {
    if (!report && pageParams?.id) {
      api.getReport(pageParams.id)
        .then(res => {
          setReport(res);
          setCurrentReport(res);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [pageParams?.id, report, setCurrentReport]);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <Sparkles size={36} className="spinner" style={{ color: 'var(--color-primary)', margin: '0 auto 16px' }} />
          <h3>Loading your Skinova Report...</h3>
        </div>
      </div>
    );
  }

  // Fallback sample if accessed directly without an upload
  const rep = report || {
    id: 'rep_demo',
    created_at: new Date().toISOString(),
    image_url: '/static/samples/sample_face_1.svg',
    skin_profile_snapshot: { skin_type: 'Combination', primary_concern: 'Acne-like breakouts', age_range: '25-34' },
    image_quality: { status: 'Good', notes: ['Clear natural lighting and balanced focus.'] },
    visible_skin_indicators: [
      { name: 'Acne-like breakouts', level: 'Moderate', color: 'amber' },
      { name: 'Oiliness / T-zone shine', level: 'High', color: 'blue' },
      { name: 'Visible redness', level: 'Mild', color: 'rose' },
      { name: 'Dryness / Flaking', level: 'Low', color: 'emerald' },
      { name: 'Visible pigmentation', level: 'Moderate', color: 'purple' },
      { name: 'Texture irregularities', level: 'Mild', color: 'slate' }
    ],
    overall_observation: 'Visual inspection reveals localized follicular congestion and surface oiliness concentrated across the forehead and perinasal areas, accompanied by mild superficial erythema and faint post-blemish pigmentation.',
    key_concerns: [
      'Visible indicators consistent with mild to moderate acne-like comedones.',
      'Elevated surface sebum resulting in noticeable T-zone shine.',
      'Scattered post-inflammatory pigmentary marks.'
    ],
    what_this_could_mean: 'Sebaceous gland activity combined with dead cell accumulation can cause pores to become visibly congested. As inflammatory blemishes heal, melanocytes may leave temporary dark marks (PIH).',
    general_skincare_guidance: [
      'Cleanse gently twice daily with a non-stripping foaming or gel cleanser.',
      'Incorporate 1-2% Salicylic Acid or 10% Azelaic Acid 2-3 nights per week.',
      'Hydrate with lightweight hyaluronic acid and barrier ceramides.',
      'Apply daily broad-spectrum SPF 30+ to prevent UV rays from darkening pigmentary marks.'
    ],
    suggested_routine: {
      morning_routine: [
        { step: 1, category: 'Cleanse', product: 'Gentle Foaming Cleanser', rationale: 'Removes overnight sebum without stripping lipid barrier.' },
        { step: 2, category: 'Treat', product: 'Niacinamide 3-5% Serum', rationale: 'Helps regulate surface sebum and soothes visible redness.' },
        { step: 3, category: 'Moisturize', product: 'Oil-Free Water Gel', rationale: 'Lightweight humectant hydration.' },
        { step: 4, category: 'Protect', product: 'Broad-Spectrum SPF 50', rationale: 'Essential photoprotection against UV-induced PIH.' }
      ],
      night_routine: [
        { step: 1, category: 'Cleanse', product: 'Gentle Cleanser', rationale: 'Thoroughly dissolves daily sunscreen and pollutants.' },
        { step: 2, category: 'Treatment', product: 'Salicylic Acid 2% (BHA)', rationale: 'Unclogs congested sebaceous pores (use 2-3 nights weekly).' },
        { step: 3, category: 'Repair', product: 'Ceramide Barrier Cream', rationale: 'Replenishes stratum corneum lipids during sleep.' }
      ]
    },
    ingredients_to_learn_about: [
      { name: 'Niacinamide (Vitamin B3)', rationale: 'Modulates sebum secretion and soothes visible redness without drying skin.' },
      { name: 'Salicylic Acid (BHA)', rationale: 'Lipophilic beta-hydroxy acid that penetrates lipid-rich follicles.' },
      { name: 'Azelaic Acid (10%)', rationale: 'Calms redness and helps fade post-inflammatory visible dark spots.' }
    ],
    things_to_watch_for: [
      'Stinging or peeling if exfoliating acids are used too frequently.',
      'Blemishes that feel warm, extremely tender, or cystic.'
    ],
    when_to_consider_professional_help: 'Seek direct evaluation by a board-certified dermatologist if you develop deep painful cystic lesions, rapidly changing or bleeding moles, or skin issues unresponsive to routine care.'
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Breadcrumb / Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '6px' }}>CONFIDENTIAL REPORT</span>
            <h1 style={{ fontSize: '2.2rem' }}>Your Skinova Report</h1>
            <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)' }}>
              Analysis ID: {rep.id} · Generated on {new Date(rep.created_at).toLocaleDateString()}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate('chat')}
              className="btn btn-primary"
            >
              <MessageSquare size={16} />
              Discuss Report with Skinova
            </button>
            <button
              onClick={() => navigate('analyze')}
              className="btn btn-secondary"
            >
              Upload Another Photo
            </button>
          </div>
        </div>

        {/* Prominent Medical Notice */}
        <MedicalDisclaimer />

        {/* Top Summary: Image + Profile Snapshot + Indicators */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {/* Photo & Quality Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '220px', height: '260px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)', marginBottom: '16px' }}>
              <img
                src={rep.image_url}
                alt="Analyzed face"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <span className="badge badge-emerald" style={{ marginBottom: '8px' }}>
              Quality: {rep.image_quality?.status || 'Good'}
            </span>
            <p style={{ fontSize: '12.5px', color: 'var(--color-text-light)' }}>
              {rep.image_quality?.notes?.[0] || 'Clear resolution and illumination.'}
            </p>
          </div>

          {/* Visible Skin Indicators Dashboard */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '17px' }}>Visible Skin Indicators</h3>
              <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>Visual Calibration</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {rep.visible_skin_indicators?.map((ind, i) => (
                <div key={i} style={{ background: 'var(--color-bg)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 600 }}>{ind.name}</span>
                    <span className={`badge badge-${ind.color}`}>{ind.level}</span>
                  </div>
                  <div className="indicator-track">
                    <div
                      className="indicator-fill"
                      style={{
                        width: ind.level === 'High' || ind.level === 'Elevated' ? '85%' : ind.level === 'Moderate' ? '55%' : '25%',
                        backgroundColor: ind.color === 'rose' ? '#D96B6B' : ind.color === 'amber' ? '#E28743' : ind.color === 'blue' ? '#4A88A9' : '#5E8E75'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Findings Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {/* Overall Observation */}
          <div className="card">
            <h3 style={{ fontSize: '17px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={18} style={{ color: 'var(--color-primary)' }} />
              Overall Observation
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.65, color: 'var(--color-text-main)', marginBottom: '16px' }}>
              {rep.overall_observation}
            </p>
            <div style={{ background: 'var(--color-bg)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
              <strong>Uncertainty Note:</strong> These observations represent computer vision surface indicators and must not be interpreted as histological or medical certainty.
            </div>
          </div>

          {/* Key Concerns & Meaning */}
          <div className="card">
            <h3 style={{ fontSize: '17px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} style={{ color: 'var(--color-primary)' }} />
              What This Could Mean
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.65, color: 'var(--color-text-main)', marginBottom: '16px' }}>
              {rep.what_this_could_mean}
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px' }}>
              {rep.key_concerns?.map((c, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Skincare Guidance & Suggested Routine */}
        <div className="card" style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '19px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} style={{ color: 'var(--color-primary)' }} />
            Suggested Personalized Routine
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            {/* AM Routine */}
            <div style={{ background: 'var(--color-bg)', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Sun size={20} style={{ color: '#D97706' }} />
                <h4 style={{ fontSize: '16px' }}>Morning (Protection & Hydration)</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {rep.suggested_routine?.morning_routine?.map(step => (
                  <div key={step.step} style={{ background: 'var(--color-surface)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 600 }}>Step {step.step}: {step.category}</div>
                    <div style={{ fontSize: '14px', color: 'var(--color-primary)', fontWeight: 500 }}>{step.product}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '2px' }}>{step.rationale}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* PM Routine */}
            <div style={{ background: 'var(--color-bg)', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Moon size={20} style={{ color: '#4F46E5' }} />
                <h4 style={{ fontSize: '16px' }}>Evening (Clarifying & Barrier Care)</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {rep.suggested_routine?.night_routine?.map(step => (
                  <div key={step.step} style={{ background: 'var(--color-surface)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 600 }}>Step {step.step}: {step.category}</div>
                    <div style={{ fontSize: '14px', color: 'var(--color-primary)', fontWeight: 500 }}>{step.product}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '2px' }}>{step.rationale}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ingredients to Learn About */}
          <h4 style={{ fontSize: '16px', marginBottom: '12px' }}>Key Ingredients to Learn About</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {rep.ingredients_to_learn_about?.map((ing, i) => (
              <div key={i} style={{ background: 'var(--color-bg)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <strong style={{ fontSize: '14px', color: 'var(--color-text-main)', display: 'block', marginBottom: '4px' }}>{ing.name}</strong>
                <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>{ing.rationale}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Red Flag & When to see a doctor banner */}
        <div className="card" style={{ borderLeft: '4px solid #E28743', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '17px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: '#9E5C16' }}>
            <AlertTriangle size={18} />
            When to Consider In-Person Professional Dermatological Help
          </h3>
          <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--color-text-main)', marginBottom: '12px' }}>
            {rep.when_to_consider_professional_help}
          </p>
          <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
            Symptoms such as deep cysts, acute pain, weeping or bleeding sores, or changing moles should never be treated solely with over-the-counter skincare.
          </div>
        </div>

        {/* Bottom CTA to chat */}
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <button
            onClick={() => navigate('chat')}
            className="btn btn-primary btn-lg"
          >
            <MessageSquare size={18} />
            Ask Skinova Any Questions About This Report
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
