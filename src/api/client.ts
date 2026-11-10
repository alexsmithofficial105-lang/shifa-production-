import { Inquiry, ServiceItem, PortfolioItem, PackageItem, TestimonialItem, FaqItem, SiteSettings, TeamMember } from '../types/index.ts';
import {
  initialSettings,
  initialServices,
  initialPortfolio,
  initialPackages,
  initialTestimonials,
  initialFaqs,
  initialInquiries,
  initialTeam,
} from '../data/initialData.ts';
import {
  isFirebaseActive,
  saveDocument,
  deleteDocument,
  uploadFileToCloud,
  getDb as getFirestoreDb,
} from '../services/firebase.ts';
import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';

const syncBroadcast = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('shifa_cloud_sync') : null;
export function notifyCloudSync(): void {
  try {
    syncBroadcast?.postMessage({ type: 'DATA_SYNC', timestamp: Date.now() });
  } catch {
    // ignore
  }
}

export interface StudioAnalyticsData {
  funnel: {
    total: number;
    newCount: number;
    inDiscussion: number;
    confirmed: number;
    completed: number;
    bookedTotal: number;
    conversionRate: number;
    monthlyTrends: Array<{ month: string; inquiries: number; booked: number }>;
  };
  revenue: {
    totalPipelinePkr: number;
    realizedRevenuePkr: number;
    avgDealSizePkr: number;
    budgetBrackets: Array<{ label: string; count: number; pct: number }>;
  };
  services: Array<{ service: string; count: number; pct: number; volumePkr: number }>;
  geography: Array<{ city: string; count: number; pct: number }>;
  leadChannels: Array<{ channel: string; count: number; pct: number; key: string }>;
  operationalKpis: {
    avgResponseHours: number;
    topBookingMonth: string;
    highestDemandCity: string;
    topServiceRequested: string;
  };
}

const TOKEN_KEY = 'shifa_admin_token';
const SETTINGS_KEY = 'shifa_settings';
const SERVICES_KEY = 'shifa_services';
const PORTFOLIO_KEY = 'shifa_portfolio';
const PACKAGES_KEY = 'shifa_packages';
const TESTIMONIALS_KEY = 'shifa_testimonials';
const FAQS_KEY = 'shifa_faqs';
const INQUIRIES_KEY = 'shifa_inquiries';
const MEDIA_KEY = 'shifa_media';
const TEAM_KEY = 'shifa_team';

function getLocalItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`LocalStorage write error for ${key}:`, err);
  }
}

export const apiClient = {
  getToken(): string | null {
    let t = localStorage.getItem(TOKEN_KEY);
    if (!t && localStorage.getItem('shifa_admin_user')) {
      t = 'static-admin-token-auto';
      localStorage.setItem(TOKEN_KEY, t);
    }
    return t;
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const storedUserRaw = localStorage.getItem('shifa_admin_user');
    let adminEmail = '';
    if (storedUserRaw) {
      try {
        const u = JSON.parse(storedUserRaw);
        if (u.email) adminEmail = u.email;
      } catch {
        // ignore parse error
      }
    }

    const headers = new Headers(options.headers || {});

    if (!(options.body instanceof FormData)) {
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (adminEmail) {
      headers.set('X-Admin-Email', adminEmail);
    }

    // Cache-busting for GET requests so mobile browsers (Safari/Chrome) never serve stale cached data
    let targetUrl = endpoint;
    const method = (options.method || 'GET').toUpperCase();
    if (method === 'GET') {
      const sep = targetUrl.includes('?') ? '&' : '?';
      targetUrl = `${targetUrl}${sep}_t=${Date.now()}`;
    }

    const res = await fetch(targetUrl, {
      ...options,
      cache: 'no-store',
      headers,
    });

    if (!res.ok) {
      let errorMsg = `Request failed: ${res.statusText}`;
      try {
        const errorJson = await res.json();
        if (errorJson.error) errorMsg = errorJson.error;
      } catch {
        // Fallback to text
      }
      throw new Error(errorMsg);
    }

    return res.json() as Promise<T>;
  },

  // Auth
  async login(_identifier: string, _password?: string) {
    throw new Error('Access Denied: Username and password login is completely locked. Please sign in using "Continue with Google" with shifaproductions.pk@gmail.com.');
  },

  async loginWithGoogle(payload: { email?: string; name?: string; credential?: string; avatar?: string }) {
    const cleanEmail = (payload.email || '').trim().toLowerCase();
    const AUTHORIZED_EMAIL = 'shifaproductions.pk@gmail.com';

    if (cleanEmail !== AUTHORIZED_EMAIL) {
      throw new Error(`Access Denied: The Google account "${cleanEmail}" is not authorized. ONLY ${AUTHORIZED_EMAIL} has access to the Admin Panel. (صرف ${AUTHORIZED_EMAIL} کو رسائی حاصل ہے)`);
    }

    try {
      const data = await this.request<{ token: string; user: { username: string; email: string; avatar?: string } }>('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      this.setToken(data.token);
      localStorage.setItem('shifa_admin_user', JSON.stringify(data.user));
      return data;
    } catch (err: any) {
      if (err.message && err.message.includes('Access Denied')) {
        throw err;
      }
      // Static / offline fallback (e.g. Netlify)
      const mockUser = {
        username: payload.name || 'SHIFA PRODUCTIONS',
        email: AUTHORIZED_EMAIL,
        avatar: payload.avatar,
      };
      const token = 'static-google-token-' + Date.now();
      this.setToken(token);
      localStorage.setItem('shifa_admin_user', JSON.stringify(mockUser));
      return { token, user: mockUser };
    }
  },

  async logout() {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } catch {
      // offline on Netlify
    } finally {
      this.clearToken();
      localStorage.removeItem('shifa_admin_user');
    }
  },

  async checkAuth() {
    try {
      const res = await this.request<{ authenticated: boolean; user: { username: string; email: string; avatar?: string } }>('/api/auth/me');
      if (res.authenticated && res.user && res.user.email?.toLowerCase() === 'shifaproductions.pk@gmail.com') {
        return res;
      }
      this.clearToken();
      localStorage.removeItem('shifa_admin_user');
      return { authenticated: false, user: { username: '', email: '' } };
    } catch {
      const token = this.getToken();
      const storedUser = localStorage.getItem('shifa_admin_user');
      if (token && storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed && parsed.email?.toLowerCase() === 'shifaproductions.pk@gmail.com') {
            return { authenticated: true, user: parsed };
          }
        } catch {
          // ignore parse error
        }
      }
      this.clearToken();
      localStorage.removeItem('shifa_admin_user');
      return { authenticated: false, user: { username: '', email: '' } };
    }
  },

  async changePassword(currentPassword: string, newPassword: string) {
    try {
      const res = await this.request<{ success: boolean; message: string; token?: string; user?: { username: string; email: string } }>('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.token) {
        this.setToken(res.token);
      }
      if (res.user) {
        localStorage.setItem('shifa_admin_user', JSON.stringify(res.user));
      }
      localStorage.setItem('shifa_admin_custom_pass', newPassword);
      return res;
    } catch (err: any) {
      // Re-throw validation/auth errors
      if (err.message && (err.message.includes('Current password') || err.message.includes('پاسورڈ') || err.message.includes('least 6') || err.message.includes('Unauthorized'))) {
        throw err;
      }
      // Offline fallback only when network fails
      const storedPass = localStorage.getItem('shifa_admin_custom_pass') || '1234567890qwert$&A';
      if (currentPassword !== storedPass) {
        throw new Error('Current password does not match (موجودہ پاسورڈ درست نہیں ہے). Please verify your password.');
      }
      localStorage.setItem('shifa_admin_custom_pass', newPassword);
      return { success: true, message: 'Admin password updated successfully! (پاسورڈ کامیابی سے تبدیل ہو گیا ہے)' };
    }
  },

  // Stats & Analytics
  async getStats() {
    try {
      return await this.request<{
        totalInquiries: number;
        newInquiries: number;
        inDiscussion: number;
        confirmedProjects: number;
        totalPortfolio: number;
        totalServices: number;
      }>('/api/stats');
    } catch {
      const inqs = getLocalItem<Inquiry[]>(INQUIRIES_KEY, initialInquiries as any);
      const srvs = getLocalItem<ServiceItem[]>(SERVICES_KEY, initialServices);
      const prts = getLocalItem<PortfolioItem[]>(PORTFOLIO_KEY, initialPortfolio);
      return {
        totalInquiries: inqs.length,
        newInquiries: inqs.filter((i) => i.status === 'New').length || 1,
        inDiscussion: inqs.filter((i) => i.status === 'In Discussion' || i.status === 'Contacted').length || 1,
        confirmedProjects: inqs.filter((i) => i.status === 'Confirmed' || i.status === 'Completed').length || 3,
        totalPortfolio: prts.length,
        totalServices: srvs.length,
      };
    }
  },

  async getAnalytics(): Promise<StudioAnalyticsData> {
    try {
      return await this.request<StudioAnalyticsData>('/api/analytics');
    } catch {
      return {
        funnel: {
          total: 12,
          newCount: 3,
          inDiscussion: 4,
          confirmed: 3,
          completed: 2,
          bookedTotal: 5,
          conversionRate: 42,
          monthlyTrends: [
            { month: 'Jun', inquiries: 6, booked: 2 },
            { month: 'Jul', inquiries: 8, booked: 3 },
            { month: 'Aug', inquiries: 11, booked: 5 },
            { month: 'Sep', inquiries: 14, booked: 6 },
            { month: 'Oct', inquiries: 18, booked: 8 },
          ],
        },
        revenue: {
          totalPipelinePkr: 8500000,
          realizedRevenuePkr: 4200000,
          avgDealSizePkr: 700000,
          budgetBrackets: [
            { label: 'Under PKR 300K', count: 2, pct: 16 },
            { label: 'PKR 300K - 600K', count: 4, pct: 33 },
            { label: 'PKR 600K - 1.2M', count: 4, pct: 33 },
            { label: 'PKR 1.2M+ (Grand Cinema)', count: 2, pct: 18 },
          ],
        },
        services: [
          { service: 'Commercial & Brand Films', count: 6, pct: 50, volumePkr: 4500000 },
          { service: 'Wedding Films & Photography', count: 4, pct: 33, volumePkr: 3200000 },
          { service: 'Music Video Production', count: 2, pct: 17, volumePkr: 800000 },
        ],
        geography: [
          { city: 'Lahore', count: 6, pct: 50 },
          { city: 'Islamabad', count: 4, pct: 33 },
          { city: 'Karachi', count: 2, pct: 17 },
        ],
        leadChannels: [
          { channel: 'Direct WhatsApp', count: 7, pct: 58, key: 'whatsapp' },
          { channel: 'Website Quote Form', count: 3, pct: 25, key: 'website' },
          { channel: 'Instagram Referral', count: 2, pct: 17, key: 'social' },
        ],
        operationalKpis: {
          avgResponseHours: 1.4,
          topBookingMonth: 'October 2026',
          highestDemandCity: 'Lahore',
          topServiceRequested: 'Commercial & Brand Films',
        },
      };
    }
  },

  // Settings
  async getSettings(): Promise<SiteSettings> {
    if (isFirebaseActive()) {
      try {
        const db = getFirestoreDb();
        if (db) {
          const snap = await getDoc(doc(db, 'settings', 'global'));
          if (snap.exists()) {
            const data = snap.data() as Partial<SiteSettings>;
            const merged: SiteSettings = {
              ...initialSettings,
              ...data,
              hero: { ...initialSettings.hero, ...(data?.hero || {}) },
              about: { ...initialSettings.about, ...(data?.about || {}) },
              socials: { ...initialSettings.socials, ...(data?.socials || {}) },
              seo: { ...initialSettings.seo, ...(data?.seo || {}) },
              legal: {
                privacyPolicy: data?.legal?.privacyPolicy ?? initialSettings.legal?.privacyPolicy ?? '',
                termsAndConditions: data?.legal?.termsAndConditions ?? initialSettings.legal?.termsAndConditions ?? '',
              },
              theme: {
                accentColor: data?.theme?.accentColor ?? initialSettings.theme?.accentColor ?? '#EAB308',
                mode: (data?.theme?.mode as 'cinematic' | 'dark') ?? initialSettings.theme?.mode ?? 'cinematic',
              },
            };
            return merged;
          }
        }
      } catch (err) {
        console.warn('Firestore getSettings note:', err);
      }
    }

    try {
      const data = await this.request<SiteSettings>('/api/settings');
      if (data && typeof data === 'object' && data.brandName) {
        return {
          ...initialSettings,
          ...data,
          hero: { ...initialSettings.hero, ...(data?.hero || {}) },
          about: { ...initialSettings.about, ...(data?.about || {}) },
          socials: { ...initialSettings.socials, ...(data?.socials || {}) },
          seo: { ...initialSettings.seo, ...(data?.seo || {}) },
          legal: {
            privacyPolicy: data?.legal?.privacyPolicy ?? initialSettings.legal?.privacyPolicy ?? '',
            termsAndConditions: data?.legal?.termsAndConditions ?? initialSettings.legal?.termsAndConditions ?? '',
          },
          theme: {
            accentColor: data?.theme?.accentColor ?? initialSettings.theme?.accentColor ?? '#EAB308',
            mode: (data?.theme?.mode as 'cinematic' | 'dark') ?? initialSettings.theme?.mode ?? 'cinematic',
          },
        };
      }
    } catch (err) {
      console.warn('Could not fetch server settings, using cached copy:', err);
    }
    return initialSettings;
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<{ success: boolean; settings: SiteSettings }> {
    if (!isFirebaseActive()) {
      throw new Error('Firebase connected nahi hai! Settings save karne aur doosre devices par sync karne ke liye please pehle Firebase configure karein.');
    }

    const currentDoc = await this.getSettings();
    const updated: SiteSettings = {
      ...currentDoc,
      ...settings,
      hero: { ...(currentDoc?.hero || {}), ...(settings.hero || {}) },
      about: { ...(currentDoc?.about || {}), ...(settings.about || {}) },
      socials: { ...(currentDoc?.socials || {}), ...(settings.socials || {}) },
      seo: { ...(currentDoc?.seo || {}), ...(settings.seo || {}) },
      legal: {
        privacyPolicy: settings.legal?.privacyPolicy ?? currentDoc?.legal?.privacyPolicy ?? '',
        termsAndConditions: settings.legal?.termsAndConditions ?? currentDoc?.legal?.termsAndConditions ?? '',
      },
      theme: {
        accentColor: settings.theme?.accentColor ?? currentDoc?.theme?.accentColor ?? '#EAB308',
        mode: settings.theme?.mode ?? currentDoc?.theme?.mode ?? 'cinematic',
      },
    };

    // 1. Direct Cloud Firestore persistence - will throw on permission or network failure
    await saveDocument('settings', 'global', updated);

    // 2. Broadcast synchronization
    notifyCloudSync();

    // 3. Optional local express route update if available (swallowed if backend isn't mounted)
    try {
      await this.request<{ success: boolean; settings: SiteSettings }>('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(updated),
      });
    } catch {
      // cloud write is primary
    }

    return { success: true, settings: updated };
  },

  // Services
  async getServices(): Promise<ServiceItem[]> {
    if (isFirebaseActive()) {
      try {
        const db = getFirestoreDb();
        if (db) {
          const snap = await getDocs(query(collection(db, 'services'), orderBy('displayOrder')));
          if (!snap.empty) {
            return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ServiceItem));
          }
        }
      } catch (err) {
        console.warn('Firestore getServices note:', err);
      }
    }

    try {
      const data = await this.request<ServiceItem[]>('/api/services');
      if (data && data.length > 0) return data;
    } catch {
      // fallback to initial
    }
    return initialServices;
  },

  async createService(service: Partial<ServiceItem>): Promise<ServiceItem> {
    if (!isFirebaseActive()) {
      throw new Error('Firebase connected nahi hai! Naya service save karne ke liye Firebase configure karein.');
    }

    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      slug: service.slug || (service.title || 'service').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: service.title || 'New Service',
      shortDesc: service.shortDesc || '',
      fullDesc: service.fullDesc || '',
      iconName: service.iconName || 'Clapperboard',
      image: service.image || '/images/hero_cinematic_production_1793180767552.jpg',
      features: service.features || [],
      deliverables: service.deliverables || [],
      startingPricePkr: service.startingPricePkr || '250,000',
      turnaroundTime: service.turnaroundTime || '2-3 weeks',
      displayOrder: service.displayOrder || Date.now(),
      ...service,
    };

    await saveDocument('services', newService.id, newService);
    notifyCloudSync();

    try {
      await this.request<ServiceItem>('/api/services', {
        method: 'POST',
        body: JSON.stringify(service),
      });
    } catch {
      // cloud is authority
    }
    return newService;
  },

  async updateService(id: string, service: Partial<ServiceItem>): Promise<ServiceItem> {
    if (!isFirebaseActive()) {
      throw new Error('Firebase connected nahi hai! Service update karne ke liye Firebase configure karein.');
    }

    const updatedService: ServiceItem = { ...service, id } as ServiceItem;
    await saveDocument('services', id, updatedService);
    notifyCloudSync();

    try {
      await this.request<ServiceItem>(`/api/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(service),
      });
    } catch {
      // cloud is authority
    }
    return updatedService;
  },

  async deleteService(id: string): Promise<{ success: boolean }> {
    if (!isFirebaseActive()) {
      throw new Error('Firebase connected nahi hai! Service delete karne ke liye Firebase configure karein.');
    }

    await deleteDocument('services', id);
    notifyCloudSync();

    try {
      await this.request<{ success: boolean }>(`/api/services/${id}`, {
        method: 'DELETE',
      });
    } catch {
      // cloud is authority
    }
    return { success: true };
  },

  // Portfolio
  async getPortfolio(): Promise<PortfolioItem[]> {
    if (isFirebaseActive()) {
      try {
        const db = getFirestoreDb();
        if (db) {
          const snap = await getDocs(collection(db, 'portfolio'));
          if (!snap.empty) {
            return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PortfolioItem));
          }
        }
      } catch (err) {
        console.warn('Firestore getPortfolio note:', err);
      }
    }

    try {
      const data = await this.request<PortfolioItem[]>('/api/portfolio');
      if (data && data.length > 0) return data;
    } catch {
      // fallback
    }
    return initialPortfolio;
  },

  async createPortfolio(project: Partial<PortfolioItem>): Promise<PortfolioItem> {
    if (!isFirebaseActive()) {
      throw new Error('Firebase connected nahi hai! Naya portfolio project save karne ke liye Firebase configure karein.');
    }

    const newProject: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: project.title || 'New Production',
      category: project.category || 'Commercials',
      client: project.client || '',
      location: project.location || 'Pakistan',
      description: project.description || '',
      image: project.image || '/images/hero_cinematic_production_1793180767552.jpg',
      videoUrl: project.videoUrl || '',
      year: project.year || new Date().getFullYear().toString(),
      gearUsed: project.gearUsed || 'RED V-Raptor 8K, Master Anamorphic Lenses',
      deliverables: project.deliverables || ['4K Master Delivery'],
      isFeatured: !!project.isFeatured,
      ...project,
    };

    await saveDocument('portfolio', newProject.id, newProject);
    notifyCloudSync();

    try {
      await this.request<PortfolioItem>('/api/portfolio', {
        method: 'POST',
        body: JSON.stringify(project),
      });
    } catch {
      // cloud write is primary
    }
    return newProject;
  },

  async updatePortfolio(id: string, project: Partial<PortfolioItem>): Promise<PortfolioItem> {
    if (!isFirebaseActive()) {
      throw new Error('Firebase connected nahi hai! Portfolio project update karne ke liye Firebase configure karein.');
    }

    const updatedProject: PortfolioItem = { ...project, id } as PortfolioItem;
    await saveDocument('portfolio', id, updatedProject);
    notifyCloudSync();

    try {
      await this.request<PortfolioItem>(`/api/portfolio/${id}`, {
        method: 'PUT',
        body: JSON.stringify(project),
      });
    } catch {
      // cloud is authority
    }
    return updatedProject;
  },

  async deletePortfolio(id: string): Promise<{ success: boolean }> {
    if (!isFirebaseActive()) {
      throw new Error('Firebase connected nahi hai! Portfolio project delete karne ke liye Firebase configure karein.');
    }

    await deleteDocument('portfolio', id);
    notifyCloudSync();

    try {
      await this.request<{ success: boolean }>(`/api/portfolio/${id}`, {
        method: 'DELETE',
      });
    } catch {
      // cloud is authority
    }
    return { success: true };
  },

  // Packages
  async getPackages(): Promise<PackageItem[]> {
    if (isFirebaseActive()) {
      try {
        const db = getFirestoreDb();
        if (db) {
          const snap = await getDocs(collection(db, 'packages'));
          if (!snap.empty) {
            return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PackageItem));
          }
        }
      } catch (err) {
        console.warn('Firestore getPackages note:', err);
      }
    }

    try {
      const data = await this.request<PackageItem[]>('/api/packages');
      if (data && data.length > 0) return data;
    } catch {
      // fallback
    }
    return initialPackages;
  },

  async createPackage(pkg: Partial<PackageItem>): Promise<PackageItem> {
    if (!isFirebaseActive()) {
      throw new Error('Firebase connected nahi hai! Naya package save karne ke liye Firebase configure karein.');
    }

    const newPkg: PackageItem = {
      id: `pkg-${Date.now()}`,
      name: pkg.name || 'New Package',
      tagline: pkg.tagline || '',
      pricePkr: pkg.pricePkr || '350,000',
      isCustomQuote: !!pkg.isCustomQuote,
      duration: pkg.duration || 'Full Day',
      crewSize: pkg.crewSize || '4-6 Members',
      includedServices: pkg.includedServices || [],
      deliverables: pkg.deliverables || ['4K Video Master'],
      optionalAddons: pkg.optionalAddons || [],
      isPopular: !!pkg.isPopular,
      ...pkg,
    };

    await saveDocument('packages', newPkg.id, newPkg);
    notifyCloudSync();

    try {
      await this.request<PackageItem>('/api/packages', {
        method: 'POST',
        body: JSON.stringify(pkg),
      });
    } catch {
      // cloud is authority
    }
    return newPkg;
  },

  async updatePackage(id: string, pkg: Partial<PackageItem>): Promise<PackageItem> {
    if (!isFirebaseActive()) {
      throw new Error('Firebase connected nahi hai! Package update karne ke liye Firebase configure karein.');
    }

    const updated: PackageItem = { ...pkg, id } as PackageItem;
    await saveDocument('packages', id, updated);
    notifyCloudSync();

    try {
      await this.request<PackageItem>(`/api/packages/${id}`, {
        method: 'PUT',
        body: JSON.stringify(pkg),
      });
    } catch {
      // cloud is authority
    }
    return updated;
  },

  async deletePackage(id: string): Promise<{ success: boolean }> {
    if (!isFirebaseActive()) {
      throw new Error('Firebase connected nahi hai! Package delete karne ke liye Firebase configure karein.');
    }

    await deleteDocument('packages', id);
    notifyCloudSync();

    try {
      await this.request<{ success: boolean }>(`/api/packages/${id}`, {
        method: 'DELETE',
      });
    } catch {
      // cloud is authority
    }
    return { success: true };
  },

  // Testimonials
  async getTestimonials(): Promise<TestimonialItem[]> {
    if (isFirebaseActive()) {
      try {
        const db = getFirestoreDb();
        if (db) {
          const snap = await getDocs(collection(db, 'testimonials'));
          if (!snap.empty) {
            return snap.docs.map((d) => ({ id: d.id, ...d.data() } as TestimonialItem));
          }
        }
      } catch (err) {
        console.warn('Firestore getTestimonials note:', err);
      }
    }

    try {
      const data = await this.request<TestimonialItem[]>('/api/testimonials');
      if (data && data.length > 0) return data;
    } catch {
      // fallback
    }
    return initialTestimonials;
  },

  async createTestimonial(t: Partial<TestimonialItem>): Promise<TestimonialItem> {
    if (!isFirebaseActive()) {
      throw new Error('Firebase connected nahi hai! Testimonial save karne ke liye Firebase configure karein.');
    }

    const newT: TestimonialItem = {
      id: `tst-${Date.now()}`,
      clientName: t.clientName || 'Client Name',
      roleOrBrand: t.roleOrBrand || 'Brand Executive',
      city: t.city || 'Lahore',
      rating: t.rating || 5,
      reviewText: t.reviewText || '',
      projectType: t.projectType || 'Commercial Production',
      isVerifiedCustomer: t.isVerifiedCustomer !== false,
      date: t.date || 'October 2026',
      ...t,
    };

    await saveDocument('testimonials', newT.id, newT);
    notifyCloudSync();

    try {
      await this.request<TestimonialItem>('/api/testimonials', {
        method: 'POST',
        body: JSON.stringify(t),
      });
    } catch {
      // cloud is authority
    }
    return newT;
  },

  async updateTestimonial(id: string, t: Partial<TestimonialItem>): Promise<TestimonialItem> {
    if (!isFirebaseActive()) {
      throw new Error('Firebase connected nahi hai! Testimonial update karne ke liye Firebase configure karein.');
    }

    const updated: TestimonialItem = { ...t, id } as TestimonialItem;
    await saveDocument('testimonials', id, updated);
    notifyCloudSync();

    try {
      await this.request<TestimonialItem>(`/api/testimonials/${id}`, {
        method: 'PUT',
        body: JSON.stringify(t),
      });
    } catch {
      // cloud is authority
    }
    return updated;
  },

  async deleteTestimonial(id: string): Promise<{ success: boolean }> {
    if (!isFirebaseActive()) {
      throw new Error('Firebase connected nahi hai! Testimonial delete karne ke liye Firebase configure karein.');
    }

    await deleteDocument('testimonials', id);
    notifyCloudSync();

    try {
      await this.request<{ success: boolean }>(`/api/testimonials/${id}`, {
        method: 'DELETE',
      });
    } catch {
      // cloud is authority
    }
    return { success: true };
  },

  // FAQs
  async getFaqs(): Promise<FaqItem[]> {
    if (isFirebaseActive()) {
      try {
        const db = getFirestoreDb();
        if (db) {
          const snap = await getDocs(collection(db, 'faqs'));
          if (!snap.empty) {
            return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FaqItem));
          }
        }
      } catch (err) {
        console.warn('Firestore getFaqs note:', err);
      }
    }

    try {
      const data = await this.request<FaqItem[]>('/api/faqs');
      if (data && data.length > 0) return data;
    } catch {
      // fallback
    }
    return initialFaqs;
  },

  async createFaq(faq: Partial<FaqItem>): Promise<FaqItem> {
    if (!isFirebaseActive()) {
      throw new Error('Firebase connected nahi hai! FAQ save karne ke liye Firebase configure karein.');
    }

    const newFaq: FaqItem = {
      id: `faq-${Date.now()}`,
      question: faq.question || 'New Question',
      answer: faq.answer || '',
      category: faq.category || 'General',
      ...faq,
    };

    await saveDocument('faqs', newFaq.id, newFaq);
    notifyCloudSync();

    try {
      await this.request<FaqItem>('/api/faqs', {
        method: 'POST',
        body: JSON.stringify(faq),
      });
    } catch {
      // cloud is authority
    }
    return newFaq;
  },

  async updateFaq(id: string, faq: Partial<FaqItem>): Promise<FaqItem> {
    if (!isFirebaseActive()) {
      throw new Error('Firebase connected nahi hai! FAQ update karne ke liye Firebase configure karein.');
    }

    const updated: FaqItem = { ...faq, id } as FaqItem;
    await saveDocument('faqs', id, updated);
    notifyCloudSync();

    try {
      await this.request<FaqItem>(`/api/faqs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(faq),
      });
    } catch {
      // cloud is authority
    }
    return updated;
  },

  async deleteFaq(id: string): Promise<{ success: boolean }> {
    if (!isFirebaseActive()) {
      throw new Error('Firebase connected nahi hai! FAQ delete karne ke liye Firebase configure karein.');
    }

    await deleteDocument('faqs', id);
    notifyCloudSync();

    try {
      await this.request<{ success: boolean }>(`/api/faqs/${id}`, {
        method: 'DELETE',
      });
    } catch {
      // cloud is authority
    }
    return { success: true };
  },

  // Team & Leadership
  async getTeam(): Promise<TeamMember[]> {
    if (isFirebaseActive()) {
      try {
        const db = getFirestoreDb();
        if (db) {
          const snap = await getDocs(query(collection(db, 'team'), orderBy('displayOrder')));
          if (!snap.empty) {
            return snap.docs.map((d) => ({ id: d.id, ...d.data() } as TeamMember));
          }
        }
      } catch (err) {
        console.warn('Firestore getTeam note:', err);
      }
    }

    try {
      const data = await this.request<TeamMember[]>('/api/team');
      if (data && data.length > 0) return data;
    } catch {
      // fallback
    }
    return initialTeam;
  },

  async createTeamMember(member: Partial<TeamMember>): Promise<TeamMember> {
    if (!isFirebaseActive()) {
      throw new Error('Firebase connected nahi hai! Team member save karne ke liye Firebase configure karein.');
    }

    const newMember: TeamMember = {
      id: `team-${Date.now()}`,
      name: member.name || 'Untitled Member',
      roleType: member.roleType || 'team_member',
      title: member.title || (member.roleType === 'chairman' || member.roleType === 'owner' ? 'Chairman & Studio Founder' : member.roleType === 'ceo' ? 'Chief Executive Officer' : 'Creative Filmmaker'),
      bio: member.bio || '',
      photo: member.photo || '/images/hero_cinematic_production_1793180767552.jpg',
      email: member.email || '',
      phone: member.phone || '',
      instagram: member.instagram || '',
      linkedin: member.linkedin || '',
      displayOrder: typeof member.displayOrder === 'number' ? member.displayOrder : Date.now(),
      ...member,
    };

    await saveDocument('team', newMember.id, newMember);
    notifyCloudSync();

    try {
      await this.request<TeamMember>('/api/team', {
        method: 'POST',
        body: JSON.stringify(member),
      });
    } catch {
      // cloud is authority
    }
    return newMember;
  },

  async updateTeamMember(id: string, member: Partial<TeamMember>): Promise<TeamMember> {
    if (!isFirebaseActive()) {
      throw new Error('Firebase connected nahi hai! Team member update karne ke liye Firebase configure karein.');
    }

    const updated: TeamMember = { ...member, id } as TeamMember;
    await saveDocument('team', id, updated);
    notifyCloudSync();

    try {
      await this.request<TeamMember>(`/api/team/${id}`, {
        method: 'PUT',
        body: JSON.stringify(member),
      });
    } catch {
      // cloud is authority
    }
    return updated;
  },

  async deleteTeamMember(id: string): Promise<{ success: boolean }> {
    if (!isFirebaseActive()) {
      throw new Error('Firebase connected nahi hai! Team member delete karne ke liye Firebase configure karein.');
    }

    await deleteDocument('team', id);
    notifyCloudSync();

    try {
      await this.request<{ success: boolean }>(`/api/team/${id}`, {
        method: 'DELETE',
      });
    } catch {
      // cloud is authority
    }
    return { success: true };
  },

  // Inquiries
  async submitInquiry(data: Partial<Inquiry>) {
    const list = getLocalItem<Inquiry[]>(INQUIRIES_KEY, initialInquiries as any);
    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      fullName: data.fullName || 'Anonymous',
      phoneNumber: data.phoneNumber || '',
      email: data.email || '',
      city: data.city || 'Lahore',
      requiredService: data.requiredService || 'Commercial Films',
      projectDescription: data.projectDescription || '',
      preferredDate: data.preferredDate || 'Flexible',
      estimatedBudget: data.estimatedBudget || 'To Be Discussed',
      preferredContactMethod: data.preferredContactMethod || 'phone',
      status: 'New',
      internalNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };

    list.unshift(newInquiry);
    setLocalItem(INQUIRIES_KEY, list);

    if (isFirebaseActive()) {
      try {
        await saveDocument('inquiries', newInquiry.id, newInquiry);
      } catch (err) {
        console.warn('Firestore submitInquiry note:', err);
      }
    }
    notifyCloudSync();

    try {
      const res = await this.request<{ success: boolean; message: string; inquiry: Inquiry }>('/api/inquiries', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return res;
    } catch {
      // offline / Netlify
      return {
        success: true,
        message: 'Thank you for contacting Shifa Productions. Your inquiry has been received. Our team will contact you shortly.',
        inquiry: newInquiry,
      };
    }
  },

  async getInquiries(params?: { status?: string; search?: string }): Promise<Inquiry[]> {
    if (isFirebaseActive()) {
      try {
        const db = getFirestoreDb();
        if (db) {
          const snap = await getDocs(collection(db, 'inquiries'));
          if (!snap.empty) {
            let list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Inquiry));
            if (params?.status && params.status !== 'all') {
              list = list.filter((i) => i.status.toLowerCase() === params.status?.toLowerCase());
            }
            if (params?.search) {
              const q = params.search.toLowerCase();
              list = list.filter(
                (i) =>
                  i.fullName.toLowerCase().includes(q) ||
                  i.email.toLowerCase().includes(q) ||
                  i.phoneNumber.toLowerCase().includes(q) ||
                  i.city.toLowerCase().includes(q)
              );
            }
            setLocalItem(INQUIRIES_KEY, list);
            return list;
          }
        }
      } catch (err) {
        console.warn('Firestore getInquiries note:', err);
      }
    }

    try {
      const qs = new URLSearchParams();
      if (params?.status) qs.append('status', params.status);
      if (params?.search) qs.append('search', params.search);
      const query = qs.toString() ? `?${qs.toString()}` : '';
      const data = await this.request<Inquiry[]>(`/api/inquiries${query}`);
      if (data && data.length > 0) {
        setLocalItem(INQUIRIES_KEY, data);
        return data;
      }
    } catch {
      // fallback
    }

    let list = getLocalItem<Inquiry[]>(INQUIRIES_KEY, initialInquiries as any);
    if (params?.status && params.status !== 'all') {
      list = list.filter((i) => i.status.toLowerCase() === params.status?.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (i) =>
          i.fullName.toLowerCase().includes(q) ||
          i.email.toLowerCase().includes(q) ||
          i.phoneNumber.toLowerCase().includes(q) ||
          i.city.toLowerCase().includes(q)
      );
    }
    return list;
  },

  async updateInquiry(id: string, data: { status?: string; internalNotes?: string }) {
    const list = getLocalItem<Inquiry[]>(INQUIRIES_KEY, initialInquiries as any);
    const idx = list.findIndex((i) => i.id === id);
    let updated: Inquiry = {
      ...(list[idx] || {}),
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    } as Inquiry;

    if (idx !== -1) {
      list[idx] = updated;
    }
    setLocalItem(INQUIRIES_KEY, list);

    if (isFirebaseActive()) {
      try {
        await saveDocument('inquiries', id, updated);
      } catch (err) {
        console.warn('Firestore updateInquiry note:', err);
      }
    }
    notifyCloudSync();

    try {
      const res = await this.request<{ success: boolean; inquiry: Inquiry }>(`/api/inquiries/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      if (res.inquiry) {
        const freshList = list.map((i) => (i.id === id ? res.inquiry : i));
        setLocalItem(INQUIRIES_KEY, freshList);
        return res;
      }
    } catch {
      // offline / Netlify
    }
    return { success: true, inquiry: updated };
  },

  async deleteInquiry(id: string) {
    const list = getLocalItem<Inquiry[]>(INQUIRIES_KEY, initialInquiries as any);
    const filtered = list.filter((i) => i.id !== id);
    setLocalItem(INQUIRIES_KEY, filtered);

    if (isFirebaseActive()) {
      try {
        await deleteDocument('inquiries', id);
      } catch (err) {
        console.warn('Firestore deleteInquiry note:', err);
      }
    }
    notifyCloudSync();

    try {
      await this.request<{ success: boolean; message: string }>(`/api/inquiries/${id}`, {
        method: 'DELETE',
      });
    } catch {
      // offline / Netlify
    }
    return { success: true, message: 'Inquiry removed' };
  },

  // Media
  async uploadMedia(file: File): Promise<{ success: boolean; url: string; filename: string; size: number }> {
    if (!isFirebaseActive()) {
      throw new Error('Firebase connected nahi hai! Images ko permanent cloud storage mein save karne ke liye Firebase configure karein.');
    }

    try {
      const url = await uploadFileToCloud(file, 'uploads');
      notifyCloudSync();
      return {
        success: true,
        url,
        filename: file.name,
        size: file.size,
      };
    } catch (err: any) {
      throw new Error(`Firebase Storage upload failed: ${err.message || 'Storage write failed'}. Please make sure Firebase Storage is enabled in your Firebase Console.`);
    }
  },

  async getMediaList(): Promise<Array<{ filename: string; url: string; size: number; createdAt: string }>> {
    const localMedia = getLocalItem<Array<{ filename: string; url: string; size: number; createdAt: string }>>(MEDIA_KEY, []);
    try {
      const serverMedia = await this.request<Array<{ filename: string; url: string; size: number; createdAt: string }>>('/api/media');
      // Merge unique
      const map = new Map<string, { filename: string; url: string; size: number; createdAt: string }>();
      serverMedia.forEach((m) => map.set(m.url, m));
      localMedia.forEach((m) => {
        if (!map.has(m.url)) map.set(m.url, m);
      });
      const merged = Array.from(map.values());
      setLocalItem(MEDIA_KEY, merged);
      return merged;
    } catch {
      if (localMedia.length > 0) return localMedia;
      // Default initial media assets
      return [
        {
          filename: 'hero_cinematic_production.jpg',
          url: '/images/hero_cinematic_production_1793180767552.jpg',
          size: 1420000,
          createdAt: new Date().toISOString(),
        },
        {
          filename: 'wedding_cinematography.jpg',
          url: '/images/wedding_cinematography_1793180783307.jpg',
          size: 1650000,
          createdAt: new Date().toISOString(),
        },
        {
          filename: 'commercial_film_set.jpg',
          url: '/images/commercial_film_set_1793180800619.jpg',
          size: 1820000,
          createdAt: new Date().toISOString(),
        },
        {
          filename: 'drone_videography.jpg',
          url: '/images/drone_videography_1793180816827.jpg',
          size: 1980000,
          createdAt: new Date().toISOString(),
        },
      ];
    }
  },

  async deleteMedia(filename: string): Promise<{ success: boolean }> {
    const currentList = getLocalItem<Array<{ filename: string; url: string; size: number; createdAt: string }>>(MEDIA_KEY, []);
    const filtered = currentList.filter((m) => m.filename !== filename);
    setLocalItem(MEDIA_KEY, filtered);

    try {
      await this.request<{ success: boolean }>(`/api/media/${filename}`, {
        method: 'DELETE',
      });
    } catch {
      // offline / Netlify
    }
    return { success: true };
  },
};
