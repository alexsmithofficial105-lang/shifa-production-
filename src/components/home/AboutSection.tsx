import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { ArrowRight, Film, Award, Camera, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { navigateTo, settings } = useApp();

  const title = settings?.about.title || 'Cinematic Storytelling Born in Pakistan';
  const story =
    settings?.about.story ||
    'Founded with an obsessive dedication to visual mastery, Shifa Productions is a full-spectrum film and visual arts production house based in Lahore and Islamabad. We engineer compelling narrative films, regal wedding cinema, high-impact commercials, and dynamic short-form content with state-of-the-art cinema equipment and seasoned industry veterans.';

  return (
    <section className="py-16 sm:py-24 bg-[#0a0a0a] text-neutral-100 border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual column */}
          <div className="relative group">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-900">
              <img
                src="/src/assets/images/portfolio_commercial_brand_1793180768486.jpg"
                alt="Shifa Productions Commercial Production Studio"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                <div className="p-4 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 text-xs text-neutral-300 space-y-1">
                  <div className="text-[#c5a059] font-semibold uppercase tracking-wider text-[11px]">
                    On Set Standards
                  </div>
                  <div className="text-white font-medium">
                    Hollywood-standard anamorphic cinema lenses & robotic motion control
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text column */}
          <div className="space-y-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#c5a059]">
              About Shifa Productions
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-brand leading-tight">
              {title}
            </h2>

            <p className="text-neutral-300 text-base leading-relaxed">
              {story}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                <span className="text-sm text-neutral-300">
                  Dual operational hubs in Lahore (Gulberg III) and Islamabad (F-7), ready for immediate dispatch across Pakistan.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                <span className="text-sm text-neutral-300">
                  Full in-house post-production: DaVinci Resolve color suites, sound design, and 4K masters.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
                <span className="text-sm text-neutral-300">
                  Registered, CAA-licensed aerial drone pilots adhering strictly to Pakistani airspace safety laws.
                </span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => navigateTo('about')}
                className="px-6 py-3 text-xs uppercase tracking-wider font-semibold text-white bg-neutral-900 border border-neutral-700 rounded-lg hover:border-[#c5a059] hover:text-[#c5a059] transition-all flex items-center gap-2 group"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
