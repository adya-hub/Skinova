import React, { Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Code-split pages for optimized bundle loading
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SkinProfilePage = lazy(() => import('./pages/SkinProfilePage'));
const AnalyzeSkinPage = lazy(() => import('./pages/AnalyzeSkinPage'));
const AnalysisReportPage = lazy(() => import('./pages/AnalysisReportPage'));
const AskSkinovaPage = lazy(() => import('./pages/AskSkinovaPage'));
const IngredientCheckerPage = lazy(() => import('./pages/IngredientCheckerPage'));
const RoutineBuilderPage = lazy(() => import('./pages/RoutineBuilderPage'));
const ProgressTrackingPage = lazy(() => import('./pages/ProgressTrackingPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));

function PageFallback() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      color: 'var(--color-primary)'
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        border: '3px solid var(--color-primary-light)',
        borderTopColor: 'var(--color-primary)',
        animation: 'spin 0.8s linear infinite'
      }} />
      <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-muted)' }}>
        Loading Skinova...
      </span>
    </div>
  );
}

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
        <Suspense fallback={<PageFallback />}>
          {renderPage()}
        </Suspense>
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
