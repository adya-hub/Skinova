import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { TrendingUp, Calendar, Camera, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

export default function ProgressTrackingPage() {
  const { user } = useApp();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comparisonPair, setComparisonPair] = useState([0, 2]); // compare week 1 and week 4 by default

  useEffect(() => {
    api.getProgress(user.id)
      .then(res => {
        setEntries(res.entries || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user.id]);

  const entryA = entries[comparisonPair[0]] || entries[0];
  const entryB = entries[comparisonPair[1]] || entries[entries.length - 1];

  return (
    <div className="page-wrapper">
      <div className="container">
        <MedicalDisclaimer compact={true} />

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '10px' }}>Visual Journey</span>
          <h1 style={{ fontSize: '2.3rem', marginBottom: '10px' }}>Skin Progress Tracking</h1>
          <p style={{ maxWidth: '620px', margin: '0 auto', fontSize: '15px' }}>
            Monitor changes in visible skin characteristics over time. Observe how your barrier responds to your personalized routine.
          </p>
        </div>

        {/* Notice on non-medical claim */}
        <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', padding: '12px 18px', borderRadius: 'var(--radius-md)', marginBottom: '28px', fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
          <strong>Visual Tracking Notice:</strong> This timeline presents observable changes in surface characteristics. It does not medically evaluate clinical pathology or claim histological proof of cure.
        </div>

        {/* Side-by-Side Visual Comparison */}
        {entryA && entryB && (
          <div className="card" style={{ marginBottom: '36px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Side-by-Side Visual Comparison</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {/* Baseline */}
              <div style={{ textAlign: 'center', background: 'var(--color-bg)', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
                <span className="badge badge-primary" style={{ marginBottom: '10px' }}>{entryA.week_label}</span>
                <div style={{ width: '180px', height: '220px', margin: '0 auto 14px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                  <img
                    src={entryA.image_preview}
                    alt={entryA.week_label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-light)', marginBottom: '6px' }}>Logged: {entryA.date}</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="badge badge-amber">Breakouts: {entryA.visible_breakouts}</span>
                  <span className="badge badge-blue">Oiliness: {entryA.visible_oiliness}</span>
                  <span className="badge badge-rose">Redness: {entryA.visible_redness}</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '10px' }}>{entryA.notes}</p>
              </div>

              {/* Progress Point */}
              <div style={{ textAlign: 'center', background: 'var(--color-bg)', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
                <span className="badge badge-emerald" style={{ marginBottom: '10px' }}>{entryB.week_label}</span>
                <div style={{ width: '180px', height: '220px', margin: '0 auto 14px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                  <img
                    src={entryB.image_preview}
                    alt={entryB.week_label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-light)', marginBottom: '6px' }}>Logged: {entryB.date}</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="badge badge-amber">Breakouts: {entryB.visible_breakouts}</span>
                  <span className="badge badge-blue">Oiliness: {entryB.visible_oiliness}</span>
                  <span className="badge badge-rose">Redness: {entryB.visible_redness}</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '10px' }}>{entryB.notes}</p>
              </div>
            </div>

            {/* Delta Highlights */}
            <div style={{ marginTop: '24px', background: 'var(--color-primary-light)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '16px', color: 'var(--color-primary)' }}>
              <div>
                <strong>Acne-like Breakouts:</strong> Moderate → <span style={{ textDecoration: 'underline' }}>Mild</span>
              </div>
              <div>
                <strong>Surface Oiliness:</strong> High → <span style={{ textDecoration: 'underline' }}>Moderate</span>
              </div>
              <div>
                <strong>Visible Redness:</strong> Moderate → <span style={{ textDecoration: 'underline' }}>Mild</span>
              </div>
            </div>
          </div>
        )}

        {/* Milestone Timeline List */}
        <div className="card">
          <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Check-in Timeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {entries.map((entry, idx) => (
              <div
                key={entry.id || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  background: 'var(--color-bg)',
                  borderRadius: 'var(--radius-md)',
                  flexWrap: 'wrap',
                  gap: '14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={entry.image_preview}
                    alt={entry.week_label}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border)' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '15px' }}>{entry.week_label}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>{entry.date}</span>
                    <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{entry.notes}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className="badge badge-amber">{entry.visible_breakouts} Breakouts</span>
                  <span className="badge badge-blue">{entry.visible_oiliness} Sebum</span>
                  <span className="badge badge-rose">{entry.visible_redness} Redness</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
