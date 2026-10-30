import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { X, MapPin, Calendar, Camera, Check, Film, ArrowRight } from 'lucide-react';
import { getCleanImageUrl } from '../../utils/imageUrl.ts';

export const ProjectDetailModal: React.FC = () => {
  const { selectedProject, setSelectedProject, navigateTo } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProject, setSelectedProject]);

  if (!selectedProject) return null;

  const handleInquire = () => {
    const category = selectedProject.category;
    setSelectedProject(null);
    navigateTo('quote', {
      preset: {
        service: category === 'Weddings' ? 'Wedding Films & Photography' : category === 'Commercials' ? 'Commercial & Brand Films' : 'Video Production',
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={() => setSelectedProject(null)}
    >
      <div
        className="relative w-full max-w-4xl bg-[#0e0e0e] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl my-8 text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setSelectedProject(null)}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-black/80 border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media view */}
        <div className="relative aspect-video w-full bg-black overflow-hidden">
          <img
            src={getCleanImageUrl(selectedProject.image)}
            alt={selectedProject.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-black/30 pointer-events-none" />

          {selectedProject.videoUrl && (
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-xs font-medium text-amber-300">
              <Film className="w-4 h-4 text-[#3b82f6]" />
              <span>Cinematic Reel Available</span>
            </div>
          )}
        </div>

        {/* Content details */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 font-medium">
              <span className="text-[#3b82f6] uppercase tracking-wider">{selectedProject.category}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                {selectedProject.location}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                {selectedProject.year}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-brand">
              {selectedProject.title}
            </h2>
            {selectedProject.client && (
              <p className="text-sm text-neutral-400">
                Client / Commissioned by: <span className="text-neutral-200 font-medium">{selectedProject.client}</span>
              </p>
            )}
          </div>

          <p className="text-neutral-300 text-base leading-relaxed">
            {selectedProject.description}
          </p>

          {/* Technical gear & deliverables grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
            {selectedProject.gearUsed && (
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                  <Camera className="w-4 h-4" />
                  <span>Cinema Gear Deployed</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {selectedProject.gearUsed}
                </p>
              </div>
            )}

            {selectedProject.deliverables && selectedProject.deliverables.length > 0 && (
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Deliverables Produced
                </div>
                <ul className="space-y-1">
                  {selectedProject.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-neutral-300">
                      <Check className="w-3.5 h-3.5 text-[#3b82f6] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800">
            <div className="text-xs text-neutral-500 text-center sm:text-left">
              Interested in similar cinematic production caliber for your brand or wedding?
            </div>
            <button
              onClick={handleInquire}
              className="w-full sm:w-auto px-6 py-3 text-xs uppercase tracking-wider font-semibold text-white bg-[#2563eb] rounded-lg hover:bg-[#1d4ed8] transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <span>Inquire About Similar Production</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
