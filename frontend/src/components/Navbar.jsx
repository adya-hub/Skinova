import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Shield, User, Camera, MessageSquare, BookOpen, Layers, TrendingUp, Scan } from 'lucide-react';

export default function Navbar() {
  const { activePage, navigate, user, profile, perfMode, togglePerfMode } = useApp();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'analyze', label: 'Analyze', highlight: true, badge: '3D' },
    { id: 'profile', label: 'My Skin' },
    { id: 'chat', label: 'Ask Skinova' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'routine', label: 'Routine' },
    { id: 'progress', label: 'Progress' }
  ];

  return (
    <nav
      className="navbar"
      style={{
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(91, 142, 125, 0.2)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
      }}
    >
      <div className="nav-container">
        {/* Brand */}
        <a href="#home" onClick={(e) => { e.preventDefault(); navigate('home'); }} className="brand-logo">
          <div
            className="brand-icon"
            style={{
              background: 'linear-gradient(135deg, #1B4D3E 0%, #2D5A46 50%, #58FFC4 100%)',
              boxShadow: '0 2px 10px rgba(88, 255, 196, 0.4)'
            }}
          >
            <Sparkles size={18} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Skinova</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#2D5A46',
                background: 'var(--color-primary-light)',
                padding: '2px 7px',
                borderRadius: '6px',
                border: '1px solid var(--color-primary-border)'
              }}
            >
              AI 3D
            </span>
          </div>
        </a>

        {/* Links */}
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.id);
                }}
                className={`nav-link ${activePage === item.id ? 'active' : ''}`}
                style={
                  item.highlight
                    ? {
                        color: 'var(--color-primary)',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }
                    : {}
                }
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #1B4D3E, #2D5A46)',
                      color: '#58FFC4',
                      fontSize: '10px',
                      padding: '1px 6px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      letterSpacing: '0.04em'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* User Actions */}
        <div className="nav-actions">
          {/* Visual Performance Mode Toggle */}
          <button
            onClick={togglePerfMode}
            className="btn btn-sm"
            style={{
              borderRadius: 'var(--radius-full)',
              padding: '5px 12px',
              fontSize: '12px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: perfMode === 'smooth' ? 'var(--color-primary-light)' : 'linear-gradient(135deg, #1B4D3E, #2D5A46)',
              color: perfMode === 'smooth' ? 'var(--color-primary)' : '#58FFC4',
              border: `1px solid ${perfMode === 'smooth' ? 'var(--color-primary-border)' : 'rgba(88, 255, 196, 0.4)'}`,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title={perfMode === 'smooth' ? "Currently in Smooth Mode (Low CPU/GPU). Click to enable Enhanced 3D" : "Currently in Enhanced Visuals. Click to switch to Smooth Mode"}
          >
            <span>{perfMode === 'smooth' ? '🌿 Smooth' : '✨ Enhanced'}</span>
          </button>

          <button
            onClick={() => navigate('profile')}
            className="btn btn-soft btn-sm"
            style={{ fontWeight: 600 }}
            title="Create Your Skin Profile"
          >
            <User size={14} />
            Create Profile
          </button>

          <button
            onClick={() => navigate('profile')}
            className="user-pill"
            style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)', cursor: 'pointer' }}
            title="View Current Profile"
          >
            <div className="user-avatar">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <span>{profile?.skin_type || 'Profile'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
