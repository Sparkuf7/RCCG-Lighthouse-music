import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { EventItem } from '../../types';
import { useMinistry } from '../../context/MinistryContext';
import {
  X,
  Maximize2,
  Minimize2,
  RefreshCw,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { LighthouseLogo } from '../brand/LighthouseLogo';

interface QRAttendanceModalProps {
  event: EventItem;
  onClose: () => void;
}

export const QRAttendanceModal: React.FC<QRAttendanceModalProps> = ({ event, onClose }) => {
  const {
    attendanceRecords,
    toggleAttendanceOpen,
    regenerateQrToken,
    members,
    scanQrCheckin,
  } = useMinistry();

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Filter attendance records for this event
  const currentEventAttendance = attendanceRecords.filter((r) => r.event_id === event.id);

  // Generate QR image whenever qr_token changes
  useEffect(() => {
    QRCode.toDataURL(event.qr_token, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0B1F1C',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, [event.qr_token]);

  const handleToggleAttendance = () => {
    toggleAttendanceOpen(event.id, !event.is_attendance_open);
  };

  const handleRefresh = () => {
    regenerateQrToken(event.id);
  };

  const handleCopyToken = () => {
    navigator.clipboard?.writeText(event.qr_token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto transition-all ${
        isFullscreen ? 'p-0' : ''
      }`}
    >
      <div
        className={`w-full bg-[#0B1F1C] border border-[#D4AF37]/40 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden ${
          isFullscreen ? 'h-screen max-h-screen rounded-none border-none' : 'max-w-4xl'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#173B2D] bg-[#173B2D]/40">
          <div className="flex items-center gap-3">
            <LighthouseLogo variant="compact" showSubtitle={false} />
            <div className="h-6 w-px bg-white/10 hidden sm:block" />
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-[#F3D21A] uppercase tracking-wider">
                Live Attendance Station
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl text-[#AAB8B2] hover:text-white hover:bg-white/10 transition"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Kiosk Mode'}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#AAB8B2] hover:text-white hover:bg-white/10 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto p-6 gap-6">
          {/* Left Column: QR Code Display */}
          <div className="md:col-span-7 flex flex-col items-center justify-center text-center p-4 bg-[#173B2D]/30 border border-white/5 rounded-2xl">
            <div className="mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/30">
                <Sparkles className="w-3.5 h-3.5" />
                {event.type}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-2 mb-1">{event.title}</h2>
              <div className="flex items-center justify-center gap-4 text-xs text-[#AAB8B2] mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {event.date} • {event.start_time} - {event.end_time}
                </span>
                <span className="flex items-center gap-1 hidden sm:flex">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {event.location.split(',')[0]}
                </span>
              </div>
            </div>

            {/* QR Card Container */}
            <div className="relative p-4 rounded-2xl bg-white shadow-2xl border-4 border-[#D4AF37] max-w-[280px] sm:max-w-[320px] transition-transform">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Event Attendance QR Code"
                  className="w-full h-auto rounded-lg select-none"
                />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center text-gray-500 text-xs">
                  Generating secure token...
                </div>
              )}

              {/* Status Overlay if closed */}
              {!event.is_attendance_open && (
                <div className="absolute inset-0 bg-[#0B1F1C]/90 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-4">
                  <span className="text-sm font-bold text-[#F3D21A] uppercase tracking-wider mb-2">
                    Check-in Closed
                  </span>
                  <p className="text-xs text-[#AAB8B2] max-w-xs mb-4">
                    Attendance is currently paused or expired for this session.
                  </p>
                  <button
                    onClick={handleToggleAttendance}
                    className="px-4 py-2 bg-[#D4AF37] text-[#0B1F1C] font-bold text-xs rounded-xl shadow hover:bg-[#e6bf3e] transition"
                  >
                    Open Attendance Now
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs text-[#AAB8B2] mt-3 font-medium">
              Point phone camera to check in instantly with your member account.
            </p>

            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-3 border-t border-white/5 w-full">
              <button
                onClick={handleToggleAttendance}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                  event.is_attendance_open
                    ? 'bg-emerald-800/60 text-emerald-200 border border-emerald-500/40 hover:bg-emerald-800'
                    : 'bg-amber-800/60 text-amber-200 border border-amber-500/40 hover:bg-amber-800'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    event.is_attendance_open ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                  }`}
                />
                {event.is_attendance_open ? 'Check-in Active' : 'Check-in Paused'}
              </button>

              <button
                onClick={handleRefresh}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#173B2D] hover:bg-[#24513B] text-white border border-white/10 transition flex items-center gap-1.5"
                title="Regenerate token to prevent unauthorized screenshot sharing"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                Refresh QR Token
              </button>

              <button
                onClick={handleCopyToken}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#173B2D] hover:bg-[#24513B] text-[#F3D21A] border border-white/10 transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {copied ? 'Token Copied!' : 'Copy Token'}
              </button>
            </div>
          </div>

          {/* Right Column: Live Check-in Stream & Stats */}
          <div className="md:col-span-5 flex flex-col bg-[#173B2D]/20 border border-white/5 rounded-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#F3D21A]" />
                <h3 className="text-sm font-bold text-white">Live Attendance Stream</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/30">
                {currentEventAttendance.length} / {event.assigned_participant_ids?.length || members.length}
              </span>
            </div>

            {/* Quick stats badges */}
            <div className="grid grid-cols-3 gap-2 my-3 text-center">
              <div className="bg-[#173B2D]/60 p-2 rounded-xl border border-white/5">
                <span className="text-[10px] text-[#AAB8B2] block uppercase font-bold">Present</span>
                <span className="text-base font-bold text-emerald-400">
                  {currentEventAttendance.filter((r) => r.status === 'present').length}
                </span>
              </div>
              <div className="bg-[#173B2D]/60 p-2 rounded-xl border border-white/5">
                <span className="text-[10px] text-[#AAB8B2] block uppercase font-bold">Late</span>
                <span className="text-base font-bold text-amber-400">
                  {currentEventAttendance.filter((r) => r.status === 'late').length}
                </span>
              </div>
              <div className="bg-[#173B2D]/60 p-2 rounded-xl border border-white/5">
                <span className="text-[10px] text-[#AAB8B2] block uppercase font-bold">Pending</span>
                <span className="text-base font-bold text-[#AAB8B2]">
                  {Math.max(
                    0,
                    (event.assigned_participant_ids?.length || members.length) -
                      currentEventAttendance.length
                  )}
                </span>
              </div>
            </div>

            {/* Member Checkin List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[300px]">
              {currentEventAttendance.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center text-[#AAB8B2]">
                  <Clock className="w-8 h-8 text-[#24513B] mb-2 animate-spin" />
                  <p className="text-xs font-medium">Awaiting first check-in...</p>
                  <p className="text-[10px] text-[#AAB8B2]/70 mt-1">
                    Members who scan will appear here in real time.
                  </p>
                </div>
              ) : (
                currentEventAttendance.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#173B2D]/70 border border-white/5 animate-fade-in"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-[#24513B] border border-[#D4AF37]/40 flex items-center justify-center text-xs font-bold text-[#F3D21A] shrink-0">
                        {rec.member_name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{rec.member_name}</p>
                        <p className="text-[10px] text-[#AAB8B2] truncate">{rec.member_section}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 ml-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          rec.status === 'present'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                            : 'bg-amber-950 text-amber-300 border border-amber-700/50'
                        }`}
                      >
                        {rec.status}
                      </span>
                      <span className="text-[9px] text-[#AAB8B2] mt-0.5">
                        {new Date(rec.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Test Simulator Button */}
            <div className="mt-3 pt-3 border-t border-white/5">
              <button
                onClick={() => {
                  // Simulate checkin for an un-checked member for demo verification
                  const unchecked = members.find(
                    (m) => !currentEventAttendance.some((r) => r.member_id === m.id)
                  );
                  if (unchecked) {
                    scanQrCheckin(event.qr_token, unchecked.id);
                  }
                }}
                className="w-full py-2 bg-[#173B2D] hover:bg-[#24513B] text-xs font-medium text-[#F7F7F2] rounded-xl border border-white/10 transition"
              >
                Simulate Member Scan (+1 Check-in)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
