import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { PortfolioItem } from '../../types/index.ts';
import { Play, MapPin, ArrowRight, Camera } from 'lucide-react';

const CATEGORIES = ['All', 'Weddings', 'Commercials', 'Events', 'Products', 'Cinematic Films'] as const;

export const PortfolioSection: React.FC = () => {
  const { portfolio, setSelectedProject, navigateTo } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredProjects = portfolio.filter((p) => {
    if (activeCategory === 'All') return true;
    return p.category === activeCategory;
  });

  return (
    <section className="py-16 sm:py-24 bg-[#0a0a0a] text-neutral-100 border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#c5a059]">
              Selected Works
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-brand">
              Cinematic Portfolio
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Explore our recent commercial brand campaigns, royal wedding films, and aerial documentaries filmed across Pakistan.
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-900/90 border border-neutral-800 rounded-xl">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeCategory === cat
                    ? 'bg-[#c5a059] text-black font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => {
            const isMarquee = idx === 0 && activeCategory === 'All';
            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 cursor-pointer transition-all duration-300 hover:border-[#c5a059]/50 hover:shadow-2xl ${
                  isMarquee ? 'lg:col-span-2 lg:aspect-16/9' : 'aspect-4/3'
                }`}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />

                {/* Measured contrast scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 transition-opacity duration-300" />

                {/* Video play hint badge */}
                {project.videoUrl && (
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#c5a059] group-hover:text-black group-hover:border-transparent transition-all">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                )}

                {/* Overlay content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                  <div className="flex items-center gap-2 text-[11px] text-[#c5a059] font-medium uppercase tracking-wider mb-1.5">
                    <span>{project.category}</span>
                    <span aria-hidden="true" className="text-neutral-500">·</span>
                    <span className="text-neutral-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-neutral-500" />
                      {project.location}
                    </span>
                    <span aria-hidden="true" className="text-neutral-500">·</span>
                    <span className="text-neutral-400">{project.year}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#c5a059] transition-colors font-brand leading-snug">
                    {project.title}
                  </h3>

                  {project.client && (
                    <div className="text-xs text-neutral-400 mt-1 line-clamp-1">
                      Client: <span className="text-neutral-200">{project.client}</span>
                    </div>
                  )}

                  {/* Gear tag */}
                  {project.gearUsed && (
                    <div className="mt-2 text-[11px] text-neutral-400 flex items-center gap-1 line-clamp-1">
                      <Camera className="w-3 h-3 text-[#c5a059] shrink-0" />
                      <span>{project.gearUsed}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigateTo('portfolio')}
            className="px-8 py-3.5 text-xs uppercase tracking-wider font-semibold text-white bg-neutral-900 border border-neutral-700 rounded-lg hover:border-[#c5a059] hover:text-[#c5a059] transition-all inline-flex items-center gap-2"
          >
            <span>View Full Portfolio & Case Studies</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
