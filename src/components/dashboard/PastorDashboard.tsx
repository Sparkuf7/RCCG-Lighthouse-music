import React from 'react';
import { useMinistry } from '../../context/MinistryContext';
import {
  Target,
  Users,
  TrendingUp,
  HeartHandshake,
  Award,
  Sparkles,
  Calendar,
  CheckCircle,
  FileText,
  UserCheck,
  Compass,
} from 'lucide-react';
import { LighthouseLogo } from '../brand/LighthouseLogo';

interface PastorDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const PastorDashboard: React.FC<PastorDashboardProps> = ({ onNavigateTab }) => {
  const {
    members,
    prospects,
    events,
    attendanceRecords,
    settings,
    developmentGoals,
  } = useMinistry();

  const activeMembers = members.filter((m) => m.status === 'ACTIVE_MEMBER');
  const developingMembers = members.filter((m) => m.status === 'DEVELOPING');
  const targetCount = settings.target_active_members || 30;
  const targetPct = Math.round((activeMembers.length / targetCount) * 100);

  // Church connection breakdown (how music ministry attracts people to Lighthouse)
  const connectionCounts = members.reduce((acc, m) => {
    const key = m.church_connection || 'Existing Lighthouse Member';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Attendance health rate
  const totalAttended = attendanceRecords.filter((r) => r.status === 'present' || r.status === 'late').length;
  const overallAttendanceRate =
    attendanceRecords.length > 0
      ? Math.round((totalAttended / attendanceRecords.length) * 100)
      : 94;

  // Leadership development candidates
  const leaders = members.filter((m) => m.leadership_ratings || m.leadership_role !== 'None');

  return (
    <div className="space-y-6">
      {/* Pastoral Greeting Banner */}
      <div className="bg-gradient-to-r from-[#173B2D] via-[#123024] to-[#0B1F1C] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold tracking-[0.25em] text-[#D4AF37] uppercase block">
              Senior Pastor Executive Overview
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Music Ministry Health & Growth
            </h1>
            <p className="text-xs sm:text-sm text-[#AAB8B2] max-w-xl">
              High-level spiritual and developmental vitality of the RCCG Lighthouse music ensemble.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateTab('reports')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#e0bc43] text-[#0B1F1C] font-extrabold text-xs shadow-lg transition"
            >
              <FileText className="w-4 h-4" />
              <span>Full Ministry Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* 30-MEMBER TARGET OVERVIEW (EXECUTIVE) */}
      <div className="bg-[#173B2D]/40 border border-[#D4AF37]/30 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
              <Target className="w-4 h-4 text-[#F3D21A]" />
              <span>Strategic Target Progress</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              {activeMembers.length} / {targetCount} Active Committed Members
            </h2>
            <p className="text-xs text-[#AAB8B2] mt-0.5">
              Target of at least 30 grounded worshippers advancing smoothly with {developingMembers.length} currently in development.
            </p>
          </div>

          <div className="text-right">
            <span className="text-3xl font-black text-[#F3D21A]">{targetPct}%</span>
            <span className="block text-[11px] text-[#AAB8B2] font-semibold uppercase">
              Target Attainment
            </span>
          </div>
        </div>

        <div className="w-full bg-[#0B1F1C] h-3.5 rounded-full overflow-hidden p-0.5 border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#24513B] via-[#D4AF37] to-[#F3D21A] rounded-full transition-all duration-700"
            style={{ width: `${targetPct}%` }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/5 text-center">
          <div className="bg-[#0B1F1C]/40 p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] uppercase font-bold text-[#AAB8B2] block">
              Active Choir & Band
            </span>
            <span className="text-xl font-bold text-white">{activeMembers.length}</span>
          </div>

          <div className="bg-[#0B1F1C]/40 p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] uppercase font-bold text-[#D4AF37] block">
              In Development
            </span>
            <span className="text-xl font-bold text-[#F3D21A]">{developingMembers.length}</span>
          </div>

          <div className="bg-[#0B1F1C]/40 p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] uppercase font-bold text-emerald-300 block">
              Recruitment Pipeline
            </span>
            <span className="text-xl font-bold text-emerald-400">
              {prospects.filter((p) => p.current_stage !== 'ACTIVE_MEMBER').length}
            </span>
          </div>

          <div className="bg-[#0B1F1C]/40 p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] uppercase font-bold text-blue-300 block">
              Attendance Health
            </span>
            <span className="text-xl font-bold text-blue-400">{overallAttendanceRate}%</span>
          </div>
        </div>
      </div>

      {/* 2-Column High-Level Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHURCH CONNECTION / OUTREACH IMPACT */}
        <div className="bg-[#173B2D]/40 border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-[#F3D21A]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Church Connection & Growth Impact
              </h3>
            </div>
            <span className="text-xs text-[#D4AF37] font-semibold">How People Connect</span>
          </div>

          <p className="text-xs text-[#AAB8B2] leading-relaxed">
            Music ministry serves as an evangelistic and welcoming pathway into RCCG Lighthouse. Current member origin distribution:
          </p>

          <div className="space-y-2.5">
            {Object.entries(connectionCounts).map(([source, count]) => {
              const pct = Math.round((count / members.length) * 100);
              return (
                <div key={source} className="p-3 rounded-xl bg-[#0B1F1C]/50 border border-white/5">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-white">{source}</span>
                    <span className="font-bold text-[#F3D21A]">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#173B2D] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#24513B] to-[#D4AF37] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* LEADERSHIP PIPELINE & DEVELOPMENT VITALITY */}
        <div className="bg-[#173B2D]/40 border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Leadership Progression
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('leadership')}
              className="text-xs text-[#D4AF37] hover:underline font-semibold"
            >
              View Pipeline
            </button>
          </div>

          <p className="text-xs text-[#AAB8B2] leading-relaxed">
            Key appointed and emerging leaders tracked by Music Director on character, reliability, musical competence, and teachability:
          </p>

          <div className="space-y-2.5">
            {leaders.slice(0, 4).map((leader) => (
              <div
                key={leader.id}
                className="p-3 rounded-xl bg-[#0B1F1C]/50 border border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#24513B] border border-[#D4AF37]/40 flex items-center justify-center text-xs font-bold text-[#F3D21A]">
                    {leader.preferred_name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{leader.full_name}</h5>
                    <span className="text-[10px] text-[#AAB8B2]">{leader.leadership_role}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/40">
                    Active Leader
                  </span>
                  <span className="block text-[9px] text-[#AAB8B2] mt-0.5">
                    {leader.section}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* UPCOMING MAJOR MINISTRY CALENDAR */}
      <div className="bg-[#173B2D]/40 border border-white/5 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#F3D21A]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Upcoming Ministry Engagements
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('events')}
            className="text-xs text-[#D4AF37] hover:underline font-semibold"
          >
            All Events
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.slice(0, 3).map((evt) => (
            <div
              key={evt.id}
              className="p-4 rounded-2xl bg-[#0B1F1C]/60 border border-white/5 space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/30 uppercase">
                  {evt.type}
                </span>
                <h4 className="text-sm font-bold text-white mt-2 leading-tight">{evt.title}</h4>
                <p className="text-xs text-[#AAB8B2] mt-1">
                  {evt.date} • {evt.start_time} - {evt.end_time}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 text-[11px] text-[#D4AF37] flex items-center justify-between">
                <span>{evt.assigned_participant_ids?.length || 0} Expected</span>
                <span>{evt.location.split(',')[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
