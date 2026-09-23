import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SkinProfilePage from './pages/SkinProfilePage';
import AnalyzeSkinPage from './pages/AnalyzeSkinPage';
import AnalysisReportPage from './pages/AnalysisReportPage';
import AskSkinovaPage from './pages/AskSkinovaPage';
import IngredientCheckerPage from './pages/IngredientCheckerPage';
import RoutineBuilderPage from './pages/RoutineBuilderPage';
import ProgressTrackingPage from './pages/ProgressTrackingPage';
import PrivacyPage from './pages/PrivacyPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function MainRouter() {
  const { activePage, toast } = useApp();

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <LandingPage />;
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return <SkinProfilePage />;
      case 'analyze':
        return <AnalyzeSkinPage />;
      case 'report':
        return <AnalysisReportPage />;
      case 'chat':
        return <AskSkinovaPage />;
      case 'ingredients':
        return <IngredientCheckerPage />;
      case 'routine':
        return <RoutineBuilderPage />;
      case 'progress':
        return <ProgressTrackingPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'about':
        return <AboutPage />;
      case 'login':
        return <LoginPage />;
      case 'signup':
        return <SignupPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 72px)' }}>
        {renderPage()}
      </main>
      <Footer />

      {/* Global Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: toast.type === 'error' ? 'var(--color-rose-bg)' : 'var(--color-surface)',
            color: toast.type === 'error' ? 'var(--color-rose-text)' : 'var(--color-primary)',
            border: `1px solid ${toast.type === 'error' ? 'var(--color-rose-border)' : 'var(--color-primary-border)'}`,
            padding: '12px 20px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 9999,
            fontSize: '13.5px',
            fontWeight: 600,
            animation: 'fadeIn 0.2s ease-in-out'
          }}
        >
          {toast.message}
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
