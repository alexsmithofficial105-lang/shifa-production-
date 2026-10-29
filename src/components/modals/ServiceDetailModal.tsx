import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { X, Check, Clock, Tag, ArrowRight } from 'lucide-react';
import { getCleanImageUrl } from '../../utils/imageUrl.ts';

export const ServiceDetailModal: React.FC = () => {
  const { selectedService, setSelectedService, navigateTo } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedService(null);
    };
    if (selectedService) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedService, setSelectedService]);

  if (!selectedService) return null;

  const handleBookService = () => {
    const serviceTitle = selectedService.title;
    setSelectedService(null);
    navigateTo('quote', {
      preset: { service: serviceTitle },
    });
  };

  const serviceImage = getCleanImageUrl(selectedService.image || '/images/hero_cinematic_production_1793180767552.jpg');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={() => setSelectedService(null)}
    >
      <div
        className="relative w-full max-w-2xl bg-[#111111] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl my-8 text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Visual Header Banner */}
        <div className="relative aspect-21/9 sm:aspect-16/7 w-full overflow-hidden bg-neutral-950">
          <img
            src={serviceImage}
            alt={selectedService.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-black/40 to-transparent" />

          {/* Close button positioned top right */}
          <button
            onClick={() => setSelectedService(null)}
            className="absolute top-4 right-4 w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-neutral-300 hover:text-white transition-colors flex items-center justify-center z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#c5a059]">
              Production Service
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-brand">
              {selectedService.title}
            </h2>
          </div>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            {selectedService.fullDesc || selectedService.shortDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 border-y border-neutral-800 text-xs">
            {selectedService.startingPricePkr && (
              <div className="flex items-center gap-2 text-neutral-300">
                <Tag className="w-4 h-4 text-[#c5a059]" />
                <span>
                  Starting from <strong className="text-white">PKR {selectedService.startingPricePkr}</strong>
                </span>
              </div>
            )}
            {selectedService.turnaroundTime && (
              <div className="flex items-center gap-2 text-neutral-300">
                <Clock className="w-4 h-4 text-[#c5a059]" />
                <span>
                  Turnaround: <strong className="text-white">{selectedService.turnaroundTime}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Features */}
          {selectedService.features && selectedService.features.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                What’s Included in Production
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedService.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                    <Check className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deliverables */}
          {selectedService.deliverables && selectedService.deliverables.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Deliverables Provided
              </h4>
              <div className="space-y-1.5">
                {selectedService.deliverables.map((deliv, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-neutral-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059] shrink-0" />
                    <span>{deliv}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800">
            <button
              onClick={() => setSelectedService(null)}
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              Back to Services
            </button>
            <button
              onClick={handleBookService}
              className="w-full sm:w-auto px-6 py-3 text-xs uppercase tracking-wider font-semibold text-black bg-[#c5a059] rounded-lg hover:bg-[#d4af37] transition-all flex items-center justify-center gap-2"
            >
              <span>Request Quote for This Service</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
