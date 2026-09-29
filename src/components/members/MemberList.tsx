import React, { useState } from 'react';
import { useMinistry } from '../../context/MinistryContext';
import { Member, MemberStatus, VocalPart, PrimaryInstrument } from '../../types';
import {
  Users,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Target,
  Sparkles,
  Phone,
  Mail,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { MemberDetailModal } from './MemberDetailModal';

export const MemberList: React.FC = () => {
  const { members, addMember, currentUserRole, settings } = useMinistry();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ACTIVE_MEMBER');
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [activeMember, setActiveMember] = useState<Member | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New member form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [vocalPart, setVocalPart] = useState<VocalPart>('Soprano');
  const [instrument, setInstrument] = useState<PrimaryInstrument>('Vocals Only');
  const [section, setSection] = useState('Sopranos');
  const [status, setStatus] = useState<MemberStatus>('ACTIVE_MEMBER');
  const [experience, setExperience] = useState('3 years church choir');
  const [strengths, setStrengths] = useState('Pitch accuracy, punctuality');
  const [development, setDevelopment] = useState('Harmony blending');

  const canManage = currentUserRole === 'MUSIC_DIRECTOR' || currentUserRole === 'SUPER_ADMIN_PASTOR';

  const sections = ['All', 'Sopranos', 'Altos', 'Tenors', 'Band / Rhythm Section', 'Worship Leaders'];
  const statuses = [
    { key: 'ACTIVE_MEMBER', label: 'Active (30 Target)' },
    { key: 'DEVELOPING', label: 'Developing' },
    { key: 'INACTIVE', label: 'Inactive' },
    { key: 'All', label: 'All Members' },
  ];

  const filteredMembers = members.filter((m) => {
    if (m.status === 'ARCHIVED') return false;
    if (selectedStatus !== 'All' && m.status !== selectedStatus) return false;
    if (selectedSection !== 'All' && !m.section.toLowerCase().includes(selectedSection.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.full_name.toLowerCase().includes(q) ||
        m.preferred_name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q) ||
        m.section.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeCount = members.filter((m) => m.status === 'ACTIVE_MEMBER').length;
  const targetCount = settings.target_active_members || 30;

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    addMember({
      full_name: fullName.trim(),
      preferred_name: fullName.trim().split(' ')[0],
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || phone.trim(),
      email: email.trim(),
      date_joined: new Date().toISOString().split('T')[0],
      role: 'MEMBER',
      status,
      vocal_part: vocalPart,
      instrument,
      music_experience: experience,
      strengths: strengths.split(',').map((s) => s.trim()).filter(Boolean),
      development_areas: development.split(',').map((s) => s.trim()).filter(Boolean),
      skill_level: 'Developing',
      section,
      leadership_role: 'None',
      recruitment_source: 'Direct Addition',
      induction_status: 'Completed',
      availability: 'Full',
      church_connection: 'Existing Lighthouse Member',
    });

    setShowAddModal(false);
    setFullName('');
    setPhone('');
    setWhatsapp('');
    setEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Target Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#173B2D]/40 border border-white/5 p-6 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-[#F3D21A]" />
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              Ensemble Roster
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Music Ministry Members</h2>
          <p className="text-xs text-[#AAB8B2] mt-0.5">
            Complete database of singers, musicians, section leaders, and developing members.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#0B1F1C] px-4 py-2 rounded-2xl border border-[#D4AF37]/30 text-right">
            <span className="text-[10px] text-[#AAB8B2] uppercase font-bold block">Target</span>
            <span className="text-sm sm:text-base font-extrabold text-[#F3D21A]">
              {activeCount} / {targetCount} Active
            </span>
          </div>

          {canManage && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#e0bc43] text-[#0B1F1C] font-extrabold text-xs rounded-xl shadow transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status and Section filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {statuses.map((st) => (
            <button
              key={st.key}
              onClick={() => setSelectedStatus(st.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedStatus === st.key
                  ? 'bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/50 shadow'
                  : 'bg-[#173B2D]/40 text-[#AAB8B2] hover:text-white border border-white/5'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-[#AAB8B2] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, role, section..."
            className="w-full bg-[#173B2D]/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#AAB8B2]/50 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs text-[#AAB8B2] bg-[#173B2D]/20 rounded-3xl border border-white/5">
            No members found matching your search and filter criteria.
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => setActiveMember(member)}
              className="bg-[#173B2D]/40 hover:bg-[#173B2D]/70 border border-white/5 hover:border-[#D4AF37]/40 rounded-3xl p-5 transition cursor-pointer flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#24513B] border border-[#D4AF37]/30 flex items-center justify-center font-black text-[#F3D21A] text-lg shrink-0 group-hover:scale-105 transition">
                    {member.preferred_name.charAt(0)}
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      member.status === 'ACTIVE_MEMBER'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                        : member.status === 'DEVELOPING'
                        ? 'bg-amber-950 text-amber-300 border border-amber-700/50'
                        : 'bg-white/10 text-[#AAB8B2]'
                    }`}
                  >
                    {member.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#F3D21A] transition leading-snug">
                  {member.full_name}
                </h3>
                <p className="text-xs text-[#D4AF37] font-semibold mt-0.5">
                  {member.section}
                  {member.leadership_role !== 'None' && ` • ${member.leadership_role}`}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-[#AAB8B2] mt-2">
                  <span>{member.vocal_part !== 'Not Applicable' ? member.vocal_part : member.instrument}</span>
                  <span>•</span>
                  <span>{member.skill_level}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#AAB8B2]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold text-white">
                    {member.attendance_stats.percentage}%
                  </span>
                  <span>attendance</span>
                </div>

                <div className="flex items-center gap-1 text-[#D4AF37] font-bold text-[11px]">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Member Details Modal */}
      {activeMember && (
        <MemberDetailModal member={activeMember} onClose={() => setActiveMember(null)} />
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg bg-[#0B1F1C] border border-[#D4AF37]/40 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Add Member to Roster</h3>
            <p className="text-xs text-[#AAB8B2] mb-4">
              Enter individual singer or musician profile details.
            </p>

            <form onSubmit={handleCreateMember} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#AAB8B2] font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rachel Adeleke"
                  className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-[#AAB8B2]/50 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">Phone</label>
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
                    placeholder="rachel@email.com"
                    className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-[#AAB8B2]/50 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">Vocal Part</label>
                  <select
                    value={vocalPart}
                    onChange={(e) => setVocalPart(e.target.value as VocalPart)}
                    className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Soprano">Soprano</option>
                    <option value="Alto">Alto</option>
                    <option value="Tenor">Tenor</option>
                    <option value="Bass">Bass</option>
                    <option value="Multi-vocal">Multi-vocal</option>
                    <option value="Not Applicable">Not Applicable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">Primary Instrument</label>
                  <select
                    value={instrument}
                    onChange={(e) => setInstrument(e.target.value as PrimaryInstrument)}
                    className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Vocals Only">Vocals Only</option>
                    <option value="Keys/Piano">Keys/Piano</option>
                    <option value="Bass Guitar">Bass Guitar</option>
                    <option value="Drums">Drums</option>
                    <option value="Lead Guitar">Lead Guitar</option>
                    <option value="Acoustic Guitar">Acoustic Guitar</option>
                    <option value="Saxophone">Saxophone</option>
                    <option value="Strings">Strings</option>
                    <option value="Auxiliary Percussion">Auxiliary Percussion</option>
                    <option value="Sound / Media">Sound / Media</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">Ministry Section</label>
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    placeholder="e.g. Sopranos, Band, Rhythm"
                    className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#AAB8B2] font-semibold mb-1">Member Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as MemberStatus)}
                    className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-2 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="ACTIVE_MEMBER">Active Member</option>
                    <option value="DEVELOPING">Developing</option>
                    <option value="INDUCTION">Induction</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#AAB8B2] font-semibold mb-1">Musical Experience</label>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. 5 years church choir"
                  className="w-full bg-[#173B2D]/50 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
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
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
