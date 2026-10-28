import { Inquiry, ServiceItem, PortfolioItem, PackageItem, TestimonialItem, FaqItem, SiteSettings } from '../types/index.ts';

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
    const headers = new Headers(options.headers || {});
    
    if (!(options.body instanceof FormData)) {
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const res = await fetch(endpoint, {
      ...options,
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
  async login(email: string, password: string) {
    const data = await this.request<{ token: string; user: { username: string; email: string; avatar?: string } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  },

  async loginWithGoogle(payload: { email?: string; name?: string; credential?: string; avatar?: string }) {
    const data = await this.request<{ token: string; user: { username: string; email: string; avatar?: string } }>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    this.setToken(data.token);
    return data;
  },

  async logout() {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  },

  async checkAuth() {
    return this.request<{ authenticated: boolean; user: { username: string; email: string } }>('/api/auth/me');
  },

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<{ success: boolean; message: string }>('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // Stats & Analytics
  async getStats() {
    return this.request<{
      totalInquiries: number;
      newInquiries: number;
      inDiscussion: number;
      confirmedProjects: number;
      totalPortfolio: number;
      totalServices: number;
    }>('/api/stats');
  },

  async getAnalytics(): Promise<StudioAnalyticsData> {
    return this.request<StudioAnalyticsData>('/api/analytics');
  },

  // Settings
  async getSettings(): Promise<SiteSettings> {
    return this.request<SiteSettings>('/api/settings');
  },

  async updateSettings(settings: Partial<SiteSettings>) {
    return this.request<{ success: boolean; settings: SiteSettings }>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  // Services
  async getServices(): Promise<ServiceItem[]> {
    return this.request<ServiceItem[]>('/api/services');
  },

  async createService(service: Partial<ServiceItem>) {
    return this.request<ServiceItem>('/api/services', {
      method: 'POST',
      body: JSON.stringify(service),
    });
  },

  async updateService(id: string, service: Partial<ServiceItem>) {
    return this.request<ServiceItem>(`/api/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(service),
    });
  },

  async deleteService(id: string) {
    return this.request<{ success: boolean }>(`/api/services/${id}`, {
      method: 'DELETE',
    });
  },

  // Portfolio
  async getPortfolio(): Promise<PortfolioItem[]> {
    return this.request<PortfolioItem[]>('/api/portfolio');
  },

  async createPortfolio(project: Partial<PortfolioItem>) {
    return this.request<PortfolioItem>('/api/portfolio', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  },

  async updatePortfolio(id: string, project: Partial<PortfolioItem>) {
    return this.request<PortfolioItem>(`/api/portfolio/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  },

  async deletePortfolio(id: string) {
    return this.request<{ success: boolean }>(`/api/portfolio/${id}`, {
      method: 'DELETE',
    });
  },

  // Packages
  async getPackages(): Promise<PackageItem[]> {
    return this.request<PackageItem[]>('/api/packages');
  },

  async createPackage(pkg: Partial<PackageItem>) {
    return this.request<PackageItem>('/api/packages', {
      method: 'POST',
      body: JSON.stringify(pkg),
    });
  },

  async updatePackage(id: string, pkg: Partial<PackageItem>) {
    return this.request<PackageItem>(`/api/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pkg),
    });
  },

  async deletePackage(id: string) {
    return this.request<{ success: boolean }>(`/api/packages/${id}`, {
      method: 'DELETE',
    });
  },

  // Testimonials
  async getTestimonials(): Promise<TestimonialItem[]> {
    return this.request<TestimonialItem[]>('/api/testimonials');
  },

  async createTestimonial(t: Partial<TestimonialItem>) {
    return this.request<TestimonialItem>('/api/testimonials', {
      method: 'POST',
      body: JSON.stringify(t),
    });
  },

  async updateTestimonial(id: string, t: Partial<TestimonialItem>) {
    return this.request<TestimonialItem>(`/api/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(t),
    });
  },

  async deleteTestimonial(id: string) {
    return this.request<{ success: boolean }>(`/api/testimonials/${id}`, {
      method: 'DELETE',
    });
  },

  // FAQs
  async getFaqs(): Promise<FaqItem[]> {
    return this.request<FaqItem[]>('/api/faqs');
  },

  async createFaq(faq: Partial<FaqItem>) {
    return this.request<FaqItem>('/api/faqs', {
      method: 'POST',
      body: JSON.stringify(faq),
    });
  },

  async updateFaq(id: string, faq: Partial<FaqItem>) {
    return this.request<FaqItem>(`/api/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(faq),
    });
  },

  async deleteFaq(id: string) {
    return this.request<{ success: boolean }>(`/api/faqs/${id}`, {
      method: 'DELETE',
    });
  },

  // Inquiries
  async submitInquiry(data: Partial<Inquiry>) {
    return this.request<{ success: boolean; message: string; inquiry: Inquiry }>('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getInquiries(params?: { status?: string; search?: string }): Promise<Inquiry[]> {
    const qs = new URLSearchParams();
    if (params?.status) qs.append('status', params.status);
    if (params?.search) qs.append('search', params.search);
    const query = qs.toString() ? `?${qs.toString()}` : '';
    return this.request<Inquiry[]>(`/api/inquiries${query}`);
  },

  async updateInquiry(id: string, data: { status?: string; internalNotes?: string }) {
    return this.request<{ success: boolean; inquiry: Inquiry }>(`/api/inquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteInquiry(id: string) {
    return this.request<{ success: boolean; message: string }>(`/api/inquiries/${id}`, {
      method: 'DELETE',
    });
  },

  // Media
  async uploadMedia(file: File) {
    const formData = new FormData();
    formData.append('mediaFile', file);
    return this.request<{ success: boolean; url: string; filename: string; size: number }>('/api/media/upload', {
      method: 'POST',
      body: formData,
    });
  },

  async getMediaList() {
    return this.request<Array<{ filename: string; url: string; size: number; createdAt: string }>>('/api/media');
  },

  async deleteMedia(filename: string) {
    return this.request<{ success: boolean }>(`/api/media/${filename}`, {
      method: 'DELETE',
    });
  },
};
