import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  PageRoute,
  SiteSettings,
  ServiceItem,
  PortfolioItem,
  PackageItem,
  TestimonialItem,
  FaqItem,
} from '../types/index.ts';
import { apiClient } from '../api/client.ts';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentRoute: PageRoute;
  navigateTo: (route: PageRoute, options?: { scrollToTop?: boolean; preset?: { service?: string; package?: string } }) => void;
  settings: SiteSettings | null;
  services: ServiceItem[];
  portfolio: PortfolioItem[];
  packages: PackageItem[];
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
  selectedProject: PortfolioItem | null;
  setSelectedProject: (p: PortfolioItem | null) => void;
  selectedService: ServiceItem | null;
  setSelectedService: (s: ServiceItem | null) => void;
  quotePreset: { service?: string; package?: string } | null;
  setQuotePreset: (p: { service?: string; package?: string } | null) => void;
  loading: boolean;
  refreshData: () => Promise<void>;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('home');
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [quotePreset, setQuotePreset] = useState<{ service?: string; package?: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const [sett, srv, prt, pkg, tst, fq] = await Promise.all([
        apiClient.getSettings(),
        apiClient.getServices(),
        apiClient.getPortfolio(),
        apiClient.getPackages(),
        apiClient.getTestimonials(),
        apiClient.getFaqs(),
      ]);
      setSettings(sett);
      setServices(srv);
      setPortfolio(prt);
      setPackages(pkg);
      setTestimonials(tst);
      setFaqs(fq);
    } catch (err) {
      console.error('Failed to load website content:', err);
      showToast('Could not load some content from server.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '') as PageRoute;
      if (hash && ['home', 'about', 'services', 'portfolio', 'pricing', 'contact', 'quote', 'faq', 'privacy', 'terms', 'admin-login', 'admin-dashboard'].includes(hash)) {
        setCurrentRoute(hash);
      } else if (!hash) {
        setCurrentRoute('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    if (window.location.hash) {
      handlePopState();
    }
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (
    route: PageRoute,
    options?: { scrollToTop?: boolean; preset?: { service?: string; package?: string } }
  ) => {
    if (options?.preset) {
      setQuotePreset(options.preset);
    }
    setCurrentRoute(route);
    window.location.hash = route === 'home' ? '' : `#${route}`;
    if (options?.scrollToTop !== false) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigateTo,
        settings,
        services,
        portfolio,
        packages,
        testimonials,
        faqs,
        selectedProject,
        setSelectedProject,
        selectedService,
        setSelectedService,
        quotePreset,
        setQuotePreset,
        loading,
        refreshData,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};
