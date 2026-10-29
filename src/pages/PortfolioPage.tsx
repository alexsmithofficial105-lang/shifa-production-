import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { PortfolioItem } from '../types/index.ts';
import { Play, MapPin, Search, Camera, Filter } from 'lucide-react';
import { getCleanImageUrl } from '../utils/imageUrl.ts';

const CATEGORIES = ['All', 'Weddings', 'Commercials', 'Events', 'Products', 'Cinematic Films'] as const;

export const PortfolioPage: React.FC = () => {
  const { portfolio, setSelectedProject } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const filtered = portfolio.filter((p) => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(q) ||
      p.client.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="py-12 sm:py-24 bg-[#080808] text-neutral-100 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-800">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#c5a059]">
              Visual Showcase
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-brand">
              Featured Portfolio
            </h1>
            <p className="text-neutral-400 text-sm leading-relaxed">
              A curated catalog of commercial films, regal Pakistani weddings, brand campaigns, and aerial expeditions produced by Shifa Productions.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#c5a059]"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-medium rounded-xl transition-all whitespace-nowrap shrink-0 ${
                activeCategory === cat
                  ? 'bg-[#c5a059] text-black font-semibold shadow-md'
                  : 'bg-neutral-900/80 text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 cursor-pointer transition-all duration-300 hover:border-[#c5a059]/50 hover:shadow-2xl aspect-4/3 flex flex-col justify-end"
            >
              <img
                src={getCleanImageUrl(project.image)}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />

              {/* Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10" />

              {/* Video icon */}
              {project.videoUrl && (
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#c5a059] group-hover:text-black group-hover:border-transparent transition-all">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
              )}

              {/* Information */}
              <div className="relative z-10 p-6 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-[#c5a059] font-medium uppercase tracking-wider">
                  <span>{project.category}</span>
                  <span aria-hidden="true" className="text-neutral-500">·</span>
                  <span className="text-neutral-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-neutral-500" />
                    {project.location}
                  </span>
                  <span aria-hidden="true" className="text-neutral-500">·</span>
                  <span className="text-neutral-400">{project.year}</span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-[#c5a059] transition-colors font-brand leading-snug">
                  {project.title}
                </h3>

                {project.client && (
                  <p className="text-xs text-neutral-400">
                    Client: <span className="text-neutral-200">{project.client}</span>
                  </p>
                )}

                {project.gearUsed && (
                  <div className="pt-1 text-[11px] text-neutral-400 flex items-center gap-1 line-clamp-1">
                    <Camera className="w-3 h-3 text-[#c5a059] shrink-0" />
                    <span>{project.gearUsed}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-neutral-400 text-sm">
            No projects found matching current criteria.
          </div>
        )}
      </div>
    </div>
  );
};
