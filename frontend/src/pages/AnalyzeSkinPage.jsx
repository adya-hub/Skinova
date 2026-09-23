import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { UploadCloud, Camera, Check, X, AlertTriangle, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

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
    'Image received & uploaded securely',
    'Illumination and focal clarity validated',
    'Analyzing visible cutaneous indicators (sebum, redness, congestion)',
    'Querying skincare educational literature & RAG corpus',
    'Screening safety guardrails & non-diagnostic parameters',
    'Personalizing your Skinova Report'
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
    <div className="page-wrapper">
      <div className="container-narrow">
        <MedicalDisclaimer />

        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '12px' }}>AI Cutaneous Scan</span>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '10px' }}>Analyze Your Skin</h1>
          <p style={{ maxWidth: '580px', margin: '0 auto', fontSize: '15px' }}>
            Upload a clear face photo. Skinova evaluates visible characteristics, provides uncertainty-aware observations, and customizes your skincare advice.
          </p>
        </div>

        {/* Multi-Stage Loading Overlay */}
        {analyzing ? (
          <div className="stages-loader-box">
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
                  margin: '0 auto 16px'
                }}
              >
                <Sparkles size={28} className="spinner" />
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '6px' }}>Skinova is analyzing your image...</h3>
              <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)' }}>
                Running agent tools, RAG knowledge retrieval, and clinical guardrails.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {stages.map((st, idx) => {
                const isDone = idx < currentStageIndex;
                const isActive = idx === currentStageIndex;
                return (
                  <div key={idx} className="stage-item">
                    <div className={`stage-icon-wrap ${isDone ? 'stage-done' : isActive ? 'stage-active' : 'stage-pending'}`}>
                      {isDone ? <Check size={16} /> : isActive ? '⟳' : idx + 1}
                    </div>
                    <span style={{ fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--color-text-main)' : isDone ? 'var(--color-primary)' : 'var(--color-text-light)' }}>
                      {st}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="card" style={{ padding: '36px' }}>
            {/* Step 1: Skin Profile Confirmation Banner */}
            <div style={{ background: 'var(--color-bg)', padding: '14px 18px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--color-text-light)', display: 'block' }}>Connected Profile</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-main)' }}>
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

            {/* Upload or Preview Box */}
            {previewUrl ? (
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ position: 'relative', display: 'inline-block', maxWidth: '340px', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '2px solid var(--color-border)' }}>
                  <img
                    src={previewUrl}
                    alt="Upload preview"
                    style={{ width: '100%', height: '340px', objectFit: 'cover', display: 'block' }}
                  />
                  <button
                    onClick={handleClearImage}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(0, 0, 0, 0.65)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
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
                    padding: '48px 24px',
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
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '12px', textAlign: 'center' }}>
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
              <strong>Quality Guidance:</strong> For better results, use a clear image with good natural lighting, neutral facial expression, and minimal filters or heavy makeup.
            </div>

            {/* Consent & Privacy Notice Checkbox */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', fontSize: '13.5px', color: 'var(--color-text-main)', lineHeight: 1.5 }}>
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
                  cursor: (!previewUrl || !consentAgreed) ? 'not-allowed' : 'pointer'
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
