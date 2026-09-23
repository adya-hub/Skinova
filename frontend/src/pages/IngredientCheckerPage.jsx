import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Sparkles, Search, AlertTriangle, CheckCircle, ShieldAlert, Camera, Layers, ArrowRight } from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

export default function IngredientCheckerPage() {
  const [inputText, setInputText] = useState('Niacinamide + Salicylic Acid + Retinol');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' | 'ocr'
  const [ocrText, setOcrText] = useState('');
  const [ocrLoading, setOcrLoading] = useState(false);

  const popularActives = [
    'Niacinamide',
    'Salicylic Acid',
    'Retinol',
    'Hyaluronic Acid',
    'Benzoyl Peroxide',
    'Vitamin C',
    'Ceramides',
    'Azelaic Acid'
  ];

  const handleAddActive = (act) => {
    if (!inputText) {
      setInputText(act);
    } else if (!inputText.toLowerCase().includes(act.toLowerCase())) {
      setInputText(prev => `${prev} + ${act}`);
    }
  };

  const handleCheck = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const res = await api.checkIngredients(inputText);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunOcrDemo = async () => {
    setOcrLoading(true);
    try {
      const formData = new FormData();
      formData.append('sample_ocr_text', 'Water/Aqua, Niacinamide (5%), Salicylic Acid (2%), Glycerin, Zinc PCA, Sodium Hyaluronate, Ceramide NP');
      const res = await api.scanProductLabel(formData);
      setOcrText(res.ocr_extracted_text);
      setResults(res.analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setOcrLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container-narrow">
        <MedicalDisclaimer compact={true} />

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '10px' }}>Active Formulation Science</span>
          <h1 style={{ fontSize: '2.3rem', marginBottom: '10px' }}>Ingredient Compatibility Checker</h1>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '15px' }}>
            Check ingredient synergies, potential irritation risks, active conflicts, and safe introduction protocols.
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
          <button
            onClick={() => setActiveTab('manual')}
            className={`btn btn-sm ${activeTab === 'manual' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Manual Ingredient Entry
          </button>
          <button
            onClick={() => setActiveTab('ocr')}
            className={`btn btn-sm ${activeTab === 'ocr' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Camera size={14} />
            Product Label Scanner (OCR)
          </button>
        </div>

        {/* Main Input Card */}
        <div className="card" style={{ marginBottom: '32px' }}>
          {activeTab === 'manual' ? (
            <div>
              <label className="form-label">
                Enter ingredients separated by commas or plus signs (+):
              </label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <input
                  type="text"
                  className="form-input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="e.g., Niacinamide + Salicylic Acid + Retinol"
                  style={{ flex: 1 }}
                />
                <button
                  onClick={handleCheck}
                  disabled={loading || !inputText.trim()}
                  className="btn btn-primary"
                >
                  <Search size={16} />
                  {loading ? 'Checking...' : 'Check Compatibility'}
                </button>
              </div>

              {/* Popular Actives Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12.5px', color: 'var(--color-text-light)' }}>Quick Add:</span>
                {popularActives.map(act => (
                  <button
                    key={act}
                    type="button"
                    onClick={() => handleAddActive(act)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '12px', padding: '4px 10px' }}
                  >
                    + {act}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <Camera size={38} style={{ color: 'var(--color-primary)', margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '17px', marginBottom: '6px' }}>Scan a Skincare Product Label</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', maxWidth: '480px', margin: '0 auto 20px' }}>
                  Skinova extracts ingredients from product packaging photos via computer vision OCR and checks formulation safety.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  <button
                    onClick={handleRunOcrDemo}
                    disabled={ocrLoading}
                    className="btn btn-primary"
                  >
                    <Sparkles size={16} />
                    {ocrLoading ? 'Extracting text...' : 'Run Demo Label Extraction'}
                  </button>
                </div>
              </div>

              {ocrText && (
                <div style={{ marginTop: '20px', background: 'var(--color-bg)', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '13px' }}>
                  <strong>Extracted Label Ingredients:</strong>
                  <p style={{ color: 'var(--color-text-main)', marginTop: '4px' }}>{ocrText}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Section */}
        {results && (
          <div>
            {/* Synergies & Conflicts Summary */}
            {results.conflicts_detected?.length > 0 && (
              <div className="card" style={{ borderLeft: '4px solid #D96B6B', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '17px', marginBottom: '10px', color: 'var(--color-rose-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={18} />
                  Compatibility Precautions Detected
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {results.conflicts_detected.map((c, i) => (
                    <div key={i} style={{ background: 'var(--color-rose-bg)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                      <strong style={{ fontSize: '14px', color: 'var(--color-rose-text)' }}>{c.pair} ({c.severity})</strong>
                      <p style={{ fontSize: '13px', color: 'var(--color-text-main)', marginTop: '4px' }}>{c.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.synergies_detected?.length > 0 && (
              <div className="card" style={{ borderLeft: '4px solid #2D5A46', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '17px', marginBottom: '10px', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={18} />
                  Harmonious Synergies
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {results.synergies_detected.map((s, i) => (
                    <div key={i} style={{ background: 'var(--color-primary-light)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                      <strong style={{ fontSize: '14px', color: 'var(--color-primary)' }}>{s.pair}</strong>
                      <p style={{ fontSize: '13px', color: 'var(--color-text-main)', marginTop: '4px' }}>{s.benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Individual Ingredient Deep Dives */}
            <h3 style={{ fontSize: '19px', marginBottom: '16px' }}>Identified Active Ingredients</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '28px' }}>
              {results.ingredients_analyzed?.map((item, idx) => (
                <div key={idx} className="card card-hover">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '16px', color: 'var(--color-text-main)' }}>{item.name}</h4>
                    <span className="badge badge-primary">{item.category}</span>
                  </div>
                  <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                    <strong>Common Benefits:</strong> {item.benefits}
                  </div>
                  <div style={{ fontSize: '13px', marginBottom: '8px', color: 'var(--color-amber-text)' }}>
                    <strong>Irritation Profile:</strong> {item.irritation_risk}
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', background: 'var(--color-bg)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                    <strong>Best Practice:</strong> {item.best_practice}
                  </div>
                </div>
              ))}
            </div>

            {/* Safe Introduction Guide */}
            <div className="card" style={{ background: 'var(--color-bg)' }}>
              <h4 style={{ fontSize: '15px', marginBottom: '8px' }}>How to Safely Introduce Active Ingredients</h4>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
                {results.general_guidance}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
