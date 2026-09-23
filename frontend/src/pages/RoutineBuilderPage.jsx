import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Sun, Moon, Sparkles, CheckCircle2, RefreshCw, Info, ShieldCheck } from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

export default function RoutineBuilderPage() {
  const { profile, user } = useApp();
  const [selectedSkinType, setSelectedSkinType] = useState(profile?.skin_type || 'Combination');
  const [selectedConcern, setSelectedConcern] = useState(profile?.primary_concern || 'Acne-like breakouts');
  const [routineData, setRoutineData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRoutine = async (st, c) => {
    setLoading(true);
    try {
      const res = await api.buildRoutine(st, c, user.id);
      setRoutineData(res.routine);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutine(selectedSkinType, selectedConcern);
  }, [selectedSkinType, selectedConcern]);

  return (
    <div className="page-wrapper">
      <div className="container">
        <MedicalDisclaimer compact={true} />

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '10px' }}>Personalized Regimen</span>
          <h1 style={{ fontSize: '2.3rem', marginBottom: '10px' }}>Build My Skincare Routine</h1>
          <p style={{ maxWidth: '620px', margin: '0 auto', fontSize: '15px' }}>
            Structured morning and evening steps tailored to your skin type, with clear scientific rationale for each step.
          </p>
        </div>

        {/* Customization Filter Bar */}
        <div className="card" style={{ marginBottom: '32px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--color-text-light)', display: 'block', marginBottom: '4px' }}>Target Skin Type</span>
              <select
                className="form-select"
                value={selectedSkinType}
                onChange={(e) => setSelectedSkinType(e.target.value)}
                style={{ width: '180px' }}
              >
                <option value="Combination">Combination</option>
                <option value="Oily">Oily</option>
                <option value="Dry">Dry</option>
                <option value="Normal">Normal</option>
                <option value="Sensitive">Sensitive</option>
              </select>
            </div>

            <div>
              <span style={{ fontSize: '12px', color: 'var(--color-text-light)', display: 'block', marginBottom: '4px' }}>Primary Focus</span>
              <select
                className="form-select"
                value={selectedConcern}
                onChange={(e) => setSelectedConcern(e.target.value)}
                style={{ width: '220px' }}
              >
                <option value="Acne-like breakouts">Acne-like breakouts</option>
                <option value="Hyperpigmentation">Dark Spots / Pigmentation</option>
                <option value="Redness & Sensitivity">Redness & Sensitivity</option>
                <option value="Dryness & Flaking">Dryness & Flaking</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => fetchRoutine(selectedSkinType, selectedConcern)}
            className="btn btn-secondary btn-sm"
          >
            <RefreshCw size={14} />
            Regenerate Routine
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Sparkles size={32} className="spinner" style={{ color: 'var(--color-primary)', margin: '0 auto 12px' }} />
            <p>Formulating customized morning and night routines...</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
            {/* Morning Routine Card */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sun size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px' }}>Morning Routine</h3>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>Protection, Antioxidants & Hydration</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {routineData?.morning_routine?.map(step => (
                  <div key={step.step} style={{ background: 'var(--color-bg)', padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span className="badge badge-primary">STEP {step.step}: {step.category}</span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-main)', marginTop: '4px' }}>
                      {step.product}
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
                      <strong>Why this step:</strong> {step.rationale}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Night Routine Card */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Moon size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px' }}>Evening Routine</h3>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>Clearing, Cell Turnover & Barrier Repair</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {routineData?.night_routine?.map(step => (
                  <div key={step.step} style={{ background: 'var(--color-bg)', padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span className="badge badge-primary">STEP {step.step}: {step.category}</span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-main)', marginTop: '4px' }}>
                      {step.product}
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
                      <strong>Why this step:</strong> {step.rationale}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Expert Tip Footer */}
        {routineData?.expert_tip && (
          <div className="card" style={{ marginTop: '28px', background: 'var(--color-primary-light)', borderColor: 'var(--color-primary-border)', color: 'var(--color-primary)' }}>
            <strong>💡 Skinova Dermatological Principle:</strong> {routineData.expert_tip}
          </div>
        )}
      </div>
    </div>
  );
}
