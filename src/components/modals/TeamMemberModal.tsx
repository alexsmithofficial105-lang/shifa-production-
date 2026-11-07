import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  X,
  Mail,
  Phone,
  Instagram,
  Linkedin,
  Crown,
  Briefcase,
  Camera,
  Award,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const TeamMemberModal: React.FC = () => {
  const { selectedTeamMember, setSelectedTeamMember, navigateTo } = useApp();

  if (!selectedTeamMember) return null;

  const isOwner = selectedTeamMember.roleType === 'owner';
  const isCeo = selectedTeamMember.roleType === 'ceo';

  const handleBookWithMember = () => {
    setSelectedTeamMember(null);
    navigateTo('quote', {
      preset: {
        service: isOwner
          ? 'Feature Films & Cinema'
          : isCeo
          ? 'Commercial & Brand Films'
          : selectedTeamMember.title,
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={() => setSelectedTeamMember(null)}
    >
      <div
        className="w-full max-w-2xl bg-[#0c0c0c] border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 my-8 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top ambient glow */}
        <div
          className={`absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl pointer-events-none opacity-20 ${
            isOwner ? 'bg-[#EAB308]' : isCeo ? 'bg-[#FBBF24]' : 'bg-[#CA8A04]'
          }`}
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border shadow-sm ${
                isOwner
                  ? 'bg-[#EAB308]/20 text-[#FBBF24] border-[#EAB308]/40'
                  : isCeo
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-[#EAB308]/15 text-[#FBBF24] border-[#EAB308]/30'
              }`}
            >
              {isOwner ? (
                <>
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>Studio Owner • بانی</span>
                </>
              ) : isCeo ? (
                <>
                  <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                  <span>Executive Leadership • سی ای او</span>
                </>
              ) : (
                <>
                  <Camera className="w-3.5 h-3.5 text-blue-400" />
                  <span>Creative Specialist • سنیماٹوگرافر</span>
                </>
              )}
            </span>
          </div>

          <button
            onClick={() => setSelectedTeamMember(null)}
            className="min-w-[36px] min-h-[36px] p-2 text-neutral-400 hover:text-white rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <div
            className={`w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 bg-neutral-900 border-2 shadow-xl ${
              isOwner
                ? 'border-amber-500/60 shadow-amber-500/10'
                : isCeo
                ? 'border-sky-500/60 shadow-sky-500/10'
                : 'border-blue-500/60 shadow-blue-500/10'
            }`}
          >
            <img
              src={selectedTeamMember.photo}
              alt={selectedTeamMember.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/hero_cinematic_production_1793180767552.jpg';
              }}
            />
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-brand">
              {selectedTeamMember.name}
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span
                className={`text-sm font-semibold ${
                  isOwner ? 'text-amber-400' : isCeo ? 'text-sky-400' : 'text-blue-400'
                }`}
              >
                {selectedTeamMember.title}
              </span>
              {selectedTeamMember.urduTitle && (
                <span className="text-xs text-neutral-400 font-urdu px-2 py-0.5 rounded bg-neutral-900/80 border border-neutral-800">
                  {selectedTeamMember.urduTitle}
                </span>
              )}
            </div>

            {selectedTeamMember.experienceYears && (
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-neutral-400 pt-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Experience: <strong className="text-white">{selectedTeamMember.experienceYears}</strong> in high-end cinema production</span>
              </div>
            )}
          </div>
        </div>

        {/* Biography */}
        <div className="space-y-2 relative z-10">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Filmmaking Background & Vision
          </h3>
          <p className="text-sm text-neutral-300 leading-relaxed bg-black/40 p-4 rounded-2xl border border-neutral-800/80">
            {selectedTeamMember.bio || 'Dedicated cinema professional committed to world-class storytelling with Shifa Productions.'}
          </p>
        </div>

        {/* Specialties / Core Mastery */}
        {selectedTeamMember.specialties && selectedTeamMember.specialties.length > 0 && (
          <div className="space-y-2 relative z-10">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Specialized Domains & Mastery</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedTeamMember.specialties.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Primary Camera & Gear Mastery */}
        {selectedTeamMember.gear && (
          <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 space-y-1 relative z-10">
            <div className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#EAB308]" />
              <span>Primary Cinema Gear & Rig</span>
            </div>
            <div className="text-xs font-mono text-neutral-200">
              {selectedTeamMember.gear}
            </div>
          </div>
        )}

        {/* Contact Links & Direct Channels */}
        {(selectedTeamMember.email || selectedTeamMember.phone || selectedTeamMember.instagram || selectedTeamMember.linkedin) && (
          <div className="pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-300 relative z-10">
            <div className="flex flex-wrap items-center gap-4">
              {selectedTeamMember.phone && (
                <a
                  href={`tel:${selectedTeamMember.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-1.5 hover:text-[#EAB308] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#EAB308]" />
                  <span>{selectedTeamMember.phone}</span>
                </a>
              )}
              {selectedTeamMember.email && (
                <a
                  href={`mailto:${selectedTeamMember.email}`}
                  className="flex items-center gap-1.5 hover:text-[#EAB308] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#EAB308]" />
                  <span>{selectedTeamMember.email}</span>
                </a>
              )}
            </div>

            <div className="flex items-center gap-3">
              {selectedTeamMember.instagram && (
                <a
                  href={selectedTeamMember.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-[#EAB308] transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {selectedTeamMember.linkedin && (
                <a
                  href={selectedTeamMember.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-[#EAB308] transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 relative z-10">
          <button
            type="button"
            onClick={() => setSelectedTeamMember(null)}
            className="w-full sm:w-auto px-5 py-2.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            Close Profile
          </button>
          <button
            type="button"
            onClick={handleBookWithMember}
            className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 text-xs uppercase tracking-wider font-bold text-black bg-gradient-to-r from-[#FBBF24] via-[#EAB308] to-[#CA8A04] rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#EAB308]/20 cursor-pointer"
          >
            <span>Request Project with {selectedTeamMember.name.split(' ')[0]}</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
};
