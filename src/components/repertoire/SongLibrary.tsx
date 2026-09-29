import React, { useState } from 'react';
import { useMinistry } from '../../context/MinistryContext';
import { Song, SongCategory, SongStatus } from '../../types';
import {
  Music,
  Search,
  Plus,
  Filter,
  ArrowRight,
  Sparkles,
  FileText,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { SongDetailModal } from './SongDetailModal';

export const SongLibrary: React.FC = () => {
  const { songs, addSong, currentUserRole } = useMinistry();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New song form state
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newKey, setNewKey] = useState('G');
  const [newTempo, setNewTempo] = useState(75);
  const [newCategory, setNewCategory] = useState<SongCategory>('Worship');
  const [newStatus, setNewStatus] = useState<SongStatus>('READY');
  const [newLyrics, setNewLyrics] = useState('');
  const [newVocalNotes, setNewVocalNotes] = useState('');
  const [newArrangementNotes, setNewArrangementNotes] = useState('');

  const canManage = currentUserRole === 'MUSIC_DIRECTOR' || currentUserRole === 'SUPER_ADMIN_PASTOR';

  const categories = [
    'All',
    'Worship',
    'Praise',
    'African Praise',
    'Choir Anthem',
    'Special Ministration',
    'Hymn',
  ];

  const filteredSongs = songs.filter((s) => {
    if (selectedCategory !== 'All' && s.category !== selectedCategory) return false;
    if (selectedStatus !== 'All' && s.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        s.lyrics.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addSong({
      title: newTitle.trim(),
      artist: newArtist.trim() || 'Lighthouse Music Ministry',
      key: newKey,
      tempo_bpm: Number(newTempo),
      category: newCategory,
      status: newStatus,
      lyrics: newLyrics,
      vocal_notes: newVocalNotes,
      arrangement_notes: newArrangementNotes,
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewArtist('');
    setNewLyrics('');
    setNewVocalNotes('');
    setNewArrangementNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#173B2D]/40 border border-white/5 p-6 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Music className="w-5 h-5 text-[#F3D21A]" />
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              Music Ministry Catalog
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Repertoire & Song Library</h2>
          <p className="text-xs text-[#AAB8B2] mt-0.5">
            Structured musical archive with lyrics, keys, tempo, and vocal arrangements.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#e0bc43] text-[#0B1F1C] font-extrabold text-xs rounded-xl shadow transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Song</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/50 shadow'
                  : 'bg-[#173B2D]/40 text-[#AAB8B2] hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-[#AAB8B2] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search song title or lyrics..."
            className="w-full bg-[#173B2D]/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#AAB8B2]/50 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Song Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSongs.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs text-[#AAB8B2] bg-[#173B2D]/20 rounded-3xl border border-white/5">
            No songs found matching your criteria.
          </div>
        ) : (
          filteredSongs.map((song) => (
            <div
              key={song.id}
              onClick={() => setActiveSong(song)}
              className="bg-[#173B2D]/40 hover:bg-[#173B2D]/70 border border-white/5 hover:border-[#D4AF37]/40 rounded-3xl p-5 transition cursor-pointer flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/30">
                    {song.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      song.status === 'READY'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                        : 'bg-amber-950 text-amber-300 border border-amber-700/50'
                    }`}
                  >
                    {song.status}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#24513B] border border-[#D4AF37]/30 flex flex-col items-center justify-center font-bold text-[#F3D21A] shrink-0 group-hover:scale-105 transition">
                    <span className="text-[9px] text-[#AAB8B2] leading-none uppercase">Key</span>
                    <span className="text-base leading-none mt-0.5">{song.key}</span>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#F3D21A] transition leading-snug">
                      {song.title}
                    </h3>
                    <p className="text-xs text-[#AAB8B2] mt-0.5">{song.artist}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#AAB8B2]">
                  <span>{song.tempo_bpm} BPM</span>
                  <span>{song.vocal_notes ? 'Harmonies documented' : 'Unison / Lead'}</span>
                </div>
              </div>

              <div className="mt-4 pt-2 flex items-center justify-between text-xs text-[#D4AF37] font-semibold">
                <span className="text-[11px]">Open Details & Lyrics</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Song Details Modal */}
      {activeSong && (
        <SongDetailModal song={activeSong} onClose={() => setActiveSong(null)} />
      )}

      {/* Add Song Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg bg-[#0B1F1C] border border-[#D4AF37]/40 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Add Song to Repertoire</h3>
            <p className="text-xs text-[#AAB8B2] mb-4">
              Enter song arrangement and musical metadata for rehearsals and services.
            </p>

            <form onSubmit={handleCreateSong} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#AAB8B2] font-semibold mb-1">Song Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Total Praise"
                  className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-[#AAB8B2]/50 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">Artist / Source</label>
                  <input
                    type="text"
                    value={newArtist}
                    onChange={(e) => setNewArtist(e.target.value)}
                    placeholder="e.g. Richard Smallwood"
                    className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-[#AAB8B2]/50 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">Original Key</label>
                  <input
                    type="text"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="e.g. Eb"
                    className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">Tempo (BPM)</label>
                  <input
                    type="number"
                    value={newTempo}
                    onChange={(e) => setNewTempo(Number(e.target.value))}
                    className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as SongCategory)}
                    className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Worship">Worship</option>
                    <option value="Praise">Praise</option>
                    <option value="African Praise">African Praise</option>
                    <option value="Choir Anthem">Choir Anthem</option>
                    <option value="Special Ministration">Special Ministration</option>
                    <option value="Hymn">Hymn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as SongStatus)}
                    className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="READY">READY</option>
                    <option value="DEVELOPING">DEVELOPING</option>
                    <option value="FUTURE">FUTURE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#AAB8B2] font-semibold mb-1">Lyrics</label>
                <textarea
                  rows={4}
                  value={newLyrics}
                  onChange={(e) => setNewLyrics(e.target.value)}
                  placeholder="Paste song lyrics here..."
                  className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-[#AAB8B2]/50 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#AAB8B2] font-semibold mb-1">Vocal Coaching & Harmonies</label>
                <textarea
                  rows={2}
                  value={newVocalNotes}
                  onChange={(e) => setNewVocalNotes(e.target.value)}
                  placeholder="Notes for Soprano, Alto, Tenor..."
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
                  Save Song
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
