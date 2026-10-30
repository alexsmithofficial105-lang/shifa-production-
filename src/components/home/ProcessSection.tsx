import React from 'react';
import { Lightbulb, MessagesSquare, CalendarCheck, Video, Sparkles } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Share Your Idea',
    desc: 'Submit your initial inquiry, brief, or wedding dates through our website or direct line.',
    icon: Lightbulb,
  },
  {
    step: '02',
    title: 'Discuss Requirements',
    desc: 'Meet our creative director in Lahore, Islamabad, or over video to establish your aesthetic vision and deliverables.',
    icon: MessagesSquare,
  },
  {
    step: '03',
    title: 'Plan the Production',
    desc: 'We storyboard, scout locations, assemble the cinema crew, schedule drone permits, and finalize shot lists.',
    icon: CalendarCheck,
  },
  {
    step: '04',
    title: 'Shoot & Create',
    desc: 'Our cinematographers execute on set with ARRI/RED cameras, master lighting, and certified aerial rigs.',
    icon: Video,
  },
  {
    step: '05',
    title: 'Edit & Deliver',
    desc: 'DaVinci color grading, sound design, early social teaser dispatch, and master 4K high-resolution delivery.',
    icon: Sparkles,
  },
];

export const ProcessSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#0a0a0a] text-neutral-100 border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#3b82f6]">
            Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-brand">
            Our 5-Step Production Journey
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            From your very first concept to the final high-definition master screening, our structured process guarantees peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-[#0f172a] border border-neutral-800/80 hover:border-[#2563eb]/40 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-brand font-bold text-[#3b82f6]/40 tabular-nums">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#3b82f6]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white font-brand">
                    {item.title}
                  </h3>

                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
