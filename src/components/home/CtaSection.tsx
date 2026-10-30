import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { ArrowRight, MessageSquare, PhoneCall } from 'lucide-react';

export const CtaSection: React.FC = () => {
  const { navigateTo, settings } = useApp();

  const phone = settings?.phone || '+92 300 8492026';
  const whatsapp = settings?.whatsapp || '+92 300 8492026';
  const cleanWaNumber = whatsapp.replace(/[^0-9]/g, '');

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-black text-white border-b border-neutral-800/80">
      <div className="absolute inset-0 bg-radial-gradient from-[#2563eb]/15 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8">
        <div className="text-xs font-semibold uppercase tracking-widest text-[#3b82f6]">
          Get Started With Shifa Productions
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-brand">
          Have a Project in Mind?
        </h2>

        <p className="text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          Let’s create something extraordinary together. Whether it’s a national commercial campaign or a regal family wedding in Pakistan, our team is ready.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigateTo('contact')}
            className="w-full sm:w-auto px-8 py-4 text-xs uppercase tracking-wider font-semibold text-white bg-neutral-900 border border-neutral-700 rounded-lg hover:border-[#2563eb] hover:text-[#3b82f6] transition-all flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Discuss Your Project</span>
          </button>

          <button
            onClick={() => navigateTo('quote')}
            className="w-full sm:w-auto px-8 py-4 text-xs uppercase tracking-wider font-semibold text-white bg-[#2563eb] rounded-lg hover:bg-[#1d4ed8] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#2563eb]/20"
          >
            <span>Request a Quote</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* WhatsApp quick connect option */}
        <div className="pt-4 text-xs text-neutral-400">
          Prefer instant messaging?{' '}
          <a
            href={`https://wa.me/${cleanWaNumber}?text=Hi%20Shifa%20Productions,%20I%20have%20an%20inquiry%20regarding%20a%20production%20project.`}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-medium ml-1"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat via WhatsApp ({phone})</span>
          </a>
        </div>
      </div>
    </section>
  );
};
