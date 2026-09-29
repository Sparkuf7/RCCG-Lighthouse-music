import React, { useState } from 'react';
import { useMinistry } from '../../context/MinistryContext';
import { EventItem, EventType } from '../../types';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  QrCode,
  Users,
  Music,
  Plus,
  Sparkles,
} from 'lucide-react';
import { QRAttendanceModal } from '../attendance/QRAttendanceModal';

export const CalendarView: React.FC = () => {
  const { events, addEvent, currentUserRole } = useMinistry();
  const [selectedType, setSelectedType] = useState<string>('All');
  const [activeQrEvent, setActiveQrEvent] = useState<EventItem | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Event Form
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('Rehearsal');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('16:00');
  const [endTime, setEndTime] = useState('18:00');
  const [location, setLocation] = useState('Main Sanctuary, RCCG Lighthouse');
  const [notes, setNotes] = useState('');

  const canManage = currentUserRole === 'MUSIC_DIRECTOR' || currentUserRole === 'SUPER_ADMIN_PASTOR';

  const types = ['All', 'Rehearsal', 'Sunday Service', 'Special Service', 'Training', 'Meeting'];

  const filteredEvents = events.filter((e) => {
    if (selectedType !== 'All' && e.type !== selectedType) return false;
    return true;
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addEvent({
      title: title.trim(),
      type,
      date,
      start_time: startTime,
      end_time: endTime,
      location,
      notes,
      attendance_window_before_mins: 30,
      attendance_window_after_mins: 30,
      assigned_participant_ids: [],
      song_ids: [],
    });

    setShowAddModal(false);
    setTitle('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#173B2D]/40 border border-white/5 p-6 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarIcon className="w-5 h-5 text-[#F3D21A]" />
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              Schedules & Engagements
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Ministry Calendar & Services</h2>
          <p className="text-xs text-[#AAB8B2] mt-0.5">
            Upcoming rehearsals, Sunday services, sectionals, and special programs.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#e0bc43] text-[#0B1F1C] font-extrabold text-xs rounded-xl shadow transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Event</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedType === t
                ? 'bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/50 shadow'
                : 'bg-[#173B2D]/40 text-[#AAB8B2] hover:text-white border border-white/5'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="bg-[#173B2D]/40 border border-white/5 hover:border-[#D4AF37]/40 rounded-3xl p-5 shadow-lg flex flex-col justify-between transition space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/30">
                  {evt.type}
                </span>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    evt.is_attendance_open
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                      : 'bg-white/5 text-[#AAB8B2]'
                  }`}
                >
                  {evt.is_attendance_open ? 'Check-in Open' : 'Scheduled'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{evt.title}</h3>
                <div className="space-y-1 text-xs text-[#AAB8B2] mt-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{evt.date} @ {evt.start_time} - {evt.end_time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{evt.location}</span>
                  </div>
                </div>
              </div>

              {evt.notes && (
                <p className="text-xs text-[#AAB8B2] bg-[#0B1F1C]/60 p-3 rounded-2xl border border-white/5 leading-relaxed">
                  {evt.notes}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] text-[#AAB8B2]">
                {evt.assigned_participant_ids?.length || 0} Expected
              </span>

              <button
                onClick={() => setActiveQrEvent(evt)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#e0bc43] text-[#0B1F1C] font-bold text-xs shadow transition active:scale-95"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Station</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* QR Modal */}
      {activeQrEvent && (
        <QRAttendanceModal event={activeQrEvent} onClose={() => setActiveQrEvent(null)} />
      )}

      {/* Schedule Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg bg-[#0B1F1C] border border-[#D4AF37]/40 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Schedule Ministry Event</h3>
            <p className="text-xs text-[#AAB8B2] mb-4">
              Create a rehearsal, Sunday service, training workshop, or outreach program.
            </p>

            <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#AAB8B2] font-semibold mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Saturday Choir & Band Rehearsal"
                  className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-[#AAB8B2]/50 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">Event Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as EventType)}
                    className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Rehearsal">Rehearsal</option>
                    <option value="Sunday Service">Sunday Service</option>
                    <option value="Special Service">Special Service</option>
                    <option value="Training">Training</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Outreach">Outreach</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">Event Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#AAB8B2] font-semibold mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Main Church Auditorium"
                  className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#AAB8B2] font-semibold mb-1">Notes / Instructions</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes on attire, sheet music preparation, soundcheck time..."
                  className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-[#AAB8B2]/50 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-[#AAB8B2] font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D4AF37] hover:bg-[#e0bc43] text-[#0B1F1C] font-bold rounded-xl shadow"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
