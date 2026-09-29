import React, { useState } from 'react';
import { useMinistry } from '../../context/MinistryContext';
import { DevelopmentCategory, DevelopmentGoal, DevelopmentGoalStatus } from '../../types';
import {
  Target,
  Plus,
  CheckCircle2,
  Clock,
  User,
  Sparkles,
  ArrowRight,
  Filter,
  Search,
} from 'lucide-react';

export const DevelopmentHub: React.FC = () => {
  const { developmentGoals, addDevelopmentGoal, updateDevelopmentGoal, members, currentUserRole } = useMinistry();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New goal form
  const [targetMemberId, setTargetMemberId] = useState<string>(members[0]?.id || '');
  const [category, setCategory] = useState<DevelopmentCategory>('Harmony');
  const [goalTitle, setGoalTitle] = useState('');
  const [currentLevel, setCurrentLevel] = useState('Developing');
  const [targetAction, setTargetAction] = useState('');
  const [notes, setNotes] = useState('');
  const [reviewDate, setReviewDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const canManage = currentUserRole === 'MUSIC_DIRECTOR' || currentUserRole === 'SUPER_ADMIN_PASTOR';

  const categories: string[] = [
    'All',
    'Vocal Development',
    'Harmony',
    'Ear Training',
    'Musicianship',
    'Instrumental Skills',
    'Stage/Service Skills',
    'Worship Skills',
    'Music Direction',
    'Leadership',
  ];

  const filteredGoals = developmentGoals.filter((g) => {
    if (selectedCategory !== 'All' && g.category !== selectedCategory) return false;
    if (selectedStatus !== 'All' && g.status !== selectedStatus) return false;
    return true;
  });

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    const targetMem = members.find((m) => m.id === targetMemberId) || members[0];

    addDevelopmentGoal({
      member_id: targetMem.id,
      member_name: targetMem.full_name,
      category,
      goal_title: goalTitle.trim(),
      current_level: currentLevel,
      target_action: targetAction.trim(),
      assigned_by: 'Brother David Okon (Music Director)',
      status: 'In Progress',
      notes,
      review_date: reviewDate,
    });

    setShowAddModal(false);
    setGoalTitle('');
    setTargetAction('');
    setNotes('');
  };

  const handleUpdateStatus = (goalId: string, newStatus: DevelopmentGoalStatus) => {
    updateDevelopmentGoal(goalId, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#173B2D]/40 border border-white/5 p-6 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-5 h-5 text-[#F3D21A]" />
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              Growth & Capacity Building
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Musician & Singer Development Hub</h2>
          <p className="text-xs text-[#AAB8B2] mt-0.5">
            Developing individuals to strengthen the ensemble and fulfill the 30-member vision.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#e0bc43] text-[#0B1F1C] font-extrabold text-xs rounded-xl shadow transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Assign Development Goal</span>
          </button>
        )}
      </div>

      {/* Categories Filter Ribbon */}
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

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGoals.map((goal) => (
          <div
            key={goal.id}
            className="bg-[#173B2D]/40 border border-white/5 rounded-3xl p-5 flex flex-col justify-between shadow-lg space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/30">
                  {goal.category}
                </span>

                <select
                  value={goal.status}
                  onChange={(e) => handleUpdateStatus(goal.id, e.target.value as DevelopmentGoalStatus)}
                  className={`text-[10px] font-bold rounded-lg px-2 py-0.5 border focus:outline-none bg-[#0B1F1C] ${
                    goal.status === 'Completed'
                      ? 'text-emerald-400 border-emerald-500/40'
                      : 'text-[#F3D21A] border-[#D4AF37]/40'
                  }`}
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Not Started">Not Started</option>
                </select>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#AAB8B2] block uppercase tracking-wider">
                  {goal.member_name}
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">{goal.goal_title}</h4>
              </div>

              <div className="p-3 rounded-2xl bg-[#0B1F1C]/60 border border-white/5 text-xs">
                <strong className="text-white block mb-0.5">Assigned Practice Routine:</strong>
                <p className="text-[#AAB8B2] leading-relaxed">{goal.target_action}</p>
              </div>

              {goal.notes && (
                <p className="text-[11px] text-[#D4AF37] italic bg-[#173B2D]/50 p-2 rounded-xl border border-white/5">
                  Coach Note: "{goal.notes}"
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-[#AAB8B2]">
              <span>Assigned by {goal.assigned_by.split(' ')[1]}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#D4AF37]" />
                Review: {goal.review_date}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Development Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg bg-[#0B1F1C] border border-[#D4AF37]/40 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Assign Development Goal</h3>
            <p className="text-xs text-[#AAB8B2] mb-4">
              Set clear, actionable milestones for singer or instrumentalist improvement.
            </p>

            <form onSubmit={handleCreateGoal} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#AAB8B2] font-semibold mb-1">Select Member</label>
                <select
                  value={targetMemberId}
                  onChange={(e) => setTargetMemberId(e.target.value)}
                  className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.full_name} ({m.section})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as DevelopmentCategory)}
                    className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Harmony">Harmony</option>
                    <option value="Vocal Development">Vocal Development</option>
                    <option value="Ear Training">Ear Training</option>
                    <option value="Musicianship">Musicianship</option>
                    <option value="Instrumental Skills">Instrumental Skills</option>
                    <option value="Stage/Service Skills">Stage/Service Skills</option>
                    <option value="Worship Skills">Worship Skills</option>
                    <option value="Music Direction">Music Direction</option>
                    <option value="Leadership">Leadership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">Review Date</label>
                  <input
                    type="date"
                    value={reviewDate}
                    onChange={(e) => setReviewDate(e.target.value)}
                    className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#AAB8B2] font-semibold mb-1">Goal Title *</label>
                <input
                  type="text"
                  required
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. Master Alto thirds on 'Total Praise'"
                  className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-[#AAB8B2]/50 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#AAB8B2] font-semibold mb-1">Action & Exercise Routine</label>
                <textarea
                  rows={3}
                  required
                  value={targetAction}
                  onChange={(e) => setTargetAction(e.target.value)}
                  placeholder="e.g. 15 minutes sectional audio exercise with metronome..."
                  className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-[#AAB8B2]/50 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#AAB8B2] font-semibold mb-1">Coach Notes / Feedback</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Initial observations..."
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
                  Assign Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
