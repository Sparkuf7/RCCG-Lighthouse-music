import React, { useState } from 'react';
import { Song, SongCategory, SongStatus } from '../../types';
import { useMinistry } from '../../context/MinistryContext';
import {
  X,
  Music,
  FileText,
  Sliders,
  Volume2,
  Calendar,
  Share2,
  Edit2,
  Check,
} from 'lucide-react';

interface SongDetailModalProps {
  song: Song;
  onClose: () => void;
  onEdit?: (song: Song) => void;
}

export const SongDetailModal: React.FC<SongDetailModalProps> = ({ song, onClose, onEdit }) => {
  const { currentUserRole, updateSong } = useMinistry();
  const [activeTab, setActiveTab] = useState<'lyrics' | 'arrangement' | 'vocal'>('lyrics');
  const [currentKey, setCurrentKey] = useState<string>(song.key);
  const [copied, setCopied] = useState<boolean>(false);

  const canEdit = currentUserRole === 'MUSIC_DIRECTOR' || currentUserRole === 'SUPER_ADMIN_PASTOR';

  const keys = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

  const handleCopyLyrics = () => {
    navigator.clipboard?.writeText(`${song.title} - ${song.artist}\nKey: ${currentKey} | ${song.tempo_bpm} BPM\n\n${song.lyrics}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#0B1F1C] border border-[#D4AF37]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#173B2D]/50 border-b border-[#173B2D] flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#24513B] border border-[#D4AF37]/40 flex flex-col items-center justify-center text-[#F3D21A] shrink-0 font-bold">
              <span className="text-[10px] text-[#AAB8B2] uppercase leading-none">Key</span>
              <span className="text-lg leading-tight mt-0.5">{currentKey}</span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/30">
                  {song.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    song.status === 'READY'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                      : song.status === 'DEVELOPING'
                      ? 'bg-amber-950 text-amber-300 border border-amber-700/50'
                      : 'bg-blue-950 text-blue-300'
                  }`}
                >
                  {song.status}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">{song.title}</h2>
              <p className="text-xs text-[#AAB8B2] mt-0.5">
                {song.artist} • {song.tempo_bpm} BPM
                {song.last_ministered && ` • Ministered: ${song.last_ministered}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLyrics}
              className="p-2 rounded-xl text-[#AAB8B2] hover:text-white hover:bg-white/10 transition"
              title="Copy Song Info & Lyrics"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#AAB8B2] hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Key Transposer Quick Bar */}
        <div className="px-6 py-2.5 bg-[#0B1F1C] border-b border-white/5 flex items-center justify-between overflow-x-auto text-xs gap-3">
          <span className="text-[#AAB8B2] text-[11px] font-semibold shrink-0">Transpose Key:</span>
          <div className="flex items-center gap-1">
            {keys.map((k) => (
              <button
                key={k}
                onClick={() => setCurrentKey(k)}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition ${
                  currentKey === k
                    ? 'bg-[#D4AF37] text-[#0B1F1C]'
                    : 'bg-[#173B2D]/40 text-[#AAB8B2] hover:text-white'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-white/5 bg-[#173B2D]/20 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('lyrics')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'lyrics'
                ? 'border-[#D4AF37] text-[#F3D21A]'
                : 'border-transparent text-[#AAB8B2] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Lyrics & Structure</span>
          </button>

          <button
            onClick={() => setActiveTab('vocal')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'vocal'
                ? 'border-[#D4AF37] text-[#F3D21A]'
                : 'border-transparent text-[#AAB8B2] hover:text-white'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Vocal Harmonies & Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('arrangement')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'arrangement'
                ? 'border-[#D4AF37] text-[#F3D21A]'
                : 'border-transparent text-[#AAB8B2] hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Band & Arrangement</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {activeTab === 'lyrics' && (
            <div className="bg-[#173B2D]/30 border border-white/5 rounded-2xl p-5 font-mono text-sm leading-relaxed text-[#F7F7F2] whitespace-pre-line select-text">
              {song.lyrics || 'No lyrics uploaded for this song yet.'}
            </div>
          )}

          {activeTab === 'vocal' && (
            <div className="space-y-4">
              <div className="bg-[#173B2D]/40 border border-white/5 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[#F3D21A]" />
                  <span>Vocal Arrangement & Coaching Directives</span>
                </h4>
                <p className="text-xs text-[#AAB8B2] leading-relaxed whitespace-pre-line">
                  {song.vocal_notes ||
                    'Section leader notes: Maintain clear diction, blend vibrato during chorus harmonies, and watch the Music Director for dynamic decrescendo on the final cadence.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-[#0B1F1C]/70 border border-white/5">
                  <span className="text-[10px] font-bold uppercase text-[#D4AF37] block">
                    Sopranos
                  </span>
                  <p className="text-[11px] text-[#AAB8B2] mt-1">
                    Leads melody on chorus; pure tone on high register without strain.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#0B1F1C]/70 border border-white/5">
                  <span className="text-[10px] font-bold uppercase text-[#D4AF37] block">
                    Altos
                  </span>
                  <p className="text-[11px] text-[#AAB8B2] mt-1">
                    Warm third below; anchor the lower harmonic richness on the bridge.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#0B1F1C]/70 border border-white/5">
                  <span className="text-[10px] font-bold uppercase text-[#D4AF37] block">
                    Tenors
                  </span>
                  <p className="text-[11px] text-[#AAB8B2] mt-1">
                    Fifth above or octave mirror; support the vocal climaxes with full chest/mix.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'arrangement' && (
            <div className="space-y-4">
              <div className="bg-[#173B2D]/40 border border-white/5 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#F3D21A]" />
                  <span>Band Instrumentation & Dynamic Flow</span>
                </h4>
                <p className="text-xs text-[#AAB8B2] leading-relaxed whitespace-pre-line">
                  {song.arrangement_notes ||
                    'Acoustic intro with keyboard pads. Drums enter on 2nd verse. Bass locks in with kick drum. Build to forte at bridge.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#0B1F1C]/70 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white">Suggested Tempo</span>
                  <span className="block text-[11px] text-[#AAB8B2]">Strict metronome recommended</span>
                </div>
                <span className="text-base font-black text-[#F3D21A]">{song.tempo_bpm} BPM</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#173B2D]/40 border-t border-white/5 flex items-center justify-between">
          <span className="text-[11px] text-[#AAB8B2]">
            RCCG Lighthouse Music Ministry Repertoire
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#e0bc43] text-[#0B1F1C] font-bold text-xs rounded-xl shadow transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
