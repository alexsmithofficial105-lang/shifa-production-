import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ServiceItem } from '../types/index.ts';
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
  Check,
  Tag,
  Clock,
  ArrowRight,
  Layers,
  Search,
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

export const ServicesPage: React.FC = () => {
  const { services, setSelectedService, navigateTo } = useApp();
  const [search, setSearch] = useState('');

  const filtered = services.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return s.title.toLowerCase().includes(q) || s.shortDesc.toLowerCase().includes(q);
  });

  const handleBook = (srv: ServiceItem) => {
    navigateTo('quote', { preset: { service: srv.title } });
  };

  return (
    <div className="py-12 sm:py-24 bg-[#080808] text-neutral-100 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-800">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#c5a059]">
              Full Scope Production
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-brand">
              Our Production Services
            </h1>
            <p className="text-neutral-400 text-sm leading-relaxed">
              We provide full-spectrum cinematography and post-production solutions across Pakistan. Every service is delivered with cinema-standard equipment and seasoned crews.
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#c5a059]"
            />
          </div>
        </div>

        {/* 12 Services Full Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((srv, index) => {
            const Icon = ICON_MAP[srv.iconName] || Layers;
            return (
              <div
                key={srv.id}
                className="card-luxury p-7 rounded-2xl flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 group-hover:border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-neutral-500 tabular-nums">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white group-hover:text-[#c5a059] transition-colors font-brand">
                    {srv.title}
                  </h2>

                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {srv.shortDesc}
                  </p>

                  {/* Highlights */}
                  {srv.features && srv.features.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      {srv.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                          <Check className="w-3.5 h-3.5 text-[#c5a059] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-neutral-900 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    {srv.startingPricePkr && (
                      <div className="flex items-center gap-1.5 text-neutral-300">
                        <Tag className="w-3.5 h-3.5 text-[#c5a059]" />
                        <span>
                          From <strong className="text-white">PKR {srv.startingPricePkr}</strong>
                        </span>
                      </div>
                    )}
                    {srv.turnaroundTime && (
                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <Clock className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{srv.turnaroundTime}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedService(srv)}
                      className="w-full py-2.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleBook(srv)}
                      className="w-full py-2.5 text-xs uppercase tracking-wider font-semibold text-black bg-[#c5a059] rounded-lg hover:bg-[#d4af37] transition-all flex items-center justify-center gap-1"
                    >
                      <span>Book Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-neutral-400 text-sm">
            No services matching "{search}". Try another search term.
          </div>
        )}
      </div>
    </div>
  );
};
