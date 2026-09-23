import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Sparkles, Lock, Mail, ArrowRight } from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

export default function LoginPage() {
  const { setUser, setProfile, navigate, showToast } = useApp();
  const [email, setEmail] = useState('alex.morgan@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.login(email, password);
      setUser(res.user);
      if (res.profile) setProfile(res.profile);
      showToast('Welcome back, ' + res.user.name);
      navigate('dashboard');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container-narrow" style={{ maxWidth: '440px' }}>
        <MedicalDisclaimer compact={true} />

        <div className="card" style={{ padding: '36px 30px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div className="brand-icon" style={{ width: '42px', height: '42px', margin: '0 auto 12px' }}>
              <Sparkles size={22} />
            </div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>Sign In to Skinova</h1>
            <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)' }}>
              Access your personalized skin profile and reports.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: '16px' }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '13.5px', color: 'var(--color-text-muted)' }}>
            Don't have an account?{' '}
            <a
              href="#signup"
              onClick={(e) => { e.preventDefault(); navigate('signup'); }}
              style={{ color: 'var(--color-primary)', fontWeight: 600 }}
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
