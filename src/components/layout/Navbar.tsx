import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { Menu, X, ArrowRight, Lock, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentRoute, navigateTo, settings } = useApp();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const brandName = settings?.brandName || 'Shifa Productions';

  const navLinks = [
    { label: 'Home', route: 'home' as const },
    { label: 'About Us', route: 'about' as const },
    { label: 'Services', route: 'services' as const },
    { label: 'Portfolio', route: 'portfolio' as const },
    { label: 'Pricing', route: 'pricing' as const },
    { label: 'Contact Us', route: 'contact' as const },
  ];

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (route: typeof navLinks[number]['route'] | 'quote' | 'admin-login' | 'admin-dashboard') => {
    navigateTo(route);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-nav transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4 md:gap-8">
          {/* Left: Brand Logo / Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 text-left group whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059] rounded-lg p-1"
            aria-label="Shifa Productions Home"
          >
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={brandName}
                className="h-9 sm:h-10 w-auto object-contain max-w-[180px]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#c5a059] flex items-center justify-center font-bold text-black font-brand text-base shadow-sm shrink-0">
                  S
                </div>
                <span className="font-brand text-base sm:text-xl font-bold tracking-wider text-neutral-100 group-hover:text-[#c5a059] transition-colors">
                  {brandName}
                </span>
              </div>
            )}
          </button>

          {/* Desktop Center: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-300">
            {navLinks.slice(1).map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => handleNavClick(link.route)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 hover:text-white ${
                    isActive ? 'text-[#c5a059] font-semibold' : 'text-neutral-400'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c5a059] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right: Admin Access + Request Quote CTA */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick(isAuthenticated ? 'admin-dashboard' : 'admin-login')}
              className="px-3 py-2 text-xs font-semibold text-neutral-400 hover:text-[#c5a059] bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              title="Admin Portal"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            <button
              onClick={() => handleNavClick('quote')}
              className="px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-black bg-[#c5a059] rounded-lg hover:bg-[#d4af37] active:scale-95 transition-all whitespace-nowrap shrink-0 shadow-lg shadow-[#c5a059]/10"
            >
              Request Quote
            </button>
          </div>

          {/* Mobile Right: Hamburger button with clean 3 horizontal lines */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('quote')}
              className="px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold text-black bg-[#c5a059] rounded-md hover:bg-[#d4af37] whitespace-nowrap shrink-0"
            >
              Quote
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-w-[44px] min-h-[44px] p-2.5 text-neutral-200 hover:text-white flex items-center justify-center rounded-lg bg-neutral-900/80 border border-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#c5a059]"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-neutral-200" />
              ) : (
                <div className="w-6 h-5 flex flex-col justify-between py-0.5">
                  <span className="w-full h-0.5 bg-neutral-200 rounded-full" />
                  <span className="w-full h-0.5 bg-neutral-200 rounded-full" />
                  <span className="w-full h-0.5 bg-neutral-200 rounded-full" />
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer / Modal */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed top-0 right-0 bottom-0 w-[82%] max-w-sm bg-[#0e0e0e] border-l border-neutral-800 p-6 flex flex-col justify-between shadow-2xl z-50 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-6 border-b border-neutral-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#c5a059] flex items-center justify-center font-bold text-black font-brand text-sm shadow-sm">
                  S
                </div>
                <span className="font-brand text-base font-bold text-white tracking-wider">
                  {brandName}
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="min-w-[40px] min-h-[40px] rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links list */}
            <nav className="flex flex-col py-6 space-y-2">
              {navLinks.map((link) => {
                const isActive = currentRoute === link.route;
                return (
                  <button
                    key={link.route}
                    onClick={() => handleNavClick(link.route)}
                    className={`min-h-[46px] px-4 rounded-xl text-left text-base font-medium tracking-tight transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-[#c5a059]/10 text-[#c5a059] font-bold border border-[#c5a059]/30'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-900/60'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </button>
                );
              })}
            </nav>

            {/* Bottom Actions: Quote CTA and Admin Access */}
            <div className="pt-6 border-t border-neutral-800/80 flex flex-col gap-3">
              <button
                onClick={() => handleNavClick('quote')}
                className="w-full min-h-[46px] py-3 text-center text-xs uppercase tracking-wider font-semibold text-black bg-[#c5a059] rounded-xl hover:bg-[#d4af37] transition-all shadow-lg shadow-[#c5a059]/15 flex items-center justify-center gap-2"
              >
                <span>Request a Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleNavClick(isAuthenticated ? 'admin-dashboard' : 'admin-login')}
                className="w-full min-h-[44px] py-2.5 text-center text-xs font-medium text-neutral-400 hover:text-white bg-neutral-900/80 border border-neutral-800 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>{isAuthenticated ? 'Admin Dashboard' : 'Admin Portal Login'}</span>
              </button>

              <div className="text-center text-[11px] text-neutral-500 pt-1">
                Lahore & Islamabad · Serving All Pakistan
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
