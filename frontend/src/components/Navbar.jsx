import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Shield, User, Camera, MessageSquare, BookOpen, Layers, TrendingUp } from 'lucide-react';

export default function Navbar() {
  const { activePage, navigate, user, profile } = useApp();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'analyze', label: 'Analyze', highlight: true },
    { id: 'profile', label: 'My Skin' },
    { id: 'chat', label: 'Ask Skinova' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'routine', label: 'Routine' },
    { id: 'progress', label: 'Progress' }
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand */}
        <a href="#home" onClick={(e) => { e.preventDefault(); navigate('home'); }} className="brand-logo">
          <div className="brand-icon">
            <Sparkles size={18} />
          </div>
          <div>
            Skinova <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-accent)' }}>AI</span>
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
                style={item.highlight ? { color: 'var(--color-primary)', fontWeight: 600 } : {}}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* User Actions */}
        <div className="nav-actions">
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
            style={{ border: 'none', background: 'var(--color-surface)', cursor: 'pointer' }}
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
