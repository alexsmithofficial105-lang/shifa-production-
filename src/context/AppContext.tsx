import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  PageRoute,
  SiteSettings,
  ServiceItem,
  PortfolioItem,
  PackageItem,
  TestimonialItem,
  FaqItem,
  TeamMember,
} from '../types/index.ts';
import { apiClient } from '../api/client.ts';
import {
  initialSettings,
  initialServices,
  initialPortfolio,
  initialPackages,
  initialTestimonials,
  initialFaqs,
  initialTeam,
} from '../data/initialData.ts';

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
  team: TeamMember[];
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
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(initialPortfolio);
  const [packages, setPackages] = useState<PackageItem[]>(initialPackages);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [quotePreset, setQuotePreset] = useState<{ service?: string; package?: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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
      const [sett, srv, prt, pkg, tst, fq, tm] = await Promise.all([
        apiClient.getSettings().catch(() => null),
        apiClient.getServices().catch(() => []),
        apiClient.getPortfolio().catch(() => []),
        apiClient.getPackages().catch(() => []),
        apiClient.getTestimonials().catch(() => []),
        apiClient.getFaqs().catch(() => []),
        apiClient.getTeam().catch(() => []),
      ]);
      if (sett) setSettings(sett);
      if (srv && srv.length > 0) setServices(srv);
      if (prt && prt.length > 0) setPortfolio(prt);
      if (pkg && pkg.length > 0) setPackages(pkg);
      if (tst && tst.length > 0) setTestimonials(tst);
      if (fq && fq.length > 0) setFaqs(fq);
      if (tm && tm.length > 0) setTeam(tm);
    } catch {
      // Graceful fallback to initial bundled data on static platforms like Netlify
    } finally {
      setLoading(false);
    }
  }, []);

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
        team,
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
