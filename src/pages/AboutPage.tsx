import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Camera,
  MapPin,
  Film,
  Sparkles,
  Award,
  ShieldCheck,
  ArrowRight,
  Crown,
  Briefcase,
  Users,
  Mail,
  Phone,
  Instagram,
  Linkedin,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings, team, navigateTo } = useApp();

  const brandName = settings?.brandName || 'Shifa Productions';
  const about = settings?.about;

  const owners = (team || []).filter((m) => m.roleType === 'owner');
  const ceos = (team || []).filter((m) => m.roleType === 'ceo');
  const creativeMembers = (team || []).filter((m) => m.roleType === 'team_member');

  return (
    <div className="py-12 sm:py-24 bg-[#060913] text-neutral-100 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-24">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#3b82f6]">
            About Our Production House
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-brand">
            {about?.title || 'Cinematic Storytelling Born in Pakistan'}
          </h1>
          <p className="text-lg text-neutral-300 leading-relaxed">
            {about?.story ||
              'We are a collective of cinematographers, directors, lighting artisans, and editors united by one mission: elevating Pakistani storytelling to international theatrical standards.'}
          </p>
        </div>

        {/* Hero Visual Banner */}
        <div className="relative aspect-21/9 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-900">
          <img
            src="/images/hero_cinematic_production_1793180767552.jpg"
            alt="Shifa Productions Film Production Studio"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-neutral-300">
            <span className="font-brand text-sm text-white font-semibold">
              Shifa Productions On-Set Cinema Rig — Lahore Studio
            </span>
            <span>Operating RED & ARRI Cinema Systems</span>
          </div>
        </div>

        {/* Editorial Vision & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#3b82f6]">
              The Cinematic Philosophy
            </div>
            <h2 className="text-3xl font-bold text-white font-brand leading-snug">
              Every Frame Tells a Story of Cultural Grandeur & Emotional Truth
            </h2>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              {about?.cinematicVision ||
                'Pakistan is filled with extraordinary texture, architectural heritage, and passionate life stories. From the heritage courtyards of old Lahore to the modern corporate towers of Karachi and the scenic backdrops of Islamabad and the northern valleys, our cinema packages capture moments that endure.'}
            </p>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              We reject the sterile, formulaic wedding and commercial video templates that dominate the market. Instead, we develop bespoke lighting designs, deliberate camera movements, and nuanced audio landscapes tailored to each commission.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#0f172a] border border-neutral-800 space-y-2">
              <div className="text-3xl font-bold text-white tabular-nums font-brand">
                {about?.completedProjects || '450+'}
              </div>
              <div className="text-xs text-neutral-400">
                Completed productions delivered across Pakistan.
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0f172a] border border-neutral-800 space-y-2">
              <div className="text-3xl font-bold text-[#3b82f6] tabular-nums font-brand">
                {about?.experienceYears || '10+'}
              </div>
              <div className="text-xs text-neutral-400">
                Years of continuous directorial and cinematography experience.
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0f172a] border border-neutral-800 space-y-2">
              <div className="text-3xl font-bold text-white tabular-nums font-brand">
                {about?.filmmakersCount || '18'}
              </div>
              <div className="text-xs text-neutral-400">
                In-house cinematographers, gaffers, drone pilots, and editors.
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0f172a] border border-neutral-800 space-y-2">
              <div className="text-3xl font-bold text-white tabular-nums font-brand">
                100%
              </div>
              <div className="text-xs text-neutral-400">
                Broadcast compliant delivery with DaVinci color grading.
              </div>
            </div>
          </div>
        </div>

        {/* Equipment & Cinema Technology Vault */}
        <div className="p-8 sm:p-12 rounded-2xl bg-[#0e0e0e] border border-neutral-800 space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#3b82f6]">
              Technology & Infrastructure
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-brand">
              Our Professional Cinema Vault
            </h3>
            <p className="text-neutral-400 text-sm">
              We own and deploy tier-one cinema ecosystems without relying on third-party equipment compromises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <Camera className="w-6 h-6 text-[#3b82f6]" />
              <h4 className="text-base font-bold text-white font-brand">Camera Systems</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                ARRI Alexa Mini LF, RED V-Raptor 8K, Sony FX6 & FX3 Cinema Line rigs with 16-bit RAW internal recording.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <Sparkles className="w-6 h-6 text-[#3b82f6]" />
              <h4 className="text-base font-bold text-white font-brand">Anamorphic & Prime Glass</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Cooke Anamorphic/i, ARRI Master Anamorphics, Zeiss Supreme Primes, and Sony G-Master cinema lenses.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <Film className="w-6 h-6 text-[#3b82f6]" />
              <h4 className="text-base font-bold text-white font-brand">Aerial & Stabilization</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                DJI Inspire 3 8K Cinema Drone, DJI Ronin 2 3-axis stabilization, Ready Rig support, and motorized sliders.
              </p>
            </div>
          </div>
        </div>

        {/* Leadership & Creative Team Section */}
        {((owners && owners.length > 0) || (ceos && ceos.length > 0) || (creativeMembers && creativeMembers.length > 0)) && (
          <div className="space-y-12">
            <div className="max-w-3xl space-y-3">
              <div className="text-xs font-semibold uppercase tracking-widest text-[#3b82f6]">
                Studio Leadership & Visionaries
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white font-brand">
                The Minds Behind the Cinematic Vision
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                Meet our founding ownership, executive leadership, and world-class cinema directors dedicated to crafting unforgettable films across Pakistan.
              </p>
            </div>

            {/* Executive Leadership: Owner & CEO Cards */}
            {((owners && owners.length > 0) || (ceos && ceos.length > 0)) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Owner Profiles */}
                {owners.map((owner) => (
                  <div
                    key={owner.id}
                    className="p-8 rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#111c38] to-[#0a0f1d] border border-amber-500/40 shadow-2xl space-y-6 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        <span>Studio Owner</span>
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-xl shrink-0 bg-neutral-900">
                        <img
                          src={owner.photo}
                          alt={owner.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/hero_cinematic_production_1793180767552.jpg';
                          }}
                        />
                      </div>
                      <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                        <h3 className="text-2xl font-bold text-white font-brand">{owner.name}</h3>
                        <p className="text-sm text-amber-400 font-medium">{owner.title}</p>
                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed pt-1">
                          {owner.bio}
                        </p>
                      </div>
                    </div>

                    {(owner.email || owner.phone || owner.instagram || owner.linkedin) && (
                      <div className="pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400">
                        <div className="flex flex-wrap items-center gap-4">
                          {owner.email && (
                            <span className="flex items-center gap-1.5 text-neutral-300">
                              <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>{owner.email}</span>
                            </span>
                          )}
                          {owner.phone && (
                            <span className="flex items-center gap-1.5 text-neutral-300">
                              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>{owner.phone}</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {owner.instagram && (
                            <a
                              href={owner.instagram}
                              target="_blank"
                              rel="noreferrer"
                              className="text-neutral-400 hover:text-white transition-colors"
                            >
                              <Instagram className="w-4 h-4" />
                            </a>
                          )}
                          {owner.linkedin && (
                            <a
                              href={owner.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="text-neutral-400 hover:text-white transition-colors"
                            >
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* CEO Profiles */}
                {ceos.map((ceo) => (
                  <div
                    key={ceo.id}
                    className="p-8 rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#101b33] to-[#060913] border border-sky-500/40 shadow-2xl space-y-6 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center gap-1.5 shadow-sm">
                        <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                        <span>Chief Executive Officer</span>
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-sky-500/50 shadow-xl shrink-0 bg-neutral-900">
                        <img
                          src={ceo.photo}
                          alt={ceo.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/commercial_film_set_1793180800619.jpg';
                          }}
                        />
                      </div>
                      <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                        <h3 className="text-2xl font-bold text-white font-brand">{ceo.name}</h3>
                        <p className="text-sm text-sky-400 font-medium">{ceo.title}</p>
                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed pt-1">
                          {ceo.bio}
                        </p>
                      </div>
                    </div>

                    {(ceo.email || ceo.phone || ceo.instagram || ceo.linkedin) && (
                      <div className="pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400">
                        <div className="flex flex-wrap items-center gap-4">
                          {ceo.email && (
                            <span className="flex items-center gap-1.5 text-neutral-300">
                              <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                              <span>{ceo.email}</span>
                            </span>
                          )}
                          {ceo.phone && (
                            <span className="flex items-center gap-1.5 text-neutral-300">
                              <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                              <span>{ceo.phone}</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {ceo.instagram && (
                            <a
                              href={ceo.instagram}
                              target="_blank"
                              rel="noreferrer"
                              className="text-neutral-400 hover:text-white transition-colors"
                            >
                              <Instagram className="w-4 h-4" />
                            </a>
                          )}
                          {ceo.linkedin && (
                            <a
                              href={ceo.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="text-neutral-400 hover:text-white transition-colors"
                            >
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Creative Team Members Grid */}
            {creativeMembers && creativeMembers.length > 0 && (
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white font-brand">Production & Creative Specialists</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {creativeMembers.map((member) => (
                    <div
                      key={member.id}
                      className="p-6 rounded-2xl bg-[#0f172a] border border-neutral-800/90 hover:border-neutral-700 flex flex-col justify-between space-y-4 transition-all group"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden border border-neutral-700 shrink-0 bg-neutral-900 group-hover:border-[#2563eb] transition-colors">
                            <img
                              src={member.photo}
                              alt={member.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/wedding_cinematography_1793180783307.jpg';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              Creative Crew
                            </span>
                            <h4 className="text-base font-bold text-white font-brand truncate">{member.name}</h4>
                            <p className="text-xs text-neutral-400 truncate">{member.title}</p>
                          </div>
                        </div>

                        <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3">
                          {member.bio}
                        </p>
                      </div>

                      {(member.email || member.phone) && (
                        <div className="pt-3 border-t border-neutral-900 text-[11px] text-neutral-400 space-y-1">
                          {member.email && (
                            <div className="truncate flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-neutral-500 shrink-0" />
                              <span>{member.email}</span>
                            </div>
                          )}
                          {member.phone && (
                            <div className="truncate flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-neutral-500 shrink-0" />
                              <span>{member.phone}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Studio Locations */}
        <div className="space-y-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-[#3b82f6]">
            Physical Presence
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white font-brand">
            Our Studio Footprint in Pakistan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-2xl bg-[#0f172a] border border-neutral-800 space-y-4">
              <div className="flex items-center gap-2 text-[#3b82f6] text-xs font-semibold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Lahore Headquarters</span>
              </div>
              <h4 className="text-xl font-bold text-white font-brand">Gulberg III Studio</h4>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {settings?.addressLahore || 'Executive Studio 4B, M.M. Alam Road, Gulberg III, Lahore, Pakistan'}
              </p>
              <div className="text-xs text-neutral-400 pt-2 border-t border-neutral-800">
                Equipped with green screen studio, editing suites, and cinema gear vault.
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-[#0f172a] border border-neutral-800 space-y-4">
              <div className="flex items-center gap-2 text-[#3b82f6] text-xs font-semibold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Islamabad Branch</span>
              </div>
              <h4 className="text-xl font-bold text-white font-brand">F-7 Markaz Studio</h4>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {settings?.addressIslamabad || 'Creative Suite 12, Executive Heights, F-7 Markaz, Islamabad, Pakistan'}
              </p>
              <div className="text-xs text-neutral-400 pt-2 border-t border-neutral-800">
                Specialized in corporate summits, embassies, and northern Pakistan production logistics.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="pt-8 text-center space-y-4">
          <h3 className="text-2xl font-bold text-white font-brand">
            Ready to Begin Your Production?
          </h3>
          <p className="text-neutral-400 text-sm max-w-lg mx-auto">
            Contact our production team today to check availability for your event date or commercial shoot.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('quote')}
              className="px-8 py-3.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#2563eb] rounded-lg hover:bg-[#1d4ed8] transition-all inline-flex items-center gap-2"
            >
              <span>Request a Production Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
