import React, { useState } from 'react';
import { Member, MemberStatus, UserRole, VocalPart, PrimaryInstrument } from '../../types';
import { useMinistry } from '../../context/MinistryContext';
import {
  X,
  User,
  Music,
  Shield,
  Clock,
  Target,
  Award,
  Phone,
  MessageSquare,
  Mail,
  Calendar,
  Lock,
  Edit2,
  Check,
  Star,
} from 'lucide-react';

interface MemberDetailModalProps {
  member: Member;
  onClose: () => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({ member, onClose }) => {
  const { currentUserRole, updateMember, updateMemberStatus, developmentGoals } = useMinistry();
  const [activeTab, setActiveTab] = useState<'profile' | 'music' | 'attendance' | 'development' | 'leadership'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Editable fields
  const [phone, setPhone] = useState(member.phone);
  const [whatsapp, setWhatsapp] = useState(member.whatsapp);
  const [email, setEmail] = useState(member.email);
  const [section, setSection] = useState(member.section);
  const [leadershipRole, setLeadershipRole] = useState(member.leadership_role);
  const [privateNotes, setPrivateNotes] = useState(member.private_notes || '');

  // Leadership ratings
  const [reliability, setReliability] = useState(member.leadership_ratings?.reliability || 4);
  const [musicalCompetence, setMusicalCompetence] = useState(member.leadership_ratings?.musical_competence || 4);
  const [teamwork, setTeamwork] = useState(member.leadership_ratings?.teamwork || 4);
  const [initiative, setInitiative] = useState(member.leadership_ratings?.initiative || 4);
  const [teachability, setTeachability] = useState(member.leadership_ratings?.teachability || 4);
  const [responsibility, setResponsibility] = useState(member.leadership_ratings?.responsibility || 4);
  const [leadershipNotes, setLeadershipNotes] = useState(member.leadership_ratings?.notes || '');

  // Permission checks
  const isPrivileged = currentUserRole === 'MUSIC_DIRECTOR' || currentUserRole === 'SUPER_ADMIN_PASTOR';
  const canEditMinistry = isPrivileged;

  // Member's goals
  const memberGoals = developmentGoals.filter((g) => g.member_id === member.id);

  const handleSave = () => {
    updateMember(member.id, {
      phone,
      whatsapp,
      email,
      section,
      leadership_role: leadershipRole,
      private_notes: isPrivileged ? privateNotes : member.private_notes,
      leadership_ratings: isPrivileged
        ? {
            reliability,
            musical_competence: musicalCompetence,
            teamwork,
            initiative,
            teachability,
            responsibility,
            notes: leadershipNotes,
            updated_at: new Date().toISOString().split('T')[0],
          }
        : member.leadership_ratings,
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#0B1F1C] border border-[#D4AF37]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 bg-[#173B2D]/50 border-b border-[#173B2D] flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#24513B] border-2 border-[#D4AF37] flex items-center justify-center text-xl font-black text-[#F3D21A] shrink-0 shadow-lg">
              {member.preferred_name.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/30">
                  {member.status.replace('_', ' ')}
                </span>
                <span className="text-xs text-[#AAB8B2]">{member.role}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{member.full_name}</h2>
              <p className="text-xs text-[#D4AF37] font-semibold mt-0.5">
                {member.section} • {member.vocal_part !== 'Not Applicable' ? member.vocal_part : member.instrument}
                {member.leadership_role !== 'None' && ` • ${member.leadership_role}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canEditMinistry && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  isEditing
                    ? 'bg-[#D4AF37] text-[#0B1F1C]'
                    : 'bg-white/5 hover:bg-white/10 text-[#AAB8B2] hover:text-white'
                }`}
              >
                <Edit2 className="w-4 h-4" />
                <span className="hidden sm:inline">{isEditing ? 'Editing' : 'Edit'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#AAB8B2] hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/5 bg-[#173B2D]/20 px-6 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-[#D4AF37] text-[#F3D21A]'
                : 'border-transparent text-[#AAB8B2] hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Ministry</span>
          </button>

          <button
            onClick={() => setActiveTab('music')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'music'
                ? 'border-[#D4AF37] text-[#F3D21A]'
                : 'border-transparent text-[#AAB8B2] hover:text-white'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Musical Skills</span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'attendance'
                ? 'border-[#D4AF37] text-[#F3D21A]'
                : 'border-transparent text-[#AAB8B2] hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Attendance ({member.attendance_stats?.percentage}%)</span>
          </button>

          <button
            onClick={() => setActiveTab('development')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'development'
                ? 'border-[#D4AF37] text-[#F3D21A]'
                : 'border-transparent text-[#AAB8B2] hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Development ({memberGoals.length})</span>
          </button>

          {/* Leadership Tab: Protected to MD and Pastor only */}
          {isPrivileged && (
            <button
              onClick={() => setActiveTab('leadership')}
              className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'leadership'
                  ? 'border-[#D4AF37] text-[#F3D21A]'
                  : 'border-transparent text-[#AAB8B2] hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Leadership Evaluation</span>
            </button>
          )}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-4">
          {/* PROFILE & MINISTRY */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#173B2D]/40 p-3.5 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#AAB8B2] block">Phone</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#0B1F1C] border border-[#D4AF37] rounded-lg px-2 py-1 text-white"
                    />
                  ) : (
                    <p className="text-white font-medium">{member.phone}</p>
                  )}
                </div>

                <div className="bg-[#173B2D]/40 p-3.5 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#AAB8B2] block">Email</span>
                  {isEditing ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0B1F1C] border border-[#D4AF37] rounded-lg px-2 py-1 text-white"
                    />
                  ) : (
                    <p className="text-white font-medium">{member.email}</p>
                  )}
                </div>

                <div className="bg-[#173B2D]/40 p-3.5 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#AAB8B2] block">Ministry Section</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      className="w-full bg-[#0B1F1C] border border-[#D4AF37] rounded-lg px-2 py-1 text-white"
                    />
                  ) : (
                    <p className="text-white font-medium">{member.section}</p>
                  )}
                </div>

                <div className="bg-[#173B2D]/40 p-3.5 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#AAB8B2] block">Leadership Assignment</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={leadershipRole}
                      onChange={(e) => setLeadershipRole(e.target.value)}
                      className="w-full bg-[#0B1F1C] border border-[#D4AF37] rounded-lg px-2 py-1 text-white"
                    />
                  ) : (
                    <p className="text-white font-medium">{member.leadership_role}</p>
                  )}
                </div>

                <div className="bg-[#173B2D]/40 p-3.5 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#AAB8B2] block">Date Joined</span>
                  <p className="text-white font-medium">{member.date_joined}</p>
                </div>

                <div className="bg-[#173B2D]/40 p-3.5 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#AAB8B2] block">Church Connection</span>
                  <p className="text-white font-medium">{member.church_connection}</p>
                </div>
              </div>

              {/* Private Notes (MD/Pastor only) */}
              {isPrivileged && (
                <div className="bg-[#173B2D]/50 border border-[#D4AF37]/30 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] uppercase">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Confidential Pastoral & Director Notes (Protected)</span>
                  </div>
                  {isEditing ? (
                    <textarea
                      rows={3}
                      value={privateNotes}
                      onChange={(e) => setPrivateNotes(e.target.value)}
                      placeholder="Add confidential notes on spiritual maturity, attendance habits, or coaching..."
                      className="w-full bg-[#0B1F1C] border border-[#D4AF37] rounded-xl p-2.5 text-xs text-white"
                    />
                  ) : (
                    <p className="text-xs text-[#AAB8B2] leading-relaxed italic">
                      {member.private_notes || 'No confidential notes recorded yet.'}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* MUSICAL SKILLS */}
          {activeTab === 'music' && (
            <div className="space-y-4">
              <div className="bg-[#173B2D]/40 border border-white/5 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase">Vocal & Instrument Skill</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/30">
                    {member.skill_level}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#AAB8B2] text-[10px] uppercase font-bold block">Vocal Part</span>
                    <span className="text-white font-semibold">{member.vocal_part}</span>
                  </div>
                  <div>
                    <span className="text-[#AAB8B2] text-[10px] uppercase font-bold block">Primary Instrument</span>
                    <span className="text-white font-semibold">{member.instrument}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[#AAB8B2] text-[10px] uppercase font-bold block mb-1">
                    Musical Background & Training
                  </span>
                  <p className="text-xs text-white leading-relaxed">
                    {member.music_experience}
                    {member.musical_training ? ` (${member.musical_training})` : ''}
                  </p>
                </div>
              </div>

              {/* Strengths & Development Areas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#173B2D]/30 border border-emerald-500/20 rounded-2xl p-4">
                  <span className="text-[10px] font-bold uppercase text-emerald-300 block mb-2">
                    Key Strengths
                  </span>
                  <ul className="space-y-1.5 text-xs text-white">
                    {member.strengths?.map((str, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#173B2D]/30 border border-amber-500/20 rounded-2xl p-4">
                  <span className="text-[10px] font-bold uppercase text-amber-300 block mb-2">
                    Development Focus Areas
                  </span>
                  <ul className="space-y-1.5 text-xs text-white">
                    {member.development_areas?.map((dev, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{dev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
                <div className="bg-[#173B2D]/40 p-3 rounded-2xl border border-white/5">
                  <span className="text-[9px] uppercase font-bold text-[#AAB8B2] block">Total</span>
                  <span className="text-lg font-bold text-white">
                    {member.attendance_stats.total_events}
                  </span>
                </div>
                <div className="bg-[#173B2D]/40 p-3 rounded-2xl border border-emerald-500/20">
                  <span className="text-[9px] uppercase font-bold text-emerald-300 block">Present</span>
                  <span className="text-lg font-bold text-emerald-400">
                    {member.attendance_stats.present}
                  </span>
                </div>
                <div className="bg-[#173B2D]/40 p-3 rounded-2xl border border-amber-500/20">
                  <span className="text-[9px] uppercase font-bold text-amber-300 block">Late</span>
                  <span className="text-lg font-bold text-amber-400">
                    {member.attendance_stats.late}
                  </span>
                </div>
                <div className="bg-[#173B2D]/40 p-3 rounded-2xl border border-rose-500/20">
                  <span className="text-[9px] uppercase font-bold text-rose-300 block">Absent</span>
                  <span className="text-lg font-bold text-rose-400">
                    {member.attendance_stats.absent}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1 bg-[#173B2D]/40 p-3 rounded-2xl border border-[#D4AF37]/30">
                  <span className="text-[9px] uppercase font-bold text-[#F3D21A] block">Rate</span>
                  <span className="text-lg font-bold text-[#F3D21A]">
                    {member.attendance_stats.percentage}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#AAB8B2] leading-relaxed bg-[#0B1F1C]/60 p-3.5 rounded-xl border border-white/5">
                Attendance rate is tracked constructively to assist pastoral encouragement and ensemble reliability.
                {member.attendance_stats.percentage >= 90
                  ? ' Commendable commitment!'
                  : ' Follow-up recommended to provide support.'}
              </p>
            </div>
          )}

          {/* DEVELOPMENT GOALS */}
          {activeTab === 'development' && (
            <div className="space-y-3">
              {memberGoals.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#AAB8B2] bg-[#173B2D]/20 rounded-2xl border border-white/5">
                  No active development goals logged for this member yet.
                </div>
              ) : (
                memberGoals.map((g) => (
                  <div
                    key={g.id}
                    className="p-4 rounded-2xl bg-[#173B2D]/40 border border-white/5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/30">
                        {g.category}
                      </span>
                      <span className="text-xs font-semibold text-emerald-400">{g.status}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">{g.goal_title}</h4>
                    <p className="text-xs text-[#AAB8B2]"><strong className="text-white">Action:</strong> {g.target_action}</p>
                    {g.notes && <p className="text-[11px] text-[#D4AF37] italic">Note: "{g.notes}"</p>}
                  </div>
                ))
              )}
            </div>
          )}

          {/* LEADERSHIP EVALUATION (PROTECTED) */}
          {activeTab === 'leadership' && isPrivileged && (
            <div className="space-y-4">
              <div className="bg-[#0B1F1C]/70 p-3.5 rounded-2xl border border-[#D4AF37]/30 text-xs text-[#D4AF37]">
                <strong className="block mb-1">Confidential Leadership Potential Assessment</strong>
                <p className="text-[11px] text-[#AAB8B2]">
                  Leadership in RCCG Lighthouse Music Ministry is measured by character, reliability, and teachability, not talent alone.
                </p>
              </div>

              {/* 6 Core Leadership Criteria */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { label: 'Reliability & Punctuality', val: reliability, setVal: setReliability },
                  { label: 'Musical Competence', val: musicalCompetence, setVal: setMusicalCompetence },
                  { label: 'Teamwork & Blending', val: teamwork, setVal: setTeamwork },
                  { label: 'Initiative & Proactivity', val: initiative, setVal: setInitiative },
                  { label: 'Teachability & Humility', val: teachability, setVal: setTeachability },
                  { label: 'Responsibility & Follow-Through', val: responsibility, setVal: setResponsibility },
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#173B2D]/40 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                    <span className="font-semibold text-white">{item.label}</span>
                    {isEditing ? (
                      <select
                        value={item.val}
                        onChange={(e) => item.setVal(Number(e.target.value))}
                        className="bg-[#0B1F1C] border border-[#D4AF37] text-[#F3D21A] text-xs rounded px-2 py-0.5"
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n} / 5
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center gap-1 text-[#F3D21A] font-bold">
                        <Star className="w-3.5 h-3.5 fill-[#F3D21A]" />
                        <span>{item.val} / 5</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Director's notes on leadership potential */}
              <div className="bg-[#173B2D]/30 p-3.5 rounded-2xl border border-white/5 space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-[#AAB8B2] block">
                  Leadership Pathway Notes
                </span>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={leadershipNotes}
                    onChange={(e) => setLeadershipNotes(e.target.value)}
                    placeholder="Specific leadership observation or prospective role..."
                    className="w-full bg-[#0B1F1C] border border-[#D4AF37] rounded-xl p-2 text-xs text-white"
                  />
                ) : (
                  <p className="text-xs text-white italic">
                    "{member.leadership_ratings?.notes || 'Reliable and spiritually mature member.'}"
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#173B2D]/40 border-t border-white/5 flex items-center justify-between">
          <span className="text-[11px] text-[#AAB8B2]">
            RCCG Lighthouse Music Ministry Profile
          </span>

          <div className="flex items-center gap-2">
            {isEditing && (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#e0bc43] text-[#0B1F1C] font-bold text-xs rounded-xl shadow transition"
              >
                Save Changes
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-[#AAB8B2] font-semibold text-xs rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
