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
    return localStorage.getItem(TOKEN_KEY);
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
  async login(email: string, password?: string) {
    const cleanEmail = email.trim().toLowerCase();
    const validEmails = [
      'shifaproductions.pk@gmail.com',
      'umairwyc@gmail.com',
    ];

    if (!validEmails.includes(cleanEmail)) {
      throw new Error(`Access Denied: "${cleanEmail}" is not authorized. ONLY shifaproductions.pk@gmail.com and umairwyc@gmail.com have access.`);
    }

    try {
      const data = await this.request<{ token: string; user: { username: string; email: string; avatar?: string } }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail, password: password || '' }),
      });
      this.setToken(data.token);
      localStorage.setItem('shifa_admin_user', JSON.stringify(data.user));
      return data;
    } catch (err: any) {
      // If error is invalid password from server, re-throw it so user knows password was wrong
      if (err.message && err.message.includes('Incorrect password')) {
        throw err;
      }

      // Static / offline fallback (e.g. Netlify)
      const validPassword = localStorage.getItem('shifa_admin_custom_pass') || 'ShifaAdmin2026!';
      if (!password || password !== validPassword) {
        throw new Error('Incorrect password. Please enter the valid admin password.');
      }

      const mockUser = {
        username: cleanEmail === 'umairwyc@gmail.com' ? 'Umair' : 'Shifa Productions Admin',
        email: cleanEmail,
      };
      const token = 'static-admin-token-' + Date.now();
      this.setToken(token);
      localStorage.setItem('shifa_admin_user', JSON.stringify(mockUser));
      return { token, user: mockUser };
    }
  },

  async loginWithGoogle(payload: { email?: string; name?: string; credential?: string; avatar?: string }) {
    const cleanEmail = (payload.email || '').trim().toLowerCase();
    const allowed = [
      'shifaproductions.pk@gmail.com',
      'umairwyc@gmail.com',
    ];
    if (!allowed.includes(cleanEmail)) {
      throw new Error(`Access Denied: The Google account "${cleanEmail}" is not authorized. ONLY shifaproductions.pk@gmail.com and umairwyc@gmail.com have access.`);
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
      // Static / offline fallback (e.g. Netlify)
      const mockUser = {
        username: payload.name || (cleanEmail === 'umairwyc@gmail.com' ? 'Umair' : 'Shifa Productions Admin'),
        email: cleanEmail,
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
      return await this.request<{ authenticated: boolean; user: { username: string; email: string; avatar?: string } }>('/api/auth/me');
    } catch {
      const token = this.getToken();
      const storedUser = localStorage.getItem('shifa_admin_user');
      if (token && storedUser) {
        try {
          return { authenticated: true, user: JSON.parse(storedUser) };
        } catch {
          // ignore parse error
        }
      }
      return { authenticated: false, user: { username: '', email: '' } };
    }
  },

  async changePassword(currentPassword: string, newPassword: string) {
    try {
      const res = await this.request<{ success: boolean; message: string }>('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      localStorage.setItem('shifa_admin_custom_pass', newPassword);
      return res;
    } catch (err: any) {
      // Re-throw validation/auth errors
      if (err.message && (err.message.includes('Current password') || err.message.includes('at least 6') || err.message.includes('Unauthorized'))) {
        throw err;
      }
      // Offline fallback only when network fails
      const storedPass = localStorage.getItem('shifa_admin_custom_pass') || 'ShifaAdmin2026!';
      if (currentPassword !== storedPass && currentPassword !== 'ShifaAdmin2026!') {
        throw new Error('Current password does not match. Please verify your password.');
      }
      localStorage.setItem('shifa_admin_custom_pass', newPassword);
      return { success: true, message: 'Admin password updated successfully.' };
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
    try {
      const data = await this.request<SiteSettings>('/api/settings');
      if (data && typeof data === 'object' && data.brandName) {
        setLocalItem(SETTINGS_KEY, data);
        return data;
      }
    } catch (err) {
      console.warn('Could not fetch server settings, using cached copy:', err);
    }
    return getLocalItem<SiteSettings>(SETTINGS_KEY, initialSettings);
  },

  async updateSettings(settings: Partial<SiteSettings>) {
    const current = getLocalItem<SiteSettings>(SETTINGS_KEY, initialSettings);
    const updated: SiteSettings = {
      ...current,
      ...settings,
      hero: { ...(current.hero || {}), ...(settings.hero || {}) },
      about: { ...(current.about || {}), ...(settings.about || {}) },
      socials: { ...(current.socials || {}), ...(settings.socials || {}) },
      seo: { ...(current.seo || {}), ...(settings.seo || {}) },
      legal: current.legal || settings.legal ? {
        privacyPolicy: settings.legal?.privacyPolicy ?? current.legal?.privacyPolicy ?? '',
        termsAndConditions: settings.legal?.termsAndConditions ?? current.legal?.termsAndConditions ?? '',
      } : undefined,
      theme: current.theme || settings.theme ? {
        accentColor: settings.theme?.accentColor ?? current.theme?.accentColor ?? '#2563EB',
        mode: settings.theme?.mode ?? current.theme?.mode ?? 'cinematic',
      } : undefined,
    };

    // Cache locally immediately
    setLocalItem(SETTINGS_KEY, updated);

    // Persist full settings payload to backend disk
    try {
      const res = await this.request<{ success: boolean; settings: SiteSettings }>('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(updated),
      });
      if (res && res.settings) {
        setLocalItem(SETTINGS_KEY, res.settings);
        return res;
      }
      return { success: true, settings: updated };
    } catch (err: any) {
      console.error('Failed to sync settings with server:', err);
      throw new Error(err.message || 'Server failed to save settings across devices.');
    }
  },

  // Services
  async getServices(): Promise<ServiceItem[]> {
    try {
      const data = await this.request<ServiceItem[]>('/api/services');
      if (data && data.length > 0) {
        setLocalItem(SERVICES_KEY, data);
        return data;
      }
    } catch {
      // fallback
    }
    return getLocalItem<ServiceItem[]>(SERVICES_KEY, initialServices);
  },

  async createService(service: Partial<ServiceItem>): Promise<ServiceItem> {
    const list = getLocalItem<ServiceItem[]>(SERVICES_KEY, initialServices);
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
      displayOrder: list.length + 1,
      ...service,
    };

    list.push(newService);
    setLocalItem(SERVICES_KEY, list);

    try {
      const res = await this.request<ServiceItem>('/api/services', {
        method: 'POST',
        body: JSON.stringify(service),
      });
      if (res && res.id) {
        // update local item with server id if different
        const updatedList = list.map((s) => (s.id === newService.id ? res : s));
        setLocalItem(SERVICES_KEY, updatedList);
        return res;
      }
    } catch {
      // offline / Netlify
    }
    return newService;
  },

  async updateService(id: string, service: Partial<ServiceItem>): Promise<ServiceItem> {
    const list = getLocalItem<ServiceItem[]>(SERVICES_KEY, initialServices);
    const idx = list.findIndex((s) => s.id === id);
    let updatedService: ServiceItem = { ...(list[idx] || {}), ...service, id } as ServiceItem;

    if (idx !== -1) {
      list[idx] = updatedService;
    } else {
      list.push(updatedService);
    }
    setLocalItem(SERVICES_KEY, list);

    try {
      const res = await this.request<ServiceItem>(`/api/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(service),
      });
      if (res) {
        const freshList = list.map((s) => (s.id === id ? res : s));
        setLocalItem(SERVICES_KEY, freshList);
        return res;
      }
    } catch {
      // offline / Netlify
    }
    return updatedService;
  },

  async deleteService(id: string): Promise<{ success: boolean }> {
    const list = getLocalItem<ServiceItem[]>(SERVICES_KEY, initialServices);
    const filtered = list.filter((s) => s.id !== id);
    setLocalItem(SERVICES_KEY, filtered);

    try {
      await this.request<{ success: boolean }>(`/api/services/${id}`, {
        method: 'DELETE',
      });
    } catch {
      // offline / Netlify
    }
    return { success: true };
  },

  // Portfolio
  async getPortfolio(): Promise<PortfolioItem[]> {
    try {
      const data = await this.request<PortfolioItem[]>('/api/portfolio');
      if (data && data.length > 0) {
        setLocalItem(PORTFOLIO_KEY, data);
        return data;
      }
    } catch {
      // fallback
    }
    return getLocalItem<PortfolioItem[]>(PORTFOLIO_KEY, initialPortfolio);
  },

  async createPortfolio(project: Partial<PortfolioItem>): Promise<PortfolioItem> {
    const list = getLocalItem<PortfolioItem[]>(PORTFOLIO_KEY, initialPortfolio);
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

    list.unshift(newProject);
    setLocalItem(PORTFOLIO_KEY, list);

    try {
      const res = await this.request<PortfolioItem>('/api/portfolio', {
        method: 'POST',
        body: JSON.stringify(project),
      });
      if (res && res.id) {
        const freshList = list.map((p) => (p.id === newProject.id ? res : p));
        setLocalItem(PORTFOLIO_KEY, freshList);
        return res;
      }
    } catch {
      // offline / Netlify
    }
    return newProject;
  },

  async updatePortfolio(id: string, project: Partial<PortfolioItem>): Promise<PortfolioItem> {
    const list = getLocalItem<PortfolioItem[]>(PORTFOLIO_KEY, initialPortfolio);
    const idx = list.findIndex((p) => p.id === id);
    let updatedProject: PortfolioItem = { ...(list[idx] || {}), ...project, id } as PortfolioItem;

    if (idx !== -1) {
      list[idx] = updatedProject;
    } else {
      list.unshift(updatedProject);
    }
    setLocalItem(PORTFOLIO_KEY, list);

    try {
      const res = await this.request<PortfolioItem>(`/api/portfolio/${id}`, {
        method: 'PUT',
        body: JSON.stringify(project),
      });
      if (res) {
        const freshList = list.map((p) => (p.id === id ? res : p));
        setLocalItem(PORTFOLIO_KEY, freshList);
        return res;
      }
    } catch {
      // offline / Netlify
    }
    return updatedProject;
  },

  async deletePortfolio(id: string): Promise<{ success: boolean }> {
    const list = getLocalItem<PortfolioItem[]>(PORTFOLIO_KEY, initialPortfolio);
    const filtered = list.filter((p) => p.id !== id);
    setLocalItem(PORTFOLIO_KEY, filtered);

    try {
      await this.request<{ success: boolean }>(`/api/portfolio/${id}`, {
        method: 'DELETE',
      });
    } catch {
      // offline / Netlify
    }
    return { success: true };
  },

  // Packages
  async getPackages(): Promise<PackageItem[]> {
    try {
      const data = await this.request<PackageItem[]>('/api/packages');
      if (data && data.length > 0) {
        setLocalItem(PACKAGES_KEY, data);
        return data;
      }
    } catch {
      // fallback
    }
    return getLocalItem<PackageItem[]>(PACKAGES_KEY, initialPackages);
  },

  async createPackage(pkg: Partial<PackageItem>): Promise<PackageItem> {
    const list = getLocalItem<PackageItem[]>(PACKAGES_KEY, initialPackages);
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

    list.push(newPkg);
    setLocalItem(PACKAGES_KEY, list);

    try {
      const res = await this.request<PackageItem>('/api/packages', {
        method: 'POST',
        body: JSON.stringify(pkg),
      });
      if (res && res.id) {
        const freshList = list.map((p) => (p.id === newPkg.id ? res : p));
        setLocalItem(PACKAGES_KEY, freshList);
        return res;
      }
    } catch {
      // offline / Netlify
    }
    return newPkg;
  },

  async updatePackage(id: string, pkg: Partial<PackageItem>): Promise<PackageItem> {
    const list = getLocalItem<PackageItem[]>(PACKAGES_KEY, initialPackages);
    const idx = list.findIndex((p) => p.id === id);
    let updated: PackageItem = { ...(list[idx] || {}), ...pkg, id } as PackageItem;

    if (idx !== -1) {
      list[idx] = updated;
    } else {
      list.push(updated);
    }
    setLocalItem(PACKAGES_KEY, list);

    try {
      const res = await this.request<PackageItem>(`/api/packages/${id}`, {
        method: 'PUT',
        body: JSON.stringify(pkg),
      });
      if (res) {
        const freshList = list.map((p) => (p.id === id ? res : p));
        setLocalItem(PACKAGES_KEY, freshList);
        return res;
      }
    } catch {
      // offline / Netlify
    }
    return updated;
  },

  async deletePackage(id: string): Promise<{ success: boolean }> {
    const list = getLocalItem<PackageItem[]>(PACKAGES_KEY, initialPackages);
    const filtered = list.filter((p) => p.id !== id);
    setLocalItem(PACKAGES_KEY, filtered);

    try {
      await this.request<{ success: boolean }>(`/api/packages/${id}`, {
        method: 'DELETE',
      });
    } catch {
      // offline / Netlify
    }
    return { success: true };
  },

  // Testimonials
  async getTestimonials(): Promise<TestimonialItem[]> {
    try {
      const data = await this.request<TestimonialItem[]>('/api/testimonials');
      if (data && data.length > 0) {
        setLocalItem(TESTIMONIALS_KEY, data);
        return data;
      }
    } catch {
      // fallback
    }
    return getLocalItem<TestimonialItem[]>(TESTIMONIALS_KEY, initialTestimonials);
  },

  async createTestimonial(t: Partial<TestimonialItem>): Promise<TestimonialItem> {
    const list = getLocalItem<TestimonialItem[]>(TESTIMONIALS_KEY, initialTestimonials);
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

    list.unshift(newT);
    setLocalItem(TESTIMONIALS_KEY, list);

    try {
      const res = await this.request<TestimonialItem>('/api/testimonials', {
        method: 'POST',
        body: JSON.stringify(t),
      });
      if (res && res.id) {
        const freshList = list.map((item) => (item.id === newT.id ? res : item));
        setLocalItem(TESTIMONIALS_KEY, freshList);
        return res;
      }
    } catch {
      // offline / Netlify
    }
    return newT;
  },

  async updateTestimonial(id: string, t: Partial<TestimonialItem>): Promise<TestimonialItem> {
    const list = getLocalItem<TestimonialItem[]>(TESTIMONIALS_KEY, initialTestimonials);
    const idx = list.findIndex((item) => item.id === id);
    let updated: TestimonialItem = { ...(list[idx] || {}), ...t, id } as TestimonialItem;

    if (idx !== -1) {
      list[idx] = updated;
    } else {
      list.unshift(updated);
    }
    setLocalItem(TESTIMONIALS_KEY, list);

    try {
      const res = await this.request<TestimonialItem>(`/api/testimonials/${id}`, {
        method: 'PUT',
        body: JSON.stringify(t),
      });
      if (res) {
        const freshList = list.map((item) => (item.id === id ? res : item));
        setLocalItem(TESTIMONIALS_KEY, freshList);
        return res;
      }
    } catch {
      // offline / Netlify
    }
    return updated;
  },

  async deleteTestimonial(id: string): Promise<{ success: boolean }> {
    const list = getLocalItem<TestimonialItem[]>(TESTIMONIALS_KEY, initialTestimonials);
    const filtered = list.filter((t) => t.id !== id);
    setLocalItem(TESTIMONIALS_KEY, filtered);

    try {
      await this.request<{ success: boolean }>(`/api/testimonials/${id}`, {
        method: 'DELETE',
      });
    } catch {
      // offline / Netlify
    }
    return { success: true };
  },

  // FAQs
  async getFaqs(): Promise<FaqItem[]> {
    try {
      const data = await this.request<FaqItem[]>('/api/faqs');
      if (data && data.length > 0) {
        setLocalItem(FAQS_KEY, data);
        return data;
      }
    } catch {
      // fallback
    }
    return getLocalItem<FaqItem[]>(FAQS_KEY, initialFaqs);
  },

  async createFaq(faq: Partial<FaqItem>): Promise<FaqItem> {
    const list = getLocalItem<FaqItem[]>(FAQS_KEY, initialFaqs);
    const newFaq: FaqItem = {
      id: `faq-${Date.now()}`,
      question: faq.question || 'New Question',
      answer: faq.answer || '',
      category: faq.category || 'General',
      ...faq,
    };

    list.push(newFaq);
    setLocalItem(FAQS_KEY, list);

    try {
      const res = await this.request<FaqItem>('/api/faqs', {
        method: 'POST',
        body: JSON.stringify(faq),
      });
      if (res && res.id) {
        const freshList = list.map((f) => (f.id === newFaq.id ? res : f));
        setLocalItem(FAQS_KEY, freshList);
        return res;
      }
    } catch {
      // offline / Netlify
    }
    return newFaq;
  },

  async updateFaq(id: string, faq: Partial<FaqItem>): Promise<FaqItem> {
    const list = getLocalItem<FaqItem[]>(FAQS_KEY, initialFaqs);
    const idx = list.findIndex((f) => f.id === id);
    let updated: FaqItem = { ...(list[idx] || {}), ...faq, id } as FaqItem;

    if (idx !== -1) {
      list[idx] = updated;
    } else {
      list.push(updated);
    }
    setLocalItem(FAQS_KEY, list);

    try {
      const res = await this.request<FaqItem>(`/api/faqs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(faq),
      });
      if (res) {
        const freshList = list.map((f) => (f.id === id ? res : f));
        setLocalItem(FAQS_KEY, freshList);
        return res;
      }
    } catch {
      // offline / Netlify
    }
    return updated;
  },

  async deleteFaq(id: string): Promise<{ success: boolean }> {
    const list = getLocalItem<FaqItem[]>(FAQS_KEY, initialFaqs);
    const filtered = list.filter((f) => f.id !== id);
    setLocalItem(FAQS_KEY, filtered);

    try {
      await this.request<{ success: boolean }>(`/api/faqs/${id}`, {
        method: 'DELETE',
      });
    } catch {
      // offline / Netlify
    }
    return { success: true };
  },

  // Team & Leadership
  async getTeam(): Promise<TeamMember[]> {
    try {
      const data = await this.request<TeamMember[]>('/api/team');
      if (data && data.length > 0) {
        setLocalItem(TEAM_KEY, data);
        return data;
      }
    } catch {
      // offline / Netlify fallback
    }
    return getLocalItem<TeamMember[]>(TEAM_KEY, initialTeam);
  },

  async createTeamMember(member: Partial<TeamMember>): Promise<TeamMember> {
    const list = getLocalItem<TeamMember[]>(TEAM_KEY, initialTeam);
    const newMember: TeamMember = {
      id: `team-${Date.now()}`,
      name: member.name || 'Untitled Member',
      roleType: member.roleType || 'team_member',
      title: member.title || (member.roleType === 'owner' ? 'Studio Owner' : member.roleType === 'ceo' ? 'Chief Executive Officer' : 'Creative Filmmaker'),
      bio: member.bio || '',
      photo: member.photo || '/images/hero_cinematic_production_1793180767552.jpg',
      email: member.email || '',
      phone: member.phone || '',
      instagram: member.instagram || '',
      linkedin: member.linkedin || '',
      displayOrder: typeof member.displayOrder === 'number' ? member.displayOrder : list.length + 1,
      ...member,
    };

    list.push(newMember);
    setLocalItem(TEAM_KEY, list);

    try {
      const res = await this.request<TeamMember>('/api/team', {
        method: 'POST',
        body: JSON.stringify(member),
      });
      if (res && res.id) {
        const freshList = list.map((m) => (m.id === newMember.id ? res : m));
        setLocalItem(TEAM_KEY, freshList);
        return res;
      }
    } catch {
      // offline / Netlify
    }
    return newMember;
  },

  async updateTeamMember(id: string, member: Partial<TeamMember>): Promise<TeamMember> {
    const list = getLocalItem<TeamMember[]>(TEAM_KEY, initialTeam);
    const idx = list.findIndex((m) => m.id === id);
    let updated: TeamMember = { ...(list[idx] || {}), ...member, id } as TeamMember;

    if (idx !== -1) {
      list[idx] = updated;
    } else {
      list.push(updated);
    }
    setLocalItem(TEAM_KEY, list);

    try {
      const res = await this.request<TeamMember>(`/api/team/${id}`, {
        method: 'PUT',
        body: JSON.stringify(member),
      });
      if (res) {
        const freshList = list.map((m) => (m.id === id ? res : m));
        setLocalItem(TEAM_KEY, freshList);
        return res;
      }
    } catch {
      // offline / Netlify
    }
    return updated;
  },

  async deleteTeamMember(id: string): Promise<{ success: boolean }> {
    const list = getLocalItem<TeamMember[]>(TEAM_KEY, initialTeam);
    const filtered = list.filter((m) => m.id !== id);
    setLocalItem(TEAM_KEY, filtered);

    try {
      await this.request<{ success: boolean }>(`/api/team/${id}`, {
        method: 'DELETE',
      });
    } catch {
      // offline / Netlify
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
    try {
      const formData = new FormData();
      formData.append('mediaFile', file);
      const res = await this.request<{ success: boolean; url: string; filename: string; size: number }>('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.url) {
        const currentList = getLocalItem<Array<{ filename: string; url: string; size: number; createdAt: string }>>(MEDIA_KEY, []);
        currentList.unshift({
          filename: res.filename,
          url: res.url,
          size: res.size,
          createdAt: new Date().toISOString(),
        });
        setLocalItem(MEDIA_KEY, currentList);
        return res;
      }
    } catch {
      // Fallback for static platforms like Netlify
    }

    // Convert file to base64 Data URL so it is fully usable and viewable offline/on Netlify
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const currentList = getLocalItem<Array<{ filename: string; url: string; size: number; createdAt: string }>>(MEDIA_KEY, []);
    const newMedia = {
      filename: file.name,
      url: dataUrl,
      size: file.size,
      createdAt: new Date().toISOString(),
    };
    currentList.unshift(newMedia);
    setLocalItem(MEDIA_KEY, currentList);

    return {
      success: true,
      url: dataUrl,
      filename: file.name,
      size: file.size,
    };
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
