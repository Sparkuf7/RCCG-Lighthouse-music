import React, { useState } from 'react';
import { useMinistry } from '../../context/MinistryContext';
import { AttendanceStatus, CheckinMethod, Member } from '../../types';
import {
  Check,
  Clock,
  XCircle,
  HelpCircle,
  Search,
  Filter,
  QrCode,
  Calendar,
  AlertCircle,
  UserCheck,
  History,
} from 'lucide-react';
import { QRAttendanceModal } from './QRAttendanceModal';

export const ManualAttendanceSheet: React.FC = () => {
  const {
    events,
    members,
    attendanceRecords,
    recordAttendance,
    currentUserRole,
  } = useMinistry();

  const [selectedEventId, setSelectedEventId] = useState<string>(
    events[0]?.id || ''
  );
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [editingReasonMemberId, setEditingReasonMemberId] = useState<string | null>(null);
  const [reasonText, setReasonText] = useState<string>('');

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];

  // Unique sections
  const sections = ['All', 'Sopranos', 'Altos', 'Tenors', 'Band / Rhythm Section', 'Worship Leaders'];

  // Filter members
  const filteredMembers = members.filter((m) => {
    if (m.status === 'ARCHIVED' || m.status === 'INACTIVE') return false;
    if (selectedSection !== 'All' && !m.section.toLowerCase().includes(selectedSection.toLowerCase())) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.full_name.toLowerCase().includes(q) ||
        m.preferred_name.toLowerCase().includes(q) ||
        m.vocal_part.toLowerCase().includes(q) ||
        m.instrument.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Attendance for current event
  const currentEventRecords = attendanceRecords.filter(
    (r) => r.event_id === currentEvent?.id
  );

  const getMemberStatus = (memberId: string): AttendanceStatus | 'unmarked' => {
    const rec = currentEventRecords.find((r) => r.member_id === memberId);
    return rec ? rec.status : 'unmarked';
  };

  const getMemberRecord = (memberId: string) => {
    return currentEventRecords.find((r) => r.member_id === memberId);
  };

  const handleSetStatus = (member: Member, status: AttendanceStatus) => {
    if (currentUserRole === 'MEMBER') {
      alert('Only Attendance Officers, Section Leaders, and Directors can record manual attendance.');
      return;
    }

    if (status === 'excused' || status === 'late') {
      setEditingReasonMemberId(member.id);
      setReasonText('');
    } else {
      recordAttendance(currentEvent.id, member.id, status, 'manual');
    }
  };

  const handleSaveReason = (memberId: string, status: AttendanceStatus) => {
    recordAttendance(currentEvent.id, memberId, status, 'manual', reasonText);
    setEditingReasonMemberId(null);
    setReasonText('');
  };

  // Stats calculation
  const totalExpected = filteredMembers.length;
  const presentCount = filteredMembers.filter((m) => getMemberStatus(m.id) === 'present').length;
  const lateCount = filteredMembers.filter((m) => getMemberStatus(m.id) === 'late').length;
  const absentCount = filteredMembers.filter((m) => getMemberStatus(m.id) === 'absent').length;
  const excusedCount = filteredMembers.filter((m) => getMemberStatus(m.id) === 'excused').length;
  const markedCount = presentCount + lateCount + absentCount + excusedCount;
  const followUpCount = absentCount + (totalExpected - markedCount);

  return (
    <div className="space-y-6">
      {/* Event Selector & Controls Bar */}
      <div className="bg-[#173B2D]/40 border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="w-full md:w-auto">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#AAB8B2] mb-1.5">
            Select Active Ministry Event
          </label>
          <div className="flex items-center gap-2">
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="bg-[#0B1F1C] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-[#D4AF37] min-w-[260px]"
            >
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.date} • {evt.title} ({evt.type})
                </option>
              ))}
            </select>

            {currentEvent && (
              <button
                onClick={() => setShowQrModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#e0bc43] text-[#0B1F1C] font-bold text-xs shadow transition active:scale-95 shrink-0"
              >
                <QrCode className="w-4 h-4" />
                <span>Show Event QR Station</span>
              </button>
            )}
          </div>
        </div>

        {/* Current event info */}
        {currentEvent && (
          <div className="flex items-center gap-3 text-xs text-[#AAB8B2] bg-[#0B1F1C]/60 px-3.5 py-2 rounded-xl border border-white/5">
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
            <div>
              <span className="text-white font-semibold">{currentEvent.title}</span>
              <span className="block text-[11px] text-[#AAB8B2]">
                {currentEvent.date} @ {currentEvent.start_time} - {currentEvent.end_time}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-[#173B2D]/50 border border-white/5 rounded-2xl p-3.5 text-center">
          <span className="text-[10px] uppercase font-bold text-[#AAB8B2] tracking-wider block">
            Expected
          </span>
          <span className="text-xl font-bold text-white">{totalExpected}</span>
        </div>

        <div className="bg-[#173B2D]/50 border border-emerald-500/20 rounded-2xl p-3.5 text-center">
          <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider block">
            Present
          </span>
          <span className="text-xl font-bold text-emerald-400">{presentCount}</span>
        </div>

        <div className="bg-[#173B2D]/50 border border-amber-500/20 rounded-2xl p-3.5 text-center">
          <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">
            Late
          </span>
          <span className="text-xl font-bold text-amber-400">{lateCount}</span>
        </div>

        <div className="bg-[#173B2D]/50 border border-blue-500/20 rounded-2xl p-3.5 text-center">
          <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider block">
            Excused
          </span>
          <span className="text-xl font-bold text-blue-400">{excusedCount}</span>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-[#173B2D]/50 border border-yellow-500/30 rounded-2xl p-3.5 text-center">
          <span className="text-[10px] uppercase font-bold text-[#F3D21A] tracking-wider block">
            Requires Follow-Up
          </span>
          <span className="text-xl font-bold text-[#F3D21A]">{followUpCount}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Section Pill tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {sections.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedSection === sec
                  ? 'bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/50 shadow'
                  : 'bg-[#173B2D]/40 text-[#AAB8B2] hover:text-white border border-white/5'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[200px]">
          <Search className="w-4 h-4 text-[#AAB8B2] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search member name..."
            className="w-full bg-[#173B2D]/40 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#AAB8B2]/50 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Members Attendance Table / Grid */}
      <div className="bg-[#173B2D]/20 border border-white/5 rounded-2xl overflow-hidden shadow-lg">
        <div className="divide-y divide-white/5">
          {filteredMembers.length === 0 ? (
            <div className="p-8 text-center text-[#AAB8B2] text-xs">
              No members found matching the selected filter.
            </div>
          ) : (
            filteredMembers.map((member) => {
              const status = getMemberStatus(member.id);
              const rec = getMemberRecord(member.id);
              const isEditingReason = editingReasonMemberId === member.id;

              return (
                <div
                  key={member.id}
                  className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#173B2D]/40 transition"
                >
                  {/* Left: Member Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#24513B] border border-[#D4AF37]/40 flex items-center justify-center text-xs font-bold text-[#F3D21A] shrink-0">
                      {member.preferred_name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {member.full_name}
                        </h4>
                        {member.leadership_role !== 'None' && (
                          <span className="text-[9px] font-bold text-[#D4AF37] px-1.5 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30">
                            {member.leadership_role}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#AAB8B2] mt-0.5">
                        <span>{member.section}</span>
                        <span>•</span>
                        <span>{member.vocal_part !== 'Not Applicable' ? member.vocal_part : member.instrument}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-medium">
                          {member.attendance_stats.percentage}% record
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status Actions & Audit Info */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Reason input popup if active */}
                    {isEditingReason && (
                      <div className="flex items-center gap-1.5 bg-[#0B1F1C] border border-[#D4AF37] p-1.5 rounded-xl animate-fade-in">
                        <input
                          type="text"
                          value={reasonText}
                          onChange={(e) => setReasonText(e.target.value)}
                          placeholder="Optional note / reason..."
                          className="bg-transparent text-xs text-white px-2 py-1 focus:outline-none w-36 sm:w-44"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveReason(member.id, 'excused')}
                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingReasonMemberId(null)}
                          className="px-2 py-1 bg-white/10 hover:bg-white/20 text-[#AAB8B2] rounded-lg text-[10px]"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {/* Present Button */}
                    <button
                      onClick={() => handleSetStatus(member, 'present')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        status === 'present'
                          ? 'bg-emerald-600 text-white shadow-lg border border-emerald-400'
                          : 'bg-[#173B2D]/70 text-[#AAB8B2] hover:text-white hover:bg-emerald-950/60 border border-white/5'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Present</span>
                    </button>

                    {/* Late Button */}
                    <button
                      onClick={() => handleSetStatus(member, 'late')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        status === 'late'
                          ? 'bg-amber-600 text-white shadow-lg border border-amber-400'
                          : 'bg-[#173B2D]/70 text-[#AAB8B2] hover:text-white hover:bg-amber-950/60 border border-white/5'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Late</span>
                    </button>

                    {/* Absent Button */}
                    <button
                      onClick={() => handleSetStatus(member, 'absent')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        status === 'absent'
                          ? 'bg-rose-700 text-white shadow-lg border border-rose-400'
                          : 'bg-[#173B2D]/70 text-[#AAB8B2] hover:text-white hover:bg-rose-950/60 border border-white/5'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Absent</span>
                    </button>

                    {/* Excused Button */}
                    <button
                      onClick={() => handleSetStatus(member, 'excused')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        status === 'excused'
                          ? 'bg-blue-600 text-white shadow-lg border border-blue-400'
                          : 'bg-[#173B2D]/70 text-[#AAB8B2] hover:text-white hover:bg-blue-950/60 border border-white/5'
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Excused</span>
                    </button>

                    {/* Audit note if recorded */}
                    {rec && (
                      <span className="text-[10px] text-[#AAB8B2] italic ml-1 hidden lg:inline">
                        via {rec.checkin_method} ({new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* QR Modal when requested */}
      {showQrModal && currentEvent && (
        <QRAttendanceModal event={currentEvent} onClose={() => setShowQrModal(false)} />
      )}
    </div>
  );
};
