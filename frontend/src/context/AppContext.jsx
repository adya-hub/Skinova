import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState({
    id: 'demo_user',
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com'
  });

  const [profile, setProfile] = useState({
    skin_type: 'Combination',
    primary_concern: 'Acne-like breakouts',
    secondary_concerns: ['Visible dark spots', 'Mild redness around nose'],
    age_range: '25-34',
    current_routine: 'Gentle foam cleanser, hyaluronic serum, lightweight moisturizer',
    products_used: ['CeraVe Foaming Cleanser', 'The Ordinary Hyaluronic Acid 2% + B5', 'Neutrogena Hydro Boost'],
    breakout_frequency: '1-2 times per month',
    sun_exposure: 'Moderate (outdoor walks 3-4 days/week)',
    lifestyle_notes: 'Works in an air-conditioned office; drinks 2L water daily'
  });

  const [currentReport, setCurrentReport] = useState(null);
  const [activePage, setActivePage] = useState('home');
  const [pageParams, setPageParams] = useState({});
  const [toast, setToast] = useState(null);

  // Sync profile on mount
  useEffect(() => {
    api.getProfile(user.id)
      .then(p => {
        if (p) setProfile(p);
      })
      .catch(err => console.log('Using default local profile:', err.message));
  }, [user.id]);

  // Handle URL hash changes for deep linking
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      const [page, id] = hash.split('/');
      setActivePage(page);
      if (id) setPageParams({ id });
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigate = (page, params = {}) => {
    setActivePage(page);
    setPageParams(params);
    const hash = params.id ? `#${page}/${params.id}` : `#${page}`;
    window.location.hash = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Performance Mode: 'smooth' (default for low/mid hardware & battery saving) vs 'enhanced'
  const [perfMode, setPerfMode] = useState(() => {
    const saved = localStorage.getItem('skinova_perf_mode');
    if (saved === 'smooth' || saved === 'enhanced') return saved;
    // Auto-detect prefers-reduced-motion or modest hardware (<= 4 CPU cores or small mobile)
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const isModestDevice = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || window.innerWidth < 768;
    return (prefersReducedMotion || isModestDevice) ? 'smooth' : 'smooth'; // Smooth Mode default ensures great experience everywhere
  });

  useEffect(() => {
    document.documentElement.dataset.perfMode = perfMode;
    localStorage.setItem('skinova_perf_mode', perfMode);
  }, [perfMode]);

  const togglePerfMode = () => {
    setPerfMode((prev) => {
      const next = prev === 'smooth' ? 'enhanced' : 'smooth';
      showToast(next === 'smooth' ? '🌿 Smooth Mode activated (low battery & high FPS)' : '✨ Enhanced 3D Visuals activated', 'info');
      return next;
    });
  };

  const updateProfileContext = async (newFields) => {
    try {
      const res = await api.updateProfile(newFields, user.id);
      if (res.profile) {
        setProfile(res.profile);
        showToast('Skin profile updated successfully');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        profile,
        setProfile,
        updateProfileContext,
        currentReport,
        setCurrentReport,
        activePage,
        pageParams,
        navigate,
        toast,
        showToast,
        perfMode,
        setPerfMode,
        togglePerfMode
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
