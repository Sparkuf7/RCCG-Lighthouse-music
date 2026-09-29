import React, { useState } from 'react';
import { useMinistry } from '../../context/MinistryContext';
import { EventItem, OrderOfService } from '../../types';
import {
  Calendar,
  Clock,
  Sparkles,
  Music,
  Users,
  CheckCircle2,
  QrCode,
  Shield,
  Edit2,
  FileText,
} from 'lucide-react';
import { QRAttendanceModal } from '../attendance/QRAttendanceModal';
import { SongDetailModal } from '../repertoire/SongDetailModal';
import { Song } from '../../types';

export const ServiceManager: React.FC = () => {
  const { events, updateEvent, songs, members, currentUserRole, currentMember } = useMinistry();
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    events.find((e) => e.type === 'Sunday Service' || e.type === 'Special Service')?.id || events[0]?.id || ''
  );
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const canManage = currentUserRole === 'MUSIC_DIRECTOR' || currentUserRole === 'SUPER_ADMIN_PASTOR';

  // Services filter
  const services = events.filter((e) => e.type === 'Sunday Service' || e.type === 'Special Service');
  const currentService = services.find((e) => e.id === selectedServiceId) || services[0];

  const assignedSongs = songs.filter((s) => currentService?.song_ids?.includes(s.id));
  const order = currentService?.order_of_service;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#173B2D]/40 border border-white/5 p-6 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-[#F3D21A]" />
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              Liturgical Order & Ministration
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Sunday & Special Service Operations</h2>
          <p className="text-xs text-[#AAB8B2] mt-0.5">
            Coordination of praise, worship, choir presentations, and instrumentalist roster.
          </p>
        </div>

        {currentService && (
          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#e0bc43] text-[#0B1F1C] font-extrabold text-xs rounded-xl shadow transition shrink-0"
          >
            <QrCode className="w-4 h-4" />
            <span>Service Check-In Station</span>
          </button>
        )}
      </div>

      {/* Service Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {services.map((svc) => (
          <button
            key={svc.id}
            onClick={() => setSelectedServiceId(svc.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              selectedServiceId === svc.id
                ? 'bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/50 shadow-md'
                : 'bg-[#173B2D]/30 text-[#AAB8B2] hover:text-white border border-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{svc.date} • {svc.title}</span>
          </button>
        ))}
      </div>

      {currentService && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Order of Service and Assignments */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#173B2D]/40 border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/30">
                    {currentService.type}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">{currentService.title}</h3>
                  <p className="text-xs text-[#AAB8B2] mt-0.5">
                    {currentService.date} @ {currentService.start_time} - {currentService.end_time} • {currentService.location}
                  </p>
                </div>
              </div>

              {currentService.notes && (
                <div className="p-3.5 rounded-2xl bg-[#0B1F1C]/60 border border-white/5 text-xs text-[#AAB8B2]">
                  <strong className="text-white">Service Briefing:</strong> {currentService.notes}
                </div>
              )}

              {/* Order of Service Details */}
              <div className="border-t border-white/5 pt-4 space-y-3">
                <span className="text-xs font-bold uppercase text-[#D4AF37] block">
                  Service Flow & Responsibilities
                </span>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#0B1F1C]/70 border border-white/5 flex items-center justify-between">
                    <span className="text-[#AAB8B2]">Opening Prayer & Exhortation</span>
                    <span className="font-bold text-white">{order?.opening_prayer || 'Pastor Daniel Adeleke'}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1F1C]/70 border border-white/5 flex items-center justify-between">
                    <span className="text-[#AAB8B2]">Praise Ministration Leader</span>
                    <span className="font-bold text-[#F3D21A]">{order?.praise_leader || 'Blessing Eze'}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1F1C]/70 border border-white/5 flex items-center justify-between">
                    <span className="text-[#AAB8B2]">Worship Ministration Leader</span>
                    <span className="font-bold text-[#F3D21A]">{order?.worship_leader || 'David Okon'}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0B1F1C]/70 border border-white/5 flex items-center justify-between">
                    <span className="text-[#AAB8B2]">Choir Presentation</span>
                    <span className="font-bold text-white">{order?.special_ministration || 'Total Praise — Lighthouse Choir'}</span>
                  </div>
                </div>
              </div>

              {/* Instrumental Section Assignments */}
              <div className="border-t border-white/5 pt-4 space-y-3">
                <span className="text-xs font-bold uppercase text-[#D4AF37] block">
                  Band & Technical Deployment
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#0B1F1C]/70 border border-white/5">
                    <span className="text-[10px] text-[#AAB8B2] uppercase font-bold block">Keys / Piano</span>
                    <span className="font-semibold text-white">{order?.keyboardist || 'David Okon & Gabriel Martins'}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#0B1F1C]/70 border border-white/5">
                    <span className="text-[10px] text-[#AAB8B2] uppercase font-bold block">Bass Guitar</span>
                    <span className="font-semibold text-white">{order?.bass_player || 'Samuel Chukwu'}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#0B1F1C]/70 border border-white/5">
                    <span className="text-[10px] text-[#AAB8B2] uppercase font-bold block">Drums</span>
                    <span className="font-semibold text-white">{order?.drummer || 'Emmanuel Tobi'}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#0B1F1C]/70 border border-white/5">
                    <span className="text-[10px] text-[#AAB8B2] uppercase font-bold block">Lead Guitar</span>
                    <span className="font-semibold text-white">{order?.lead_guitarist || 'Kofi Mensah'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Service Song List */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#173B2D]/40 border border-white/5 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-[#F3D21A]" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Service Setlist
                  </h3>
                </div>
                <span className="text-xs text-[#D4AF37] font-semibold">
                  {assignedSongs.length} Songs Selected
                </span>
              </div>

              <div className="space-y-3">
                {assignedSongs.map((song, idx) => (
                  <div
                    key={song.id}
                    onClick={() => setSelectedSong(song)}
                    className="p-3.5 rounded-2xl bg-[#0B1F1C]/70 hover:bg-[#0B1F1C] border border-white/5 hover:border-[#D4AF37]/40 transition cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#AAB8B2] w-4">{idx + 1}.</span>
                      <div className="w-9 h-9 rounded-xl bg-[#24513B] border border-[#D4AF37]/30 flex items-center justify-center font-bold text-xs text-[#F3D21A]">
                        {song.key}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#F3D21A] transition">
                          {song.title}
                        </h4>
                        <span className="text-[10px] text-[#AAB8B2]">
                          {song.tempo_bpm} BPM • {song.category}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-[#D4AF37] group-hover:translate-x-1 transition">
                      View →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {showQrModal && currentService && (
        <QRAttendanceModal event={currentService} onClose={() => setShowQrModal(false)} />
      )}

      {/* Song Modal */}
      {selectedSong && (
        <SongDetailModal song={selectedSong} onClose={() => setSelectedSong(null)} />
      )}
    </div>
  );
};
