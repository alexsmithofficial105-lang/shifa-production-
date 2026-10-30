import React from 'react';
import { ShieldCheck, Film, Cpu, Clock, SlidersHorizontal, HeartHandshake } from 'lucide-react';

const REASONS = [
  {
    icon: ShieldCheck,
    title: 'Professional Quality',
    desc: 'Uncompromising broadcast and cinema grade standards. Every project is planned, lighted, and recorded with cinematic precision.',
  },
  {
    icon: Film,
    title: 'Creative Storytelling',
    desc: 'We don’t just record footage; we construct emotional arcs that capture the unique spirit of your brand or life celebration.',
  },
  {
    icon: Cpu,
    title: 'Modern Equipment & Techniques',
    desc: 'Equipped with ARRI and RED cinema ecosystems, anamorphic optics, motorized gimbals, and licensed 8K aerial drones.',
  },
  {
    icon: Clock,
    title: 'Reliable Project Delivery',
    desc: 'Strict timelines with milestone transparency. Early social media teasers delivered within days and complete masters on schedule.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Customized Packages',
    desc: 'Tailored production tiers scaled specifically for your budget in PKR, event duration, and required deliverable formats.',
  },
  {
    icon: HeartHandshake,
    title: 'Client-Focused Service',
    desc: 'Dedicated creative producers in Lahore and Islamabad walking with you through every phase from first concept to final export.',
  },
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#060913] text-neutral-100 border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#3b82f6]">
            The Shifa Standard
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-brand">
            Why Visionaries Choose Shifa Productions
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Our reputation is built on technical discipline, artistic sensibility, and seamless production management across Pakistan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map((reason, idx) => {
            const Icon = reason.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-[#0f0f0f] border border-neutral-800/80 hover:border-[#2563eb]/40 transition-colors space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#3b82f6]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white font-brand">
                  {reason.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {reason.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
