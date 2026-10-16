import React, { useEffect, useState } from 'react';
import { Sparkles, Scan, Crosshair, Cpu, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

export default function SkinScan3DOverlay({ imageUrl, isScanning = false, scanProgress = 0 }) {
  const [telemetry, setTelemetry] = useState({
    meshPoints: 1420,
    illumination: '98.4% Uniform',
    chroma: 'Standardized D65',
    tilt: '0.4° Orthogonal',
    zonesTracked: 5
  });

  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        ...prev,
        meshPoints: Math.floor(1400 + Math.random() * 50)
      }));
    }, 1200);
    return () => clearInterval(interval);
  }, [isScanning]);

  return (
    <div
      className="skin-scan-3d-container"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '460px',
        margin: '0 auto',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(15, 35, 25, 0.25), 0 0 30px rgba(88, 255, 196, 0.15)',
        border: '1.5px solid rgba(88, 255, 196, 0.4)',
        background: '#0B1511'
      }}
    >
      {/* Underlying Image */}
      <div style={{ position: 'relative', width: '100%', height: '380px', overflow: 'hidden' }}>
        <img
          src={imageUrl}
          alt="Skin Scan Subject"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: isScanning ? 'contrast(1.08) brightness(0.95)' : 'none',
            transition: 'filter 0.3s'
          }}
        />

        {/* 3D Isometric Neon Perspective Grid Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(88, 255, 196, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(88, 255, 196, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
            pointerEvents: 'none'
          }}
        />

        {/* Dynamic Sweeping 3D Laser Beam */}
        {isScanning && (
          <div
            className="scanner-laser-beam"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, transparent 0%, #58FFC4 50%, transparent 100%)',
              boxShadow: '0 0 16px #58FFC4, 0 0 32px #58FFC4',
              animation: 'laserScan 2.4s ease-in-out infinite',
              zIndex: 5
            }}
          />
        )}

        {/* Target Reticles (Forehead, Cheeks, Nose, Chin) */}
        <div
          style={{
            position: 'absolute',
            top: '22%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none'
          }}
        >
          <div className="reticle-target" style={{ animationDelay: '0s' }}>
            <span className="reticle-dot" />
            <span className="reticle-label">Forehead Sebum (T-Zone)</span>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: '48%',
            left: '30%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none'
          }}
        >
          <div className="reticle-target" style={{ animationDelay: '0.4s' }}>
            <span className="reticle-dot" />
            <span className="reticle-label">R-Cheek (Erythema)</span>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: '48%',
            left: '70%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none'
          }}
        >
          <div className="reticle-target" style={{ animationDelay: '0.8s' }}>
            <span className="reticle-dot" />
            <span className="reticle-label">L-Cheek (Barrier)</span>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: '52%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none'
          }}
        >
          <div className="reticle-target" style={{ animationDelay: '1.2s' }}>
            <span className="reticle-dot" />
            <span className="reticle-label">Nasal Congestion</span>
          </div>
        </div>

        {/* Cybernetic Corner Brackets */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', width: '20px', height: '20px', borderTop: '2px solid #58FFC4', borderLeft: '2px solid #58FFC4' }} />
        <div style={{ position: 'absolute', top: '12px', right: '12px', width: '20px', height: '20px', borderTop: '2px solid #58FFC4', borderRight: '2px solid #58FFC4' }} />
        <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '20px', height: '20px', borderBottom: '2px solid #58FFC4', borderLeft: '2px solid #58FFC4' }} />
        <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '20px', height: '20px', borderBottom: '2px solid #58FFC4', borderRight: '2px solid #58FFC4' }} />

        {/* Live Status Badge */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            background: 'rgba(10, 24, 18, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(88, 255, 196, 0.4)',
            borderRadius: 'var(--radius-full)',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#58FFC4',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Activity size={12} className={isScanning ? 'spinner' : ''} />
          <span>{isScanning ? '3D CUTANEOUS SCAN IN PROGRESS' : 'IMAGE CALIBRATED · READY'}</span>
        </div>

        {/* Coordinate Readout */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(10, 24, 18, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            padding: '3px 8px',
            fontFamily: 'monospace',
            fontSize: '10.5px',
            color: 'rgba(255, 255, 255, 0.7)'
          }}
        >
          PTS: {telemetry.meshPoints}
        </div>
      </div>

      {/* Bottom Telemetry HUD Ribbon */}
      <div
        style={{
          background: 'rgba(10, 20, 16, 0.95)',
          padding: '12px 16px',
          borderTop: '1px solid rgba(88, 255, 196, 0.2)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.7)'
        }}
      >
        <div>
          <span style={{ color: 'rgba(255,255,255,0.4)', display: 'block', fontSize: '9.5px' }}>LIGHTING</span>
          <span style={{ color: '#58FFC4', fontWeight: 600 }}>{telemetry.illumination}</span>
        </div>
        <div>
          <span style={{ color: 'rgba(255,255,255,0.4)', display: 'block', fontSize: '9.5px' }}>SPECTRUM</span>
          <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{telemetry.chroma}</span>
        </div>
        <div>
          <span style={{ color: 'rgba(255,255,255,0.4)', display: 'block', fontSize: '9.5px' }}>ORIENTATION</span>
          <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{telemetry.tilt}</span>
        </div>
      </div>
    </div>
  );
}
