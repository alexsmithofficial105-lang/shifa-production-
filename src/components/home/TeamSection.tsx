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
    <section className="py-20 sm:py-28 bg-[#090d1a]/80 border-t border-neutral-900 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#2563eb]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold uppercase tracking-widest text-[#3b82f6]">
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
            className="group px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-neutral-900 border border-neutral-800 hover:border-[#2563eb] hover:bg-[#2563eb]/10 transition-all flex items-center gap-2 self-start md:self-auto shrink-0"
          >
            <span>View All Profiles (تمام ٹیم ممبرز)</span>
            <ArrowRight className="w-4 h-4 text-[#3b82f6] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTeam.map((member) => {
            const isOwner = member.roleType === 'owner';
            const isCeo = member.roleType === 'ceo';

            return (
              <div
                key={member.id}
                onClick={() => setSelectedTeamMember(member)}
                className={`p-5 rounded-3xl bg-[#0f172a] border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between space-y-4 cursor-pointer group relative overflow-hidden ${
                  isOwner
                    ? 'border-amber-500/40 hover:border-amber-500/80 shadow-amber-500/5'
                    : isCeo
                    ? 'border-sky-500/40 hover:border-sky-500/80 shadow-sky-500/5'
                    : 'border-neutral-800 hover:border-blue-500/60'
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
                          isOwner
                            ? 'bg-amber-950/80 text-amber-300 border-amber-600'
                            : isCeo
                            ? 'bg-sky-950/80 text-sky-300 border-sky-600'
                            : 'bg-black/70 text-blue-300 border-blue-500/30'
                        }`}
                      >
                        {isOwner ? <Crown className="w-3 h-3 text-amber-400" /> : isCeo ? <Briefcase className="w-3 h-3 text-sky-400" /> : <Camera className="w-3 h-3 text-blue-400" />}
                        <span>{isOwner ? 'Studio Owner' : isCeo ? 'CEO' : 'Specialist'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Name and Designation */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white font-brand group-hover:text-[#3b82f6] transition-colors truncate">
                      {member.name}
                    </h3>
                    <p className={`text-xs truncate font-medium ${isOwner ? 'text-amber-400' : isCeo ? 'text-sky-400' : 'text-neutral-400'}`}>
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
                  <span className="text-xs font-semibold text-[#3b82f6] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
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
