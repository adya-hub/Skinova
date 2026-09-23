import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Shield, Heart } from 'lucide-react';

export default function Footer() {
  const { navigate } = useApp();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          {/* Col 1 */}
          <div>
            <div className="brand-logo" style={{ marginBottom: '14px' }}>
              <div className="brand-icon">
                <Sparkles size={18} />
              </div>
              <span>Skinova AI</span>
            </div>
            <p style={{ maxWidth: '320px', fontSize: '13.5px', marginBottom: '16px' }}>
              <strong>"Understand Your Skin. Make Smarter Choices."</strong>
              <br />
              An AI-powered skin health analysis and skincare education assistant built for clarity, safety, and evidence-based routines.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--color-primary)' }}>
              <Shield size={16} />
              <span>Evidence-based · Non-diagnostic · Privacy-first</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--color-text-main)' }}>Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
              <li><a href="#analyze" onClick={(e) => { e.preventDefault(); navigate('analyze'); }}>Analyze Skin</a></li>
              <li><a href="#dashboard" onClick={(e) => { e.preventDefault(); navigate('dashboard'); }}>Dashboard</a></li>
              <li><a href="#chat" onClick={(e) => { e.preventDefault(); navigate('chat'); }}>Ask Skinova</a></li>
              <li><a href="#progress" onClick={(e) => { e.preventDefault(); navigate('progress'); }}>Progress Tracking</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--color-text-main)' }}>Education</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
              <li><a href="#ingredients" onClick={(e) => { e.preventDefault(); navigate('ingredients'); }}>Ingredient Checker</a></li>
              <li><a href="#routine" onClick={(e) => { e.preventDefault(); navigate('routine'); }}>Routine Builder</a></li>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); navigate('about'); }}>About Skinova</a></li>
              <li><a href="#privacy" onClick={(e) => { e.preventDefault(); navigate('privacy'); }}>Privacy & Data</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--color-text-main)' }}>Clinical Advisory</h4>
            <p style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--color-text-muted)' }}>
              Skinova provides educational insights and does not diagnose disease or prescribe medications. Please consult a board-certified dermatologist for medical diagnosis.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} Skinova AI. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#privacy" onClick={(e) => { e.preventDefault(); navigate('privacy'); }}>Privacy Policy</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); navigate('about'); }}>AI Architecture</a>
            <a href="#profile" onClick={(e) => { e.preventDefault(); navigate('profile'); }}>Skin Profile</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
