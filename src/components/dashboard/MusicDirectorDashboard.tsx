import React, { useState } from 'react';
import { useMinistry } from '../../context/MinistryContext';
import {
  Users,
  Target,
  Calendar,
  CheckCircle2,
  Clock,
  UserPlus,
  TrendingUp,
  Award,
  Sparkles,
  Music,
  ArrowRight,
  AlertCircle,
  QrCode,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { QRAttendanceModal } from '../attendance/QRAttendanceModal';
import { EventItem } from '../../types';

interface MusicDirectorDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenQRScanner: () => void;
}

export const MusicDirectorDashboard: React.FC<MusicDirectorDashboardProps> = ({
  onNavigateTab,
  onOpenQRScanner,
}) => {
  const {
    currentMember,
    members,
    prospects,
    events,
    attendanceRecords,
    settings,
    songs,
    developmentGoals,
  } = useMinistry();

  const [activeQrEvent, setActiveQrEvent] = useState<EventItem | null>(null);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'GOOD MORNING';
    if (hour < 17) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
  };

  const activeMembers = members.filter((m) => m.status === 'ACTIVE_MEMBER');
  const developingMembers = members.filter((m) => m.status === 'DEVELOPING');
  const targetCount = settings.target_active_members || 30;
  const targetPct = Math.min(100, Math.round((activeMembers.length / targetCount) * 100));

  const upcomingEvent = events[0];
  const upcomingEventAttendance = upcomingEvent
    ? attendanceRecords.filter((r) => r.event_id === upcomingEvent.id)
    : [];

  const presentCount = upcomingEventAttendance.filter((r) => r.status === 'present').length;
  const lateCount = upcomingEventAttendance.filter((r) => r.status === 'late').length;
  const expectedCount = upcomingEvent?.assigned_participant_ids?.length || members.length;
  const pendingCount = Math.max(0, expectedCount - (presentCount + lateCount));

  // Prospects summary by stage
  const prospectsList = prospects.filter((p) => p.current_stage !== 'ACTIVE_MEMBER');
  const followUpNeeded = prospectsList.filter((p) => {
    if (!p.follow_up_date) return false;
    const diff = new Date(p.follow_up_date).getTime() - new Date().getTime();
    return diff <= 3 * 24 * 60 * 60 * 1000; // within 3 days or overdue
  });

  // Members requiring attendance follow-up
  const membersNeedingFollowUp = members.filter(
    (m) => m.status === 'ACTIVE_MEMBER' && m.attendance_stats.percentage < 85
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#173B2D] via-[#102d23] to-[#0B1F1C] border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#F3D21A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-[#D4AF37] uppercase block mb-1">
              Music Ministry Management & Development System
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {getGreeting()}, {currentMember?.preferred_name?.toUpperCase() || 'DIRECTOR'}
            </h1>
            <p className="text-xs sm:text-sm text-[#AAB8B2] mt-1 max-w-xl">
              Equipping every musician and singer for spiritual impact and musical excellence at RCCG Lighthouse.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {upcomingEvent && (
              <button
                onClick={() => setActiveQrEvent(upcomingEvent)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#e6bf3e] text-[#0B1F1C] font-extrabold text-xs shadow-lg transition active:scale-95"
              >
                <QrCode className="w-4 h-4 text-[#0B1F1C]" />
                <span>Open QR Station</span>
              </button>
            )}

            <button
              onClick={() => onNavigateTab('recruitment')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#24513B] hover:bg-[#1f4532] border border-[#D4AF37]/40 text-xs font-bold text-[#F3D21A] transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>Pipeline ({prospectsList.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 30-MEMBER TARGET HERO CARD */}
      <div className="bg-[#173B2D]/50 border border-[#D4AF37]/40 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-1">
              <Target className="w-4 h-4 text-[#F3D21A]" />
              <span>30-Member Ministry Target</span>
            </div>

            <div className="flex items-baseline gap-3 my-2">
              <span className="text-3xl sm:text-4xl font-black text-white">
                {activeMembers.length}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[#AAB8B2]">
                / {targetCount} Active Members
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/30 ml-2">
                {targetPct}% Achieved
              </span>
            </div>

            {/* Target Progress Bar */}
            <div className="w-full bg-[#0B1F1C] h-3 rounded-full overflow-hidden p-0.5 border border-white/10 my-3">
              <div
                className="h-full bg-gradient-to-r from-[#24513B] via-[#D4AF37] to-[#F3D21A] rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(243,210,26,0.4)]"
                style={{ width: `${targetPct}%` }}
              />
            </div>

            {/* Developmental Progression Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3 border-t border-white/5 text-center">
              <div className="bg-[#0B1F1C]/50 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-[#AAB8B2] block">
                  Active
                </span>
                <span className="text-base font-extrabold text-white">{activeMembers.length}</span>
              </div>
              <div className="bg-[#0B1F1C]/50 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-[#D4AF37] block">
                  Developing
                </span>
                <span className="text-base font-extrabold text-[#F3D21A]">
                  {developingMembers.length}
                </span>
              </div>
              <div className="bg-[#0B1F1C]/50 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                  Pipeline
                </span>
                <span className="text-base font-extrabold text-emerald-400">
                  {prospectsList.length}
                </span>
              </div>
              <div className="bg-[#0B1F1C]/50 p-2.5 rounded-xl border border-white/5">
                <span className="text-[10px] uppercase font-bold text-[#AAB8B2] block">
                  Needed
                </span>
                <span className="text-base font-extrabold text-[#AAB8B2]">
                  {Math.max(0, targetCount - activeMembers.length)}
                </span>
              </div>
            </div>
          </div>

          {/* Guiding Philosophy Quote Box */}
          <div className="lg:w-80 bg-[#0B1F1C]/80 border border-[#D4AF37]/30 rounded-2xl p-4.5 text-xs text-[#AAB8B2] flex flex-col justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#F3D21A] block mb-2">
              Ministry Development Principle
            </span>
            <p className="text-[11px] leading-relaxed text-[#F7F7F2] font-medium italic">
              "Strong Individuals → Strong Ensemble → Strong Music Ministry → More People Attracted & Developed → More Leaders → Stronger Church Connection."
            </p>
            <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-[#D4AF37]">
              <span>Growth with depth & character</span>
              <Sparkles className="w-3 h-3 text-[#F3D21A]" />
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Upcoming Event & Attendance & Focus */}
        <div className="lg:col-span-8 space-y-6">
          {/* UPCOMING EVENT & ATTENDANCE CARD */}
          {upcomingEvent && (
            <div className="bg-[#173B2D]/40 border border-white/5 rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#F3D21A]" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Next Ministry Event
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/30">
                  {upcomingEvent.type}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0B1F1C]/60 border border-white/5">
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {upcomingEvent.title}
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-[#AAB8B2] mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {upcomingEvent.date} @ {upcomingEvent.start_time} - {upcomingEvent.end_time}
                    </span>
                    <span>•</span>
                    <span>{upcomingEvent.location.split(',')[0]}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveQrEvent(upcomingEvent)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#e6bf3e] text-[#0B1F1C] font-bold text-xs shadow transition"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Station</span>
                  </button>
                  <button
                    onClick={() => onNavigateTab('attendance')}
                    className="px-3 py-2 rounded-xl bg-[#24513B] hover:bg-[#1f4532] text-white font-semibold text-xs border border-white/10 transition"
                  >
                    Manage Roll
                  </button>
                </div>
              </div>

              {/* Attendance metrics */}
              <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                <div className="bg-[#0B1F1C]/40 p-3 rounded-xl border border-emerald-500/20">
                  <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                    Present
                  </span>
                  <span className="text-xl font-bold text-emerald-400">{presentCount}</span>
                </div>
                <div className="bg-[#0B1F1C]/40 p-3 rounded-xl border border-amber-500/20">
                  <span className="text-[10px] uppercase font-bold text-amber-300 block">
                    Late
                  </span>
                  <span className="text-xl font-bold text-amber-400">{lateCount}</span>
                </div>
                <div className="bg-[#0B1F1C]/40 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-[#AAB8B2] block">
                    Pending
                  </span>
                  <span className="text-xl font-bold text-[#AAB8B2]">{pendingCount}</span>
                </div>
              </div>
            </div>
          )}

          {/* THIS WEEK'S FOCUS CARD */}
          <div className="bg-[#173B2D]/40 border border-white/5 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F3D21A]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  This Week's Ministry Focus
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('rehearsals')}
                className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Rehearsal Review</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3">
              {settings.weekly_focus.map((focus) => (
                <div
                  key={focus}
                  className="bg-[#24513B]/50 border border-[#D4AF37]/30 p-3 rounded-2xl text-center shadow-sm"
                >
                  <span className="text-xs font-bold text-[#F3D21A]">{focus}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-[#AAB8B2] leading-relaxed mt-2 bg-[#0B1F1C]/50 p-3.5 rounded-xl border border-white/5">
              <strong className="text-white">Music Director's Note:</strong> We are drilling dynamic contrast on the verses of Total Praise and tightening the rhythm section pocket for Communion ministration. Ensure section leaders warm up their parts thoroughly before full ensemble run-through.
            </p>
          </div>
        </div>

        {/* Right Column (4 cols): Recruitment Follow-up & Development */}
        <div className="lg:col-span-4 space-y-6">
          {/* RECRUITMENT PIPELINE SUMMARY */}
          <div className="bg-[#173B2D]/40 border border-white/5 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#F3D21A]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Recruitment Pipeline
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('recruitment')}
                className="text-xs text-[#D4AF37] hover:underline font-semibold"
              >
                View Kanban
              </button>
            </div>

            <div className="space-y-2.5">
              {prospectsList.slice(0, 4).map((prospect) => (
                <div
                  key={prospect.id}
                  className="p-3 rounded-xl bg-[#0B1F1C]/60 border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <h5 className="text-xs font-bold text-white">{prospect.name}</h5>
                    <p className="text-[10px] text-[#AAB8B2]">{prospect.interested_role}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/20 uppercase">
                    {prospect.current_stage}
                  </span>
                </div>
              ))}
            </div>

            {followUpNeeded.length > 0 && (
              <div className="mt-4 p-3 rounded-xl bg-amber-950/50 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Follow-Up Due ({followUpNeeded.length})</span>
                  <span className="text-[11px] text-amber-300/80">
                    Reach out to {followUpNeeded[0]?.name} before their scheduled date.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* MEMBERS REQUIRING ATTENTION / FOLLOW-UP */}
          <div className="bg-[#173B2D]/40 border border-white/5 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#D69E2E]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Care & Follow-Up
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('members')}
                className="text-xs text-[#D4AF37] hover:underline font-semibold"
              >
                Members
              </button>
            </div>

            <p className="text-[11px] text-[#AAB8B2] mb-3">
              Attendance and development encouragement (pastoral care, not reprimand):
            </p>

            <div className="space-y-2">
              {membersNeedingFollowUp.length > 0 ? (
                membersNeedingFollowUp.map((m) => (
                  <div
                    key={m.id}
                    className="p-2.5 rounded-xl bg-[#0B1F1C]/60 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-white">{m.full_name}</span>
                      <span className="text-[10px] text-[#AAB8B2] block">{m.section}</span>
                    </div>
                    <span className="text-[11px] font-bold text-amber-400">
                      {m.attendance_stats.percentage}%
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-emerald-400 font-medium">
                  ✓ All active members have healthy attendance records!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* QR Station Modal */}
      {activeQrEvent && (
        <QRAttendanceModal event={activeQrEvent} onClose={() => setActiveQrEvent(null)} />
      )}
    </div>
  );
};
