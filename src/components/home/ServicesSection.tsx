import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { ServiceItem } from '../../types/index.ts';
import { getCleanImageUrl } from '../../utils/imageUrl.ts';
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
    <section className="py-16 sm:py-24 bg-[#060913] text-neutral-100 border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#3b82f6]">
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

        {/* 12 Services Grid with Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv, index) => {
            const IconComponent = ICON_MAP[srv.iconName] || Layers;
            const serviceImage = getCleanImageUrl(srv.image || '/images/hero_cinematic_production_1793180767552.jpg');

            return (
              <div
                key={srv.id}
                onClick={() => setSelectedService(srv)}
                className="card-luxury rounded-2xl flex flex-col justify-between overflow-hidden cursor-pointer group"
              >
                {/* Visual Header Image Banner */}
                <div className="relative aspect-16/9 w-full overflow-hidden bg-neutral-900">
                  <img
                    src={serviceImage}
                    alt={srv.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-black/40 to-transparent" />

                  {/* Icon badge overlay */}
                  <div className="absolute top-3.5 left-3.5 w-10 h-10 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 flex items-center justify-center text-[#3b82f6] shadow-lg group-hover:border-[#2563eb]/60 transition-colors">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Number pill */}
                  <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-mono text-neutral-300">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-[#3b82f6] transition-colors font-brand leading-snug">
                      {srv.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed line-clamp-3">
                      {srv.shortDesc}
                    </p>
                  </div>

                  <div className="pt-4 mt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                    {srv.startingPricePkr ? (
                      <span className="text-neutral-400">
                        From <strong className="text-neutral-200 font-semibold">PKR {srv.startingPricePkr}</strong>
                      </span>
                    ) : (
                      <span className="text-neutral-500">Custom Quote</span>
                    )}
                    <span className="text-[#3b82f6] font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
