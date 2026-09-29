import React, { useState } from 'react';
import { useMinistry } from '../../context/MinistryContext';
import { RecruitmentProspect, MemberStatus, ChurchConnection } from '../../types';
import {
  UserPlus,
  Users,
  Clock,
  CheckCircle2,
  Calendar,
  Phone,
  MessageSquare,
  Mail,
  ArrowRight,
  Filter,
  Plus,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RecruitmentPipeline: React.FC = () => {
  const {
    prospects,
    addProspect,
    updateProspectStage,
    convertProspectToMember,
    members,
    currentUserRole,
  } = useMinistry();

  const [activeView, setActiveView] = useState<'kanban' | 'list'>('kanban');
  const [selectedProspect, setSelectedProspect] = useState<RecruitmentProspect | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [stageChangeModal, setStageChangeModal] = useState<{
    prospect: RecruitmentProspect;
    targetStage: MemberStatus;
  } | null>(null);
  const [stageNote, setStageNote] = useState<string>('');

  // New Prospect form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState('Existing Lighthouse members');
  const [churchConnection, setChurchConnection] = useState<ChurchConnection>('Existing Lighthouse Member');
  const [interestedRole, setInterestedRole] = useState('Soprano Vocalist');
  const [ability, setAbility] = useState('');
  const [experience, setExperience] = useState('');
  const [followUpDate, setFollowUpDate] = useState(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [assignedLeaderId, setAssignedLeaderId] = useState(members[0]?.id || '');
  const [initialNotes, setInitialNotes] = useState('');

  const canManage = currentUserRole === 'MUSIC_DIRECTOR' || currentUserRole === 'SUPER_ADMIN_PASTOR';

  // The 7 pipeline stages
  const pipelineStages: { stage: MemberStatus; label: string; desc: string }[] = [
    { stage: 'PROSPECT', label: 'Prospect', desc: 'First contact identified' },
    { stage: 'INTERESTED', label: 'Interested', desc: 'Expressed interest in joining' },
    { stage: 'CONNECTED', label: 'Connected', desc: 'Welcomed & contact established' },
    { stage: 'ASSESSMENT', label: 'Assessment', desc: 'Vocal/instrument evaluation' },
    { stage: 'INDUCTION', label: 'Induction', desc: 'Vision & culture orientation' },
    { stage: 'DEVELOPING', label: 'Developing', desc: 'Weekly sectional development' },
    { stage: 'ACTIVE_MEMBER', label: 'Active Member', desc: 'Fully committed ensemble member' },
  ];

  const handleStageSelect = (prospect: RecruitmentProspect, newStage: MemberStatus) => {
    setStageChangeModal({ prospect, targetStage: newStage });
    setStageNote('');
  };

  const handleConfirmStageChange = () => {
    if (!stageChangeModal) return;

    if (stageChangeModal.targetStage === 'ACTIVE_MEMBER') {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#F3D21A', '#4F9D69'],
        });
      } catch {}
      convertProspectToMember(stageChangeModal.prospect.id);
    } else {
      updateProspectStage(
        stageChangeModal.prospect.id,
        stageChangeModal.targetStage,
        stageNote || `Moved to ${stageChangeModal.targetStage}`
      );
    }

    setStageChangeModal(null);
  };

  const handleCreateProspect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const assignedLeader = members.find((m) => m.id === assignedLeaderId) || members[0];

    addProspect({
      name: name.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || phone.trim(),
      email: email.trim(),
      source,
      date_discovered: new Date().toISOString().split('T')[0],
      interested_role: interestedRole,
      vocal_or_instrument_ability: ability || 'Musical interest registered',
      experience_level: experience || 'Church music background',
      current_stage: 'PROSPECT',
      follow_up_date: followUpDate,
      assigned_leader_id: assignedLeader.id,
      assigned_leader_name: assignedLeader.full_name,
      notes: initialNotes,
      church_connection: churchConnection,
    });

    setShowAddModal(false);
    setName('');
    setPhone('');
    setWhatsapp('');
    setEmail('');
    setAbility('');
    setExperience('');
    setInitialNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#173B2D]/40 border border-white/5 p-6 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <UserPlus className="w-5 h-5 text-[#F3D21A]" />
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              Recruitment & Development Pipeline
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Member Recruitment Journey</h2>
          <p className="text-xs text-[#AAB8B2] mt-0.5">
            Nurturing individuals from first discovery to active, spiritually grounded membership.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex bg-[#0B1F1C] p-1 rounded-xl border border-white/5 text-xs font-semibold">
            <button
              onClick={() => setActiveView('kanban')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeView === 'kanban' ? 'bg-[#24513B] text-[#F3D21A]' : 'text-[#AAB8B2]'
              }`}
            >
              Stage Board
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeView === 'list' ? 'bg-[#24513B] text-[#F3D21A]' : 'text-[#AAB8B2]'
              }`}
            >
              Table View
            </button>
          </div>

          {canManage && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#e0bc43] text-[#0B1F1C] font-extrabold text-xs rounded-xl shadow transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Candidate</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Pipeline Progression Ribbon */}
      <div className="bg-[#0B1F1C]/70 border border-white/5 rounded-2xl p-4 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[750px] gap-2">
          {pipelineStages.map((s, idx) => {
            const count = prospects.filter((p) => p.current_stage === s.stage).length;
            return (
              <div key={s.stage} className="flex-1 flex items-center">
                <div className="flex-1 text-center bg-[#173B2D]/40 border border-white/5 rounded-xl p-2.5">
                  <span className="text-[10px] font-bold text-[#AAB8B2] uppercase block truncate">
                    {s.label}
                  </span>
                  <span className="text-lg font-black text-[#F3D21A]">{count}</span>
                </div>
                {idx < pipelineStages.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-[#24513B] shrink-0 mx-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {activeView === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3.5 items-start overflow-x-auto pb-4">
          {pipelineStages.map((stageInfo) => {
            const stageProspects = prospects.filter((p) => p.current_stage === stageInfo.stage);

            return (
              <div
                key={stageInfo.stage}
                className="bg-[#173B2D]/30 border border-white/5 rounded-2xl p-3 flex flex-col min-w-[200px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/5">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      {stageInfo.label}
                    </h4>
                    <span className="text-[10px] text-[#AAB8B2] block">{stageInfo.desc}</span>
                  </div>
                  <span className="w-5 h-5 rounded-full bg-[#24513B] text-[11px] font-bold text-[#F3D21A] flex items-center justify-center border border-[#D4AF37]/30">
                    {stageProspects.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-2.5 min-h-[150px]">
                  {stageProspects.length === 0 ? (
                    <div className="p-4 text-center text-[11px] text-[#AAB8B2]/50 italic">
                      Empty
                    </div>
                  ) : (
                    stageProspects.map((prospect) => (
                      <div
                        key={prospect.id}
                        onClick={() => setSelectedProspect(prospect)}
                        className="p-3 bg-[#0B1F1C]/80 hover:bg-[#0B1F1C] border border-white/5 hover:border-[#D4AF37]/40 rounded-xl transition cursor-pointer shadow group"
                      >
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <h5 className="text-xs font-bold text-white group-hover:text-[#F3D21A] transition">
                            {prospect.name}
                          </h5>
                          <span className="text-[9px] font-semibold text-[#AAB8B2]">
                            {prospect.source.split(' ')[0]}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#D4AF37] font-medium leading-tight mb-2">
                          {prospect.interested_role}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-[#AAB8B2] pt-2 border-t border-white/5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#D4AF37]" />
                            {prospect.follow_up_date?.slice(5)}
                          </span>
                          <span className="truncate max-w-[80px]">
                            {prospect.assigned_leader_name.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-[#173B2D]/20 border border-white/5 rounded-2xl overflow-hidden shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#173B2D]/60 border-b border-white/10 text-[#AAB8B2] uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="p-3.5">Candidate Name</th>
                  <th className="p-3.5">Interested Role</th>
                  <th className="p-3.5">Current Stage</th>
                  <th className="p-3.5">Source / Church Connection</th>
                  <th className="p-3.5">Follow-up Date</th>
                  <th className="p-3.5">Assigned Leader</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {prospects.map((prospect) => (
                  <tr
                    key={prospect.id}
                    className="hover:bg-[#173B2D]/40 transition cursor-pointer"
                    onClick={() => setSelectedProspect(prospect)}
                  >
                    <td className="p-3.5 font-bold text-white">{prospect.name}</td>
                    <td className="p-3.5 text-[#F3D21A]">{prospect.interested_role}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/30 uppercase">
                        {prospect.current_stage}
                      </span>
                    </td>
                    <td className="p-3.5 text-[#AAB8B2]">
                      {prospect.church_connection || prospect.source}
                    </td>
                    <td className="p-3.5 text-[#AAB8B2]">{prospect.follow_up_date}</td>
                    <td className="p-3.5 text-white">{prospect.assigned_leader_name}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProspect(prospect);
                        }}
                        className="text-xs text-[#D4AF37] hover:underline font-bold"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PROSPECT DETAIL MODAL */}
      {selectedProspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-xl bg-[#0B1F1C] border border-[#D4AF37]/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-[#173B2D] pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/30">
                  {selectedProspect.current_stage}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{selectedProspect.name}</h3>
                <p className="text-xs text-[#D4AF37] font-semibold">
                  {selectedProspect.interested_role} • {selectedProspect.church_connection}
                </p>
              </div>

              <button
                onClick={() => setSelectedProspect(null)}
                className="p-1 rounded-xl text-[#AAB8B2] hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-[#AAB8B2]">
              <div className="bg-[#173B2D]/40 p-2.5 rounded-xl border border-white/5">
                <span className="block text-[10px] font-bold uppercase text-[#AAB8B2]">Phone</span>
                <span className="text-white font-medium">{selectedProspect.phone || 'N/A'}</span>
              </div>
              <div className="bg-[#173B2D]/40 p-2.5 rounded-xl border border-white/5">
                <span className="block text-[10px] font-bold uppercase text-[#AAB8B2]">WhatsApp</span>
                <span className="text-white font-medium">{selectedProspect.whatsapp || 'N/A'}</span>
              </div>
              <div className="bg-[#173B2D]/40 p-2.5 rounded-xl border border-white/5 col-span-2 sm:col-span-1">
                <span className="block text-[10px] font-bold uppercase text-[#AAB8B2]">Assigned Leader</span>
                <span className="text-white font-medium">{selectedProspect.assigned_leader_name}</span>
              </div>
            </div>

            {/* Experience & Ability */}
            <div className="bg-[#173B2D]/30 p-3.5 rounded-2xl border border-white/5 text-xs space-y-2">
              <div>
                <strong className="text-white block">Musical Background & Experience:</strong>
                <p className="text-[#AAB8B2] mt-0.5">{selectedProspect.experience_level}</p>
              </div>
              <div>
                <strong className="text-white block">Ability Assessment:</strong>
                <p className="text-[#AAB8B2] mt-0.5">{selectedProspect.vocal_or_instrument_ability}</p>
              </div>
              {selectedProspect.notes && (
                <div>
                  <strong className="text-white block">Director / Follow-up Notes:</strong>
                  <p className="text-[#D4AF37] italic mt-0.5">"{selectedProspect.notes}"</p>
                </div>
              )}
            </div>

            {/* Quick Stage Transition Buttons */}
            {canManage && (
              <div className="pt-2">
                <span className="block text-[11px] font-bold uppercase text-[#AAB8B2] mb-2">
                  Advance Journey Stage:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {pipelineStages.map((s) => (
                    <button
                      key={s.stage}
                      onClick={() => handleStageSelect(selectedProspect, s.stage)}
                      disabled={selectedProspect.current_stage === s.stage}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition ${
                        selectedProspect.current_stage === s.stage
                          ? 'bg-[#D4AF37] text-[#0B1F1C] cursor-default'
                          : 'bg-[#173B2D]/60 hover:bg-[#24513B] text-[#AAB8B2] hover:text-white border border-white/5'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stage History Log */}
            <div className="border-t border-white/5 pt-3">
              <span className="block text-[11px] font-bold uppercase text-[#AAB8B2] mb-2">
                Milestone History
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {selectedProspect.history?.map((h, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-xl bg-[#0B1F1C]/50 border border-white/5 text-[11px] flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white uppercase">{h.stage}</span>
                      <span className="text-[#AAB8B2] ml-2">{h.notes}</span>
                    </div>
                    <span className="text-[10px] text-[#D4AF37] shrink-0">{h.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <button
                onClick={() => setSelectedProspect(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-[#AAB8B2] rounded-xl text-xs font-semibold"
              >
                Close
              </button>

              {canManage && selectedProspect.current_stage !== 'ACTIVE_MEMBER' && (
                <button
                  onClick={() => handleStageSelect(selectedProspect, 'ACTIVE_MEMBER')}
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-[#e0bc43] text-[#0B1F1C] font-extrabold rounded-xl text-xs shadow flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Convert to Active Member</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STAGE CHANGE CONFIRMATION MODAL */}
      {stageChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0B1F1C] border border-[#D4AF37]/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">
              Move {stageChangeModal.prospect.name} to {stageChangeModal.targetStage}?
            </h3>
            <p className="text-xs text-[#AAB8B2]">
              Record a brief milestone observation for the ministry development records.
            </p>

            <textarea
              rows={3}
              value={stageNote}
              onChange={(e) => setStageNote(e.target.value)}
              placeholder="e.g. Completed vocal audition, passed with recommendation..."
              className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-[#AAB8B2]/50 focus:outline-none focus:border-[#D4AF37]"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setStageChangeModal(null)}
                className="px-4 py-2 bg-white/10 text-[#AAB8B2] rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStageChange}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#e0bc43] text-[#0B1F1C] font-bold text-xs rounded-xl shadow"
              >
                Confirm Move
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CANDIDATE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg bg-[#0B1F1C] border border-[#D4AF37]/40 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Add Recruitment Candidate</h3>
            <p className="text-xs text-[#AAB8B2] mb-4">
              Register a singer or musician into the Lighthouse ministry pipeline.
            </p>

            <form onSubmit={handleCreateProspect} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#AAB8B2] font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Michael Adeleke"
                  className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-[#AAB8B2]/50 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 7700 900..."
                    className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-[#AAB8B2]/50 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="candidate@email.com"
                    className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-[#AAB8B2]/50 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">Interested Role *</label>
                  <input
                    type="text"
                    required
                    value={interestedRole}
                    onChange={(e) => setInterestedRole(e.target.value)}
                    placeholder="e.g. Alto Singer, Drummer, Bassist"
                    className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">Church Connection</label>
                  <select
                    value={churchConnection}
                    onChange={(e) => setChurchConnection(e.target.value as ChurchConnection)}
                    className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Existing Lighthouse Member">Existing Lighthouse Member</option>
                    <option value="New Church Attendee">New Church Attendee</option>
                    <option value="Invited by Member">Invited by Member</option>
                    <option value="Music Recruitment">Music Recruitment</option>
                    <option value="Community Contact">Community Contact</option>
                    <option value="Event Contact">Event Contact</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#AAB8B2] font-semibold mb-1">Musical Background & Experience</label>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. 4 years church choir, plays by ear"
                  className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-[#AAB8B2]/50 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">Assigned Follow-Up Leader</label>
                  <select
                    value={assignedLeaderId}
                    onChange={(e) => setAssignedLeaderId(e.target.value)}
                    className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    {members
                      .filter((m) => m.role !== 'MEMBER')
                      .map((lead) => (
                        <option key={lead.id} value={lead.id}>
                          {lead.full_name} ({lead.role})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">Next Follow-Up Date</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#AAB8B2] font-semibold mb-1">Notes / How Met</label>
                <textarea
                  rows={2}
                  value={initialNotes}
                  onChange={(e) => setInitialNotes(e.target.value)}
                  placeholder="Notes from initial interaction..."
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
                  Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
