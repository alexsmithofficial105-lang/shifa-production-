import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Crown,
  Briefcase,
  Camera,
  ArrowRight,
  Sparkles,
  Users,
} from 'lucide-react';

export const TeamSection: React.FC = () => {
  const { team, setSelectedTeamMember, navigateTo } = useApp();

  // Show top featured team members
  const featuredTeam = (team || []).slice(0, 4);

  if (!featuredTeam || featuredTeam.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-[#050505] border-t border-neutral-900 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#EAB308]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAB308]/10 border border-[#EAB308]/25 text-xs font-semibold uppercase tracking-widest text-[#EAB308]">
              <Users className="w-3.5 h-3.5" />
              <span>Studio Filmmakers • ہماری ٹیم</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-brand">
              Meet The Directors & Cinematographers
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              The creative visionaries and technical masters crafting Pakistan's premier weddings, commercial films, and royal documentary cinema.
            </p>
          </div>

          <button
            onClick={() => navigateTo('team')}
            className="group px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-neutral-900 border border-neutral-800 hover:border-[#EAB308] hover:bg-[#EAB308]/10 transition-all flex items-center gap-2 self-start md:self-auto shrink-0"
          >
            <span>View All Profiles (تمام ٹیم ممبرز)</span>
            <ArrowRight className="w-4 h-4 text-[#EAB308] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTeam.map((member) => {
            const isChairman = member.roleType === 'chairman' || member.roleType === 'owner';
            const isCeo = member.roleType === 'ceo';

            return (
              <div
                key={member.id}
                onClick={() => setSelectedTeamMember(member)}
                className={`p-5 rounded-3xl bg-[#0c0c0c] border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between space-y-4 cursor-pointer group relative overflow-hidden ${
                  isChairman
                    ? 'border-2 border-[#EAB308]/60 hover:border-[#FBBF24] shadow-lg shadow-[#EAB308]/10'
                    : isCeo
                    ? 'border-amber-500/50 hover:border-amber-400 shadow-amber-500/10'
                    : 'border-neutral-800 hover:border-[#EAB308]/50'
                }`}
              >
                <div className="space-y-4">
                  {/* Photo Container */}
                  <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-900 relative shadow-inner">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/hero_cinematic_production_1793180767552.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Role Tag */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1 border shadow-sm ${
                          isChairman
                            ? 'bg-[#EAB308]/20 text-[#FBBF24] border-[#EAB308]/60'
                            : isCeo
                            ? 'bg-amber-950/80 text-amber-300 border-amber-600'
                            : 'bg-black/80 text-[#EAB308] border-[#EAB308]/30'
                        }`}
                      >
                        {isChairman ? <Crown className="w-3 h-3 text-[#EAB308]" /> : isCeo ? <Briefcase className="w-3 h-3 text-amber-400" /> : <Camera className="w-3 h-3 text-[#EAB308]" />}
                        <span>{isChairman ? 'Chairman • چیئرمین' : isCeo ? 'CEO • سی ای او' : 'Filmmaker'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Name and Designation */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white font-brand group-hover:text-[#EAB308] transition-colors truncate">
                      {member.name}
                    </h3>
                    <p className={`text-xs truncate font-medium ${isChairman ? 'text-[#FBBF24]' : isCeo ? 'text-amber-400' : 'text-neutral-400'}`}>
                      {member.title}
                    </p>
                    {member.urduTitle && (
                      <p className="text-[11px] text-neutral-500 font-urdu truncate">
                        {member.urduTitle}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-neutral-400 font-medium">
                    {member.experienceYears || 'Cinema Team'}
                  </span>
                  <span className="text-xs font-semibold text-[#EAB308] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
