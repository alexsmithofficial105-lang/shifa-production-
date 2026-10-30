import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { PackageItem } from '../types/index.ts';
import { Check, Plus, Clock, Users, ArrowRight, Sparkles } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { packages, navigateTo } = useApp();

  const handleBookPackage = (pkg: PackageItem) => {
    navigateTo('quote', { preset: { package: pkg.name } });
  };

  return (
    <div className="py-12 sm:py-24 bg-[#060913] text-neutral-100 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#3b82f6]">
            Transparent Investment
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-brand">
            Production Packages & Pricing
          </h1>
          <p className="text-neutral-400 text-base leading-relaxed">
            All prices are quoted in Pakistani Rupees (PKR). Packages are fully customizable to your specific shoot requirements, crew size, and travel locations across Pakistan.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {packages.map((pkg) => {
            const isHighlight = pkg.isPopular;
            return (
              <div
                key={pkg.id}
                className={`relative rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 ${
                  isHighlight
                    ? 'bg-[#0f172a] border-2 border-[#2563eb] shadow-2xl shadow-[#2563eb]/10'
                    : 'bg-[#0e0e0e] border border-neutral-800/90 hover:border-neutral-700'
                }`}
              >
                {/* Popular indicator */}
                {isHighlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#2563eb] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Most Requested Tier</span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Title & Tagline */}
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-white font-brand">
                      {pkg.name}
                    </h2>
                    <p className="text-xs text-neutral-400 leading-relaxed min-h-[3rem]">
                      {pkg.tagline}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="pt-2 border-t border-neutral-800">
                    {pkg.isCustomQuote || pkg.pricePkr === 'Request a Quote' ? (
                      <div className="text-2xl font-bold text-white font-brand">
                        Custom Quote
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="text-xs uppercase tracking-wider text-neutral-400">
                          Starting at
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-white font-brand tabular-nums">
                          PKR {pkg.pricePkr}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Duration & Crew */}
                  <div className="space-y-2 pt-2 text-xs text-neutral-300">
                    {pkg.duration && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#3b82f6] shrink-0" />
                        <span>{pkg.duration}</span>
                      </div>
                    )}
                    {pkg.crewSize && (
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-[#3b82f6] shrink-0" />
                        <span>{pkg.crewSize}</span>
                      </div>
                    )}
                  </div>

                  {/* Inclusions */}
                  <div className="space-y-2 pt-2 border-t border-neutral-800">
                    <div className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      Included Services
                    </div>
                    <ul className="space-y-2">
                      {pkg.includedServices.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                          <Check className="w-3.5 h-3.5 text-[#3b82f6] shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Deliverables */}
                  {pkg.deliverables && pkg.deliverables.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-neutral-800">
                      <div className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                        Deliverables
                      </div>
                      <ul className="space-y-1.5">
                        {pkg.deliverables.map((deliv, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-neutral-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] shrink-0" />
                            <span>{deliv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Optional Add-ons */}
                  {pkg.optionalAddons && pkg.optionalAddons.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-neutral-800">
                      <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        Available Add-Ons
                      </div>
                      <ul className="space-y-1">
                        {pkg.optionalAddons.map((addon, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                            <Plus className="w-3 h-3 text-[#3b82f6] shrink-0" />
                            <span>{addon}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Book Action */}
                <div className="pt-8 mt-6 border-t border-neutral-800">
                  <button
                    onClick={() => handleBookPackage(pkg)}
                    className={`w-full py-3 text-xs uppercase tracking-wider font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                      isHighlight
                        ? 'bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-lg shadow-[#2563eb]/15'
                        : 'bg-neutral-900 text-white border border-neutral-700 hover:border-[#2563eb] hover:text-[#3b82f6]'
                    }`}
                  >
                    <span>Book {pkg.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing notice & payment schedule */}
        <div className="p-8 rounded-2xl bg-[#0f0f0f] border border-neutral-800 space-y-4 text-xs text-neutral-400 leading-relaxed max-w-4xl mx-auto">
          <h3 className="text-sm font-bold text-white font-brand uppercase tracking-wider">
            Booking & Payment Terms in Pakistan
          </h3>
          <p>
            • Date Reservation: Production dates are secured with a 50% advance deposit via official banking channels.
          </p>
          <p>
            • Nationwide Travel: Productions outside Lahore and Islamabad require transparent logistics, hotel lodging, and transit itemization.
          </p>
          <p>
            • Post-Production Revisions: All packages include two to three rounds of editorial cuts prior to final theatrical master export.
          </p>
        </div>
      </div>
    </div>
  );
};
