import React from 'react';
import { useApp } from '../../context/AppContext.tsx';

export const FloatingWhatsApp: React.FC = () => {
  const { settings, currentRoute } = useApp();

  // Don't show in admin dashboard
  if (currentRoute === 'admin-dashboard') return null;

  const rawPhone = settings?.whatsapp || '+92 300 8492026';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Hello Shifa Productions, I would like to inquire about your video production & cinematography services.'
  )}`;

  return (
    <aside aria-label="Floating WhatsApp" className="fixed bottom-6 left-6 z-40">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-2xl shadow-[#25D366]/40 hover:shadow-[#25D366]/60 transition-all duration-300 active:scale-95 hover:scale-110 border-2 border-white/20"
        title="WhatsApp Chat (+92 300 8492026)"
        aria-label="WhatsApp"
      >
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
        <svg className="w-6 h-6 fill-current relative transition-transform group-hover:scale-110" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.085-2.02-.486-1.554-.64-2.531-2.227-2.607-2.329-.077-.102-.622-.828-.622-1.579 0-.751.393-1.121.533-1.274.14-.153.307-.192.41-.192.103 0 .205.002.296.006.096.005.224-.036.35.267.129.31.439 1.07.477 1.147.039.077.065.166.013.268-.052.102-.078.166-.154.256-.076.09-.16.2-.23.268-.078.077-.16.16-.068.318.092.158.408.673.876 1.09.602.537 1.109.703 1.267.781.158.078.251.069.345-.04.094-.108.405-.472.513-.633.108-.162.217-.135.365-.081.149.054.945.446 1.107.527.162.081.27.122.31.19.04.068.04.394-.104.799z"/>
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.176L2 22l4.954-1.396A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.062c-1.63 0-3.14-.493-4.412-1.34l-.316-.21-2.946.831.815-2.825-.231-.341C3.978 14.834 3.438 13.46 3.438 12c0-4.721 3.841-8.562 8.562-8.562 4.722 0 8.562 3.841 8.562 8.562 0 4.722-3.84 8.562-8.562 8.562z"/>
        </svg>
      </a>
    </aside>
  );
};
