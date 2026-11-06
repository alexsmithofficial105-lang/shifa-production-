import React from 'react';
import { AuthProvider } from './context/AuthContext.tsx';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { ToastContainer } from './components/common/Toast.tsx';
import { ProjectDetailModal } from './components/modals/ProjectDetailModal.tsx';
import { ServiceDetailModal } from './components/modals/ServiceDetailModal.tsx';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp.tsx';

import { HomePage } from './pages/HomePage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ServicesPage } from './pages/ServicesPage.tsx';
import { PortfolioPage } from './pages/PortfolioPage.tsx';
import { PricingPage } from './pages/PricingPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { FaqPage } from './pages/FaqPage.tsx';
import { LegalPage } from './pages/LegalPage.tsx';
import { AdminLoginPage } from './pages/AdminLoginPage.tsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx';
import { TeamPage } from './pages/TeamPage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';
import { TeamMemberModal } from './components/modals/TeamMemberModal.tsx';
import { AlertTriangle, Database } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentRoute, loading, isCloudActive, navigateTo } = useApp();

  const isAdminDashboard = currentRoute === 'admin-dashboard';

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'team':
        return <TeamPage />;
      case 'services':
        return <ServicesPage />;
      case 'portfolio':
        return <PortfolioPage />;
      case 'pricing':
        return <PricingPage />;
      case 'contact':
      case 'quote':
        return <ContactPage />;
      case 'faq':
        return <FaqPage />;
      case 'privacy':
        return <LegalPage type="privacy" />;
      case 'terms':
        return <LegalPage type="terms" />;
      case 'admin-login':
        return <AdminLoginPage />;
      case 'admin-dashboard':
        return <AdminDashboardPage />;
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#060913] text-neutral-100 selection:bg-[#2563eb] selection:text-white">
      {/* Prominent Cloud Connection Warning if Firebase is not active */}
      {!isCloudActive && (
        <div className="bg-rose-950/95 border-b border-rose-800 text-rose-200 px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3 z-50 shadow-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>Firebase connected nahi hai:</strong> Website cloud database se connected nahi hai. Changes doosre devices par sync nahi hon gi jab tak Firebase credentials connect na hon.
            </span>
          </div>
          <button
            onClick={() => navigateTo('admin-dashboard')}
            className="px-3.5 py-1 rounded-lg bg-rose-800 hover:bg-rose-700 text-white font-semibold text-[11px] transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Connect Firebase Now</span>
          </button>
        </div>
      )}

      {!isAdminDashboard && <Navbar />}

      <main className="flex-1">
        {loading ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#2563eb] border-t-transparent animate-spin" />
              <span className="text-xs font-brand tracking-widest uppercase text-[#3b82f6]">
                Shifa Productions
              </span>
            </div>
          </div>
        ) : (
          renderCurrentPage()
        )}
      </main>

      {!isAdminDashboard && <Footer />}

      {/* Global Modals & Notifications */}
      <ProjectDetailModal />
      <ServiceDetailModal />
      <TeamMemberModal />
      <ToastContainer />
      <FloatingWhatsApp />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
