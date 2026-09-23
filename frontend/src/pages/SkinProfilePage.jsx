import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Save, CheckCircle2, User, Layers, Shield } from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

export default function SkinProfilePage() {
  const { profile, updateProfileContext, navigate } = useApp();
  const [formData, setFormData] = useState({
    skin_type: profile?.skin_type || 'Combination',
    primary_concern: profile?.primary_concern || 'Acne-like breakouts',
    secondary_concerns: profile?.secondary_concerns || ['Visible dark spots'],
    age_range: profile?.age_range || '25-34',
    current_routine: profile?.current_routine || 'Basic Cleanser & Moisturizer',
    products_used: Array.isArray(profile?.products_used) ? profile.products_used.join(', ') : (profile?.products_used || ''),
    breakout_frequency: profile?.breakout_frequency || '1-2 times per month',
    sun_exposure: profile?.sun_exposure || 'Moderate (outdoor walks 3-4 days/week)',
    lifestyle_notes: profile?.lifestyle_notes || 'Adequate hydration, indoor office environment'
  });

  const [saving, setSaving] = useState(false);

  const skinTypes = ['Combination', 'Oily', 'Dry', 'Normal', 'Sensitive'];
  const ageRanges = ['Under 18', '18-24', '25-34', '35-44', '45-54', '55+'];
  const primaryConcerns = [
    'Acne-like breakouts',
    'Visible dark spots & hyperpigmentation',
    'Visible redness & reactivity',
    'Surface dryness & flaking',
    'Enlarged visible pores & shine',
    'Fine lines & skin elasticity'
  ];
  const secondaryOptions = [
    'Visible dark spots',
    'Redness around nose/cheeks',
    'Uneven skin texture',
    'Clogged pores/blackheads',
    'Occasional tightness',
    'Sun spots'
  ];

  const handleSecondaryToggle = (concern) => {
    const current = formData.secondary_concerns || [];
    if (current.includes(concern)) {
      setFormData({ ...formData, secondary_concerns: current.filter(c => c !== concern) });
    } else {
      setFormData({ ...formData, secondary_concerns: [...current, concern] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...formData,
      products_used: formData.products_used.split(',').map(p => p.trim()).filter(Boolean)
    };
    await updateProfileContext(payload);
    setSaving(false);
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <MedicalDisclaimer compact={true} />

        <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: 600, fontSize: '13.5px', marginBottom: '4px' }}>
              <User size={16} />
              <span>Personalized Skin Identity</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Create Your Profile on Skinova</h1>
            <p style={{ maxWidth: '640px' }}>
              Configure your skin characteristics, current routine, and concerns so Skinova can ground every analysis and routine recommendation.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  skin_type: 'Combination',
                  primary_concern: 'Acne-like breakouts',
                  secondary_concerns: ['Visible dark spots'],
                  age_range: '25-34',
                  current_routine: '',
                  products_used: '',
                  breakout_frequency: '1-2 times per month',
                  sun_exposure: 'Moderate',
                  lifestyle_notes: ''
                });
              }}
              className="btn btn-secondary btn-sm"
              title="Reset form to create a new profile from scratch"
            >
              Start New Profile
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  skin_type: 'Combination',
                  primary_concern: 'Acne-like breakouts',
                  secondary_concerns: ['Visible dark spots', 'Mild redness around nose'],
                  age_range: '25-34',
                  current_routine: 'Gentle foam cleanser, hyaluronic serum, lightweight moisturizer',
                  products_used: 'CeraVe Foaming Cleanser, Niacinamide Serum, SPF 50',
                  breakout_frequency: '1-2 times per month',
                  sun_exposure: 'Moderate (outdoor walks 3-4 days/week)',
                  lifestyle_notes: 'Adequate hydration, indoor office environment'
                });
              }}
              className="btn btn-soft btn-sm"
              title="Load recommended default profile preset"
            >
              Load Recommended Preset
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {/* Form Column */}
          <div className="card">
            <form onSubmit={handleSubmit}>
              {/* Age Range */}
              <div className="form-group">
                <label className="form-label">Age Range</label>
                <select
                  className="form-select"
                  value={formData.age_range}
                  onChange={(e) => setFormData({ ...formData, age_range: e.target.value })}
                >
                  {ageRanges.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              {/* Skin Type */}
              <div className="form-group">
                <label className="form-label">Skin Type</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {skinTypes.map(st => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setFormData({ ...formData, skin_type: st })}
                      className={`btn btn-sm ${formData.skin_type === st ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Concern */}
              <div className="form-group">
                <label className="form-label">Primary Skin Concern</label>
                <select
                  className="form-select"
                  value={formData.primary_concern}
                  onChange={(e) => setFormData({ ...formData, primary_concern: e.target.value })}
                >
                  {primaryConcerns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Secondary Concerns */}
              <div className="form-group">
                <label className="form-label">Secondary Concerns (Select all that apply)</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {secondaryOptions.map(sec => {
                    const selected = formData.secondary_concerns.includes(sec);
                    return (
                      <button
                        type="button"
                        key={sec}
                        onClick={() => handleSecondaryToggle(sec)}
                        className={`btn btn-sm ${selected ? 'btn-soft' : 'btn-secondary'}`}
                        style={selected ? { borderColor: 'var(--color-primary)', fontWeight: 600 } : {}}
                      >
                        {selected ? '✓ ' : ''}{sec}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Breakout Frequency */}
              <div className="form-group">
                <label className="form-label">Frequency of Breakouts</label>
                <select
                  className="form-select"
                  value={formData.breakout_frequency}
                  onChange={(e) => setFormData({ ...formData, breakout_frequency: e.target.value })}
                >
                  <option value="Rarely or never">Rarely or never</option>
                  <option value="1-2 times per month">1-2 times per month (hormonal or stress-related)</option>
                  <option value="Weekly / Frequent">Weekly / Frequent</option>
                  <option value="Continuous persistent breakouts">Continuous persistent breakouts</option>
                </select>
              </div>

              {/* Current Routine */}
              <div className="form-group">
                <label className="form-label">Current Skincare Routine</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.current_routine}
                  onChange={(e) => setFormData({ ...formData, current_routine: e.target.value })}
                  placeholder="e.g., Gentle foam cleanser, moisturizer, occasional sunscreen"
                />
              </div>

              {/* Products currently used */}
              <div className="form-group">
                <label className="form-label">Key Products Currently Used</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.products_used}
                  onChange={(e) => setFormData({ ...formData, products_used: e.target.value })}
                  placeholder="e.g., CeraVe Foaming Cleanser, Niacinamide Serum, SPF 50"
                />
                <span style={{ fontSize: '12px', color: 'var(--color-text-light)', marginTop: '4px', display: 'block' }}>
                  Separate products with commas.
                </span>
              </div>

              {/* Sun Exposure */}
              <div className="form-group">
                <label className="form-label">General Daily Sun Exposure</label>
                <select
                  className="form-select"
                  value={formData.sun_exposure}
                  onChange={(e) => setFormData({ ...formData, sun_exposure: e.target.value })}
                >
                  <option value="Low (primarily indoors with minimal direct sunlight)">Low (primarily indoors)</option>
                  <option value="Moderate (commute & outdoor walks 3-4 days/week)">Moderate (walks & light outdoor time)</option>
                  <option value="High (frequent prolonged direct sun exposure)">High (sports/frequent outdoor activities)</option>
                </select>
              </div>

              <div style={{ marginTop: '28px', display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                >
                  <Save size={16} />
                  {saving ? 'Activating Profile...' : 'Save & Activate Profile'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('analyze')}
                  className="btn btn-soft"
                >
                  Proceed to Analyze Skin →
                </button>
              </div>
            </form>
          </div>

          {/* Profile Summary Card Column */}
          <div>
            <div
              className="card"
              style={{
                position: 'sticky',
                top: '90px',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F7F4 100%)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Sparkles size={16} style={{ color: 'var(--color-primary)' }} />
                <h3 style={{ fontSize: '16px', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                  Skin Profile Summary
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                <div>
                  <span style={{ fontSize: '11.5px', color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Skin Type</span>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                    {formData.skin_type}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11.5px', color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Primary Concern</span>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-amber-text)' }}>
                    {formData.primary_concern}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11.5px', color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Secondary Concerns</span>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                    {formData.secondary_concerns.length > 0 ? formData.secondary_concerns.join(', ') : 'None specified'}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11.5px', color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Estimated Oiliness</span>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-blue-text)' }}>
                    {formData.skin_type === 'Oily' ? 'High' : formData.skin_type === 'Combination' ? 'Moderate to High (T-Zone)' : 'Low to Balanced'}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11.5px', color: 'var(--color-text-light)', textTransform: 'uppercase' }}>Current Routine</span>
                  <div style={{ fontSize: '13.5px', color: 'var(--color-text-muted)' }}>
                    {formData.current_routine}
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--color-surface)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '12.5px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                <Shield size={14} style={{ display: 'inline', marginRight: '6px', color: 'var(--color-primary)' }} />
                This profile is injected into Skinova's context window for all conversational recommendations and routine generation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
