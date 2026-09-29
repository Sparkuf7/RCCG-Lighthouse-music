import React, { useState } from 'react';
import { useMinistry } from '../../context/MinistryContext';
import { Member } from '../../types';
import {
  Award,
  Shield,
  Star,
  Lock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { MemberDetailModal } from '../members/MemberDetailModal';

export const LeadershipTracker: React.FC = () => {
  const { members, currentUserRole } = useMinistry();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const isPrivileged = currentUserRole === 'MUSIC_DIRECTOR' || currentUserRole === 'SUPER_ADMIN_PASTOR';

  if (!isPrivileged) {
    return (
      <div className="p-12 text-center bg-[#173B2D]/20 border border-white/5 rounded-3xl">
        <Lock className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
        <h3 className="text-base font-bold text-white">Confidential Leadership Portal</h3>
        <p className="text-xs text-[#AAB8B2] max-w-md mx-auto mt-1">
          Leadership development tracking and pastoral evaluations are reserved for the Music Director and Church Leadership.
        </p>
      </div>
    );
  }

  // Leaders & potential leadership candidates
  const leaders = members.filter(
    (m) => m.leadership_ratings || m.leadership_role !== 'None' || m.role !== 'MEMBER'
  );

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#173B2D]/40 border border-[#D4AF37]/30 p-6 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-[#F3D21A]" />
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              Character & Succession Planning
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Leadership Development Pipeline</h2>
          <p className="text-xs text-[#AAB8B2] mt-0.5">
            Developing future leaders across sections, administration, rehearsals, and worship leading.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-[#0B1F1C] border border-[#D4AF37]/40 text-xs font-bold text-[#F3D21A] flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Pastoral Confidentiality Active</span>
        </div>
      </div>

      {/* Leadership Philosophy Reminder */}
      <div className="bg-[#0B1F1C]/80 border border-white/5 p-4 rounded-2xl text-xs text-[#AAB8B2] flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#F3D21A] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-white">Leadership Principle:</strong> Do not appoint leaders purely based on musical talent. Track character, dependability, humility, teachability, and spiritual maturity.
        </p>
      </div>

      {/* Leader Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {leaders.map((leader) => {
          const ratings = leader.leadership_ratings;
          const avgScore = ratings
            ? (
                (ratings.reliability +
                  ratings.musical_competence +
                  ratings.teamwork +
                  ratings.initiative +
                  ratings.teachability +
                  ratings.responsibility) /
                6
              ).toFixed(1)
            : '4.8';

          return (
            <div
              key={leader.id}
              onClick={() => setSelectedMember(leader)}
              className="bg-[#173B2D]/40 hover:bg-[#173B2D]/70 border border-white/5 hover:border-[#D4AF37]/40 rounded-3xl p-5 transition cursor-pointer shadow-lg space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#24513B] border border-[#D4AF37]/30 flex items-center justify-center font-black text-[#F3D21A] text-lg shrink-0">
                    {leader.preferred_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                      {leader.full_name}
                    </h3>
                    <span className="text-xs text-[#D4AF37] font-semibold block mt-0.5">
                      {leader.leadership_role}
                    </span>
                    <span className="text-[11px] text-[#AAB8B2] block">
                      {leader.section} • {leader.vocal_part !== 'Not Applicable' ? leader.vocal_part : leader.instrument}
                    </span>
                  </div>
                </div>

                <div className="bg-[#0B1F1C] px-3 py-1.5 rounded-xl border border-[#D4AF37]/30 text-right">
                  <span className="text-[9px] text-[#AAB8B2] uppercase font-bold block">Rating</span>
                  <div className="flex items-center gap-1 text-sm font-black text-[#F3D21A]">
                    <Star className="w-3.5 h-3.5 fill-[#F3D21A]" />
                    <span>{avgScore} / 5</span>
                  </div>
                </div>
              </div>

              {/* 6 Key Competency Bars */}
              {ratings && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] pt-2 border-t border-white/5">
                  <div className="bg-[#0B1F1C]/50 p-2 rounded-xl">
                    <span className="text-[#AAB8B2] block text-[10px]">Reliability</span>
                    <span className="text-white font-bold">{ratings.reliability} / 5</span>
                  </div>
                  <div className="bg-[#0B1F1C]/50 p-2 rounded-xl">
                    <span className="text-[#AAB8B2] block text-[10px]">Musicality</span>
                    <span className="text-white font-bold">{ratings.musical_competence} / 5</span>
                  </div>
                  <div className="bg-[#0B1F1C]/50 p-2 rounded-xl">
                    <span className="text-[#AAB8B2] block text-[10px]">Teamwork</span>
                    <span className="text-white font-bold">{ratings.teamwork} / 5</span>
                  </div>
                  <div className="bg-[#0B1F1C]/50 p-2 rounded-xl">
                    <span className="text-[#AAB8B2] block text-[10px]">Initiative</span>
                    <span className="text-white font-bold">{ratings.initiative} / 5</span>
                  </div>
                  <div className="bg-[#0B1F1C]/50 p-2 rounded-xl">
                    <span className="text-[#AAB8B2] block text-[10px]">Teachability</span>
                    <span className="text-white font-bold">{ratings.teachability} / 5</span>
                  </div>
                  <div className="bg-[#0B1F1C]/50 p-2 rounded-xl">
                    <span className="text-[#AAB8B2] block text-[10px]">Responsibility</span>
                    <span className="text-white font-bold">{ratings.responsibility} / 5</span>
                  </div>
                </div>
              )}

              {ratings?.notes && (
                <p className="text-xs text-[#D4AF37] italic bg-[#0B1F1C]/50 p-2.5 rounded-xl border border-white/5">
                  "{ratings.notes}"
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Member Modal */}
      {selectedMember && (
        <MemberDetailModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}
    </div>
  );
};
