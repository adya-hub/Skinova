import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Sparkles, ArrowRight, User, Mail, Lock } from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

export default function SignupPage() {
  const { setUser, setProfile, navigate, showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.signup(name, email, password);
      setUser(res.user);
      if (res.profile) setProfile(res.profile);
      showToast('Account created successfully! Welcome to Skinova.');
      navigate('profile');
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
            <h1 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>Join Skinova AI</h1>
            <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)' }}>
              Understand your skin and build smarter daily habits.
            </p>
          </div>

          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Lee"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
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
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: '16px' }}
            >
              {loading ? 'Creating Account...' : 'Get Started'}
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '13.5px', color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <a
              href="#login"
              onClick={(e) => { e.preventDefault(); navigate('login'); }}
              style={{ color: 'var(--color-primary)', fontWeight: 600 }}
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
