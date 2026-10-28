import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Star, CheckCircle, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = useApp();

  return (
    <section className="py-16 sm:py-24 bg-[#080808] text-neutral-100 border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#c5a059]">
            Client Experiences
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-brand">
            Feedback From Pakistani Clients
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Real feedback from Pakistani couples, corporate directors, and brand heads. All reviews are labeled transparently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-7 rounded-2xl bg-[#0e0e0e] border border-neutral-800/80 hover:border-neutral-700 transition-colors flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Rating & Verification Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-[#c5a059]" />
                    ))}
                  </div>

                  {/* Clearly distinguish verified feedback from sample */}
                  {t.isVerifiedCustomer ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Verified Client</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-neutral-500">
                      Sample Testimonial
                    </span>
                  )}
                </div>

                <p className="text-neutral-300 text-sm leading-relaxed italic">
                  "{t.reviewText}"
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-900 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white font-brand text-sm">
                    {t.clientName}
                  </h4>
                  <p className="text-neutral-400 text-[11px]">
                    {t.roleOrBrand} {t.city ? `· ${t.city}` : ''}
                  </p>
                </div>
                <span className="text-[11px] text-neutral-500">{t.projectType}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
