import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { TeamMember, TeamRoleType } from '../types/index.ts';
import {
  Crown,
  Briefcase,
  Camera,
  Users,
  Sparkles,
  Award,
  Mail,
  Phone,
  Instagram,
  Linkedin,
  ArrowRight,
  ShieldCheck,
  Film,
  Compass,
} from 'lucide-react';

export const TeamPage: React.FC = () => {
  const { team, setSelectedTeamMember, navigateTo } = useApp();
  const [filter, setFilter] = useState<'all' | 'leadership' | 'cinematography' | 'post'>('all');

  const filteredMembers = (team || []).filter((m) => {
    if (filter === 'all') return true;
    if (filter === 'leadership') return m.roleType === 'owner' || m.roleType === 'ceo';
    if (filter === 'cinematography') {
      const t = (m.title + ' ' + m.bio + ' ' + (m.specialties || []).join(' ')).toLowerCase();
      return t.includes('photog') || t.includes('drone') || t.includes('aerial') || t.includes('camera') || t.includes('dop');
    }
    if (filter === 'post') {
      const t = (m.title + ' ' + m.bio + ' ' + (m.specialties || []).join(' ')).toLowerCase();
      return t.includes('color') || t.includes('edit') || t.includes('post') || t.includes('sound');
    }
    return true;
  });

  const owners = (team || []).filter((m) => m.roleType === 'owner');
  const ceos = (team || []).filter((m) => m.roleType === 'ceo');
  const creativeCrew = (team || []).filter((m) => m.roleType === 'team_member');

  return (
    <div className="py-12 sm:py-24 bg-[#060913] text-neutral-100 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-24">
        {/* Page Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold uppercase tracking-widest text-[#3b82f6]">
            <Film className="w-3.5 h-3.5" />
            <span>Studio Filmmakers & Leadership • ہماری ٹیم پروفائل</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-brand">
            The Visionaries Behind Every Cinematic Frame
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            From our founding directors and executive studio leadership to our certified 8K drone pilots, gaffers, and DaVinci colorists — meet the passionate artists dedicated to high-end Pakistani cinema.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-b border-neutral-800 pb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              filter === 'all'
                ? 'bg-[#2563eb] text-white shadow-lg shadow-[#2563eb]/20'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            All Filmmakers (تمام پروفائلز)
          </button>
          <button
            onClick={() => setFilter('leadership')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              filter === 'leadership'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Studio Leadership & Owners</span>
          </button>
          <button
            onClick={() => setFilter('cinematography')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              filter === 'cinematography'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Cinematography & Drone Pilots</span>
          </button>
          <button
            onClick={() => setFilter('post')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              filter === 'post'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500'
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Colorists & Post-Production</span>
          </button>
        </div>

        {/* Executive Leadership Spotlight (Owner & CEO) */}
        {(filter === 'all' || filter === 'leadership') && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white font-brand flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <span>Founding Ownership & Executive Leadership</span>
                </h2>
                <p className="text-xs text-neutral-400">
                  Director-level supervision and creative direction on all premier commissions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Studio Owner Cards */}
              {owners.map((owner) => (
                <div
                  key={owner.id}
                  className="p-8 rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#111c38] to-[#0a0f1d] border border-amber-500/40 shadow-2xl space-y-6 relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      <span>Studio Owner • بانی</span>
                    </span>
                    {owner.experienceYears && (
                      <span className="text-xs text-amber-400/90 font-medium">
                        {owner.experienceYears} In Film
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-amber-500/60 shadow-xl shrink-0 bg-neutral-900 group-hover:scale-102 transition-transform">
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
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <span className="text-sm text-amber-400 font-semibold">{owner.title}</span>
                        {owner.urduTitle && (
                          <span className="text-xs text-neutral-400 font-urdu px-2 py-0.5 rounded bg-neutral-900/80 border border-neutral-800">
                            {owner.urduTitle}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed pt-1 line-clamp-3">
                        {owner.bio}
                      </p>
                    </div>
                  </div>

                  {owner.gear && (
                    <div className="p-3 bg-black/40 rounded-xl border border-neutral-800/80 text-xs">
                      <span className="text-neutral-400 font-medium">Signature Rig: </span>
                      <span className="text-neutral-200 font-mono text-[11px]">{owner.gear}</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      {owner.phone && (
                        <a
                          href={`tel:${owner.phone.replace(/[^0-9+]/g, '')}`}
                          className="text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-amber-400" />
                          <span>{owner.phone}</span>
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedTeamMember(owner)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <span>View Full Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* CEO Cards */}
              {ceos.map((ceo) => (
                <div
                  key={ceo.id}
                  className="p-8 rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#101b33] to-[#060913] border border-sky-500/40 shadow-2xl space-y-6 relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center gap-1.5 shadow-sm">
                      <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                      <span>Chief Executive Officer • سی ای او</span>
                    </span>
                    {ceo.experienceYears && (
                      <span className="text-xs text-sky-400/90 font-medium">
                        {ceo.experienceYears} In Film
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-sky-500/60 shadow-xl shrink-0 bg-neutral-900 group-hover:scale-102 transition-transform">
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
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <span className="text-sm text-sky-400 font-semibold">{ceo.title}</span>
                        {ceo.urduTitle && (
                          <span className="text-xs text-neutral-400 font-urdu px-2 py-0.5 rounded bg-neutral-900/80 border border-neutral-800">
                            {ceo.urduTitle}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed pt-1 line-clamp-3">
                        {ceo.bio}
                      </p>
                    </div>
                  </div>

                  {ceo.gear && (
                    <div className="p-3 bg-black/40 rounded-xl border border-neutral-800/80 text-xs">
                      <span className="text-neutral-400 font-medium">Operating Setup: </span>
                      <span className="text-neutral-200 font-mono text-[11px]">{ceo.gear}</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      {ceo.email && (
                        <a
                          href={`mailto:${ceo.email}`}
                          className="text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5 text-sky-400" />
                          <span>{ceo.email}</span>
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedTeamMember(ceo)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <span>View Full Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Creative & Technical Filmmakers Grid */}
        <div className="space-y-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white font-brand flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#3b82f6]" />
              <span>Production Crew, Cinematographers & Post-Production</span>
            </h2>
            <p className="text-xs text-neutral-400">
              On-set directors of photography, certified aerial drone operators, gaffers, and colorists.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredMembers
              .filter((m) => filter !== 'all' || m.roleType === 'team_member')
              .map((member) => (
                <div
                  key={member.id}
                  className="p-6 rounded-3xl bg-[#0f172a] border border-neutral-800/90 hover:border-neutral-700 hover:shadow-2xl flex flex-col justify-between space-y-5 transition-all group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border border-neutral-700 shrink-0 bg-neutral-900 group-hover:border-[#2563eb] transition-colors shadow-md">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/wedding_cinematography_1793180783307.jpg';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {member.roleType === 'owner'
                            ? 'Studio Owner'
                            : member.roleType === 'ceo'
                            ? 'CEO'
                            : 'Filmmaker'}
                        </span>
                        <h3 className="text-lg font-bold text-white font-brand truncate">{member.name}</h3>
                        <p className="text-xs text-neutral-400 truncate">{member.title}</p>
                        {member.urduTitle && (
                          <p className="text-[11px] text-neutral-500 font-urdu truncate">{member.urduTitle}</p>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3">
                      {member.bio}
                    </p>

                    {member.specialties && member.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {member.specialties.slice(0, 3).map((spec, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[10px] bg-neutral-900 text-neutral-300 border border-neutral-800"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400 font-medium">
                      {member.experienceYears || 'Studio Artist'}
                    </span>
                    <button
                      onClick={() => setSelectedTeamMember(member)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 border border-neutral-700 hover:border-[#2563eb] rounded-xl flex items-center gap-1.5 transition-colors group-hover:bg-[#2563eb]"
                    >
                      <span>Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* CTA: Book or Collaborate with Shifa Productions */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0d1527] via-[#101b33] to-[#070b14] border border-[#2563eb]/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-brand">
              Want Our Elite Cinema Team on Your Next Production?
            </h3>
            <p className="text-sm text-neutral-300 max-w-xl">
              We travel nationwide across Pakistan with dedicated cinema crews, master anamorphic lenses, and RED 8K camera packages.
            </p>
          </div>
          <button
            onClick={() => navigateTo('quote')}
            className="min-h-[48px] px-8 py-3.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#2563eb] rounded-xl hover:bg-[#1d4ed8] active:scale-95 transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-[#2563eb]/20"
          >
            <span>Book A Production Date</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
