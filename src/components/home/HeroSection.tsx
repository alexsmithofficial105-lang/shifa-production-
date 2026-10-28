import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { ArrowRight } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { navigateTo, settings } = useApp();

  const heroHeading = settings?.hero.heading || 'Turning Your Vision Into Reality.';
  const heroSubheading =
    settings?.hero.subheading ||
    'Creative storytelling. Professional production. Powerful visual experiences tailored for Pakistan’s leading brands, regal weddings, and ambitious visionaries.';
  const bgImage = settings?.hero.bgImage || '/src/assets/images/hero_cinematic_production_1793180767552.jpg';

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
          <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs uppercase tracking-widest text-[#c5a059] font-semibold">
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
          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigateTo('portfolio')}
              className="min-h-[48px] px-7 py-3.5 text-xs uppercase tracking-wider font-semibold text-black bg-[#c5a059] rounded-xl hover:bg-[#d4af37] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#c5a059]/15"
            >
              <span>Explore Our Work</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateTo('quote')}
              className="min-h-[48px] px-7 py-3.5 text-xs uppercase tracking-wider font-semibold text-white bg-black/70 hover:bg-neutral-900 border border-neutral-700/80 rounded-xl hover:border-neutral-500 transition-all flex items-center justify-center gap-2 backdrop-blur-md"
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
              <div className="text-lg sm:text-2xl font-bold text-[#c5a059] font-brand">
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
