import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ChevronDown, HelpCircle, MessageSquare, ArrowRight } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const { faqs, navigateTo, settings } = useApp();
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    [faqs[0]?.id || '']: true,
  });

  const toggle = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const whatsapp = settings?.whatsapp || '+92 300 8492026';
  const cleanWa = whatsapp.replace(/[^0-9]/g, '');

  return (
    <div className="py-16 md:py-24 bg-[#080808] text-neutral-100 animate-fadeIn">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#c5a059]">
            Questions & Answers
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-brand">
            Frequently Asked Questions
          </h1>
          <p className="text-neutral-400 text-base leading-relaxed max-w-xl mx-auto">
            Everything you need to know about our production workflows, camera technology, Pakistani nationwide logistics, and payment schedules.
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = !!openIds[faq.id];
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-[#0f0f0f] border border-neutral-800/80 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none hover:text-[#c5a059] transition-colors"
                >
                  <span className="text-base sm:text-lg font-bold text-white font-brand">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#c5a059]' : 'text-neutral-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-neutral-300 leading-relaxed border-t border-neutral-900">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="p-8 rounded-2xl bg-[#121212] border border-neutral-800 text-center space-y-4">
          <h3 className="text-xl font-bold text-white font-brand">
            Have a Specific Question About Your Shoot?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
            Our producers are available on phone or WhatsApp to walk through your venue specifications and customized logistics.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigateTo('quote')}
              className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-black bg-[#c5a059] rounded-lg hover:bg-[#d4af37] transition-all flex items-center gap-2"
            >
              <span>Submit Inquiry</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={`https://wa.me/${cleanWa}?text=Hi%20Shifa%20Productions,%20I%20have%20a%20question%20regarding%20production%20services.`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-800/80 rounded-lg hover:bg-emerald-900 transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
