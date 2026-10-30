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
import { NotFoundPage } from './pages/NotFoundPage.tsx';

const AppContent: React.FC = () => {
  const { currentRoute, loading } = useApp();

  const isAdminDashboard = currentRoute === 'admin-dashboard';

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
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
