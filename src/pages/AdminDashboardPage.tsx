import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import { apiClient } from '../api/client.ts';
import {
  Inquiry,
  ServiceItem,
  PortfolioItem,
  PackageItem,
  TestimonialItem,
  FaqItem,
  SiteSettings,
} from '../types/index.ts';
import {
  LayoutDashboard,
  Inbox,
  Layers,
  Film,
  Tag,
  Star,
  HelpCircle,
  Image as ImageIcon,
  Sliders,
  Settings,
  LogOut,
  ExternalLink,
  Search,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Eye,
  Upload,
  Copy,
  Lock,
  Loader2,
  X,
  Save,
  Menu,
  Shield,
  FileText,
  Palette,
  Check,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { AdminAnalyticsSection } from '../components/admin/AdminAnalyticsSection.tsx';
import { StudioAnalyticsData } from '../api/client.ts';

type AdminSection =
  | 'overview'
  | 'analytics'
  | 'inquiries'
  | 'services'
  | 'portfolio'
  | 'packages'
  | 'testimonials'
  | 'content'
  | 'contact-social'
  | 'faqs-legal'
  | 'media'
  | 'settings';

export const AdminDashboardPage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { navigateTo, showToast, refreshData } = useApp();

  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalInquiries: 0,
    newInquiries: 0,
    inDiscussion: 0,
    confirmedProjects: 0,
    totalPortfolio: 0,
    totalServices: 0,
  });

  // Entities
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryFilterStatus, setInquiryFilterStatus] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const [servicesList, setServicesList] = useState<ServiceItem[]>([]);
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);

  const [portfolioList, setPortfolioList] = useState<PortfolioItem[]>([]);
  const [editingPortfolio, setEditingPortfolio] = useState<Partial<PortfolioItem> | null>(null);

  const [packagesList, setPackagesList] = useState<PackageItem[]>([]);
  const [editingPackage, setEditingPackage] = useState<Partial<PackageItem> | null>(null);

  const [testimonialsList, setTestimonialsList] = useState<TestimonialItem[]>([]);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<TestimonialItem> | null>(null);

  const [faqsList, setFaqsList] = useState<FaqItem[]>([]);
  const [editingFaq, setEditingFaq] = useState<Partial<FaqItem> | null>(null);

  const [mediaList, setMediaList] = useState<Array<{ filename: string; url: string; size: number; createdAt: string }>>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroMediaInputRef = useRef<HTMLInputElement>(null);
  const portfolioImgInputRef = useRef<HTMLInputElement>(null);

  // Settings
  const [settingsForm, setSettingsForm] = useState<SiteSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  // Analytics
  const [analytics, setAnalytics] = useState<StudioAnalyticsData | null>(null);

  // Load Admin Data
  const loadAdminData = async () => {
    try {
      const [s, inqs, srvs, ports, pkgs, tests, fqs, sett, med, anlyt] = await Promise.all([
        apiClient.getStats(),
        apiClient.getInquiries(),
        apiClient.getServices(),
        apiClient.getPortfolio(),
        apiClient.getPackages(),
        apiClient.getTestimonials(),
        apiClient.getFaqs(),
        apiClient.getSettings(),
        apiClient.getMediaList(),
        apiClient.getAnalytics(),
      ]);

      setStats(s);
      setInquiries(inqs);
      setServicesList(srvs);
      setPortfolioList(ports);
      setPackagesList(pkgs);
      setTestimonialsList(tests);
      setFaqsList(fqs);
      setSettingsForm(sett);
      setMediaList(med);
      setAnalytics(anlyt);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      showToast(err.message || 'Error fetching admin records', 'error');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo('admin-login');
      return;
    }
    loadAdminData();
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  // ----------------- Inquiry Actions -----------------
  const handleUpdateInquiryStatus = async (id: string, status: string) => {
    try {
      const res = await apiClient.updateInquiry(id, { status });
      if (res.success) {
        setInquiries((prev) => prev.map((i) => (i.id === id ? res.inquiry : i)));
        if (selectedInquiry?.id === id) setSelectedInquiry(res.inquiry);
        showToast(`Inquiry status set to "${status}"`, 'success');
        const st = await apiClient.getStats();
        setStats(st);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleSaveInternalNotes = async (id: string, internalNotes: string) => {
    try {
      const res = await apiClient.updateInquiry(id, { internalNotes });
      if (res.success) {
        setInquiries((prev) => prev.map((i) => (i.id === id ? res.inquiry : i)));
        if (selectedInquiry?.id === id) setSelectedInquiry(res.inquiry);
        showToast('Internal notes saved', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save notes', 'error');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Delete this customer inquiry permanently?')) return;
    try {
      await apiClient.deleteInquiry(id);
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
      showToast('Inquiry removed from database', 'info');
      const st = await apiClient.getStats();
      setStats(st);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete inquiry', 'error');
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStatus =
      inquiryFilterStatus === 'all' || inq.status.toLowerCase() === inquiryFilterStatus.toLowerCase();
    const q = inquirySearch.toLowerCase();
    const matchesSearch =
      !inquirySearch ||
      inq.fullName.toLowerCase().includes(q) ||
      inq.city.toLowerCase().includes(q) ||
      inq.requiredService.toLowerCase().includes(q) ||
      inq.phoneNumber.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // ----------------- Service Actions -----------------
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title) return;
    try {
      if (editingService.id) {
        const updated = await apiClient.updateService(editingService.id, editingService);
        setServicesList((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        showToast('Service updated successfully', 'success');
      } else {
        const created = await apiClient.createService(editingService);
        setServicesList((prev) => [...prev, created]);
        showToast('New service added', 'success');
      }
      setEditingService(null);
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save service', 'error');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!window.confirm('Delete this service permanently?')) return;
    try {
      await apiClient.deleteService(id);
      setServicesList((prev) => prev.filter((s) => s.id !== id));
      showToast('Service removed', 'info');
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete service', 'error');
    }
  };

  // ----------------- Portfolio Actions -----------------
  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPortfolio?.title || !editingPortfolio?.image) {
      showToast('Project title and image are required', 'error');
      return;
    }
    try {
      if (editingPortfolio.id) {
        const updated = await apiClient.updatePortfolio(editingPortfolio.id, editingPortfolio);
        setPortfolioList((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        showToast('Portfolio project updated', 'success');
      } else {
        const created = await apiClient.createPortfolio(editingPortfolio);
        setPortfolioList((prev) => [created, ...prev]);
        showToast('Portfolio project created', 'success');
      }
      setEditingPortfolio(null);
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save project', 'error');
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    if (!window.confirm('Delete this portfolio project?')) return;
    try {
      await apiClient.deletePortfolio(id);
      setPortfolioList((prev) => prev.filter((p) => p.id !== id));
      showToast('Portfolio item removed', 'info');
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  };

  // ----------------- Package Actions -----------------
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage?.name) return;
    try {
      if (editingPackage.id) {
        const updated = await apiClient.updatePackage(editingPackage.id, editingPackage);
        setPackagesList((prev) => prev.map((pkg) => (pkg.id === updated.id ? updated : pkg)));
        showToast('Package updated', 'success');
      } else {
        const created = await apiClient.createPackage(editingPackage);
        setPackagesList((prev) => [...prev, created]);
        showToast('Package added', 'success');
      }
      setEditingPackage(null);
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save package', 'error');
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!window.confirm('Delete this package?')) return;
    try {
      await apiClient.deletePackage(id);
      setPackagesList((prev) => prev.filter((pkg) => pkg.id !== id));
      showToast('Package deleted', 'info');
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete package', 'error');
    }
  };

  // ----------------- Testimonial Actions -----------------
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial?.clientName || !editingTestimonial?.reviewText) return;
    try {
      if (editingTestimonial.id) {
        const updated = await apiClient.updateTestimonial(editingTestimonial.id, editingTestimonial);
        setTestimonialsList((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        showToast('Testimonial updated', 'success');
      } else {
        const created = await apiClient.createTestimonial(editingTestimonial);
        setTestimonialsList((prev) => [...prev, created]);
        showToast('Testimonial added', 'success');
      }
      setEditingTestimonial(null);
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save testimonial', 'error');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!window.confirm('Delete testimonial?')) return;
    try {
      await apiClient.deleteTestimonial(id);
      setTestimonialsList((prev) => prev.filter((t) => t.id !== id));
      showToast('Testimonial removed', 'info');
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  };

  // ----------------- FAQ Actions -----------------
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq?.question || !editingFaq?.answer) return;
    try {
      if (editingFaq.id) {
        const updated = await apiClient.updateFaq(editingFaq.id, editingFaq);
        setFaqsList((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
        showToast('FAQ updated', 'success');
      } else {
        const created = await apiClient.createFaq(editingFaq);
        setFaqsList((prev) => [...prev, created]);
        showToast('FAQ added', 'success');
      }
      setEditingFaq(null);
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save FAQ', 'error');
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!window.confirm('Delete FAQ?')) return;
    try {
      await apiClient.deleteFaq(id);
      setFaqsList((prev) => prev.filter((f) => f.id !== id));
      showToast('FAQ removed', 'info');
      refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete FAQ', 'error');
    }
  };

  // ----------------- Media Upload Actions -----------------
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingMedia(true);
      const res = await apiClient.uploadMedia(file);
      if (res.success) {
        showToast(`Uploaded ${res.filename} to storage`, 'success');
        const list = await apiClient.getMediaList();
        setMediaList(list);
      }
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setUploadingMedia(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Dedicated Logo Upload Handler
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settingsForm) return;

    try {
      setUploadingMedia(true);
      const res = await apiClient.uploadMedia(file);
      if (res.success) {
        const updatedSettings = { ...settingsForm, logoUrl: res.url };
        setSettingsForm(updatedSettings);
        await apiClient.updateSettings(updatedSettings);
        showToast('Logo uploaded and set as official website logo!', 'success');
        refreshData();
        const list = await apiClient.getMediaList();
        setMediaList(list);
      }
    } catch (err: any) {
      showToast(err.message || 'Logo upload failed', 'error');
    } finally {
      setUploadingMedia(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  // Dedicated Hero Media Upload Handler
  const handleHeroMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settingsForm) return;

    try {
      setUploadingMedia(true);
      const res = await apiClient.uploadMedia(file);
      if (res.success) {
        const updatedSettings = {
          ...settingsForm,
          hero: { ...settingsForm.hero, bgImage: res.url },
        };
        setSettingsForm(updatedSettings);
        await apiClient.updateSettings(updatedSettings);
        showToast('Hero background media updated successfully!', 'success');
        refreshData();
      }
    } catch (err: any) {
      showToast(err.message || 'Hero upload failed', 'error');
    } finally {
      setUploadingMedia(false);
      if (heroMediaInputRef.current) heroMediaInputRef.current.value = '';
    }
  };

  // Dedicated Portfolio Modal Image Upload Handler
  const handlePortfolioImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPortfolio) return;

    try {
      setUploadingMedia(true);
      const res = await apiClient.uploadMedia(file);
      if (res.success) {
        setEditingPortfolio({ ...editingPortfolio, image: res.url });
        showToast('Image uploaded and set for project!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setUploadingMedia(false);
      if (portfolioImgInputRef.current) portfolioImgInputRef.current.value = '';
    }
  };

  const handleDeleteMedia = async (filename: string) => {
    if (!window.confirm(`Delete ${filename} permanently from storage?`)) return;
    try {
      await apiClient.deleteMedia(filename);
      setMediaList((prev) => prev.filter((m) => m.filename !== filename));
      showToast('Media file deleted', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete file', 'error');
    }
  };

  const handleCopyMediaUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast(`Copied URL: ${url}`, 'info');
  };

  // ----------------- Settings Save -----------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;
    try {
      setSavingSettings(true);
      const res = await apiClient.updateSettings(settingsForm);
      if (res.success) {
        showToast('Website settings and branding saved persistently!', 'success');
        refreshData();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  // ----------------- Password Change -----------------
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    try {
      setChangingPass(true);
      const res = await apiClient.changePassword(currentPassword, newPassword);
      if (res.success) {
        showToast('Admin password updated successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err: any) {
      showToast(err.message || 'Password update failed', 'error');
    } finally {
      setChangingPass(false);
    }
  };

  const navigationItems: Array<{ id: AdminSection; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }> = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'analytics', label: 'Studio Analytics', icon: BarChart3 },
    { id: 'inquiries', label: 'Inquiries', icon: Inbox, badge: stats.newInquiries },
    { id: 'services', label: 'Services', icon: Layers },
    { id: 'portfolio', label: 'Portfolio & Works', icon: Film },
    { id: 'packages', label: 'Pricing & Packages', icon: Tag },
    { id: 'testimonials', label: 'Client Reviews', icon: Star },
    { id: 'content', label: 'Hero & About Content', icon: Sliders },
    { id: 'contact-social', label: 'Contact & Socials', icon: Phone },
    { id: 'faqs-legal', label: 'FAQs & Legal Pages', icon: FileText },
    { id: 'media', label: 'Persistent Media Vault', icon: ImageIcon },
    { id: 'settings', label: 'Theme & Security', icon: Settings },
  ];

  const handleTabSelect = (id: AdminSection) => {
    setActiveSection(id);
    setMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-neutral-100 flex flex-col md:flex-row antialiased">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex md:w-64 lg:w-72 bg-[#0c0c0c] border-r border-neutral-800/90 flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none">
        <div className="flex flex-col h-full overflow-y-auto p-4 space-y-6">
          {/* Logo / Studio Header */}
          <div className="px-2 pt-2 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c5a059] flex items-center justify-center font-bold text-black font-brand text-base shadow-sm shrink-0">
              S
            </div>
            <div className="truncate">
              <div className="font-brand font-bold text-white text-base tracking-wide truncate">
                Shifa Productions
              </div>
              <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Admin Studio</span>
              </div>
            </div>
          </div>

          {/* User profile tag */}
          <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-300 space-y-0.5">
            <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
              Authenticated Admin
            </div>
            <div className="truncate font-medium text-white text-xs">{user?.email}</div>
          </div>

          {/* Navigation Links List */}
          <nav className="flex-1 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabSelect(item.id)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-[#c5a059] text-black shadow-md font-bold'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        isActive ? 'bg-black text-[#c5a059]' : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-neutral-800/80 space-y-2">
            <button
              onClick={() => navigateTo('home')}
              className="w-full px-3.5 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Website</span>
            </button>

            <button
              onClick={logout}
              className="w-full px-3.5 py-2 text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-950/40 border border-rose-800/70 rounded-xl hover:bg-rose-900/50 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MOBILE ADMIN TOP BAR ================= */}
      <div className="md:hidden sticky top-0 z-40 bg-[#0d0d0d] border-b border-neutral-800 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#c5a059] flex items-center justify-center font-bold text-black font-brand text-xs">
            S
          </div>
          <div>
            <div className="font-brand font-bold text-white text-sm">Shifa Admin</div>
            <div className="text-[10px] text-[#c5a059] uppercase tracking-wider font-semibold">
              {navigationItems.find((n) => n.id === activeSection)?.label || 'Dashboard'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('home')}
            className="p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-900 border border-neutral-800"
            title="View Site"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="min-w-[40px] min-h-[40px] p-2 text-neutral-200 hover:text-white rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center"
            aria-label="Toggle Admin Menu"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ================= MOBILE DRAWER FOR ADMIN ================= */}
      {mobileNavOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setMobileNavOpen(false)}
        >
          <div
            className="fixed top-0 left-0 bottom-0 w-[80%] max-w-xs bg-[#111111] border-r border-neutral-800 p-5 flex flex-col justify-between shadow-2xl z-50 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <span className="font-brand font-bold text-white text-base">Admin Navigation</span>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabSelect(item.id)}
                      className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-[#c5a059] text-black font-bold'
                          : 'text-neutral-300 hover:bg-neutral-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-neutral-800 space-y-2">
              <button
                onClick={() => {
                  navigateTo('home');
                  setMobileNavOpen(false);
                }}
                className="w-full min-h-[42px] py-2 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Public Website</span>
              </button>
              <button
                onClick={logout}
                className="w-full min-h-[42px] py-2 text-xs font-semibold text-rose-300 bg-rose-950/40 border border-rose-800/70 rounded-xl flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN CONTENT WORKSPACE ================= */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* ================= 1. OVERVIEW SECTION ================= */}
        {activeSection === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-brand">
                Dashboard Overview
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Real-time inquiry metrics, active cinema services, and production catalog stats.
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => setActiveSection('inquiries')}
                className="p-5 rounded-2xl bg-[#111111] border border-neutral-800 hover:border-[#c5a059]/40 cursor-pointer transition-colors space-y-1"
              >
                <div className="text-xs text-neutral-400">Total Inquiries Received</div>
                <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums font-brand">
                  {stats.totalInquiries}
                </div>
              </div>

              <div
                onClick={() => setActiveSection('inquiries')}
                className="p-5 rounded-2xl bg-[#111111] border border-neutral-800 hover:border-amber-500/40 cursor-pointer transition-colors space-y-1"
              >
                <div className="text-xs text-amber-400">New / Unhandled Inquiries</div>
                <div className="text-2xl sm:text-3xl font-bold text-amber-400 tabular-nums font-brand">
                  {stats.newInquiries}
                </div>
              </div>

              <div
                onClick={() => setActiveSection('inquiries')}
                className="p-5 rounded-2xl bg-[#111111] border border-neutral-800 hover:border-emerald-500/40 cursor-pointer transition-colors space-y-1"
              >
                <div className="text-xs text-emerald-400">Confirmed Projects</div>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-400 tabular-nums font-brand">
                  {stats.confirmedProjects}
                </div>
              </div>

              <div
                onClick={() => setActiveSection('services')}
                className="p-5 rounded-2xl bg-[#111111] border border-neutral-800 hover:border-[#c5a059]/40 cursor-pointer transition-colors space-y-1"
              >
                <div className="text-xs text-neutral-400">Active Services & Portfolio</div>
                <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums font-brand">
                  {stats.totalServices} / {stats.totalPortfolio}
                </div>
              </div>
            </div>

            {/* Analytics Snapshot Banner */}
            {analytics && (
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#141414] via-[#161616] to-[#121212] border border-neutral-800 hover:border-[#c5a059]/50 transition-all space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#c5a059]/15 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059] shrink-0">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white font-brand">
                          Studio Performance Analytics
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-semibold">
                          Live Metrics
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        PKR {(analytics.revenue.totalPipelinePkr / 1000000).toFixed(1)}M Total Pipeline · {analytics.funnel.conversionRate}% Lead Conversion · {analytics.funnel.total} Verified Inquiries
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSection('analytics')}
                    className="px-4 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d4af37] text-black text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto shrink-0 shadow-md shadow-[#c5a059]/15"
                  >
                    <span>Open Full 5-Type Analytics</span>
                    <TrendingUp className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions Strip */}
            <div className="p-6 rounded-2xl bg-[#111111] border border-neutral-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300 font-brand">
                Quick Studio Actions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <button
                  onClick={() => setActiveSection('analytics')}
                  className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#c5a059] transition-all text-left space-y-1"
                >
                  <BarChart3 className="w-5 h-5 text-[#c5a059]" />
                  <div className="text-xs font-bold text-white">Studio Analytics</div>
                  <div className="text-[10px] text-neutral-400">View 5 core dimensions</div>
                </button>

                <button
                  onClick={() => setActiveSection('inquiries')}
                  className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#c5a059] transition-all text-left space-y-1"
                >
                  <Inbox className="w-5 h-5 text-[#c5a059]" />
                  <div className="text-xs font-bold text-white">Review Inquiries</div>
                  <div className="text-[10px] text-neutral-400">Update client statuses</div>
                </button>

                <button
                  onClick={() => setActiveSection('content')}
                  className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#c5a059] transition-all text-left space-y-1"
                >
                  <Sliders className="w-5 h-5 text-[#c5a059]" />
                  <div className="text-xs font-bold text-white">Edit Hero & Logo</div>
                  <div className="text-[10px] text-neutral-400">Change homepage visuals</div>
                </button>

                <button
                  onClick={() => setActiveSection('portfolio')}
                  className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#c5a059] transition-all text-left space-y-1"
                >
                  <Film className="w-5 h-5 text-[#c5a059]" />
                  <div className="text-xs font-bold text-white">Add Portfolio Film</div>
                  <div className="text-[10px] text-neutral-400">Upload new wedding or TVC</div>
                </button>

                <button
                  onClick={() => setActiveSection('media')}
                  className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-[#c5a059] transition-all text-left space-y-1"
                >
                  <ImageIcon className="w-5 h-5 text-[#c5a059]" />
                  <div className="text-xs font-bold text-white">Media Vault</div>
                  <div className="text-[10px] text-neutral-400">Upload raw assets & video</div>
                </button>
              </div>
            </div>

            {/* Recent Inquiries preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white font-brand">Recent Client Inquiries</h3>
                <button
                  onClick={() => setActiveSection('inquiries')}
                  className="text-xs text-[#c5a059] hover:underline font-medium"
                >
                  View All ({inquiries.length})
                </button>
              </div>

              <div className="space-y-3">
                {inquiries.slice(0, 3).map((inq) => (
                  <div
                    key={inq.id}
                    onClick={() => {
                      setSelectedInquiry(inq);
                      setActiveSection('inquiries');
                    }}
                    className="p-4 rounded-xl bg-[#111111] border border-neutral-800 hover:border-neutral-700 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-white text-sm">{inq.fullName}</div>
                      <div className="text-xs text-neutral-400">
                        {inq.city} · {inq.requiredService} · Budget: {inq.estimatedBudget}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                        {inq.status}
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. STUDIO ANALYTICS SECTION ================= */}
        {activeSection === 'analytics' && (
          <AdminAnalyticsSection
            analytics={analytics}
            onRefresh={loadAdminData}
            onNavigateToInquiries={() => setActiveSection('inquiries')}
          />
        )}

        {/* ================= 3. INQUIRIES SECTION ================= */}
        {activeSection === 'inquiries' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white font-brand">Customer Inquiries</h1>
                <p className="text-xs text-neutral-400 mt-0.5">
                  View, filter, update project statuses, and add private producer notes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    placeholder="Search client, city, service..."
                    className="w-full sm:w-60 pl-9 pr-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <select
                  value={inquiryFilterStatus}
                  onChange={(e) => setInquiryFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="in discussion">In Discussion</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-5 sm:p-6 rounded-2xl bg-[#111111] border border-neutral-800 hover:border-neutral-700 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-base sm:text-lg font-bold text-white font-brand">
                          {inq.fullName}
                        </h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider ${
                            inq.status === 'New'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : inq.status === 'Confirmed'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : inq.status === 'In Discussion'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          {inq.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                        <span className="flex items-center gap-1 text-neutral-300">
                          <MapPin className="w-3 h-3 text-[#c5a059]" />
                          {inq.city}
                        </span>
                        <span>·</span>
                        <span className="text-[#c5a059] font-medium">{inq.requiredService}</span>
                        <span>·</span>
                        <span>Budget: {inq.estimatedBudget}</span>
                        <span>·</span>
                        <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setSelectedInquiry(inq)}
                        className="min-h-[38px] px-3.5 py-1.5 text-xs font-semibold text-neutral-200 bg-neutral-900 border border-neutral-700 rounded-lg hover:text-white hover:border-[#c5a059] transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect & Notes</span>
                      </button>

                      <select
                        value={inq.status}
                        onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                        className="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                      >
                        <option value="New">Status: New</option>
                        <option value="Contacted">Status: Contacted</option>
                        <option value="In Discussion">Status: In Discussion</option>
                        <option value="Confirmed">Status: Confirmed</option>
                        <option value="Completed">Status: Completed</option>
                      </select>

                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="min-h-[38px] min-w-[38px] p-2 text-neutral-500 hover:text-rose-400 transition-colors flex items-center justify-center rounded-lg bg-neutral-900/60"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed bg-black/40 p-3.5 rounded-xl border border-neutral-900">
                    "{inq.projectDescription}"
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#c5a059]" />
                      <a href={`tel:${inq.phoneNumber}`} className="hover:text-white underline">
                        {inq.phoneNumber}
                      </a>
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#c5a059]" />
                      <a href={`mailto:${inq.email}`} className="hover:text-white underline">
                        {inq.email}
                      </a>
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Preferred: <strong className="text-neutral-300">{inq.preferredContactMethod.toUpperCase()}</strong>
                    </span>
                    {inq.internalNotes && (
                      <span className="text-[11px] text-amber-300/80 italic line-clamp-1">
                        Note: {inq.internalNotes}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {filteredInquiries.length === 0 && (
                <div className="p-12 text-center text-neutral-500 text-sm bg-[#111111] rounded-2xl border border-neutral-800">
                  No inquiries matching the selected filters.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= 3. SERVICES SECTION ================= */}
        {activeSection === 'services' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white font-brand">Manage Services</h1>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Add, edit, change PKR prices, features, and deliverables for all services.
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingService({
                    title: '',
                    slug: '',
                    shortDesc: '',
                    fullDesc: '',
                    iconName: 'Clapperboard',
                    features: ['Cinema camera package', 'Director on set', 'Lighting kit'],
                    deliverables: ['Master 4K Video', 'Social Cut'],
                    startingPricePkr: '250,000',
                    turnaroundTime: '2-3 weeks',
                  })
                }
                className="min-h-[44px] px-4 py-2 text-xs uppercase tracking-wider font-semibold text-black bg-[#c5a059] rounded-xl hover:bg-[#d4af37] transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {servicesList.map((srv) => (
                <div key={srv.id} className="p-5 rounded-2xl bg-[#111111] border border-neutral-800 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#c5a059] uppercase tracking-wider">
                        {srv.iconName}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingService(srv)}
                          className="min-w-[36px] min-h-[36px] flex items-center justify-center text-neutral-400 hover:text-white"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(srv.id)}
                          className="min-w-[36px] min-h-[36px] flex items-center justify-center text-neutral-400 hover:text-rose-400"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white font-brand">{srv.title}</h3>
                    <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">{srv.shortDesc}</p>
                  </div>

                  <div className="pt-3 border-t border-neutral-900 flex items-center justify-between text-xs">
                    <span className="text-neutral-300">
                      PKR <strong className="text-white">{srv.startingPricePkr || 'Quote'}</strong>
                    </span>
                    <span className="text-neutral-500">{srv.turnaroundTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 4. PORTFOLIO SECTION ================= */}
        {activeSection === 'portfolio' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white font-brand">Manage Portfolio Projects</h1>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Upload project stills, embed video showreels, and categorize client works.
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingPortfolio({
                    title: '',
                    category: 'Weddings',
                    client: '',
                    location: 'Lahore, Pakistan',
                    description: '',
                    image: '/src/assets/images/hero_cinematic_production_1793180767552.jpg',
                    videoUrl: '',
                    year: '2026',
                    gearUsed: 'ARRI Alexa Mini LF, Master Anamorphics',
                    deliverables: ['Cinematic Master Film', 'Vertical Teaser'],
                    isFeatured: true,
                  })
                }
                className="min-h-[44px] px-4 py-2 text-xs uppercase tracking-wider font-semibold text-black bg-[#c5a059] rounded-xl hover:bg-[#d4af37] transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Portfolio Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioList.map((item) => (
                <div key={item.id} className="rounded-2xl bg-[#111111] border border-neutral-800 overflow-hidden flex flex-col justify-between">
                  <div className="relative aspect-video bg-black">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-black/80 px-2 py-1 rounded-md text-[10px] text-white">
                      {item.category}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold text-white font-brand">{item.title}</h3>
                    <p className="text-xs text-neutral-400 line-clamp-2">{item.description}</p>
                    <div className="text-[11px] text-neutral-500">
                      {item.location} · {item.year} {item.client ? `· Client: ${item.client}` : ''}
                    </div>

                    <div className="pt-3 border-t border-neutral-900 flex items-center justify-between">
                      <button
                        onClick={() => setEditingPortfolio(item)}
                        className="px-3 py-1.5 text-xs font-semibold text-neutral-200 bg-neutral-900 border border-neutral-800 rounded-lg hover:text-white"
                      >
                        Edit Details
                      </button>
                      <button
                        onClick={() => handleDeletePortfolio(item.id)}
                        className="p-1 text-neutral-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 5. PACKAGES & PRICING ================= */}
        {activeSection === 'packages' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white font-brand">Pricing & Packages</h1>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Update package titles, crew allocations, deliverables, and PKR rates.
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingPackage({
                    name: 'New Custom Tier',
                    tagline: 'Custom production tier...',
                    pricePkr: '250,000',
                    isCustomQuote: false,
                    duration: '8 Hours',
                    crewSize: '3 Crew Members',
                    includedServices: ['4K Camera Package', 'Audio Capture'],
                    deliverables: ['Highlight Film'],
                    optionalAddons: [],
                    isPopular: false,
                  })
                }
                className="min-h-[44px] px-4 py-2 text-xs uppercase tracking-wider font-semibold text-black bg-[#c5a059] rounded-xl hover:bg-[#d4af37] transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Package</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {packagesList.map((pkg) => (
                <div key={pkg.id} className="p-6 rounded-2xl bg-[#111111] border border-neutral-800 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white font-brand">{pkg.name}</h3>
                      {pkg.isPopular && (
                        <span className="text-[10px] font-bold text-black bg-[#c5a059] px-2 py-0.5 rounded-full uppercase">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="text-xl font-bold text-[#c5a059] font-brand">
                      {pkg.isCustomQuote ? 'Custom Quote' : `PKR ${pkg.pricePkr}`}
                    </div>
                    <p className="text-xs text-neutral-400">{pkg.tagline}</p>
                    <div className="text-xs text-neutral-300 space-y-1">
                      <div>Duration: {pkg.duration}</div>
                      <div>Crew: {pkg.crewSize}</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-900 flex items-center justify-between">
                    <button
                      onClick={() => setEditingPackage(pkg)}
                      className="px-3 py-1.5 text-xs font-semibold text-neutral-200 bg-neutral-900 border border-neutral-800 rounded-lg hover:text-white"
                    >
                      Edit Package
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="p-1 text-neutral-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 6. TESTIMONIALS SECTION ================= */}
        {activeSection === 'testimonials' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white font-brand">Client Testimonials</h1>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Manage client feedback with transparent verified customer badges.
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingTestimonial({
                    clientName: '',
                    roleOrBrand: '',
                    city: 'Lahore',
                    rating: 5,
                    reviewText: '',
                    projectType: 'Regal Wedding Film',
                    isVerifiedCustomer: true,
                    date: 'October 2026',
                  })
                }
                className="min-h-[44px] px-4 py-2 text-xs uppercase tracking-wider font-semibold text-black bg-[#c5a059] rounded-xl hover:bg-[#d4af37] transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Review</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonialsList.map((t) => (
                <div key={t.id} className="p-5 rounded-2xl bg-[#111111] border border-neutral-800 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{t.clientName}</span>
                      <span className={`text-[10px] ${t.isVerifiedCustomer ? 'text-emerald-400 font-semibold' : 'text-neutral-500'}`}>
                        {t.isVerifiedCustomer ? 'Verified' : 'Sample'}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-400">{t.roleOrBrand} · {t.city}</div>
                    <p className="text-xs text-neutral-300 italic line-clamp-3 leading-relaxed">"{t.reviewText}"</p>
                  </div>

                  <div className="pt-3 border-t border-neutral-900 flex items-center justify-between">
                    <button
                      onClick={() => setEditingTestimonial(t)}
                      className="px-2.5 py-1 text-xs text-neutral-300 hover:text-white"
                    >
                      Edit Review
                    </button>
                    <button onClick={() => handleDeleteTestimonial(t.id)} className="p-1 text-neutral-500 hover:text-rose-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 7. CONTENT (HERO & ABOUT & LOGO) ================= */}
        {activeSection === 'content' && settingsForm && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-bold text-white font-brand">
                Website Content, Logo & Hero
              </h1>
              <p className="text-xs text-neutral-400 mt-0.5">
                Upload your official company logo, customize homepage hero headings, and update About Us story.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-8">
              {/* Logo Management Card */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#111111] border border-neutral-800 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white font-brand">
                    Website Official Logo
                  </h3>
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    className="hidden"
                    accept="image/*"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingMedia}
                    className="min-h-[40px] px-4 py-2 text-xs font-semibold text-black bg-[#c5a059] rounded-xl hover:bg-[#d4af37] transition-all flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload New Logo File</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                  <div className="w-32 h-20 bg-black/60 rounded-xl border border-neutral-800 flex items-center justify-center p-2 shrink-0">
                    {settingsForm.logoUrl ? (
                      <img
                        src={settingsForm.logoUrl}
                        alt="Current Logo"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-neutral-500 text-center">Using Text Wordmark</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1 text-xs text-neutral-400">
                    <div>Logo URL: <span className="text-neutral-200 font-mono break-all">{settingsForm.logoUrl || '(Default Text Wordmark)'}</span></div>
                    <div>Recommended: Transparent PNG or SVG, minimum height 60px.</div>
                  </div>
                </div>
              </div>

              {/* Homepage Hero Content */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#111111] border border-neutral-800 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white font-brand">
                    Homepage Hero Section
                  </h3>
                  <input
                    type="file"
                    ref={heroMediaInputRef}
                    onChange={handleHeroMediaUpload}
                    className="hidden"
                    accept="image/*,video/*"
                  />
                  <button
                    type="button"
                    onClick={() => heroMediaInputRef.current?.click()}
                    className="min-h-[40px] px-3.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-xl flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4 text-[#c5a059]" />
                    <span>Upload Hero Image/Video</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      Main Hero Headline
                    </label>
                    <input
                      type="text"
                      value={settingsForm.hero.heading}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          hero: { ...settingsForm.hero, heading: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      Hero Subheading / Supporting Text
                    </label>
                    <textarea
                      rows={3}
                      value={settingsForm.hero.subheading}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          hero: { ...settingsForm.hero, subheading: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      Hero Background Media Path or URL
                    </label>
                    <input
                      type="text"
                      value={settingsForm.hero.bgImage}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          hero: { ...settingsForm.hero, bgImage: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>
              </div>

              {/* About Us Content Management */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#111111] border border-neutral-800 space-y-6">
                <h3 className="text-base font-bold text-white font-brand">
                  About Us Story & Vision
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      About Title
                    </label>
                    <input
                      type="text"
                      value={settingsForm.about.title}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          about: { ...settingsForm.about, title: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      Main Story & Origin
                    </label>
                    <textarea
                      rows={4}
                      value={settingsForm.about.story}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          about: { ...settingsForm.about, story: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      Cinematic Philosophy & Vision
                    </label>
                    <textarea
                      rows={3}
                      value={settingsForm.about.cinematicVision}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          about: { ...settingsForm.about, cinematicVision: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs text-neutral-400">Completed Projects</label>
                      <input
                        type="text"
                        value={settingsForm.about.completedProjects}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            about: { ...settingsForm.about, completedProjects: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-neutral-400">Years Experience</label>
                      <input
                        type="text"
                        value={settingsForm.about.experienceYears}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            about: { ...settingsForm.about, experienceYears: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-neutral-400">Filmmakers & Crew Count</label>
                      <input
                        type="text"
                        value={settingsForm.about.filmmakersCount}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            about: { ...settingsForm.about, filmmakersCount: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="min-h-[46px] w-full sm:w-auto px-8 py-3 text-xs uppercase tracking-wider font-semibold text-black bg-[#c5a059] rounded-xl hover:bg-[#d4af37] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#c5a059]/20"
                >
                  {savingSettings ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Persistent DB...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Content Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= 8. CONTACT & SOCIALS SECTION ================= */}
        {activeSection === 'contact-social' && settingsForm && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-bold text-white font-brand">
                Contact Details & Social Media
              </h1>
              <p className="text-xs text-neutral-400 mt-0.5">
                Update studio phone number, WhatsApp, email, Lahore/Islamabad addresses, and social links.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-8">
              <div className="p-6 sm:p-7 rounded-2xl bg-[#111111] border border-neutral-800 space-y-6">
                <h3 className="text-base font-bold text-white font-brand">
                  Pakistani Contact Numbers & Official Channels
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-400">Phone Number</label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-neutral-400">WhatsApp Number</label>
                    <input
                      type="text"
                      value={settingsForm.whatsapp}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-neutral-400">Official Email</label>
                    <input
                      type="email"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-400">Lahore Studio Address</label>
                    <input
                      type="text"
                      value={settingsForm.addressLahore}
                      onChange={(e) => setSettingsForm({ ...settingsForm, addressLahore: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-neutral-400">Islamabad Studio Address</label>
                    <input
                      type="text"
                      value={settingsForm.addressIslamabad}
                      onChange={(e) => setSettingsForm({ ...settingsForm, addressIslamabad: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#111111] border border-neutral-800 space-y-6">
                <h3 className="text-base font-bold text-white font-brand">
                  Social Media Links
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-400">Instagram Profile URL</label>
                    <input
                      type="text"
                      value={settingsForm.socials.instagram}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          socials: { ...settingsForm.socials, instagram: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-neutral-400">YouTube Channel URL</label>
                    <input
                      type="text"
                      value={settingsForm.socials.youtube}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          socials: { ...settingsForm.socials, youtube: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-neutral-400">Vimeo Portfolio URL</label>
                    <input
                      type="text"
                      value={settingsForm.socials.vimeo}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          socials: { ...settingsForm.socials, vimeo: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-neutral-400">LinkedIn Page URL</label>
                    <input
                      type="text"
                      value={settingsForm.socials.linkedin}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          socials: { ...settingsForm.socials, linkedin: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="min-h-[46px] w-full sm:w-auto px-8 py-3 text-xs uppercase tracking-wider font-semibold text-black bg-[#c5a059] rounded-xl hover:bg-[#d4af37] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#c5a059]/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Contact & Social Details</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= 9. FAQS & LEGAL PAGES ================= */}
        {activeSection === 'faqs-legal' && settingsForm && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white font-brand">FAQs & Legal Documentation</h1>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Update questions/answers and customize Privacy Policy & Terms and Conditions.
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingFaq({
                    question: '',
                    answer: '',
                    category: 'General',
                  })
                }
                className="min-h-[44px] px-4 py-2 text-xs uppercase tracking-wider font-semibold text-black bg-[#c5a059] rounded-xl hover:bg-[#d4af37] transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add FAQ</span>
              </button>
            </div>

            {/* FAQs List */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-300 font-brand">
                Active FAQ Entries
              </h3>
              {faqsList.map((f) => (
                <div key={f.id} className="p-5 rounded-2xl bg-[#111111] border border-neutral-800 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-sm font-bold text-white font-brand">{f.question}</h4>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingFaq(f)}
                        className="p-1 text-neutral-400 hover:text-white"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFaq(f.id)}
                        className="p-1 text-neutral-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>

            {/* Legal Documents Editor */}
            <form onSubmit={handleSaveSettings} className="p-6 sm:p-7 rounded-2xl bg-[#111111] border border-neutral-800 space-y-6">
              <h3 className="text-base font-bold text-white font-brand">
                Custom Legal Text (Privacy Policy & Terms)
              </h3>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Custom Privacy Policy Text
                  </label>
                  <textarea
                    rows={5}
                    value={settingsForm.legal?.privacyPolicy || ''}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        legal: {
                          privacyPolicy: e.target.value,
                          termsAndConditions: settingsForm.legal?.termsAndConditions || '',
                        },
                      })
                    }
                    placeholder="Enter customized privacy terms (or leave blank to use default Pakistan privacy clauses)..."
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs sm:text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Custom Terms & Conditions Text
                  </label>
                  <textarea
                    rows={5}
                    value={settingsForm.legal?.termsAndConditions || ''}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        legal: {
                          privacyPolicy: settingsForm.legal?.privacyPolicy || '',
                          termsAndConditions: e.target.value,
                        },
                      })
                    }
                    placeholder="Enter customized terms of booking & shoot deliverables (or leave blank for standard clauses)..."
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs sm:text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="min-h-[44px] px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-black bg-[#c5a059] rounded-xl hover:bg-[#d4af37]"
                  >
                    Save Legal Documentation
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ================= 10. MEDIA VAULT ================= */}
        {activeSection === 'media' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#111111] border border-neutral-800">
              <div className="space-y-1">
                <h1 className="text-xl font-bold text-white font-brand">Persistent Media Storage</h1>
                <p className="text-xs text-neutral-400">
                  Upload images, showreels, and client clips directly from your device. Files stay stored permanently on disk.
                </p>
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,video/*"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingMedia}
                  className="min-h-[44px] px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-black bg-[#c5a059] rounded-xl hover:bg-[#d4af37] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {uploadingMedia ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading to Disk...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload New File</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {mediaList.map((m) => (
                <div key={m.filename} className="group relative rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col justify-between">
                  <div className="aspect-square bg-black overflow-hidden flex items-center justify-center">
                    {m.filename.endsWith('.mp4') || m.filename.endsWith('.webm') ? (
                      <div className="text-xs text-neutral-400 flex flex-col items-center gap-1">
                        <Film className="w-6 h-6 text-[#c5a059]" />
                        <span>Video Clip</span>
                      </div>
                    ) : (
                      <img src={m.url} alt={m.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    )}
                  </div>

                  <div className="p-3 bg-[#0d0d0d] space-y-2 text-xs">
                    <div className="truncate text-[11px] text-neutral-300 font-mono" title={m.filename}>
                      {m.filename}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-neutral-500">
                      <span>{(m.size / 1024 / 1024).toFixed(1)} MB</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyMediaUrl(m.url)}
                          className="hover:text-white p-1"
                          title="Copy Public URL"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMedia(m.filename)}
                          className="hover:text-rose-400 p-1"
                          title="Delete File"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {mediaList.length === 0 && (
              <div className="p-12 text-center text-neutral-500 text-sm bg-[#111111] rounded-2xl border border-neutral-800">
                No custom media files in the library yet. Click "Upload New File" to add banners or stills.
              </div>
            )}
          </div>
        )}

        {/* ================= 11. THEME & SECURITY SETTINGS ================= */}
        {activeSection === 'settings' && settingsForm && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-bold text-white font-brand">
                Theme, SEO & Security Settings
              </h1>
              <p className="text-xs text-neutral-400 mt-0.5">
                Configure brand name, SEO metadata, theme accents, and update administrator credentials.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="p-6 sm:p-7 rounded-2xl bg-[#111111] border border-neutral-800 space-y-6">
              <h3 className="text-base font-bold text-white font-brand">
                General Branding & SEO Metadata
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">Brand Name</label>
                  <input
                    type="text"
                    value={settingsForm.brandName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">Tagline</label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">Google SEO Title</label>
                  <input
                    type="text"
                    value={settingsForm.seo.metaTitle}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        seo: { ...settingsForm.seo, metaTitle: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">Google SEO Meta Description</label>
                  <textarea
                    rows={2}
                    value={settingsForm.seo.metaDescription}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        seo: { ...settingsForm.seo, metaDescription: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs sm:text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="min-h-[44px] px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-black bg-[#c5a059] rounded-xl hover:bg-[#d4af37]"
                >
                  Save Branding & SEO
                </button>
              </div>
            </form>

            {/* Change Admin Password */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#111111] border border-neutral-800 space-y-6">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white font-brand">
                  Security & Administrator Password
                </h3>
                <p className="text-xs text-neutral-400">
                  Update your secure password. Credentials are hashed using cryptographic PBKDF2 with salt.
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={changingPass}
                  className="min-h-[44px] px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL: INQUIRY DETAIL & NOTES ================= */}
      {selectedInquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedInquiry(null)}
        >
          <div
            className="w-full max-w-2xl bg-[#121212] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs text-[#c5a059] uppercase tracking-wider font-semibold">
                  Inquiry Details
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-brand">
                  {selectedInquiry.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-neutral-300 p-4 rounded-xl bg-neutral-900 border border-neutral-800">
              <div>
                <span className="text-neutral-500 block">Phone:</span>
                <strong className="text-white text-sm">{selectedInquiry.phoneNumber}</strong>
              </div>
              <div>
                <span className="text-neutral-500 block">Email:</span>
                <strong className="text-white text-sm">{selectedInquiry.email}</strong>
              </div>
              <div>
                <span className="text-neutral-500 block">City:</span>
                <strong className="text-white text-sm">{selectedInquiry.city}</strong>
              </div>
              <div>
                <span className="text-neutral-500 block">Service:</span>
                <strong className="text-white text-sm">{selectedInquiry.requiredService}</strong>
              </div>
              <div>
                <span className="text-neutral-500 block">Target Date:</span>
                <strong className="text-white text-sm">{selectedInquiry.preferredDate}</strong>
              </div>
              <div>
                <span className="text-neutral-500 block">Budget:</span>
                <strong className="text-[#c5a059] text-sm">{selectedInquiry.estimatedBudget}</strong>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
                Client Project Description:
              </label>
              <div className="p-4 rounded-xl bg-black/60 border border-neutral-800 text-xs sm:text-sm text-neutral-200 leading-relaxed">
                {selectedInquiry.projectDescription}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
                Internal Producer Notes:
              </label>
              <textarea
                rows={3}
                defaultValue={selectedInquiry.internalNotes || ''}
                id="internalNotesField"
                placeholder="Add private team notes, meeting date, price agreed..."
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
              <button
                onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Inquiry</span>
              </button>

              <button
                onClick={() => {
                  const input = document.getElementById('internalNotesField') as HTMLTextAreaElement;
                  handleSaveInternalNotes(selectedInquiry.id, input?.value || '');
                }}
                className="min-h-[40px] px-5 py-2 text-xs uppercase tracking-wider font-semibold text-black bg-[#c5a059] rounded-lg hover:bg-[#d4af37]"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT SERVICE ================= */}
      {editingService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn overflow-y-auto"
          onClick={() => setEditingService(null)}
        >
          <div
            className="w-full max-w-xl bg-[#121212] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-5 my-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white font-brand">
                {editingService.id ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button onClick={() => setEditingService(null)} className="p-1 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Service Title</label>
                <input
                  type="text"
                  required
                  value={editingService.title || ''}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Short Summary</label>
                <textarea
                  rows={2}
                  required
                  value={editingService.shortDesc || ''}
                  onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">Starting Price in PKR</label>
                  <input
                    type="text"
                    value={editingService.startingPricePkr || ''}
                    onChange={(e) => setEditingService({ ...editingService, startingPricePkr: e.target.value })}
                    placeholder="e.g. 250,000"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">Turnaround Timeline</label>
                  <input
                    type="text"
                    value={editingService.turnaroundTime || ''}
                    onChange={(e) => setEditingService({ ...editingService, turnaroundTime: e.target.value })}
                    placeholder="e.g. 2-3 weeks"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="min-h-[40px] px-4 py-2 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] px-6 py-2 text-xs font-semibold text-black bg-[#c5a059] rounded-lg hover:bg-[#d4af37]"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT PORTFOLIO ================= */}
      {editingPortfolio && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn overflow-y-auto"
          onClick={() => setEditingPortfolio(null)}
        >
          <div
            className="w-full max-w-xl bg-[#121212] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-5 my-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white font-brand">
                {editingPortfolio.id ? 'Edit Portfolio Project' : 'Add Portfolio Project'}
              </h3>
              <button onClick={() => setEditingPortfolio(null)} className="p-1 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePortfolio} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Project Title</label>
                <input
                  type="text"
                  required
                  value={editingPortfolio.title || ''}
                  onChange={(e) => setEditingPortfolio({ ...editingPortfolio, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">Category</label>
                  <select
                    value={editingPortfolio.category}
                    onChange={(e) => setEditingPortfolio({ ...editingPortfolio, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  >
                    <option value="Weddings">Weddings</option>
                    <option value="Commercials">Commercials</option>
                    <option value="Events">Events</option>
                    <option value="Products">Products</option>
                    <option value="Cinematic Films">Cinematic Films</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">Client / Couple</label>
                  <input
                    type="text"
                    value={editingPortfolio.client || ''}
                    onChange={(e) => setEditingPortfolio({ ...editingPortfolio, client: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-neutral-400">Project Image</label>
                  <input
                    type="file"
                    ref={portfolioImgInputRef}
                    onChange={handlePortfolioImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                  <button
                    type="button"
                    onClick={() => portfolioImgInputRef.current?.click()}
                    className="text-xs text-[#c5a059] hover:underline flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={editingPortfolio.image || ''}
                  onChange={(e) => setEditingPortfolio({ ...editingPortfolio, image: e.target.value })}
                  placeholder="/src/assets/images/... or /uploads/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Video URL (YouTube or Vimeo)</label>
                <input
                  type="text"
                  value={editingPortfolio.videoUrl || ''}
                  onChange={(e) => setEditingPortfolio({ ...editingPortfolio, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Project Description</label>
                <textarea
                  rows={3}
                  value={editingPortfolio.description || ''}
                  onChange={(e) => setEditingPortfolio({ ...editingPortfolio, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Cinema Gear Deployed</label>
                <input
                  type="text"
                  value={editingPortfolio.gearUsed || ''}
                  onChange={(e) => setEditingPortfolio({ ...editingPortfolio, gearUsed: e.target.value })}
                  placeholder="e.g. ARRI Alexa Mini LF, Master Anamorphics, DJI Inspire 3"
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingPortfolio(null)}
                  className="min-h-[40px] px-4 py-2 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] px-6 py-2 text-xs font-semibold text-black bg-[#c5a059] rounded-lg hover:bg-[#d4af37]"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT PACKAGE ================= */}
      {editingPackage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn overflow-y-auto"
          onClick={() => setEditingPackage(null)}
        >
          <div
            className="w-full max-w-xl bg-[#121212] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-5 my-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white font-brand">
                {editingPackage.id ? 'Edit Package' : 'Add Package'}
              </h3>
              <button onClick={() => setEditingPackage(null)} className="p-1 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Package Title</label>
                <input
                  type="text"
                  required
                  value={editingPackage.name || ''}
                  onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">Price in PKR</label>
                  <input
                    type="text"
                    value={editingPackage.pricePkr || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, pricePkr: e.target.value })}
                    placeholder="e.g. 380,000 or Request a Quote"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">Crew Size</label>
                  <input
                    type="text"
                    value={editingPackage.crewSize || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, crewSize: e.target.value })}
                    placeholder="e.g. 4 Cinematographers"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Tagline</label>
                <input
                  type="text"
                  value={editingPackage.tagline || ''}
                  onChange={(e) => setEditingPackage({ ...editingPackage, tagline: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPopularCheck"
                  checked={!!editingPackage.isPopular}
                  onChange={(e) => setEditingPackage({ ...editingPackage, isPopular: e.target.checked })}
                  className="rounded bg-neutral-900 border-neutral-700 text-[#c5a059] focus:ring-0"
                />
                <label htmlFor="isPopularCheck" className="text-xs text-neutral-300">
                  Highlight as "Most Popular Tier"
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingPackage(null)}
                  className="min-h-[40px] px-4 py-2 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] px-6 py-2 text-xs font-semibold text-black bg-[#c5a059] rounded-lg hover:bg-[#d4af37]"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT TESTIMONIAL ================= */}
      {editingTestimonial && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn"
          onClick={() => setEditingTestimonial(null)}
        >
          <div
            className="w-full max-w-lg bg-[#121212] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white font-brand">
                {editingTestimonial.id ? 'Edit Review' : 'Add Review'}
              </h3>
              <button onClick={() => setEditingTestimonial(null)} className="p-1 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Client / Brand Name</label>
                <input
                  type="text"
                  required
                  value={editingTestimonial.clientName || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, clientName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">City in Pakistan</label>
                  <input
                    type="text"
                    value={editingTestimonial.city || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, city: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-neutral-400">Role / Company</label>
                  <input
                    type="text"
                    value={editingTestimonial.roleOrBrand || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, roleOrBrand: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Feedback Review</label>
                <textarea
                  rows={3}
                  required
                  value={editingTestimonial.reviewText || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, reviewText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isVerifiedCheck"
                  checked={!!editingTestimonial.isVerifiedCustomer}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, isVerifiedCustomer: e.target.checked })}
                  className="rounded bg-neutral-900 border-neutral-700 text-[#c5a059] focus:ring-0"
                />
                <label htmlFor="isVerifiedCheck" className="text-xs text-neutral-300">
                  Mark as Verified Customer Feedback
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingTestimonial(null)}
                  className="min-h-[40px] px-4 py-2 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] px-6 py-2 text-xs font-semibold text-black bg-[#c5a059] rounded-lg hover:bg-[#d4af37]"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT FAQ ================= */}
      {editingFaq && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn"
          onClick={() => setEditingFaq(null)}
        >
          <div
            className="w-full max-w-lg bg-[#121212] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white font-brand">
                {editingFaq.id ? 'Edit FAQ' : 'Add FAQ'}
              </h3>
              <button onClick={() => setEditingFaq(null)} className="p-1 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Question</label>
                <input
                  type="text"
                  required
                  value={editingFaq.question || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-400">Answer</label>
                <textarea
                  rows={4}
                  required
                  value={editingFaq.answer || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingFaq(null)}
                  className="min-h-[40px] px-4 py-2 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[40px] px-6 py-2 text-xs font-semibold text-black bg-[#c5a059] rounded-lg hover:bg-[#d4af37]"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
