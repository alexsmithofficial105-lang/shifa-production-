import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Phone, Mail, MessageSquare, Instagram, Facebook, Linkedin, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, settings, isCloudActive, lastUpdatedTime } = useApp();

  const brandName = settings?.brandName || 'Shifa Productions';
  const phone = settings?.phone || '+92 300 8492026';
  const whatsapp = settings?.whatsapp || '+92 300 8492026';
  const email = settings?.email || 'contact@shifaproductions.pk';

  const cleanWaNumber = whatsapp.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-[#050505] border-t border-neutral-800/80 text-neutral-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-900">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              {settings?.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={brandName}
                  className="h-10 w-auto object-contain max-w-[200px]"
                />
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FBBF24] via-[#EAB308] to-[#CA8A04] flex items-center justify-center font-bold text-black font-brand text-base shadow-sm">
                    S
                  </div>
                  <span className="font-brand text-xl font-bold tracking-wider text-neutral-100">
                    {brandName}
                  </span>
                </div>
              )}
            </button>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              Pakistan’s premier cinema production agency. We craft high-end commercial films, regal wedding cinematography, corporate documentaries, and aerial drone experiences across Pakistan.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings?.socials?.instagram || 'https://instagram.com'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-pink-400 hover:border-pink-500/40 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings?.socials?.facebook || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={settings?.socials?.linkedin || 'https://linkedin.com'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-sky-400 hover:border-sky-500/40 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${cleanWaNumber}?text=Hi%20Shifa%20Productions,%20I%20would%20like%20to%20discuss%20a%20production%20project.`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              Agency
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('team')} className="hover:text-white transition-colors">
                  Our Team (ہماری ٹیم)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors">
                  Our Services
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('portfolio')} className="hover:text-white transition-colors">
                  Featured Portfolio
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('pricing')} className="hover:text-white transition-colors">
                  Pricing & Packages
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('faq')} className="hover:text-white transition-colors">
                  FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              Key Capabilities
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors">
                  Commercial Brand Films
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors">
                  Regal Wedding Cinema
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors">
                  Corporate Video & Events
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors">
                  5.1K Drone Videography
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('services')} className="hover:text-white transition-colors">
                  DaVinci Color Grading
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details without physical locations */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              Direct Inquiries
            </h4>
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-[#EAB308] shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-white transition-colors">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${cleanWaNumber}?text=Hi%20Shifa%20Productions,%20I%20would%20like%20to%20discuss%20a%20production%20project.`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-300 transition-colors"
                >
                  WhatsApp: {whatsapp}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-[#EAB308] shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors break-all">
                  {email}
                </a>
              </div>
              <p className="text-[11px] text-neutral-500 pt-1 border-t border-neutral-900 leading-normal">
                Available nationwide across Pakistan for commercial brand cinema, royal weddings, and corporate events.
              </p>
            </div>
          </div>
        </div>

        {/* Cloud Sync Debug Info */}
        <div className="pt-6 pb-2 border-t border-neutral-900 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                isCloudActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span className="text-neutral-400">
              Data source:{' '}
              <strong className={isCloudActive ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                {isCloudActive ? 'Firestore' : 'Disconnected (Firebase connected nahi hai)'}
              </strong>
            </span>
          </div>
          <div className="text-neutral-500">
            Last updated:{' '}
            <span className="text-neutral-300 font-mono">
              {lastUpdatedTime || (isCloudActive ? 'Connected (Live onSnapshot)' : 'Not Connected')}
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} {brandName}. All rights reserved. Registered Production Studio in Pakistan.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigateTo('privacy')} className="hover:text-neutral-300 transition-colors">
              Privacy Policy
            </button>
            <span aria-hidden="true">·</span>
            <button onClick={() => navigateTo('terms')} className="hover:text-neutral-300 transition-colors">
              Terms & Conditions
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => navigateTo('admin-login')}
              className="flex items-center gap-1.5 text-neutral-500 hover:text-[#EAB308] transition-colors"
              title="Admin Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Access</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
