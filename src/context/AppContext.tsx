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
import {
  isFirebaseActive,
  subscribeToSettings,
  subscribeToCollection,
  seedFirestoreIfEmpty,
  getConfigSource,
} from '../services/firebase.ts';

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
  selectedTeamMember: TeamMember | null;
  setSelectedTeamMember: (m: TeamMember | null) => void;
  quotePreset: { service?: string; package?: string } | null;
  setQuotePreset: (p: { service?: string; package?: string } | null) => void;
  loading: boolean;
  refreshData: () => Promise<void>;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: number) => void;
  isCloudActive: boolean;
  cloudSyncMode: string;
  lastUpdatedTime: string | null;
  dataSource: string;
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
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(null);
  const [quotePreset, setQuotePreset] = useState<{ service?: string; package?: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [isCloudActive, setIsCloudActive] = useState<boolean>(() => isFirebaseActive());
  const [cloudSyncMode, setCloudSyncMode] = useState<string>(() => (isFirebaseActive() ? 'firestore' : 'disconnected'));
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>(() => (isFirebaseActive() ? 'Firestore' : 'Disconnected (Firebase connected nahi hai)'));

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    let displayMessage = message;
    if (typeof message === 'string' && message.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(message);
        if (parsed.error) {
          displayMessage = parsed.error + (parsed.path ? ` (${parsed.path})` : '');
        }
      } catch {
        // use raw message
      }
    }
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message: displayMessage, type }]);
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
      if (isFirebaseActive()) {
        setLastUpdatedTime(new Date().toLocaleTimeString());
      }
    } catch {
      // Graceful fallback to initial bundled data
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Real-time synchronization
  useEffect(() => {
    const active = isFirebaseActive();
    setIsCloudActive(active);
    setCloudSyncMode(active ? `firestore (${getConfigSource()})` : 'disconnected');
    setDataSource(active ? 'Firestore' : 'Disconnected (Firebase connected nahi hai)');

    // If Firebase Firestore is active, set up real-time listener subscriptions
    if (active) {
      seedFirestoreIfEmpty().catch((e) => console.warn('Seed note:', e));

      const unsubSettings = subscribeToSettings((data) => {
        if (data && typeof data === 'object') {
          setSettings((prev) => ({
            ...initialSettings,
            ...prev,
            ...data,
            hero: { ...initialSettings.hero, ...(prev?.hero || {}), ...(data?.hero || {}) },
            about: { ...initialSettings.about, ...(prev?.about || {}), ...(data?.about || {}) },
            socials: { ...initialSettings.socials, ...(prev?.socials || {}), ...(data?.socials || {}) },
            seo: { ...initialSettings.seo, ...(prev?.seo || {}), ...(data?.seo || {}) },
            legal: {
              privacyPolicy: data?.legal?.privacyPolicy ?? prev?.legal?.privacyPolicy ?? initialSettings.legal?.privacyPolicy ?? '',
              termsAndConditions: data?.legal?.termsAndConditions ?? prev?.legal?.termsAndConditions ?? initialSettings.legal?.termsAndConditions ?? '',
            },
            theme: {
              accentColor: data?.theme?.accentColor ?? prev?.theme?.accentColor ?? initialSettings.theme?.accentColor ?? '#E50914',
              mode: (data?.theme?.mode ?? prev?.theme?.mode ?? initialSettings.theme?.mode ?? 'cinematic') as 'cinematic' | 'dark',
            },
          }));
          setLastUpdatedTime(new Date().toLocaleTimeString());
        }
      });

      const unsubServices = subscribeToCollection<ServiceItem>('services', (items) => {
        if (items && items.length > 0) {
          setServices(items);
          setLastUpdatedTime(new Date().toLocaleTimeString());
        }
      });

      const unsubPortfolio = subscribeToCollection<PortfolioItem>('portfolio', (items) => {
        if (items && items.length > 0) {
          setPortfolio(items);
          setLastUpdatedTime(new Date().toLocaleTimeString());
        }
      });

      const unsubPackages = subscribeToCollection<PackageItem>('packages', (items) => {
        if (items && items.length > 0) {
          setPackages(items);
          setLastUpdatedTime(new Date().toLocaleTimeString());
        }
      });

      const unsubTestimonials = subscribeToCollection<TestimonialItem>('testimonials', (items) => {
        if (items && items.length > 0) {
          setTestimonials(items);
          setLastUpdatedTime(new Date().toLocaleTimeString());
        }
      });

      const unsubFaqs = subscribeToCollection<FaqItem>('faqs', (items) => {
        if (items && items.length > 0) {
          setFaqs(items);
          setLastUpdatedTime(new Date().toLocaleTimeString());
        }
      });

      const unsubTeam = subscribeToCollection<TeamMember>('team', (items) => {
        if (items && items.length > 0) {
          setTeam(items);
          setLastUpdatedTime(new Date().toLocaleTimeString());
        }
      });

      return () => {
        unsubSettings?.();
        unsubServices?.();
        unsubPortfolio?.();
        unsubPackages?.();
        unsubTestimonials?.();
        unsubFaqs?.();
        unsubTeam?.();
      };
    }

    // BroadcastChannel for cross-tab immediate synchronization
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('shifa_cloud_sync');
      channel.onmessage = () => {
        refreshData();
      };
    } catch {
      // Fallback
    }

    // Storage event for other tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('shifa_')) {
        refreshData();
      }
    };
    window.addEventListener('storage', handleStorage);

    // Refresh when user returns to tab or window
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshData();
      }
    };
    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', refreshData);

    // Periodic synchronization poll (every 10s)
    const pollInterval = window.setInterval(() => {
      refreshData();
    }, 10000);

    return () => {
      channel?.close();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', refreshData);
      window.clearInterval(pollInterval);
    };
  }, [refreshData]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '') as PageRoute;
      if (hash && ['home', 'about', 'team', 'services', 'portfolio', 'pricing', 'contact', 'quote', 'faq', 'privacy', 'terms', 'admin-login', 'admin-dashboard'].includes(hash)) {
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
        selectedTeamMember,
        setSelectedTeamMember,
        quotePreset,
        setQuotePreset,
        loading,
        refreshData,
        toasts,
        showToast,
        removeToast,
        isCloudActive,
        cloudSyncMode,
        lastUpdatedTime,
        dataSource,
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
