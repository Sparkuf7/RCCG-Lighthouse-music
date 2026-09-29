import React, { useState } from 'react';
import { useMinistry } from '../../context/MinistryContext';
import {
  Calendar,
  Clock,
  Music,
  Target,
  Sparkles,
  QrCode,
  CheckCircle2,
  Bell,
  BookOpen,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { MemberQRScanner } from '../attendance/MemberQRScanner';
import { SongDetailModal } from '../repertoire/SongDetailModal';
import { Song } from '../../types';

interface MemberDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenQRScanner: () => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  onNavigateTab,
  onOpenQRScanner,
}) => {
  const {
    currentMember,
    events,
    songs,
    developmentGoals,
    announcements,
    attendanceRecords,
  } = useMinistry();

  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'GOOD MORNING' : hour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING';

  // Next event member is assigned to
  const myEvents = events.filter(
    (e) =>
      !e.assigned_participant_ids ||
      e.assigned_participant_ids.length === 0 ||
      e.assigned_participant_ids.includes(currentMember.id)
  );
  const nextEvent = myEvents[0] || events[0];

  // My development goals
  const myGoals = developmentGoals.filter((g) => g.member_id === currentMember.id);

  // My songs for next event
  const eventSongIds = nextEvent?.song_ids || [];
  const myAssignedSongs = songs.filter((s) => eventSongIds.includes(s.id));

  // My recent attendance records
  const myRecentAttendance = attendanceRecords.filter(
    (r) => r.member_id === currentMember.id
  );

  return (
    <div className="space-y-6">
      {/* Mobile-friendly Welcome Card with QR Check-in Trigger */}
      <div className="bg-gradient-to-r from-[#173B2D] via-[#102d23] to-[#0B1F1C] border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#F3D21A] animate-pulse" />
              <span className="text-xs font-bold tracking-[0.2em] text-[#D4AF37] uppercase">
                {currentMember.section} • {currentMember.vocal_part !== 'Not Applicable' ? currentMember.vocal_part : currentMember.instrument}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {greeting}, {currentMember.preferred_name?.toUpperCase() || 'MEMBER'}
            </h1>
            <p className="text-xs sm:text-sm text-[#AAB8B2] mt-1 max-w-md">
              Welcome to your personal ministry portal. Practice well, minister with love, and let your light shine!
            </p>
          </div>

          {/* Big Quick Check-In CTA for Android / Phone */}
          <button
            onClick={onOpenQRScanner}
            className="flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#F3D21A] hover:brightness-105 text-[#0B1F1C] font-extrabold text-sm rounded-2xl shadow-xl transition transform active:scale-95 shrink-0"
          >
            <QrCode className="w-5 h-5 text-[#0B1F1C]" />
            <span>Scan QR to Check In</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Next Event */}
        <div className="bg-[#173B2D]/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#AAB8B2] text-xs mb-2">
            <span className="uppercase font-bold text-[10px] tracking-wider">Next Event</span>
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div>
            <span className="text-sm sm:text-base font-bold text-white block truncate">
              {nextEvent?.title.split(' ')[0]} {nextEvent?.type}
            </span>
            <span className="text-xs text-[#F3D21A] font-semibold mt-0.5 block">
              {nextEvent?.date} @ {nextEvent?.start_time}
            </span>
          </div>
        </div>

        {/* My Attendance */}
        <div className="bg-[#173B2D]/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#AAB8B2] text-xs mb-2">
            <span className="uppercase font-bold text-[10px] tracking-wider">My Attendance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-2xl font-black text-emerald-400">
              {currentMember.attendance_stats?.percentage || 92}%
            </span>
            <span className="text-[10px] text-[#AAB8B2] block mt-0.5">
              {currentMember.attendance_stats?.present || 0} Present • {currentMember.attendance_stats?.late || 0} Late
            </span>
          </div>
        </div>

        {/* My Songs */}
        <div className="bg-[#173B2D]/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#AAB8B2] text-xs mb-2">
            <span className="uppercase font-bold text-[10px] tracking-wider">Repertoire</span>
            <Music className="w-4 h-4 text-[#F3D21A]" />
          </div>
          <div>
            <span className="text-2xl font-black text-white">
              {myAssignedSongs.length > 0 ? myAssignedSongs.length : songs.length}
            </span>
            <span className="text-[10px] text-[#AAB8B2] block mt-0.5">Songs assigned</span>
          </div>
        </div>

        {/* My Development */}
        <div className="bg-[#173B2D]/40 border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#AAB8B2] text-xs mb-2">
            <span className="uppercase font-bold text-[10px] tracking-wider">Development</span>
            <Target className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div>
            <span className="text-sm font-bold text-white block truncate">
              {myGoals[0]?.category || 'Vocal Harmony'}
            </span>
            <span className="text-[10px] text-[#D4AF37] font-semibold mt-0.5 block">
              {myGoals[0]?.status || 'In Progress'}
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Assigned Songs for Next Event */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#173B2D]/40 border border-white/5 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-[#F3D21A]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Repertoire for {nextEvent?.title || 'Next Event'}
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('repertoire')}
                className="text-xs text-[#D4AF37] hover:underline font-semibold"
              >
                All Songs ({songs.length})
              </button>
            </div>

            <p className="text-xs text-[#AAB8B2] mb-4">
              Tap any song to open lyrics, key, arrangement directions, and vocal coaching notes.
            </p>

            <div className="space-y-3">
              {(myAssignedSongs.length > 0 ? myAssignedSongs : songs.slice(0, 3)).map((song) => (
                <div
                  key={song.id}
                  onClick={() => setSelectedSong(song)}
                  className="p-3.5 rounded-2xl bg-[#0B1F1C]/60 hover:bg-[#0B1F1C] border border-white/5 hover:border-[#D4AF37]/40 transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#24513B] border border-[#D4AF37]/30 flex flex-col items-center justify-center font-bold text-[#F3D21A] text-xs shrink-0 group-hover:scale-105 transition">
                      <span className="text-[9px] text-[#AAB8B2] leading-none uppercase">Key</span>
                      <span className="text-sm leading-none mt-0.5">{song.key}</span>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#F3D21A] transition">
                        {song.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-[#AAB8B2] mt-0.5">
                        <span>{song.artist}</span>
                        <span>•</span>
                        <span>{song.tempo_bpm} BPM</span>
                        <span>•</span>
                        <span className="text-[#D4AF37]">{song.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-semibold">
                    <span className="hidden sm:inline text-[11px]">View Notes</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MY PERSONAL DEVELOPMENT GOALS */}
          <div className="bg-[#173B2D]/40 border border-white/5 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  My Development Goals
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('development')}
                className="text-xs text-[#D4AF37] hover:underline font-semibold"
              >
                Development Hub
              </button>
            </div>

            {myGoals.length > 0 ? (
              <div className="space-y-3">
                {myGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="p-4 rounded-2xl bg-[#0B1F1C]/60 border border-white/5 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/30">
                        {goal.category}
                      </span>
                      <span className="text-xs font-semibold text-emerald-400">
                        {goal.status}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-white">{goal.goal_title}</h4>
                    <p className="text-xs text-[#AAB8B2] leading-relaxed">
                      <strong className="text-white">Action:</strong> {goal.target_action}
                    </p>

                    {goal.notes && (
                      <p className="text-[11px] text-[#D4AF37] italic bg-[#173B2D]/40 p-2 rounded-xl border border-white/5">
                        Feedback: "{goal.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-[#AAB8B2] bg-[#0B1F1C]/40 rounded-2xl border border-white/5">
                <Sparkles className="w-6 h-6 text-[#D4AF37] mx-auto mb-2" />
                <p className="font-semibold text-white">Your Development Plan is Being Formulated</p>
                <p className="text-[11px] text-[#AAB8B2] mt-1">
                  Music Director David Okon will assign your specific sectional goals during the next rehearsal.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Announcements & Ministry Schedule */}
        <div className="lg:col-span-5 space-y-6">
          {/* MINISTRY ANNOUNCEMENTS */}
          <div className="bg-[#173B2D]/40 border border-white/5 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#F3D21A]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Ministry Announcements
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-4 rounded-2xl bg-[#0B1F1C]/60 border border-white/5 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-white">{ann.title}</h5>
                    <span className="text-[10px] text-[#AAB8B2]">{ann.date}</span>
                  </div>
                  <p className="text-xs text-[#AAB8B2] leading-relaxed">{ann.content}</p>
                  <span className="text-[10px] text-[#D4AF37] block font-semibold pt-1">
                    — {ann.author}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* MY RECENT ATTENDANCE HISTORY */}
          <div className="bg-[#173B2D]/40 border border-white/5 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  My Recent Check-Ins
                </h3>
              </div>
            </div>

            <div className="space-y-2">
              {myRecentAttendance.slice(0, 4).map((rec) => {
                const evt = events.find((e) => e.id === rec.event_id);
                return (
                  <div
                    key={rec.id}
                    className="p-3 rounded-xl bg-[#0B1F1C]/50 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-white block">
                        {evt?.title || 'Ministry Session'}
                      </span>
                      <span className="text-[10px] text-[#AAB8B2]">
                        {new Date(rec.timestamp).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        via {rec.checkin_method}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        rec.status === 'present'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                          : 'bg-amber-950 text-amber-300 border border-amber-700/50'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Song Detail Modal when clicked */}
      {selectedSong && (
        <SongDetailModal song={selectedSong} onClose={() => setSelectedSong(null)} />
      )}
    </div>
  );
};
