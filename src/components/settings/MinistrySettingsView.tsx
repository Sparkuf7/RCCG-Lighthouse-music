import React, { useState } from 'react';
import { useMinistry } from '../../context/MinistryContext';
import {
  Settings,
  ShieldCheck,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Save,
  RotateCcw,
} from 'lucide-react';

export const MinistrySettingsView: React.FC = () => {
  const { settings, updateSettings, auditLogs, currentUserRole } = useMinistry();

  const [targetCount, setTargetCount] = useState(settings.target_active_members || 30);
  const [beforeMins, setBeforeMins] = useState(settings.default_attendance_window_before_mins || 30);
  const [afterMins, setAfterMins] = useState(settings.default_attendance_window_after_mins || 30);
  const [rehearsalDay, setRehearsalDay] = useState(settings.default_rehearsal_day || 'Saturday');
  const [rehearsalTime, setRehearsalTime] = useState(settings.default_rehearsal_time || '16:00');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const canManage = currentUserRole === 'MUSIC_DIRECTOR' || currentUserRole === 'SUPER_ADMIN_PASTOR';

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      target_active_members: Number(targetCount),
      default_attendance_window_before_mins: Number(beforeMins),
      default_attendance_window_after_mins: Number(afterMins),
      default_rehearsal_day: rehearsalDay,
      default_rehearsal_time: rehearsalTime,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const checklistItems = [
    { label: 'Configure 30-Member Ministry Target', done: true },
    { label: 'Add Initial Members & Section Allocation', done: true },
    { label: 'Configure Vocal Sections (Soprano, Alto, Tenor, Band)', done: true },
    { label: 'Set Up QR Attendance Security Rules', done: true },
    { label: 'Add Core Repertoire & Harmonic Coaching Notes', done: true },
    { label: 'Formulate Individual Member Development Goals', done: true },
    { label: 'Establish Recruitment Pipeline & Stage Handover', done: true },
    { label: 'Activate Confidential Leadership Assessments', done: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#173B2D]/40 border border-white/5 p-6 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-[#F3D21A]" />
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              Administration & Policy
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Ministry Configuration & Audit</h2>
          <p className="text-xs text-[#AAB8B2] mt-0.5">
            Operational settings, target parameters, setup checklist, and audit trails.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 animate-fade-in shadow">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Updated!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Parameters & Setup Checklist */}
        <div className="lg:col-span-7 space-y-6">
          {/* Operational Settings Form */}
          <div className="bg-[#173B2D]/40 border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-[#F3D21A]" />
              <span>Ministry Target & Attendance Window Parameters</span>
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">
                    Active Members Target (Default: 30)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={targetCount}
                    onChange={(e) => setTargetCount(Number(e.target.value))}
                    disabled={!canManage}
                    className="w-full bg-[#0B1F1C] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                  <span className="text-[10px] text-[#AAB8B2] mt-1 block">
                    Strategic goal of dedicated, committed musicians.
                  </span>
                </div>

                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">
                    Default Rehearsal Day & Time
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={rehearsalDay}
                      onChange={(e) => setRehearsalDay(e.target.value)}
                      disabled={!canManage}
                      className="bg-[#0B1F1C] border border-[#D4AF37]/40 rounded-xl px-2 py-2 text-white text-xs flex-1"
                    >
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                      <option value="Friday">Friday</option>
                      <option value="Midweek">Midweek</option>
                    </select>
                    <input
                      type="time"
                      value={rehearsalTime}
                      onChange={(e) => setRehearsalTime(e.target.value)}
                      disabled={!canManage}
                      className="bg-[#0B1F1C] border border-[#D4AF37]/40 rounded-xl px-2 py-2 text-white text-xs w-24"
                    >
                    </input>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">
                    QR Window Opens (Minutes Before Event)
                  </label>
                  <input
                    type="number"
                    value={beforeMins}
                    onChange={(e) => setBeforeMins(Number(e.target.value))}
                    disabled={!canManage}
                    className="w-full bg-[#0B1F1C] border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">
                    QR Window Closes (Minutes After Start)
                  </label>
                  <input
                    type="number"
                    value={afterMins}
                    onChange={(e) => setAfterMins(Number(e.target.value))}
                    disabled={!canManage}
                    className="w-full bg-[#0B1F1C] border border-white/10 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>

              {canManage && (
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#e0bc43] text-[#0B1F1C] font-extrabold rounded-xl shadow transition flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Configuration</span>
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* First-Time Setup Checklist for Music Director */}
          <div className="bg-[#173B2D]/40 border border-white/5 rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Music Director Setup Checklist</span>
            </h3>

            <div className="space-y-2 text-xs">
              {checklistItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-[#0B1F1C]/60 border border-white/5 flex items-center gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-white font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Audit Trail Log */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#173B2D]/40 border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#F3D21A]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Administrative Audit Trail
                </h3>
              </div>
              <span className="text-[10px] text-[#AAB8B2] font-bold uppercase">
                Tamper-Resistant
              </span>
            </div>

            <p className="text-xs text-[#AAB8B2] leading-relaxed">
              Every status advancement, manual attendance override, and role adjustment is logged for accountability.
            </p>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-[#0B1F1C]/70 border border-white/5 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#F3D21A]">{log.action}</span>
                    <span className="text-[10px] text-[#AAB8B2]">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-[#F7F7F2] leading-tight">{log.details}</p>
                  <span className="text-[10px] text-[#AAB8B2] block">
                    By {log.user_name} ({log.user_role})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
