import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { ArrowRight } from 'lucide-react';
import { getCleanImageUrl } from '../../utils/imageUrl.ts';

export const HeroSection: React.FC = () => {
  const { navigateTo, settings } = useApp();

  const heroHeading = settings?.hero.heading || 'Turning Your Vision Into Reality.';
  const heroSubheading =
    settings?.hero.subheading ||
    'Creative storytelling. Professional production. Powerful visual experiences tailored for Pakistan’s leading brands, regal weddings, and ambitious visionaries.';
  const bgImage = getCleanImageUrl(settings?.hero.bgImage || '/images/hero_cinematic_production_1793180767552.jpg');

  const whatsapp = settings?.whatsapp || '+92 300 8492026';
  const cleanWaNumber = whatsapp.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(
    'Hello Shifa Productions, I would like to inquire about your video production & cinematography services.'
  )}`;

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-between overflow-hidden bg-black text-white">
      {/* Background cinematic visual with measured contrast scrim */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={bgImage}
          alt="Shifa Productions Film Set"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/35" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/80" />
      </div>

      {/* Main hero content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-12 sm:pb-16 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl space-y-5 sm:space-y-6">
          {/* Subtle unboxed metadata kicker */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs uppercase tracking-widest text-[#3b82f6] font-semibold">
            <span>Cinema & Film Production</span>
            <span aria-hidden="true">·</span>
            <span>Lahore & Islamabad</span>
            <span aria-hidden="true">·</span>
            <span>Nationwide Coverage</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] font-brand max-w-2xl">
            {heroHeading}
          </h1>

          <p className="text-sm sm:text-lg text-neutral-300 leading-relaxed max-w-2xl font-normal">
            {heroSubheading}
          </p>

          {/* Action CTAs */}
          <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
            {/* WhatsApp Icon directly on the left of Explore Our Work */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-105 transition-all shrink-0 group border border-white/20"
              title="Chat on WhatsApp (+92 300 8492026)"
              aria-label="WhatsApp"
            >
              <svg className="w-6 h-6 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.085-2.02-.486-1.554-.64-2.531-2.227-2.607-2.329-.077-.102-.622-.828-.622-1.579 0-.751.393-1.121.533-1.274.14-.153.307-.192.41-.192.103 0 .205.002.296.006.096.005.224-.036.35.267.129.31.439 1.07.477 1.147.039.077.065.166.013.268-.052.102-.078.166-.154.256-.076.09-.16.2-.23.268-.078.077-.16.16-.068.318.092.158.408.673.876 1.09.602.537 1.109.703 1.267.781.158.078.251.069.345-.04.094-.108.405-.472.513-.633.108-.162.217-.135.365-.081.149.054.945.446 1.107.527.162.081.27.122.31.19.04.068.04.394-.104.799z"/>
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.176L2 22l4.954-1.396A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.062c-1.63 0-3.14-.493-4.412-1.34l-.316-.21-2.946.831.815-2.825-.231-.341C3.978 14.834 3.438 13.46 3.438 12c0-4.721 3.841-8.562 8.562-8.562 4.722 0 8.562 3.841 8.562 8.562 0 4.722-3.84 8.562-8.562 8.562z"/>
              </svg>
            </a>

            <button
              onClick={() => navigateTo('portfolio')}
              className="min-h-[48px] px-6 sm:px-7 py-3.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#2563eb] rounded-xl hover:bg-[#1d4ed8] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#2563eb]/15"
            >
              <span>Explore Our Work</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateTo('quote')}
              className="min-h-[48px] px-6 sm:px-7 py-3.5 text-xs uppercase tracking-wider font-semibold text-white bg-black/70 hover:bg-neutral-900 border border-neutral-700/80 rounded-xl hover:border-neutral-500 transition-all flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <span>Get a Quote</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full-width 4-column trust strip placed below hero split */}
      <div className="relative z-10 border-t border-neutral-800/80 bg-black/80 backdrop-blur-md py-5 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-neutral-300">
            <div className="space-y-0.5 sm:space-y-1">
              <div className="text-lg sm:text-2xl font-bold text-white tabular-nums font-brand">
                450+
              </div>
              <div className="text-[11px] sm:text-xs text-neutral-400">
                Completed Films & Projects
              </div>
            </div>

            <div className="space-y-0.5 sm:space-y-1">
              <div className="text-lg sm:text-2xl font-bold text-white tabular-nums font-brand">
                10+ Years
              </div>
              <div className="text-[11px] sm:text-xs text-neutral-400">
                Of Dedicated Film Craft
              </div>
            </div>

            <div className="space-y-0.5 sm:space-y-1">
              <div className="text-lg sm:text-2xl font-bold text-white font-brand">
                Lahore & Islamabad
              </div>
              <div className="text-[11px] sm:text-xs text-neutral-400">
                Two Active Studio Hubs
              </div>
            </div>

            <div className="space-y-0.5 sm:space-y-1">
              <div className="text-lg sm:text-2xl font-bold text-[#3b82f6] font-brand">
                4K & 8K Cinema
              </div>
              <div className="text-[11px] sm:text-xs text-neutral-400">
                ARRI, RED & Inspire 3 Rigs
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
