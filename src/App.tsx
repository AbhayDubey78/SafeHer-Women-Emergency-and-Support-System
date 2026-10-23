import React, { useState } from 'react';
import { SafetyProvider, useSafety } from './context/SafetyContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';

// Modals
import { SOSCountdownModal } from './components/common/SOSCountdownModal';
import { EmergencyActiveModal } from './components/common/EmergencyActiveModal';
import { FakeCallModal } from './components/common/FakeCallModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { LiveLocationPage } from './pages/LiveLocationPage';
import { TrustedContactsPage } from './pages/TrustedContactsPage';
import { SafetyMonitoringPage } from './pages/SafetyMonitoringPage';
import { EmergencyHistoryPage } from './pages/EmergencyHistoryPage';
import { EmergencyResourcesPage } from './pages/EmergencyResourcesPage';
import { SafetyTipsPage } from './pages/SafetyTipsPage';
import { ArchitectureViewerPage } from './pages/ArchitectureViewerPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';

const AppContent: React.FC = () => {
  const { user } = useSafety();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'landing':
        return (
          <LandingPage
            onGetStarted={() => setActiveTab('dashboard')}
            onViewArchitecture={() => setActiveTab('architecture')}
          />
        );
      case 'login':
        return (
          <LoginPage
            onLoginSuccess={() => setActiveTab('dashboard')}
            onNavigateSignup={() => setActiveTab('signup')}
          />
        );
      case 'signup':
        return (
          <SignupPage
            onSignupSuccess={() => setActiveTab('dashboard')}
            onNavigateLogin={() => setActiveTab('login')}
          />
        );
      case 'dashboard':
        return <DashboardPage setActiveTab={setActiveTab} />;
      case 'emergency':
        return <EmergencyPage />;
      case 'location':
        return <LiveLocationPage />;
      case 'contacts':
        return <TrustedContactsPage />;
      case 'monitoring':
        return <SafetyMonitoringPage />;
      case 'history':
        return <EmergencyHistoryPage />;
      case 'resources':
        return <EmergencyResourcesPage />;
      case 'tips':
        return <SafetyTipsPage />;
      case 'architecture':
        return <ArchitectureViewerPage />;
      case 'profile':
        return <ProfilePage />;
      case 'about':
        return <AboutPage />;
      default:
        return <DashboardPage setActiveTab={setActiveTab} />;
    }
  };

  // Full-bleed views for Landing, Login, Signup
  const isFullBleed = activeTab === 'landing' || activeTab === 'login' || activeTab === 'signup';

  if (isFullBleed) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        {renderCurrentPage()}
        <SOSCountdownModal />
        <EmergencyActiveModal />
        <FakeCallModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="flex-1 flex">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobileOpen={isMobileMenuOpen}
          closeMobileMenu={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Global Safety Modals */}
      <SOSCountdownModal />
      <EmergencyActiveModal />
      <FakeCallModal />
    </div>
  );
};

export function App() {
  return (
    <SafetyProvider>
      <AppContent />
    </SafetyProvider>
  );
}

export default App;
