import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Camera, MapPin, Film, Sparkles, Award, ShieldCheck, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings, navigateTo } = useApp();

  const brandName = settings?.brandName || 'Shifa Productions';
  const about = settings?.about;

  return (
    <div className="py-12 sm:py-24 bg-[#080808] text-neutral-100 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-24">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#c5a059]">
            About Our Production House
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-brand">
            {about?.title || 'Cinematic Storytelling Born in Pakistan'}
          </h1>
          <p className="text-lg text-neutral-300 leading-relaxed">
            {about?.story ||
              'We are a collective of cinematographers, directors, lighting artisans, and editors united by one mission: elevating Pakistani storytelling to international theatrical standards.'}
          </p>
        </div>

        {/* Hero Visual Banner */}
        <div className="relative aspect-21/9 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-900">
          <img
            src="/images/hero_cinematic_production_1793180767552.jpg"
            alt="Shifa Productions Film Production Studio"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-neutral-300">
            <span className="font-brand text-sm text-white font-semibold">
              Shifa Productions On-Set Cinema Rig — Lahore Studio
            </span>
            <span>Operating RED & ARRI Cinema Systems</span>
          </div>
        </div>

        {/* Editorial Vision & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#c5a059]">
              The Cinematic Philosophy
            </div>
            <h2 className="text-3xl font-bold text-white font-brand leading-snug">
              Every Frame Tells a Story of Cultural Grandeur & Emotional Truth
            </h2>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              {about?.cinematicVision ||
                'Pakistan is filled with extraordinary texture, architectural heritage, and passionate life stories. From the heritage courtyards of old Lahore to the modern corporate towers of Karachi and the scenic backdrops of Islamabad and the northern valleys, our cinema packages capture moments that endure.'}
            </p>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              We reject the sterile, formulaic wedding and commercial video templates that dominate the market. Instead, we develop bespoke lighting designs, deliberate camera movements, and nuanced audio landscapes tailored to each commission.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#111111] border border-neutral-800 space-y-2">
              <div className="text-3xl font-bold text-white tabular-nums font-brand">
                {about?.completedProjects || '450+'}
              </div>
              <div className="text-xs text-neutral-400">
                Completed productions delivered across Pakistan.
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#111111] border border-neutral-800 space-y-2">
              <div className="text-3xl font-bold text-[#c5a059] tabular-nums font-brand">
                {about?.experienceYears || '10+'}
              </div>
              <div className="text-xs text-neutral-400">
                Years of continuous directorial and cinematography experience.
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#111111] border border-neutral-800 space-y-2">
              <div className="text-3xl font-bold text-white tabular-nums font-brand">
                {about?.filmmakersCount || '18'}
              </div>
              <div className="text-xs text-neutral-400">
                In-house cinematographers, gaffers, drone pilots, and editors.
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#111111] border border-neutral-800 space-y-2">
              <div className="text-3xl font-bold text-white tabular-nums font-brand">
                100%
              </div>
              <div className="text-xs text-neutral-400">
                Broadcast compliant delivery with DaVinci color grading.
              </div>
            </div>
          </div>
        </div>

        {/* Equipment & Cinema Technology Vault */}
        <div className="p-8 sm:p-12 rounded-2xl bg-[#0e0e0e] border border-neutral-800 space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#c5a059]">
              Technology & Infrastructure
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-brand">
              Our Professional Cinema Vault
            </h3>
            <p className="text-neutral-400 text-sm">
              We own and deploy tier-one cinema ecosystems without relying on third-party equipment compromises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <Camera className="w-6 h-6 text-[#c5a059]" />
              <h4 className="text-base font-bold text-white font-brand">Camera Systems</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                ARRI Alexa Mini LF, RED V-Raptor 8K, Sony FX6 & FX3 Cinema Line rigs with 16-bit RAW internal recording.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <Sparkles className="w-6 h-6 text-[#c5a059]" />
              <h4 className="text-base font-bold text-white font-brand">Anamorphic & Prime Glass</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Cooke Anamorphic/i, ARRI Master Anamorphics, Zeiss Supreme Primes, and Sony G-Master cinema lenses.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <Film className="w-6 h-6 text-[#c5a059]" />
              <h4 className="text-base font-bold text-white font-brand">Aerial & Stabilization</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                DJI Inspire 3 8K Cinema Drone, DJI Ronin 2 3-axis stabilization, Ready Rig support, and motorized sliders.
              </p>
            </div>
          </div>
        </div>

        {/* Studio Locations */}
        <div className="space-y-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#c5a059]">
            Physical Presence
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white font-brand">
            Our Studio Footprint in Pakistan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-2xl bg-[#111111] border border-neutral-800 space-y-4">
              <div className="flex items-center gap-2 text-[#c5a059] text-xs font-semibold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Lahore Headquarters</span>
              </div>
              <h4 className="text-xl font-bold text-white font-brand">Gulberg III Studio</h4>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {settings?.addressLahore || 'Executive Studio 4B, M.M. Alam Road, Gulberg III, Lahore, Pakistan'}
              </p>
              <div className="text-xs text-neutral-400 pt-2 border-t border-neutral-800">
                Equipped with green screen studio, editing suites, and cinema gear vault.
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-[#111111] border border-neutral-800 space-y-4">
              <div className="flex items-center gap-2 text-[#c5a059] text-xs font-semibold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Islamabad Branch</span>
              </div>
              <h4 className="text-xl font-bold text-white font-brand">F-7 Markaz Studio</h4>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {settings?.addressIslamabad || 'Creative Suite 12, Executive Heights, F-7 Markaz, Islamabad, Pakistan'}
              </p>
              <div className="text-xs text-neutral-400 pt-2 border-t border-neutral-800">
                Specialized in corporate summits, embassies, and northern Pakistan production logistics.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="pt-8 text-center space-y-4">
          <h3 className="text-2xl font-bold text-white font-brand">
            Ready to Begin Your Production?
          </h3>
          <p className="text-neutral-400 text-sm max-w-lg mx-auto">
            Contact our production team today to check availability for your event date or commercial shoot.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('quote')}
              className="px-8 py-3.5 text-xs uppercase tracking-wider font-semibold text-black bg-[#c5a059] rounded-lg hover:bg-[#d4af37] transition-all inline-flex items-center gap-2"
            >
              <span>Request a Production Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
