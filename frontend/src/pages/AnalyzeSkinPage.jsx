import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { UploadCloud, Camera, Check, X, AlertTriangle, ShieldCheck, Sparkles, RefreshCw, Activity, Layers, Scan } from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import SkinScan3DOverlay from '../components/SkinScan3DOverlay';

export default function AnalyzeSkinPage() {
  const { user, profile, setCurrentReport, navigate } = useApp();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedSample, setSelectedSample] = useState(null);
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Multi-stage loading state
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  const fileInputRef = useRef(null);

  const stages = [
    'Image received & uploaded securely (TLS 1.3)',
    'Validating illumination, D65 color temperature & sharpness',
    '3D mesh alignment & mapping cutaneous zones (T-zone, Malar, Perioral)',
    'Extracting cutaneous telemetry (erythema, sebum, follicular congestion)',
    'Querying dermatological literature & evidence-grounded RAG index',
    'Screening clinical safety guardrails & generating Skinova report'
  ];

  const sampleFaces = [
    { id: 'sample_face_1', name: 'Sample A: Combination', desc: 'Follicular congestion & T-zone shine' },
    { id: 'sample_face_2', name: 'Sample B: Sensitive', desc: 'Mild facial erythema & reactive barrier' },
    { id: 'sample_face_3', name: 'Sample C: Pigmentation', desc: 'Visible post-inflammatory marks (PIH)' }
  ];

  const handleFileChange = (file) => {
    if (!file) return;
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (JPEG, PNG, or WebP).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 15MB. Please choose a smaller photo.');
      return;
    }
    setSelectedFile(file);
    setSelectedSample(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSelectSample = (sampleId) => {
    setSelectedSample(sampleId);
    setSelectedFile(null);
    setPreviewUrl(`/static/samples/${sampleId}.svg`);
    setErrorMsg(null);
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setSelectedSample(null);
    setPreviewUrl(null);
    setErrorMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStartAnalysis = async () => {
    if (!previewUrl) {
      setErrorMsg('Please upload a skin photo or select a demo sample to begin.');
      return;
    }
    if (!consentAgreed) {
      setErrorMsg('Please review and check the image processing consent agreement.');
      return;
    }

    setAnalyzing(true);
    setErrorMsg(null);
    setCurrentStageIndex(0);

    // Progressive stage animation timer to give real feedback
    const stageInterval = setInterval(() => {
      setCurrentStageIndex(prev => {
        if (prev < stages.length - 1) return prev + 1;
        return prev;
      });
    }, 700);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('image', selectedFile);
      } else if (selectedSample) {
        formData.append('sample_id', selectedSample);
      }
      formData.append('consent', 'true');
      formData.append('user_id', user.id);

      const res = await api.analyzeSkin(formData);
      clearInterval(stageInterval);
      setCurrentStageIndex(stages.length);

      // Brief pause to display completion state
      setTimeout(() => {
        setAnalyzing(false);
        if (res.report) {
          setCurrentReport(res.report);
          navigate('report', { id: res.report.id });
        }
      }, 500);

    } catch (err) {
      clearInterval(stageInterval);
      setAnalyzing(false);
      setErrorMsg(err.message || 'Skinova encountered an issue analyzing this image. Please try again with a clearer photo.');
    }
  };

  return (
    <div className="page-wrapper aurora-hero-bg">
      <div className="container-narrow" style={{ position: 'relative', zIndex: 1 }}>
        <MedicalDisclaimer compact={true} />

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-primary-border)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-primary)',
              marginBottom: '10px'
            }}
          >
            <Scan size={14} /> 3D Cutaneous Vision Lab
          </div>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '10px' }}>
            AI Skin Image Analysis
          </h1>
          <p style={{ maxWidth: '620px', margin: '0 auto', fontSize: '15px', color: 'var(--color-text-muted)' }}>
            Upload a clear face photo. Skinova evaluates visible characteristics, provides uncertainty-aware observations, and customizes your skincare advice.
          </p>
        </div>

        {/* Multi-Stage Loading Overlay with Live 3D Scanner */}
        {analyzing ? (
          <div className="feature-card-3d" style={{ padding: '36px', maxWidth: '620px', margin: '0 auto', textAlign: 'center' }}>
            {previewUrl && (
              <div style={{ marginBottom: '28px' }}>
                <SkinScan3DOverlay imageUrl={previewUrl} isScanning={true} />
              </div>
            )}

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: '0 0 20px rgba(88, 255, 196, 0.3)'
                }}
              >
                <Sparkles size={28} className="spinner" />
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '6px' }}>Skinova is analyzing cutaneous telemetry...</h3>
              <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)' }}>
                Running 3D mesh zone mapping, RAG evidence grounding, and clinical guardrails.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              {stages.map((st, idx) => {
                const isDone = idx < currentStageIndex;
                const isActive = idx === currentStageIndex;
                return (
                  <div key={idx} className="stage-item">
                    <div className={`stage-icon-wrap ${isDone ? 'stage-done' : isActive ? 'stage-active' : 'stage-pending'}`}>
                      {isDone ? <Check size={16} /> : isActive ? '⟳' : idx + 1}
                    </div>
                    <span style={{ fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--color-primary)' : isDone ? 'var(--color-text-main)' : 'var(--color-text-light)', fontSize: '13.5px' }}>
                      {st}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="card feature-card-3d" style={{ padding: '36px' }}>
            {/* Step 1: Skin Profile Confirmation Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, #F4F8F5 0%, #FFFFFF 100%)',
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '24px',
                border: '1px solid var(--color-primary-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div>
                <span style={{ fontSize: '11.5px', color: 'var(--color-text-light)', display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Connected Profile
                </span>
                <span style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {profile.skin_type} Skin · {profile.primary_concern}
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigate('profile')}
                className="btn btn-soft btn-sm"
              >
                Update Profile
              </button>
            </div>

            {/* Error Message if any */}
            {errorMsg && (
              <div style={{ background: 'var(--color-rose-bg)', border: '1px solid var(--color-rose-border)', color: 'var(--color-rose-text)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Upload or 3D Cybernetic Preview Box */}
            {previewUrl ? (
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <SkinScan3DOverlay imageUrl={previewUrl} isScanning={false} />

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  <button
                    onClick={handleClearImage}
                    className="btn btn-secondary btn-sm"
                  >
                    <RefreshCw size={14} />
                    Choose Another Photo
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileChange(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${isDragging ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-xl)',
                    padding: '44px 24px',
                    textAlign: 'center',
                    backgroundColor: isDragging ? 'var(--color-primary-light)' : 'var(--color-bg)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-normal)',
                    marginBottom: '24px'
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: 'var(--color-surface)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <UploadCloud size={28} />
                  </div>
                  <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>
                    Drag & Drop your skin photo here
                  </h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                    or click to browse from your device (JPEG, PNG, WebP up to 15MB)
                  </p>
                  <span className="btn btn-secondary btn-sm">
                    <Camera size={15} />
                    Browse Photos
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileChange(e.target.files[0]);
                      }
                    }}
                  />
                </div>

                {/* Instant Demo Samples */}
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '12px', textAlign: 'center' }}>
                    — Or try instantly with a verified sample skin image —
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    {sampleFaces.map(sf => (
                      <div
                        key={sf.id}
                        onClick={() => handleSelectSample(sf.id)}
                        className={`card card-hover ${selectedSample === sf.id ? 'btn-soft' : ''}`}
                        style={{ padding: '14px', cursor: 'pointer', textAlign: 'center', borderColor: selectedSample === sf.id ? 'var(--color-primary)' : 'var(--color-border)' }}
                      >
                        <img
                          src={`/static/samples/${sf.id}.svg`}
                          alt={sf.name}
                          style={{ width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 8px', objectFit: 'cover' }}
                        />
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{sf.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-light)', marginTop: '2px' }}>{sf.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quality Guidance */}
            <div style={{ background: 'var(--color-accent-subtle)', border: '1px solid var(--color-primary-border)', padding: '14px 18px', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: '13px', color: 'var(--color-primary)' }}>
              <strong>Quality Guidance:</strong> For optimal analysis, use a clear image with balanced natural lighting, neutral facial expression, and minimal filters or heavy makeup.
            </div>

            {/* Consent & Privacy Notice Checkbox */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', fontSize: '13px', color: 'var(--color-text-main)', lineHeight: 1.5 }}>
                <input
                  type="checkbox"
                  checked={consentAgreed}
                  onChange={(e) => setConsentAgreed(e.target.checked)}
                  style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: 'var(--color-primary)' }}
                />
                <span>
                  <strong>Consent for Image Processing:</strong> I consent to Skinova AI analyzing this image strictly for educational skincare guidance. I understand that Skinova is an AI assistant, does not provide medical diagnoses, and that I can permanently delete my uploaded photo anytime via the Privacy tab.
                </span>
              </label>
            </div>

            {/* Submit Action */}
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={handleStartAnalysis}
                disabled={!previewUrl || !consentAgreed}
                className="btn btn-primary btn-lg"
                style={{
                  width: '100%',
                  maxWidth: '380px',
                  opacity: (!previewUrl || !consentAgreed) ? 0.6 : 1,
                  cursor: (!previewUrl || !consentAgreed) ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 16px rgba(45, 90, 70, 0.3)'
                }}
              >
                <Sparkles size={18} />
                Start AI Skin Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
