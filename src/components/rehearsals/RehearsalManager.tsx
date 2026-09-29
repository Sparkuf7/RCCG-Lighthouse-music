import React, { useState } from 'react';
import { useMinistry } from '../../context/MinistryContext';
import { EventItem, PostRehearsalReview } from '../../types';
import {
  Calendar,
  Clock,
  Sparkles,
  Music,
  FileText,
  CheckCircle2,
  QrCode,
  Users,
  Edit2,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { QRAttendanceModal } from '../attendance/QRAttendanceModal';

export const RehearsalManager: React.FC = () => {
  const { events, updateEvent, addEvent, songs, members, currentUserRole } = useMinistry();
  const [selectedEventId, setSelectedEventId] = useState<string>(
    events.find((e) => e.type === 'Rehearsal')?.id || events[0]?.id || ''
  );
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [isEditingReview, setIsEditingReview] = useState<boolean>(false);

  const canManage = currentUserRole === 'MUSIC_DIRECTOR' || currentUserRole === 'SUPER_ADMIN_PASTOR';

  // Filter rehearsals
  const rehearsals = events.filter((e) => e.type === 'Rehearsal' || e.type === 'Training');
  const currentRehearsal = rehearsals.find((e) => e.id === selectedEventId) || rehearsals[0];

  // Review state
  const [workedOn, setWorkedOn] = useState(currentRehearsal?.post_rehearsal_review?.worked_on || '');
  const [improved, setImproved] = useState(currentRehearsal?.post_rehearsal_review?.improved || '');
  const [needsWork, setNeedsWork] = useState(currentRehearsal?.post_rehearsal_review?.needs_work || '');
  const [nextFocus, setNextFocus] = useState(currentRehearsal?.post_rehearsal_review?.next_focus || '');

  // Attached songs
  const assignedSongs = songs.filter((s) => currentRehearsal?.song_ids?.includes(s.id));

  const handleSaveReview = () => {
    if (!currentRehearsal) return;

    const updatedReview: PostRehearsalReview = {
      worked_on: workedOn,
      improved: improved,
      needs_work: needsWork,
      next_focus: nextFocus,
      recorded_by: 'Brother David Okon',
      recorded_at: new Date().toISOString(),
    };

    updateEvent(currentRehearsal.id, {
      post_rehearsal_review: updatedReview,
    });

    setIsEditingReview(false);
  };

  const focusOptions = [
    'Blend',
    'Harmony',
    'Listening',
    'Vocal Development',
    'Dynamics',
    'Repertoire',
    'Service Preparation',
    'Instrumental Coordination',
    'Leadership Development',
  ];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#173B2D]/40 border border-white/5 p-6 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-[#F3D21A]" />
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              Musical & Choral Excellence
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Rehearsal Management & Reviews</h2>
          <p className="text-xs text-[#AAB8B2] mt-0.5">
            Planning, sectional focuses, and structured post-rehearsal evaluations.
          </p>
        </div>

        {currentRehearsal && (
          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#e0bc43] text-[#0B1F1C] font-extrabold text-xs rounded-xl shadow transition shrink-0"
          >
            <QrCode className="w-4 h-4" />
            <span>Launch Attendance Station</span>
          </button>
        )}
      </div>

      {/* Rehearsal selector tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {rehearsals.map((reh) => (
          <button
            key={reh.id}
            onClick={() => {
              setSelectedEventId(reh.id);
              setWorkedOn(reh.post_rehearsal_review?.worked_on || '');
              setImproved(reh.post_rehearsal_review?.improved || '');
              setNeedsWork(reh.post_rehearsal_review?.needs_work || '');
              setNextFocus(reh.post_rehearsal_review?.next_focus || '');
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              selectedEventId === reh.id
                ? 'bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/50 shadow-md'
                : 'bg-[#173B2D]/30 text-[#AAB8B2] hover:text-white border border-white/5'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{reh.date} • {reh.title}</span>
          </button>
        ))}
      </div>

      {currentRehearsal ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Rehearsal Info & Post-Rehearsal Evaluation */}
          <div className="lg:col-span-7 space-y-6">
            {/* Overview Card */}
            <div className="bg-[#173B2D]/40 border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/30">
                    {currentRehearsal.type}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">{currentRehearsal.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-[#AAB8B2] mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {currentRehearsal.date} @ {currentRehearsal.start_time} - {currentRehearsal.end_time}
                    </span>
                    <span>•</span>
                    <span>{currentRehearsal.location}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowQrModal(true)}
                  className="p-2 rounded-xl bg-[#0B1F1C] hover:bg-[#173B2D] border border-[#D4AF37]/40 text-[#F3D21A]"
                  title="Display QR code"
                >
                  <QrCode className="w-5 h-5" />
                </button>
              </div>

              {/* Focus Pillars */}
              <div>
                <span className="text-[11px] font-bold uppercase text-[#AAB8B2] block mb-2">
                  Technical Focus Areas
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(currentRehearsal.focus_topics || ['Blend', 'Harmony', 'Dynamics']).map((f) => (
                    <span
                      key={f}
                      className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#24513B]/70 text-[#F3D21A] border border-[#D4AF37]/30"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {currentRehearsal.notes && (
                <p className="text-xs text-[#AAB8B2] bg-[#0B1F1C]/40 p-3.5 rounded-2xl border border-white/5">
                  <strong className="text-white">Director's Directive:</strong> {currentRehearsal.notes}
                </p>
              )}
            </div>

            {/* POST-REHEARSAL REVIEW (WHAT WORKED / IMPROVED / NEEDS WORK / NEXT) */}
            <div className="bg-[#173B2D]/40 border border-[#D4AF37]/30 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Post-Rehearsal Evaluation
                  </h3>
                </div>

                {canManage && (
                  <button
                    onClick={() => setIsEditingReview(!isEditingReview)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#F3D21A] hover:underline"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>{isEditingReview ? 'Cancel' : 'Edit Review'}</span>
                  </button>
                )}
              </div>

              {isEditingReview ? (
                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[#AAB8B2] font-semibold mb-1">
                      WHAT WE WORKED ON:
                    </label>
                    <textarea
                      rows={2}
                      value={workedOn}
                      onChange={(e) => setWorkedOn(e.target.value)}
                      placeholder="e.g. 4-part choir vocal blend on Total Praise..."
                      className="w-full bg-[#0B1F1C] border border-[#D4AF37] rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-emerald-300 font-semibold mb-1">
                      WHAT IMPROVED:
                    </label>
                    <textarea
                      rows={2}
                      value={improved}
                      onChange={(e) => setImproved(e.target.value)}
                      placeholder="e.g. Soprano intonation, bass guitar lock with drums..."
                      className="w-full bg-[#0B1F1C] border border-emerald-500 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-300 font-semibold mb-1">
                      WHAT NEEDS FURTHER WORK:
                    </label>
                    <textarea
                      rows={2}
                      value={needsWork}
                      onChange={(e) => setNeedsWork(e.target.value)}
                      placeholder="e.g. Tenor section projection during verse 2..."
                      className="w-full bg-[#0B1F1C] border border-amber-500 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[#F3D21A] font-semibold mb-1">
                      NEXT REHEARSAL FOCUS:
                    </label>
                    <textarea
                      rows={2}
                      value={nextFocus}
                      onChange={(e) => setNextFocus(e.target.value)}
                      placeholder="e.g. High praise African medley transitions..."
                      className="w-full bg-[#0B1F1C] border border-[#D4AF37] rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSaveReview}
                      className="px-5 py-2 bg-[#D4AF37] hover:bg-[#e0bc43] text-[#0B1F1C] font-bold rounded-xl shadow"
                    >
                      Save Evaluation
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="bg-[#0B1F1C]/60 p-3.5 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-bold uppercase text-[#AAB8B2] block mb-1">
                      WHAT WE WORKED ON
                    </span>
                    <p className="text-white leading-relaxed">
                      {currentRehearsal.post_rehearsal_review?.worked_on ||
                        'Harmonic blend across Soprano, Alto, and Tenor sections, along with band coordination.'}
                    </p>
                  </div>

                  <div className="bg-[#0B1F1C]/60 p-3.5 rounded-2xl border border-emerald-500/20">
                    <span className="text-[10px] font-bold uppercase text-emerald-300 block mb-1">
                      WHAT IMPROVED
                    </span>
                    <p className="text-emerald-100 leading-relaxed">
                      {currentRehearsal.post_rehearsal_review?.improved ||
                        'Intonation on the sustained high harmonies and tighter synchronization between drummer and bassist.'}
                    </p>
                  </div>

                  <div className="bg-[#0B1F1C]/60 p-3.5 rounded-2xl border border-amber-500/20">
                    <span className="text-[10px] font-bold uppercase text-amber-300 block mb-1">
                      WHAT NEEDS FURTHER WORK
                    </span>
                    <p className="text-amber-100 leading-relaxed">
                      {currentRehearsal.post_rehearsal_review?.needs_work ||
                        'Alto section volume balance on low registers; transitions between praise and worship medleys.'}
                    </p>
                  </div>

                  <div className="bg-[#0B1F1C]/60 p-3.5 rounded-2xl border border-[#D4AF37]/30">
                    <span className="text-[10px] font-bold uppercase text-[#F3D21A] block mb-1">
                      NEXT REHEARSAL FOCUS
                    </span>
                    <p className="text-white leading-relaxed">
                      {currentRehearsal.post_rehearsal_review?.next_focus ||
                        'Seamless dynamic transitions, song ending visual cues, and Communion Sunday special ministration run-through.'}
                    </p>
                  </div>

                  {currentRehearsal.post_rehearsal_review?.recorded_by && (
                    <span className="text-[10px] text-[#AAB8B2] italic block pt-1">
                      Recorded by {currentRehearsal.post_rehearsal_review.recorded_by} on{' '}
                      {new Date(
                        currentRehearsal.post_rehearsal_review.recorded_at
                      ).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (5 cols): Assigned Repertoire & Participants */}
          <div className="lg:col-span-5 space-y-6">
            {/* Assigned Songs */}
            <div className="bg-[#173B2D]/40 border border-white/5 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-[#F3D21A]" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Rehearsal Repertoire
                  </h3>
                </div>
                <span className="text-xs text-[#D4AF37] font-semibold">
                  {assignedSongs.length} Songs
                </span>
              </div>

              <div className="space-y-2.5">
                {assignedSongs.map((song) => (
                  <div
                    key={song.id}
                    className="p-3 rounded-2xl bg-[#0B1F1C]/60 border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#24513B] border border-[#D4AF37]/30 flex items-center justify-center text-xs font-bold text-[#F3D21A]">
                        {song.key}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">{song.title}</h5>
                        <span className="text-[10px] text-[#AAB8B2]">{song.artist}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#F3D21A] font-semibold">
                      {song.tempo_bpm} BPM
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Participants */}
            <div className="bg-[#173B2D]/40 border border-white/5 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Expected Ensemble
                  </h3>
                </div>
                <span className="text-xs text-[#D4AF37] font-semibold">
                  {currentRehearsal.assigned_participant_ids?.length || 0} Members
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                {members
                  .filter((m) => currentRehearsal.assigned_participant_ids?.includes(m.id))
                  .map((m) => (
                    <span
                      key={m.id}
                      className="px-2.5 py-1 rounded-xl bg-[#0B1F1C]/70 border border-white/5 text-[11px] text-white flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{m.preferred_name}</span>
                      <span className="text-[9px] text-[#AAB8B2]">({m.section.split(' ')[0]})</span>
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* QR Modal */}
      {showQrModal && currentRehearsal && (
        <QRAttendanceModal event={currentRehearsal} onClose={() => setShowQrModal(false)} />
      )}
    </div>
  );
};
