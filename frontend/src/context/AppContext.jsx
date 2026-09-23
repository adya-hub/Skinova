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
        showToast
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
