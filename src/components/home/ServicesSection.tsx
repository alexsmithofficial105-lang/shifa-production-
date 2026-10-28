import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { ServiceItem } from '../../types/index.ts';
import {
  Clapperboard,
  Film,
  Sparkles,
  Briefcase,
  Calendar,
  Package,
  Music,
  Share2,
  Tv,
  Sliders,
  Compass,
  Smartphone,
  ArrowRight,
  Layers,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Clapperboard,
  Film,
  Sparkles,
  Briefcase,
  Calendar,
  Package,
  Music,
  Share2,
  Tv,
  Sliders,
  Compass,
  Smartphone,
};

export const ServicesSection: React.FC = () => {
  const { services, setSelectedService, navigateTo } = useApp();

  return (
    <section className="py-16 sm:py-24 bg-[#080808] text-neutral-100 border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#c5a059]">
              Our Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-brand">
              Production Services Built for Impact
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              From commercial brand spots and royal Pakistani weddings to nationwide event broadcasts, our cinema packages combine technical excellence with bespoke storytelling.
            </p>
          </div>

          <button
            onClick={() => navigateTo('services')}
            className="self-start md:self-auto px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <span>Explore All Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 12 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv, index) => {
            const IconComponent = ICON_MAP[srv.iconName] || Layers;
            return (
              <div
                key={srv.id}
                onClick={() => setSelectedService(srv)}
                className="card-luxury p-7 rounded-2xl flex flex-col justify-between cursor-pointer group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 group-hover:border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] transition-colors">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-neutral-500 tabular-nums">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-[#c5a059] transition-colors font-brand">
                    {srv.title}
                  </h3>

                  <p className="text-sm text-neutral-400 leading-relaxed line-clamp-3">
                    {srv.shortDesc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-900 flex items-center justify-between text-xs">
                  {srv.startingPricePkr ? (
                    <span className="text-neutral-400">
                      From <strong className="text-neutral-200 font-semibold">PKR {srv.startingPricePkr}</strong>
                    </span>
                  ) : (
                    <span className="text-neutral-500">Custom Quote</span>
                  )}
                  <span className="text-[#c5a059] font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
