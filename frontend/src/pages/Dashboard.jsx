import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Sparkles, Camera, ArrowRight, CheckCircle2, MessageSquare, AlertCircle, Droplets, Sun, Moon, Calendar, ChevronRight } from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

export default function Dashboard() {
  const { user, profile, navigate, setCurrentReport } = useApp();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getReports(user.id)
      .then(res => {
        setReports(res || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user.id]);

  const latestReport = reports.length > 0 ? reports[0] : null;

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: 600, fontSize: '13.5px', marginBottom: '4px' }}>
              <Sparkles size={16} />
              <span>Skinova AI Dashboard</span>
            </div>
            <h1 style={{ fontSize: '2.1rem' }}>Welcome back, {user?.name || 'Friend'}</h1>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate('analyze')}
              className="btn btn-primary"
            >
              <Camera size={16} />
              New Skin Analysis
            </button>
            <button
              onClick={() => navigate('chat')}
              className="btn btn-secondary"
            >
              <MessageSquare size={16} />
              Ask Skinova
            </button>
          </div>
        </div>

        {/* Compact Medical Disclaimer */}
        <MedicalDisclaimer compact={true} />

        {/* Top Grid: Profile & Latest Analysis */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {/* Card 1: Skin Profile Summary */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px' }}>Your Skin Profile</h3>
              <button
                onClick={() => navigate('profile')}
                className="btn btn-soft btn-sm"
              >
                Edit Profile
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
              <div style={{ background: 'var(--color-bg)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--color-text-light)', display: 'block', marginBottom: '2px' }}>Skin Type</span>
                <strong style={{ fontSize: '15px', color: 'var(--color-text-main)' }}>{profile?.skin_type || 'Combination'}</strong>
              </div>

              <div style={{ background: 'var(--color-bg)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--color-text-light)', display: 'block', marginBottom: '2px' }}>Primary Concern</span>
                <strong style={{ fontSize: '15px', color: 'var(--color-amber-text)' }}>{profile?.primary_concern || 'Breakouts'}</strong>
              </div>

              <div style={{ background: 'var(--color-bg)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--color-text-light)', display: 'block', marginBottom: '2px' }}>Age Group</span>
                <strong style={{ fontSize: '15px', color: 'var(--color-text-main)' }}>{profile?.age_range || '25-34'}</strong>
              </div>

              <div style={{ background: 'var(--color-bg)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--color-text-light)', display: 'block', marginBottom: '2px' }}>Current Routine</span>
                <strong style={{ fontSize: '14px', color: 'var(--color-text-main)' }}>Basic / Hydrating</strong>
              </div>
            </div>

            <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              Active in Skinova Memory: Tailored suggestions will reflect your {profile?.skin_type?.toLowerCase()} profile and focus on {profile?.primary_concern?.toLowerCase()}.
            </p>
          </div>

          {/* Card 2: Latest Skin Analysis */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '17px' }}>Latest Skin Analysis</h3>
                <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                  {latestReport ? new Date(latestReport.created_at).toLocaleDateString() : 'Baseline Assessment'}
                </span>
              </div>
              {latestReport && (
                <button
                  onClick={() => {
                    setCurrentReport(latestReport);
                    navigate('report', { id: latestReport.id });
                  }}
                  className="btn btn-soft btn-sm"
                >
                  View Full Report
                </button>
              )}
            </div>

            {latestReport ? (
              <div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                  <img
                    src={latestReport.image_url}
                    alt="Latest scan"
                    style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--color-border)' }}
                  />
                  <div>
                    <span className="badge badge-emerald" style={{ marginBottom: '4px' }}>Analysis Complete</span>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                      Non-diagnostic assessment of 6 visible surface indicators.
                    </p>
                  </div>
                </div>

                {/* Visible indicator mini meters */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div style={{ background: 'var(--color-amber-bg)', padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--color-amber-text)' }}>Breakouts</div>
                    <strong style={{ fontSize: '13px', color: 'var(--color-amber-text)' }}>Moderate</strong>
                  </div>
                  <div style={{ background: 'var(--color-blue-bg)', padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--color-blue-text)' }}>Oiliness</div>
                    <strong style={{ fontSize: '13px', color: 'var(--color-blue-text)' }}>High</strong>
                  </div>
                  <div style={{ background: 'var(--color-rose-bg)', padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--color-rose-text)' }}>Redness</div>
                    <strong style={{ fontSize: '13px', color: 'var(--color-rose-text)' }}>Mild</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 10px' }}>
                <Camera size={36} style={{ color: 'var(--color-accent)', margin: '0 auto 10px', opacity: 0.8 }} />
                <h4 style={{ fontSize: '15px', marginBottom: '6px' }}>No analysis yet</h4>
                <p style={{ fontSize: '13px', marginBottom: '16px' }}>Upload your first skin photo to receive visible indicator metrics.</p>
                <button
                  onClick={() => navigate('analyze')}
                  className="btn btn-primary btn-sm"
                >
                  Start First Scan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Second Grid: Routine & Recommended Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {/* Current Routine Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sun size={18} style={{ color: '#D97706' }} />
                <h3 style={{ fontSize: '17px' }}>Today's Skincare Routine</h3>
              </div>
              <button
                onClick={() => navigate('routine')}
                className="btn btn-secondary btn-sm"
              >
                Customize
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--color-primary)' }} />
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 600 }}>AM: Gentle Foaming Cleanse</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>Removes overnight oil without stripping barrier</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--color-primary)' }} />
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 600 }}>AM: Niacinamide 3% Serum</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>Sebum balance & redness calming</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--color-primary)' }} />
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 600 }}>AM: Broad-Spectrum SPF 50</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>Prevents dark spot darkening & photoaging</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Education */}
          <div className="card">
            <h3 style={{ fontSize: '17px', marginBottom: '16px' }}>Recommended Next Steps</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                onClick={() => navigate('ingredients')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)'
                }}
                className="card-hover"
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-main)' }}>Check Active Ingredients</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Test compatibility (e.g. Retinol + BHA)</div>
                </div>
                <ChevronRight size={18} style={{ color: 'var(--color-text-light)' }} />
              </div>

              <div
                onClick={() => navigate('progress')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)'
                }}
                className="card-hover"
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-main)' }}>Track Visual Progress</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>View your Week 1 → Week 4 photo journey</div>
                </div>
                <ChevronRight size={18} style={{ color: 'var(--color-text-light)' }} />
              </div>

              <div
                onClick={() => navigate('chat')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)'
                }}
                className="card-hover"
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-main)' }}>Talk to Skinova</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Ask questions about your skin analysis</div>
                </div>
                <ChevronRight size={18} style={{ color: 'var(--color-text-light)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
