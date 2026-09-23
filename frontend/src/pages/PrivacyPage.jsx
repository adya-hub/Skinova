import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Shield, Trash2, CheckCircle2, Lock, EyeOff, Server, AlertCircle } from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

export default function PrivacyPage() {
  const { user, showToast } = useApp();
  const [policy, setPolicy] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deletedStatus, setDeletedStatus] = useState(null);

  useEffect(() => {
    api.getPrivacyPolicy().then(res => setPolicy(res)).catch(() => {});
  }, []);

  const handleDeleteData = async () => {
    if (!window.confirm('Are you sure you want to permanently delete all your stored profile records, uploaded photos, and analysis history? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const res = await api.deleteUserData(user.id);
      setDeletedStatus(res.message);
      showToast('All your stored photos and data have been permanently erased.', 'success');
    } catch (err) {
      showToast('Error purging data: ' + err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const guarantees = [
    {
      title: 'Ephemeral Image Retention',
      desc: 'Uploaded facial images are stored exclusively in private, temporary storage for generating your report. They are never kept indefinitely.',
      icon: EyeOff
    },
    {
      title: 'End-to-End Encryption',
      desc: 'All communications between your device and Skinova are encrypted via HTTPS / TLS 1.3 in transit and encrypted with AES-256 at rest.',
      icon: Lock
    },
    {
      title: 'No Third-Party Data Selling',
      desc: 'Skinova never sells, rents, or licenses your personal information, facial biometric features, or skincare preferences to advertisers.',
      icon: Shield
    },
    {
      title: 'Total User Data Sovereignty',
      desc: 'You maintain 100% control over your data. Delete your uploaded photos, profile history, and chat logs with a single click at any time.',
      icon: Server
    }
  ];

  return (
    <div className="page-wrapper">
      <div className="container-narrow">
        <MedicalDisclaimer compact={true} />

        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="badge badge-emerald" style={{ marginBottom: '10px' }}>Patient & User Privacy</span>
          <h1 style={{ fontSize: '2.3rem', marginBottom: '10px' }}>Privacy & Data Governance</h1>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '15px' }}>
            We treat facial image privacy as a core engineering feature. Here is our exact data handling policy.
          </p>
        </div>

        {/* Four Core Guarantees Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          {guarantees.map((g, i) => {
            const IconComp = g.icon;
            return (
              <div key={i} className="card">
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <IconComp size={20} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{g.title}</h3>
                <p style={{ fontSize: '13px', lineHeight: 1.55 }}>{g.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Data Erasure Card */}
        <div className="card" style={{ border: '1px solid var(--color-rose-border)', background: 'var(--color-rose-bg)', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '18px', color: 'var(--color-rose-text)', marginBottom: '6px' }}>
                One-Click Data & Image Erasure
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--color-text-main)', maxWidth: '520px' }}>
                Permanently purge all uploaded skin photos, profile records, and generated Skinova analysis history associated with your current session.
              </p>
            </div>

            <button
              onClick={handleDeleteData}
              disabled={deleting}
              className="btn btn-danger"
              style={{ fontWeight: 600 }}
            >
              <Trash2 size={16} />
              {deleting ? 'Erasing Data...' : 'Delete My Uploads & Data'}
            </button>
          </div>

          {deletedStatus && (
            <div style={{ marginTop: '16px', padding: '10px 14px', background: 'white', borderRadius: 'var(--radius-sm)', fontSize: '13px', color: 'var(--color-emerald-text)' }}>
              ✓ {deletedStatus}
            </div>
          )}
        </div>

        {/* Technical Policy Summary */}
        <div className="card">
          <h3 style={{ fontSize: '17px', marginBottom: '14px' }}>Technical Architecture Transparency</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--color-text-muted)' }}>
            <li>• <strong>Encryption:</strong> {policy?.encryption || 'TLS/HTTPS in transit, AES-256 for persistent assets'}</li>
            <li>• <strong>Retention Policy:</strong> {policy?.data_retention || 'Private ephemeral storage with user-triggered deletion.'}</li>
            <li>• <strong>HIPAA Notice:</strong> {policy?.medical_disclaimer || 'Skinova is an educational wellness assistant and does not generate ePHI.'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
