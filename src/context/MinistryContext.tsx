import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Member,
  RecruitmentProspect,
  EventItem,
  AttendanceRecord,
  Song,
  DevelopmentGoal,
  Announcement,
  AuditLogItem,
  MinistrySettings,
  UserRole,
  MemberStatus,
  AttendanceStatus,
  CheckinMethod,
} from '../types';

interface MinistryContextType {
  currentUserRole: UserRole;
  currentMember: Member;
  setCurrentUserRole: (role: UserRole) => void;
  setCurrentMemberId: (memberId: string) => void;

  // Members
  members: Member[];
  addMember: (member: Omit<Member, 'id' | 'attendance_stats'>) => Member;
  updateMember: (id: string, updates: Partial<Member>) => void;
  updateMemberStatus: (id: string, newStatus: MemberStatus, note?: string) => void;
  deleteMember: (id: string) => void;

  // Recruitment
  prospects: RecruitmentProspect[];
  addProspect: (prospect: Omit<RecruitmentProspect, 'id' | 'history'>) => RecruitmentProspect;
  updateProspect: (id: string, updates: Partial<RecruitmentProspect>) => void;
  updateProspectStage: (id: string, stage: MemberStatus, notes: string) => void;
  convertProspectToMember: (id: string) => Member;

  // Events & Rehearsals & Services
  events: EventItem[];
  addEvent: (event: Omit<EventItem, 'id' | 'qr_token' | 'is_attendance_open'>) => EventItem;
  updateEvent: (id: string, updates: Partial<EventItem>) => void;
  toggleAttendanceOpen: (eventId: string, isOpen: boolean) => void;
  regenerateQrToken: (eventId: string) => string;

  // Attendance
  attendanceRecords: AttendanceRecord[];
  recordAttendance: (
    eventId: string,
    memberId: string,
    status: AttendanceStatus,
    method: CheckinMethod,
    reason?: string
  ) => { success: boolean; message: string; record?: AttendanceRecord };
  scanQrCheckin: (
    qrToken: string,
    memberId?: string
  ) => { success: boolean; message: string; event?: EventItem; record?: AttendanceRecord };

  // Repertoire
  songs: Song[];
  addSong: (song: Omit<Song, 'id'>) => Song;
  updateSong: (id: string, updates: Partial<Song>) => void;
  deleteSong: (id: string) => void;

  // Development
  developmentGoals: DevelopmentGoal[];
  addDevelopmentGoal: (goal: Omit<DevelopmentGoal, 'id' | 'created_at'>) => DevelopmentGoal;
  updateDevelopmentGoal: (id: string, updates: Partial<DevelopmentGoal>) => void;

  // Announcements & Audit
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  auditLogs: AuditLogItem[];
  logAuditAction: (action: string, targetType: AuditLogItem['target_type'], targetId: string, details: string) => void;

  // Settings
  settings: MinistrySettings;
  updateSettings: (newSettings: Partial<MinistrySettings>) => void;

  // Helper stats
  activeMembersCount: number;
  targetCount: number;
  prospectsCount: number;
  recentAttendanceRate: number;
}

const MinistryContext = createContext<MinistryContextType | undefined>(undefined);

// Initial Seed Data
const INITIAL_SETTINGS: MinistrySettings = {
  ministry_name: 'RCCG Lighthouse Music Ministry',
  target_active_members: 30,
  default_attendance_window_before_mins: 30,
  default_attendance_window_after_mins: 30,
  default_rehearsal_day: 'Saturday',
  default_rehearsal_time: '16:00',
  weekly_focus: ['Blend', 'Harmony', 'Listening', 'Repertoire'],
};

const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mem-1',
    full_name: 'David Okon',
    preferred_name: 'David',
    phone: '+44 7700 900101',
    whatsapp: '+44 7700 900101',
    email: 'david.okon@lighthouse.church',
    date_joined: '2023-01-15',
    role: 'MUSIC_DIRECTOR',
    status: 'ACTIVE_MEMBER',
    vocal_part: 'Tenor',
    instrument: 'Keys/Piano',
    secondary_instrument: 'Acoustic Guitar',
    music_experience: '12 years directing gospel choirs & contemporary worship',
    musical_training: 'ABRSM Grade 8 Piano, Choral Arranging',
    strengths: ['Ensemble Arranging', 'Harmonic Direction', 'Leadership', 'Vocal Coaching'],
    development_areas: ['Delegation', 'Developing Future Directors'],
    skill_level: 'Expert',
    section: 'Worship Leaders',
    leadership_role: 'Music Director',
    recruitment_source: 'Pastor Appointment',
    induction_status: 'Completed',
    availability: 'Full',
    church_connection: 'Existing Lighthouse Member',
    attendance_stats: { total_events: 24, present: 24, late: 0, absent: 0, excused: 0, percentage: 100 },
    private_notes: 'Highly capable director with great spiritual maturity and vision for the 30-member target.',
    leadership_ratings: {
      reliability: 5,
      musical_competence: 5,
      teamwork: 5,
      initiative: 5,
      teachability: 5,
      responsibility: 5,
      notes: 'Exceptional musical and spiritual maturity.',
      updated_at: '2026-09-01',
    },
  },
  {
    id: 'mem-2',
    full_name: 'Pastor Daniel Adeleke',
    preferred_name: 'Pastor Daniel',
    phone: '+44 7700 900001',
    whatsapp: '+44 7700 900001',
    email: 'pastor.daniel@lighthouse.church',
    date_joined: '2022-06-01',
    role: 'SUPER_ADMIN_PASTOR',
    status: 'ACTIVE_MEMBER',
    vocal_part: 'Tenor',
    instrument: 'Vocals Only',
    music_experience: 'Senior Pastor oversight and ministry patron',
    strengths: ['Visionary Guidance', 'Spiritual Covering', 'Church Leadership'],
    development_areas: ['High-level pastoral reports'],
    skill_level: 'Advanced',
    section: 'Pastoral Oversight',
    leadership_role: 'Senior Pastor',
    recruitment_source: 'Church Leadership',
    induction_status: 'Completed',
    availability: 'Full',
    church_connection: 'Existing Lighthouse Member',
    attendance_stats: { total_events: 24, present: 23, late: 1, absent: 0, excused: 0, percentage: 98 },
  },
  {
    id: 'mem-3',
    full_name: 'Blessing Eze',
    preferred_name: 'Blessing',
    phone: '+44 7700 900102',
    whatsapp: '+44 7700 900102',
    email: 'blessing.eze@lighthouse.church',
    date_joined: '2023-04-10',
    role: 'MUSIC_LEADER',
    status: 'ACTIVE_MEMBER',
    vocal_part: 'Soprano',
    instrument: 'Vocals Only',
    secondary_instrument: 'Tambourine',
    music_experience: '7 years church soloist and vocal section leader',
    musical_training: 'Classical voice training, Gospel harmonies',
    strengths: ['Pitch Accuracy', 'High Register Control', 'Vocal Warmups', 'Mentoring Young Singers'],
    development_areas: ['Sight reading complex chord sheets'],
    skill_level: 'Advanced',
    section: 'Sopranos',
    leadership_role: 'Soprano Section Leader',
    recruitment_source: 'Music Ministry Referral',
    induction_status: 'Completed',
    availability: 'Full',
    church_connection: 'Existing Lighthouse Member',
    attendance_stats: { total_events: 24, present: 22, late: 2, absent: 0, excused: 0, percentage: 96 },
    leadership_ratings: {
      reliability: 5,
      musical_competence: 5,
      teamwork: 5,
      initiative: 4,
      teachability: 5,
      responsibility: 5,
      notes: 'Strong candidate for Assistant Music Director in the future.',
      updated_at: '2026-08-15',
    },
  },
  {
    id: 'mem-4',
    full_name: 'Emmanuel Tobi',
    preferred_name: 'Tobi',
    phone: '+44 7700 900103',
    whatsapp: '+44 7700 900103',
    email: 'emmanuel.tobi@lighthouse.church',
    date_joined: '2023-09-12',
    role: 'ATTENDANCE_OFFICER',
    status: 'ACTIVE_MEMBER',
    vocal_part: 'Not Applicable',
    instrument: 'Drums',
    secondary_instrument: 'Auxiliary Percussion',
    music_experience: '6 years gospel and contemporary percussion',
    strengths: ['Pocket / Groove', 'Dynamic Sensitivity', 'Organized & Prompt', 'Tech Savvy'],
    development_areas: ['Metronome discipline on slow ballads'],
    skill_level: 'Advanced',
    section: 'Band / Rhythm Section',
    leadership_role: 'Attendance Officer',
    recruitment_source: 'Existing Lighthouse Member',
    induction_status: 'Completed',
    availability: 'Full',
    church_connection: 'Existing Lighthouse Member',
    attendance_stats: { total_events: 24, present: 23, late: 1, absent: 0, excused: 0, percentage: 98 },
    leadership_ratings: {
      reliability: 5,
      musical_competence: 4,
      teamwork: 5,
      initiative: 4,
      teachability: 5,
      responsibility: 5,
      notes: 'Very trustworthy with attendance and logistical setups.',
      updated_at: '2026-09-10',
    },
  },
  {
    id: 'mem-5',
    full_name: 'Grace Adebayo',
    preferred_name: 'Grace',
    phone: '+44 7700 900104',
    whatsapp: '+44 7700 900104',
    email: 'grace.adebayo@lighthouse.church',
    date_joined: '2024-02-18',
    role: 'MEMBER',
    status: 'ACTIVE_MEMBER',
    vocal_part: 'Alto',
    instrument: 'Vocals Only',
    music_experience: '2 years school choir, 1 year church choir',
    strengths: ['Warm timbre', 'Commitment', 'Eager learner'],
    development_areas: ['Harmony confidence when standing near Sopranos'],
    skill_level: 'Developing',
    section: 'Altos',
    leadership_role: 'None',
    recruitment_source: 'Open Recruitment',
    induction_status: 'Completed',
    availability: 'Full',
    church_connection: 'Invited by Member',
    attendance_stats: { total_events: 24, present: 21, late: 1, absent: 1, excused: 1, percentage: 92 },
    private_notes: 'Shows noticeable improvement every month. Good attitude.',
  },
  {
    id: 'mem-6',
    full_name: 'Samuel Chukwu',
    preferred_name: 'Sammy',
    phone: '+44 7700 900105',
    whatsapp: '+44 7700 900105',
    email: 'samuel.chukwu@lighthouse.church',
    date_joined: '2023-08-01',
    role: 'MEMBER',
    status: 'ACTIVE_MEMBER',
    vocal_part: 'Bass',
    instrument: 'Bass Guitar',
    music_experience: '8 years playing in church bands',
    strengths: ['Solid timing', 'Chord chart reading', 'Gospel runs'],
    development_areas: ['Singing harmony while playing bass'],
    skill_level: 'Advanced',
    section: 'Band / Rhythm Section',
    leadership_role: 'Band Leader',
    recruitment_source: 'Music Ministry Referral',
    induction_status: 'Completed',
    availability: 'Full',
    church_connection: 'Existing Lighthouse Member',
    attendance_stats: { total_events: 24, present: 22, late: 2, absent: 0, excused: 0, percentage: 94 },
    leadership_ratings: {
      reliability: 4,
      musical_competence: 5,
      teamwork: 4,
      initiative: 4,
      teachability: 4,
      responsibility: 4,
      notes: 'Reliable musician. Helps run band rehearsals smoothly.',
      updated_at: '2026-08-10',
    },
  },
  {
    id: 'mem-7',
    full_name: 'Funke Alabi',
    preferred_name: 'Funke',
    phone: '+44 7700 900106',
    whatsapp: '+44 7700 900106',
    email: 'funke.alabi@lighthouse.church',
    date_joined: '2023-11-05',
    role: 'MEMBER',
    status: 'ACTIVE_MEMBER',
    vocal_part: 'Alto',
    instrument: 'Vocals Only',
    music_experience: '4 years university choir',
    strengths: ['Rich low tones', 'Great blending'],
    development_areas: ['Head voice transition'],
    skill_level: 'Intermediate',
    section: 'Altos',
    leadership_role: 'None',
    recruitment_source: 'Existing Lighthouse Member',
    induction_status: 'Completed',
    availability: 'Full',
    church_connection: 'Existing Lighthouse Member',
    attendance_stats: { total_events: 24, present: 20, late: 2, absent: 1, excused: 1, percentage: 88 },
  },
  {
    id: 'mem-8',
    full_name: 'Kofi Mensah',
    preferred_name: 'Kofi',
    phone: '+44 7700 900107',
    whatsapp: '+44 7700 900107',
    email: 'kofi.mensah@lighthouse.church',
    date_joined: '2024-01-20',
    role: 'MEMBER',
    status: 'ACTIVE_MEMBER',
    vocal_part: 'Tenor',
    instrument: 'Lead Guitar',
    music_experience: '5 years worship guitar',
    strengths: ['Ambient swells', 'Solo fills', 'Spiritual sensitivity'],
    development_areas: ['Speeding up during uptempo praise songs'],
    skill_level: 'Intermediate',
    section: 'Band / Rhythm Section',
    leadership_role: 'None',
    recruitment_source: 'Music Recruitment',
    induction_status: 'Completed',
    availability: 'Sundays Only',
    church_connection: 'New Church Attendee',
    attendance_stats: { total_events: 24, present: 19, late: 2, absent: 2, excused: 1, percentage: 84 },
  },
  {
    id: 'mem-9',
    full_name: 'Esther Olatunji',
    preferred_name: 'Esther',
    phone: '+44 7700 900108',
    whatsapp: '+44 7700 900108',
    email: 'esther.o@lighthouse.church',
    date_joined: '2023-03-14',
    role: 'MEMBER',
    status: 'ACTIVE_MEMBER',
    vocal_part: 'Soprano',
    instrument: 'Vocals Only',
    music_experience: '5 years praise team',
    strengths: ['Clear diction', 'Energetic stage presence', 'Vocal agility'],
    development_areas: ['Volume dynamics during quiet reflection'],
    skill_level: 'Advanced',
    section: 'Sopranos',
    leadership_role: 'None',
    recruitment_source: 'Pastor/church leadership',
    induction_status: 'Completed',
    availability: 'Full',
    church_connection: 'Existing Lighthouse Member',
    attendance_stats: { total_events: 24, present: 23, late: 1, absent: 0, excused: 0, percentage: 98 },
  },
  {
    id: 'mem-10',
    full_name: 'Joshua Balogun',
    preferred_name: 'Josh',
    phone: '+44 7700 900109',
    whatsapp: '+44 7700 900109',
    email: 'joshua.b@lighthouse.church',
    date_joined: '2024-03-01',
    role: 'MEMBER',
    status: 'ACTIVE_MEMBER',
    vocal_part: 'Tenor',
    instrument: 'Vocals Only',
    music_experience: '3 years youth choir',
    strengths: ['Bright tone', 'Fast song learner'],
    development_areas: ['Breath control on long phrases'],
    skill_level: 'Developing',
    section: 'Tenors',
    leadership_role: 'None',
    recruitment_source: 'Member referral',
    induction_status: 'Completed',
    availability: 'Full',
    church_connection: 'Existing Lighthouse Member',
    attendance_stats: { total_events: 24, present: 21, late: 2, absent: 1, excused: 0, percentage: 90 },
  },
  {
    id: 'mem-11',
    full_name: 'Victoria Adams',
    preferred_name: 'Vicky',
    phone: '+44 7700 900110',
    whatsapp: '+44 7700 900110',
    email: 'victoria.a@lighthouse.church',
    date_joined: '2023-07-22',
    role: 'MEMBER',
    status: 'ACTIVE_MEMBER',
    vocal_part: 'Alto',
    instrument: 'Strings',
    music_experience: 'Violinist and Alto vocalist',
    strengths: ['Orchestral ear', 'Perfect pitch'],
    development_areas: ['African gospel timing'],
    skill_level: 'Advanced',
    section: 'Altos',
    leadership_role: 'None',
    recruitment_source: 'Community',
    induction_status: 'Completed',
    availability: 'Full',
    church_connection: 'Community Contact',
    attendance_stats: { total_events: 24, present: 22, late: 1, absent: 1, excused: 0, percentage: 94 },
  },
  {
    id: 'mem-12',
    full_name: 'Caleb Nnamdi',
    preferred_name: 'Caleb',
    phone: '+44 7700 900111',
    whatsapp: '+44 7700 900111',
    email: 'caleb.n@lighthouse.church',
    date_joined: '2024-04-15',
    role: 'MEMBER',
    status: 'ACTIVE_MEMBER',
    vocal_part: 'Bass',
    instrument: 'Vocals Only',
    music_experience: 'Gospel quartet singer',
    strengths: ['Deep resonance', 'Steady bottom harmony'],
    development_areas: ['Transitions from speech to singing'],
    skill_level: 'Intermediate',
    section: 'Tenors & Basses',
    leadership_role: 'None',
    recruitment_source: 'Audition/recruitment event',
    induction_status: 'Completed',
    availability: 'Full',
    church_connection: 'New Church Attendee',
    attendance_stats: { total_events: 24, present: 20, late: 2, absent: 1, excused: 1, percentage: 88 },
  },
  {
    id: 'mem-13',
    full_name: 'Chidinma Nwosu',
    preferred_name: 'Chidi',
    phone: '+44 7700 900112',
    whatsapp: '+44 7700 900112',
    email: 'chidinma.n@lighthouse.church',
    date_joined: '2023-10-18',
    role: 'MEMBER',
    status: 'ACTIVE_MEMBER',
    vocal_part: 'Soprano',
    instrument: 'Vocals Only',
    music_experience: '4 years church choir',
    strengths: ['Expressive worship ministration', 'Great memory'],
    development_areas: ['Vocal strain at top notes'],
    skill_level: 'Intermediate',
    section: 'Sopranos',
    leadership_role: 'None',
    recruitment_source: 'Existing Lighthouse member',
    induction_status: 'Completed',
    availability: 'Full',
    church_connection: 'Existing Lighthouse Member',
    attendance_stats: { total_events: 24, present: 21, late: 1, absent: 1, excused: 1, percentage: 90 },
  },
  {
    id: 'mem-14',
    full_name: 'Timothy Adeleke',
    preferred_name: 'Timmy',
    phone: '+44 7700 900113',
    whatsapp: '+44 7700 900113',
    email: 'timothy.a@lighthouse.church',
    date_joined: '2024-05-02',
    role: 'MEMBER',
    status: 'ACTIVE_MEMBER',
    vocal_part: 'Not Applicable',
    instrument: 'Saxophone',
    secondary_instrument: 'Acoustic Guitar',
    music_experience: 'Alto sax in high school and church bands',
    strengths: ['Melodic riffs', 'Horn arrangements'],
    development_areas: ['Playing quietly behind prayer ministers'],
    skill_level: 'Intermediate',
    section: 'Band / Horns',
    leadership_role: 'None',
    recruitment_source: 'Music recruitment',
    induction_status: 'Completed',
    availability: 'Full',
    church_connection: 'Invited by Member',
    attendance_stats: { total_events: 20, present: 18, late: 1, absent: 1, excused: 0, percentage: 92 },
  },
  {
    id: 'mem-15',
    full_name: 'Rachel Bamidele',
    preferred_name: 'Rachel',
    phone: '+44 7700 900114',
    whatsapp: '+44 7700 900114',
    email: 'rachel.b@lighthouse.church',
    date_joined: '2024-06-11',
    role: 'MEMBER',
    status: 'ACTIVE_MEMBER',
    vocal_part: 'Alto',
    instrument: 'Vocals Only',
    music_experience: 'High school chorus',
    strengths: ['Steady ear', 'Punctuality'],
    development_areas: ['Vocal projection without microphone'],
    skill_level: 'Developing',
    section: 'Altos',
    leadership_role: 'None',
    recruitment_source: 'Open recruitment',
    induction_status: 'Completed',
    availability: 'Full',
    church_connection: 'Existing Lighthouse Member',
    attendance_stats: { total_events: 16, present: 15, late: 1, absent: 0, excused: 0, percentage: 96 },
  },
  {
    id: 'mem-16',
    full_name: 'Philip Osei',
    preferred_name: 'Phil',
    phone: '+44 7700 900115',
    whatsapp: '+44 7700 900115',
    email: 'philip.o@lighthouse.church',
    date_joined: '2024-06-20',
    role: 'MEMBER',
    status: 'ACTIVE_MEMBER',
    vocal_part: 'Tenor',
    instrument: 'Auxiliary Percussion',
    music_experience: 'Congas, talking drum, shakers',
    strengths: ['African rhythmic drive', 'Energy'],
    development_areas: ['Pacing on slow worship transitions'],
    skill_level: 'Intermediate',
    section: 'Band / Rhythm Section',
    leadership_role: 'None',
    recruitment_source: 'Community contact',
    induction_status: 'Completed',
    availability: 'Full',
    church_connection: 'New Church Attendee',
    attendance_stats: { total_events: 15, present: 14, late: 1, absent: 0, excused: 0, percentage: 95 },
  },
  {
    id: 'mem-17',
    full_name: 'Abigail Davies',
    preferred_name: 'Abby',
    phone: '+44 7700 900116',
    whatsapp: '+44 7700 900116',
    email: 'abigail.d@lighthouse.church',
    date_joined: '2024-07-01',
    role: 'MEMBER',
    status: 'ACTIVE_MEMBER',
    vocal_part: 'Soprano',
    instrument: 'Vocals Only',
    music_experience: 'Soloist in youth choir',
    strengths: ['Vocal warmth', 'Vibrant praise ministration'],
    development_areas: ['Harmony blending with section'],
    skill_level: 'Intermediate',
    section: 'Sopranos',
    leadership_role: 'None',
    recruitment_source: 'Music ministry referral',
    induction_status: 'Completed',
    availability: 'Full',
    church_connection: 'Existing Lighthouse Member',
    attendance_stats: { total_events: 12, present: 11, late: 1, absent: 0, excused: 0, percentage: 94 },
  },
  {
    id: 'mem-18',
    full_name: 'Gabriel Martins',
    preferred_name: 'Gabe',
    phone: '+44 7700 900117',
    whatsapp: '+44 7700 900117',
    email: 'gabriel.m@lighthouse.church',
    date_joined: '2024-07-15',
    role: 'MEMBER',
    status: 'ACTIVE_MEMBER',
    vocal_part: 'Tenor',
    instrument: 'Keys/Piano',
    music_experience: 'Secondary keyboardist and tenor backing vocals',
    strengths: ['Synth pads', 'Organ chords', 'Quick learner'],
    development_areas: ['Key transposition on fly'],
    skill_level: 'Developing',
    section: 'Band / Rhythm Section',
    leadership_role: 'None',
    recruitment_source: 'Pastor referral',
    induction_status: 'Completed',
    availability: 'Full',
    church_connection: 'Existing Lighthouse Member',
    attendance_stats: { total_events: 10, present: 9, late: 1, absent: 0, excused: 0, percentage: 92 },
  },
  // Developing members (on pathway to 30 Active)
  {
    id: 'mem-19',
    full_name: 'Deborah Sowande',
    preferred_name: 'Deborah',
    phone: '+44 7700 900118',
    whatsapp: '+44 7700 900118',
    email: 'deborah.s@lighthouse.church',
    date_joined: '2024-08-01',
    role: 'MEMBER',
    status: 'DEVELOPING',
    vocal_part: 'Alto',
    instrument: 'Vocals Only',
    music_experience: 'Beginner vocalist, completed induction',
    strengths: ['Eager to learn', 'Faithful attendance at training'],
    development_areas: ['Vocal control and harmony retention'],
    skill_level: 'Developing',
    section: 'Altos (Trainee)',
    leadership_role: 'None',
    recruitment_source: 'Open recruitment',
    induction_status: 'In Progress',
    availability: 'Full',
    church_connection: 'New Church Attendee',
    attendance_stats: { total_events: 8, present: 7, late: 1, absent: 0, excused: 0, percentage: 90 },
  },
  {
    id: 'mem-20',
    full_name: 'Daniel Omotayo',
    preferred_name: 'Danny',
    phone: '+44 7700 900119',
    whatsapp: '+44 7700 900119',
    email: 'daniel.o@lighthouse.church',
    date_joined: '2024-08-10',
    role: 'MEMBER',
    status: 'DEVELOPING',
    vocal_part: 'Tenor',
    instrument: 'Acoustic Guitar',
    music_experience: 'Self-taught guitarist',
    strengths: ['Rhythm strumming', 'Humble spirit'],
    development_areas: ['Barre chords and fingerpicking'],
    skill_level: 'Developing',
    section: 'Band (Trainee)',
    leadership_role: 'None',
    recruitment_source: 'Member referral',
    induction_status: 'In Progress',
    availability: 'Saturdays Only',
    church_connection: 'Invited by Member',
    attendance_stats: { total_events: 6, present: 5, late: 1, absent: 0, excused: 0, percentage: 88 },
  },
  {
    id: 'mem-21',
    full_name: 'Hannah Mensah',
    preferred_name: 'Hannah',
    phone: '+44 7700 900120',
    whatsapp: '+44 7700 900120',
    email: 'hannah.m@lighthouse.church',
    date_joined: '2024-08-18',
    role: 'MEMBER',
    status: 'DEVELOPING',
    vocal_part: 'Soprano',
    instrument: 'Vocals Only',
    music_experience: 'Choir in Ghana, recently relocated',
    strengths: ['Clear voice', 'Rich cultural gospel background'],
    development_areas: ['Familiarity with current church repertoire'],
    skill_level: 'Intermediate',
    section: 'Sopranos (Trainee)',
    leadership_role: 'None',
    recruitment_source: 'Existing Lighthouse member',
    induction_status: 'In Progress',
    availability: 'Full',
    church_connection: 'Existing Lighthouse Member',
    attendance_stats: { total_events: 6, present: 5, late: 1, absent: 0, excused: 0, percentage: 90 },
  },
  {
    id: 'mem-22',
    full_name: 'Lucas Adeyemi',
    preferred_name: 'Lucas',
    phone: '+44 7700 900121',
    whatsapp: '+44 7700 900121',
    email: 'lucas.a@lighthouse.church',
    date_joined: '2024-08-25',
    role: 'MEMBER',
    status: 'DEVELOPING',
    vocal_part: 'Bass',
    instrument: 'Sound / Media',
    music_experience: 'Sound technician with keen ear for vocal balance',
    strengths: ['Soundboard mixing', 'EQ for vocals'],
    development_areas: ['Live recording workflow'],
    skill_level: 'Intermediate',
    section: 'Audio & Tech',
    leadership_role: 'None',
    recruitment_source: 'Music recruitment',
    induction_status: 'In Progress',
    availability: 'Full',
    church_connection: 'Community Contact',
    attendance_stats: { total_events: 5, present: 5, late: 0, absent: 0, excused: 0, percentage: 100 },
  },
  {
    id: 'mem-23',
    full_name: 'Beatrice Cole',
    preferred_name: 'Beatrice',
    phone: '+44 7700 900122',
    whatsapp: '+44 7700 900122',
    email: 'beatrice.c@lighthouse.church',
    date_joined: '2023-05-10',
    role: 'MEMBER',
    status: 'INACTIVE',
    vocal_part: 'Alto',
    instrument: 'Vocals Only',
    music_experience: '3 years choir',
    strengths: ['Vocal tone'],
    development_areas: ['Attendance consistency'],
    skill_level: 'Intermediate',
    section: 'Altos',
    leadership_role: 'None',
    recruitment_source: 'Existing Lighthouse member',
    induction_status: 'Completed',
    availability: 'Variable',
    church_connection: 'Existing Lighthouse Member',
    attendance_stats: { total_events: 24, present: 10, late: 3, absent: 8, excused: 3, percentage: 48 },
    private_notes: 'On temporary leave due to university examinations. Follow up in November.',
  },
];

const INITIAL_PROSPECTS: RecruitmentProspect[] = [
  {
    id: 'prosp-1',
    name: 'Michael Johnson',
    phone: '+44 7700 900201',
    whatsapp: '+44 7700 900201',
    email: 'michael.j@gmail.com',
    source: 'Community',
    date_discovered: '2026-09-12',
    interested_role: 'Bass Singer',
    vocal_or_instrument_ability: 'Deep, resonant bass baritone with choir background',
    experience_level: '4 years university gospel choir',
    current_stage: 'CONNECTED',
    follow_up_date: '2026-10-02',
    assigned_leader_id: 'mem-1',
    assigned_leader_name: 'David Okon',
    notes: 'Met at September church praise night. Keen to connect. Sent invite to Saturday rehearsal.',
    church_connection: 'Community Contact',
    history: [
      { stage: 'PROSPECT', date: '2026-09-12', notes: 'Connected during outreach service', changed_by: 'David Okon' },
      { stage: 'INTERESTED', date: '2026-09-18', notes: 'WhatsApp chat confirmed keen interest', changed_by: 'David Okon' },
      { stage: 'CONNECTED', date: '2026-09-24', notes: 'Attended worship service, greeted pastoral team', changed_by: 'David Okon' },
    ],
  },
  {
    id: 'prosp-2',
    name: 'Samuel King',
    phone: '+44 7700 900202',
    whatsapp: '+44 7700 900202',
    email: 'samuel.king@gmail.com',
    source: 'Member referral',
    date_discovered: '2026-09-15',
    interested_role: 'Saxophonist / Woodwinds',
    vocal_or_instrument_ability: 'Tenor and Alto Saxophone, good sight reading',
    experience_level: 'Played in Christian fellowship band for 3 years',
    current_stage: 'ASSESSMENT',
    follow_up_date: '2026-10-03',
    assigned_leader_id: 'mem-6',
    assigned_leader_name: 'Samuel Chukwu',
    notes: 'Audition scheduled for this coming Saturday before rehearsal starts.',
    church_connection: 'Invited by Member',
    history: [
      { stage: 'PROSPECT', date: '2026-09-15', notes: 'Referred by Sammy Chukwu', changed_by: 'David Okon' },
      { stage: 'INTERESTED', date: '2026-09-19', notes: 'Sent church vision and ministry guidelines', changed_by: 'David Okon' },
      { stage: 'ASSESSMENT', date: '2026-09-25', notes: 'Audition invite confirmed', changed_by: 'Samuel Chukwu' },
    ],
  },
  {
    id: 'prosp-3',
    name: 'Sarah Osei',
    phone: '+44 7700 900203',
    whatsapp: '+44 7700 900203',
    email: 'sarah.osei@gmail.com',
    source: 'Existing Lighthouse members',
    date_discovered: '2026-09-08',
    interested_role: 'Soprano Vocalist',
    vocal_or_instrument_ability: 'Clear, high soprano register',
    experience_level: 'Sang in church youth choir in Manchester',
    current_stage: 'INDUCTION',
    follow_up_date: '2026-10-01',
    assigned_leader_id: 'mem-3',
    assigned_leader_name: 'Blessing Eze',
    notes: 'Completed assessment with great feedback. Currently going through ministry induction handbook.',
    church_connection: 'Existing Lighthouse Member',
    history: [
      { stage: 'PROSPECT', date: '2026-09-08', notes: 'Expressed interest after Sunday service', changed_by: 'Blessing Eze' },
      { stage: 'ASSESSMENT', date: '2026-09-14', notes: 'Vocal range test completed: Soprano 1', changed_by: 'David Okon' },
      { stage: 'INDUCTION', date: '2026-09-22', notes: 'Started 2-week induction on expectations & culture', changed_by: 'Blessing Eze' },
    ],
  },
  {
    id: 'prosp-4',
    name: 'Joshua Bamidele',
    phone: '+44 7700 900204',
    whatsapp: '+44 7700 900204',
    email: 'joshua.bam@gmail.com',
    source: 'Pastor/church leadership',
    date_discovered: '2026-09-20',
    interested_role: 'Keyboard / Auxiliary Keys',
    vocal_or_instrument_ability: 'Keyboard chords, gospel pads, rhythm timing',
    experience_level: '2 years amateur keys',
    current_stage: 'INTERESTED',
    follow_up_date: '2026-10-04',
    assigned_leader_id: 'mem-1',
    assigned_leader_name: 'David Okon',
    notes: 'Pastor Daniel introduced him. Looking to join band.',
    church_connection: 'New Church Attendee',
    history: [
      { stage: 'PROSPECT', date: '2026-09-20', notes: 'Introduced by Pastor Daniel', changed_by: 'David Okon' },
      { stage: 'INTERESTED', date: '2026-09-22', notes: 'Introductory phone call completed', changed_by: 'David Okon' },
    ],
  },
  {
    id: 'prosp-5',
    name: 'Ruth Mwangi',
    phone: '+44 7700 900205',
    whatsapp: '+44 7700 900205',
    email: 'ruth.m@gmail.com',
    source: 'Audition/recruitment event',
    date_discovered: '2026-09-01',
    interested_role: 'Alto Vocalist',
    vocal_or_instrument_ability: 'Warm gospel alto tone, good ear for thirds',
    experience_level: 'Church singer for 5 years',
    current_stage: 'DEVELOPING',
    follow_up_date: '2026-10-05',
    assigned_leader_id: 'mem-3',
    assigned_leader_name: 'Blessing Eze',
    notes: 'Nearly ready for full active member induction. Rehearsing weekly focus songs.',
    church_connection: 'Music Recruitment',
    history: [
      { stage: 'PROSPECT', date: '2026-09-01', notes: 'Audition event', changed_by: 'David Okon' },
      { stage: 'ASSESSMENT', date: '2026-09-07', notes: 'Passed audition with high remarks', changed_by: 'David Okon' },
      { stage: 'INDUCTION', date: '2026-09-14', notes: 'Induction completed', changed_by: 'Blessing Eze' },
      { stage: 'DEVELOPING', date: '2026-09-21', notes: 'Onboarded into development pipeline', changed_by: 'David Okon' },
    ],
  },
  {
    id: 'prosp-6',
    name: 'Elijah Okoro',
    phone: '+44 7700 900206',
    whatsapp: '+44 7700 900206',
    email: 'elijah.okoro@gmail.com',
    source: 'Open recruitment',
    date_discovered: '2026-09-27',
    interested_role: 'Drums / Percussion',
    vocal_or_instrument_ability: 'Dynamic gospel drummer',
    experience_level: 'High school band drummer',
    current_stage: 'PROSPECT',
    follow_up_date: '2026-10-02',
    assigned_leader_id: 'mem-4',
    assigned_leader_name: 'Emmanuel Tobi',
    notes: 'Submitted recruitment form online. Tobi to call him for initial welcome.',
    church_connection: 'Community Contact',
    history: [
      { stage: 'PROSPECT', date: '2026-09-27', notes: 'Registered via web recruitment', changed_by: 'System' },
    ],
  },
];

const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Saturday Choir & Band Rehearsal',
    type: 'Rehearsal',
    date: '2026-10-03',
    start_time: '16:00',
    end_time: '18:30',
    location: 'Main Church Auditorium, RCCG Lighthouse',
    attendance_window_before_mins: 30,
    attendance_window_after_mins: 30,
    notes: 'Focus on harmonic blend and dynamic contrast for upcoming Communion Sunday.',
    assigned_participant_ids: [
      'mem-1', 'mem-3', 'mem-4', 'mem-5', 'mem-6', 'mem-7', 'mem-8', 'mem-9',
      'mem-10', 'mem-11', 'mem-12', 'mem-13', 'mem-14', 'mem-15', 'mem-16',
      'mem-17', 'mem-18', 'mem-19', 'mem-20', 'mem-21'
    ],
    focus_topics: ['Blend', 'Harmony', 'Listening', 'Repertoire', 'Vocal Development'],
    song_ids: ['song-1', 'song-2', 'song-3', 'song-4'],
    qr_token: 'LIGHTHOUSE-REHEARSAL-OCT03-2026',
    is_attendance_open: true,
  },
  {
    id: 'evt-2',
    title: 'Sunday Celebration Service',
    type: 'Sunday Service',
    date: '2026-10-04',
    start_time: '08:30',
    end_time: '11:45',
    location: 'Main Sanctuary, RCCG Lighthouse',
    attendance_window_before_mins: 45,
    attendance_window_after_mins: 30,
    notes: 'First Sunday Thanksgiving & Communion Service. All members in formal choir attire.',
    assigned_participant_ids: [
      'mem-1', 'mem-2', 'mem-3', 'mem-4', 'mem-5', 'mem-6', 'mem-7', 'mem-8',
      'mem-9', 'mem-10', 'mem-11', 'mem-12', 'mem-13', 'mem-14', 'mem-15',
      'mem-16', 'mem-17', 'mem-18'
    ],
    order_of_service: {
      opening_prayer: 'Pastor Daniel Adeleke',
      praise_leader: 'Blessing Eze',
      worship_leader: 'David Okon',
      special_ministration: 'Total Praise — Lighthouse Choir',
      keyboardist: 'David Okon & Gabriel Martins',
      bass_player: 'Samuel Chukwu',
      drummer: 'Emmanuel Tobi',
      lead_guitarist: 'Kofi Mensah',
      sound_lead: 'Lucas Adeyemi',
      notes: 'Transition seamlessly between Praise and Worship without abrupt pauses.',
    },
    song_ids: ['song-1', 'song-2', 'song-3', 'song-5'],
    qr_token: 'LIGHTHOUSE-SUNDAY-OCT04-2026',
    is_attendance_open: false,
  },
  {
    id: 'evt-3',
    title: 'Vocal Sectionals & Harmony Workshop',
    type: 'Training',
    date: '2026-10-10',
    start_time: '14:30',
    end_time: '16:00',
    location: 'Choir Room / Annex',
    attendance_window_before_mins: 15,
    attendance_window_after_mins: 15,
    notes: 'Special training on ear tuning, sight reading, and vocal health.',
    assigned_participant_ids: [
      'mem-1', 'mem-3', 'mem-5', 'mem-7', 'mem-9', 'mem-10', 'mem-11',
      'mem-12', 'mem-13', 'mem-15', 'mem-17', 'mem-19', 'mem-21'
    ],
    focus_topics: ['Harmony', 'Ear Training', 'Vocal Development'],
    song_ids: ['song-3'],
    qr_token: 'LIGHTHOUSE-TRAIN-OCT10-2026',
    is_attendance_open: false,
  },
  {
    id: 'evt-4',
    title: 'Midweek Rehearsal (Past Session)',
    type: 'Rehearsal',
    date: '2026-09-26',
    start_time: '16:00',
    end_time: '18:00',
    location: 'Main Church Auditorium, RCCG Lighthouse',
    attendance_window_before_mins: 30,
    attendance_window_after_mins: 30,
    assigned_participant_ids: ['mem-1', 'mem-3', 'mem-4', 'mem-5', 'mem-6', 'mem-7', 'mem-9'],
    song_ids: ['song-1', 'song-4'],
    qr_token: 'LIGHTHOUSE-PAST-SEP26-2026',
    is_attendance_open: false,
    post_rehearsal_review: {
      worked_on: 'Refined 4-part choir arrangement on "Total Praise", focused on breath support for Altos.',
      improved: 'Soprano intonation on the sustained high G; drummer pocket with click track.',
      needs_work: 'Tenor section blend on verse 2; bass guitar dynamics during vocal crescendos.',
      next_focus: 'Seamless transition into African high praise medley and stage presence.',
      recorded_by: 'David Okon',
      recorded_at: '2026-09-26T18:45:00Z',
    },
  },
];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    event_id: 'evt-1',
    member_id: 'mem-1',
    member_name: 'David Okon',
    member_section: 'Worship Leaders',
    status: 'present',
    checkin_method: 'officer_checkin',
    timestamp: '2026-10-03T15:45:00Z',
    recorded_by: 'Emmanuel Tobi',
  },
  {
    id: 'att-2',
    event_id: 'evt-1',
    member_id: 'mem-3',
    member_name: 'Blessing Eze',
    member_section: 'Sopranos',
    status: 'present',
    checkin_method: 'qr_scan',
    timestamp: '2026-10-03T15:48:00Z',
    recorded_by: 'Self (QR Scan)',
  },
  {
    id: 'att-3',
    event_id: 'evt-1',
    member_id: 'mem-4',
    member_name: 'Emmanuel Tobi',
    member_section: 'Band / Rhythm Section',
    status: 'present',
    checkin_method: 'officer_checkin',
    timestamp: '2026-10-03T15:40:00Z',
    recorded_by: 'Emmanuel Tobi',
  },
  {
    id: 'att-4',
    event_id: 'evt-1',
    member_id: 'mem-6',
    member_name: 'Samuel Chukwu',
    member_section: 'Band / Rhythm Section',
    status: 'present',
    checkin_method: 'qr_scan',
    timestamp: '2026-10-03T15:52:00Z',
    recorded_by: 'Self (QR Scan)',
  },
  {
    id: 'att-5',
    event_id: 'evt-1',
    member_id: 'mem-9',
    member_name: 'Esther Olatunji',
    member_section: 'Sopranos',
    status: 'present',
    checkin_method: 'qr_scan',
    timestamp: '2026-10-03T15:55:00Z',
    recorded_by: 'Self (QR Scan)',
  },
  {
    id: 'att-6',
    event_id: 'evt-1',
    member_id: 'mem-5',
    member_name: 'Grace Adebayo',
    member_section: 'Altos',
    status: 'late',
    checkin_method: 'qr_scan',
    timestamp: '2026-10-03T16:18:00Z',
    recorded_by: 'Self (QR Scan)',
    reason: 'Delayed public transit',
  },
];

const INITIAL_SONGS: Song[] = [
  {
    id: 'song-1',
    title: 'Great Are You Lord',
    artist: 'All Sons & Daughters / Sinach',
    key: 'G',
    tempo_bpm: 72,
    category: 'Worship',
    status: 'READY',
    lyrics: `You give life, You are love
You bring light to the darkness
You give hope, You restore every heart that is broken
And great are You, Lord

It's Your breath in our lungs
So we pour out our praise, we pour out our praise
It's Your breath in our lungs
So we pour out our praise to You only

All the earth will shout Your praise
Our hearts will cry, these bones will sing
Great are You, Lord`,
    vocal_notes: 'Start unison, introduce warm 3-part harmony on second chorus. Tenors lead the bridge.',
    arrangement_notes: 'Gentle piano & acoustic guitar intro; build with full band on bridge.',
    last_ministered: '2026-09-20',
  },
  {
    id: 'song-2',
    title: 'Olorun Agbaye (You Are Mighty)',
    artist: 'Nathaniel Bassey ft. Chandler Moore & Oba',
    key: 'C',
    tempo_bpm: 78,
    category: 'African Praise',
    status: 'READY',
    lyrics: `Olorun Agbaye o (Mighty God of the universe)
You are mighty, You are mighty
Kabiyesi o (King of Kings)
Hosanna to the King of Glory

No one compares to You
You rule and reign forevermore
Great is Your name, glorious are Your ways`,
    vocal_notes: 'Blessing leads opening chant in Yoruba; choir enters strong in 3 parts with call and response.',
    arrangement_notes: 'Talking drum and horns enter at chorus 2. Dynamics must peak at bridge.',
    last_ministered: '2026-09-13',
  },
  {
    id: 'song-3',
    title: 'Total Praise',
    artist: 'Richard Smallwood',
    key: 'Eb',
    tempo_bpm: 64,
    category: 'Choir Anthem',
    status: 'DEVELOPING',
    lyrics: `Lord, I will lift mine eyes to the hills
Knowing my help is coming from You
Your peace, You give in time of the storm

You are the source of my strength
You are the strength of my life
I lift my hands in total praise to You

Amen, Amen, Amen, Amen
Amen, Amen, Amen, Amen`,
    vocal_notes: 'Classic choral gospel. Precision in 4-part voice leading. Sustained high notes require strong diaphragm support.',
    arrangement_notes: 'Classical gospel piano style. Band joins progressively at "You are the source".',
  },
  {
    id: 'song-4',
    title: 'Goodness of God',
    artist: 'Bethel Music / CeCe Winans',
    key: 'Ab',
    tempo_bpm: 70,
    category: 'Worship',
    status: 'READY',
    lyrics: `I love You, Lord
For Your mercy never fails me
All my days, I've been held in Your hands
From the moment that I wake up until I lay my head
Oh, I will sing of the goodness of God

All my life You have been faithful
All my life You have been so, so good
With every breath that I am able
Oh, I will sing of the goodness of God`,
    vocal_notes: 'Soloist verse 1; Altos and Tenors join gentle thirds in chorus.',
    arrangement_notes: 'Electric guitar swells with dotted-eighth delay.',
    last_ministered: '2026-09-27',
  },
  {
    id: 'song-5',
    title: 'Jehovah You Are So Good (African Praise Medley)',
    artist: 'Traditional / RCCG Praise',
    key: 'G',
    tempo_bpm: 126,
    category: 'African Praise',
    status: 'READY',
    lyrics: `Jehovah You are so good! (So good!)
Jehovah You are so kind! (So kind!)
Jehovah You are so good, excellent is Your name!

What shall I render unto the Lord?
For all His benefits toward me?
I will lift up the cup of salvation
And call upon the name of the Lord!`,
    vocal_notes: 'High energy! Section leaders dance and motivate the congregation.',
    arrangement_notes: 'Fast African highlife groove. Congas and brass fills throughout.',
    last_ministered: '2026-09-27',
  },
  {
    id: 'song-6',
    title: 'The Blessing',
    artist: 'Kari Jobe, Cody Carnes, Elevation Worship',
    key: 'B',
    tempo_bpm: 70,
    category: 'Worship',
    status: 'READY',
    lyrics: `The Lord bless you and keep you
Make His face shine upon you and be gracious to you
The Lord turn His face toward you and give you peace

Amen, amen, amen
Amen, amen, amen

May His favor be upon you and a thousand generations
And your family and your children and their children`,
    vocal_notes: 'Prayer and ministration song. Very soft, intimate delivery building to majestic anthem.',
    arrangement_notes: 'Acoustic piano driven.',
  },
];

const INITIAL_DEVELOPMENT_GOALS: DevelopmentGoal[] = [
  {
    id: 'goal-1',
    member_id: 'mem-5',
    member_name: 'Grace Adebayo',
    category: 'Harmony',
    goal_title: 'Harmony confidence & independent part-holding',
    current_level: 'Developing',
    target_action: 'Complete weekly alto sectional exercise and record audio practice check-in',
    assigned_by: 'David Okon',
    status: 'In Progress',
    notes: 'Working on "Total Praise" alto intervals. Already sounding much more grounded.',
    review_date: '2026-10-15',
    created_at: '2026-09-01',
  },
  {
    id: 'goal-2',
    member_id: 'mem-10',
    member_name: 'Joshua Balogun',
    category: 'Vocal Development',
    goal_title: 'Breath management and high range stamina',
    current_level: 'Developing',
    target_action: 'Daily 10-minute diaphragmatic breathing and lip trill routines',
    assigned_by: 'Blessing Eze',
    status: 'In Progress',
    notes: 'Vocal fatigue reduced noticeably after 2 weeks of warm-down routines.',
    review_date: '2026-10-20',
    created_at: '2026-09-05',
  },
  {
    id: 'goal-3',
    member_id: 'mem-6',
    member_name: 'Samuel Chukwu',
    category: 'Leadership',
    goal_title: 'Band Rehearsal Direction & Time Management',
    current_level: 'Intermediate',
    target_action: 'Lead the 30-minute band rhythm warmup and chord coordination',
    assigned_by: 'David Okon',
    status: 'In Progress',
    notes: 'Demonstrating good communication with drummer and keyboardists.',
    review_date: '2026-10-30',
    created_at: '2026-08-20',
  },
  {
    id: 'goal-4',
    member_id: 'mem-8',
    member_name: 'Kofi Mensah',
    category: 'Musicianship',
    goal_title: 'Tempo stability on uptempo gospel shuffles',
    current_level: 'Developing',
    target_action: 'Metronome practice at 120-130 BPM with click on 2 & 4',
    assigned_by: 'David Okon',
    status: 'Completed',
    notes: 'Solidified groove. Passed band check with flying colors.',
    review_date: '2026-09-25',
    created_at: '2026-08-10',
  },
  {
    id: 'goal-5',
    member_id: 'mem-19',
    member_name: 'Deborah Sowande',
    category: 'Ear Training',
    goal_title: 'Accurate pitch matching and interval recognition',
    current_level: 'Beginner',
    target_action: 'Complete Solfege exercises Do-Re-Mi-Fa-Sol with Blessing',
    assigned_by: 'Blessing Eze',
    status: 'In Progress',
    notes: 'Showing high enthusiasm. Pitch accuracy improved 40%.',
    review_date: '2026-10-18',
    created_at: '2026-09-12',
  },
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Saturday Rehearsal & 30-Member Target Focus',
    content: 'Praise the Lord saints! Please be on time at 4:00 PM this Saturday. We will be fine-tuning our dynamic blend on "Total Praise" and welcoming our new developing members. Let us continue praying for our ministry growth target of 30 committed worshippers!',
    priority: 'important',
    date: '2026-09-29',
    author: 'Brother David Okon (Music Director)',
    audience: 'all',
  },
  {
    id: 'ann-2',
    title: 'Communion Sunday Service Attire',
    content: 'For this coming Sunday, choir attire is Royal Deep Green with Gold accents. Sound team and band setup begins promptly at 07:45 AM.',
    priority: 'normal',
    date: '2026-09-28',
    author: 'Sister Blessing Eze (Section Leader)',
    audience: 'all',
  },
];

const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    user_name: 'David Okon',
    user_role: 'MUSIC_DIRECTOR',
    action: 'Opened QR Attendance',
    target_type: 'event',
    target_id: 'evt-1',
    details: 'Opened live attendance window for Saturday Rehearsal',
    timestamp: '2026-10-03T15:30:00Z',
  },
  {
    id: 'log-2',
    user_name: 'Emmanuel Tobi',
    user_role: 'ATTENDANCE_OFFICER',
    action: 'Manual Attendance Check-in',
    target_type: 'attendance',
    target_id: 'mem-1',
    details: 'Marked David Okon as Present',
    timestamp: '2026-10-03T15:45:00Z',
  },
  {
    id: 'log-3',
    user_name: 'David Okon',
    user_role: 'MUSIC_DIRECTOR',
    action: 'Status Change',
    target_type: 'recruitment',
    target_id: 'prosp-5',
    details: 'Moved Ruth Mwangi from INDUCTION to DEVELOPING',
    timestamp: '2026-09-21T17:00:00Z',
  },
];

export const MinistryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or initialize with seed data
  const [currentUserRole, setCurrentUserRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('lighthouse_user_role') as UserRole) || 'MUSIC_DIRECTOR';
  });

  const [currentMemberId, setCurrentMemberIdState] = useState<string>(() => {
    return localStorage.getItem('lighthouse_member_id') || 'mem-1';
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('lighthouse_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [prospects, setProspects] = useState<RecruitmentProspect[]>(() => {
    const saved = localStorage.getItem('lighthouse_prospects');
    return saved ? JSON.parse(saved) : INITIAL_PROSPECTS;
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('lighthouse_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('lighthouse_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [songs, setSongs] = useState<Song[]>(() => {
    const saved = localStorage.getItem('lighthouse_songs');
    return saved ? JSON.parse(saved) : INITIAL_SONGS;
  });

  const [developmentGoals, setDevelopmentGoals] = useState<DevelopmentGoal[]>(() => {
    const saved = localStorage.getItem('lighthouse_dev_goals');
    return saved ? JSON.parse(saved) : INITIAL_DEVELOPMENT_GOALS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('lighthouse_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('lighthouse_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [settings, setSettings] = useState<MinistrySettings>(() => {
    const saved = localStorage.getItem('lighthouse_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('lighthouse_user_role', currentUserRole);
  }, [currentUserRole]);

  useEffect(() => {
    localStorage.setItem('lighthouse_member_id', currentMemberId);
  }, [currentMemberId]);

  useEffect(() => {
    localStorage.setItem('lighthouse_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('lighthouse_prospects', JSON.stringify(prospects));
  }, [prospects]);

  useEffect(() => {
    localStorage.setItem('lighthouse_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('lighthouse_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('lighthouse_songs', JSON.stringify(songs));
  }, [songs]);

  useEffect(() => {
    localStorage.setItem('lighthouse_dev_goals', JSON.stringify(developmentGoals));
  }, [developmentGoals]);

  useEffect(() => {
    localStorage.setItem('lighthouse_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('lighthouse_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('lighthouse_settings', JSON.stringify(settings));
  }, [settings]);

  // Current logged in member profile object
  const currentMember =
    members.find((m) => m.id === currentMemberId) ||
    members.find((m) => m.role === currentUserRole) ||
    members[0];

  const logAuditAction = (
    action: string,
    targetType: AuditLogItem['target_type'],
    targetId: string,
    details: string
  ) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      user_name: currentMember ? currentMember.full_name : 'System Admin',
      user_role: currentUserRole,
      action,
      target_type: targetType,
      target_id: targetId,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const setCurrentUserRole = (role: UserRole) => {
    setCurrentUserRoleState(role);
    // Switch to representative member for role testing
    const matching = members.find((m) => m.role === role);
    if (matching) {
      setCurrentMemberIdState(matching.id);
    }
  };

  const setCurrentMemberId = (id: string) => {
    setCurrentMemberIdState(id);
    const m = members.find((item) => item.id === id);
    if (m) {
      setCurrentUserRoleState(m.role);
    }
  };

  // Member Operations
  const addMember = (newMemData: Omit<Member, 'id' | 'attendance_stats'>): Member => {
    const id = `mem-${Date.now()}`;
    const newMember: Member = {
      ...newMemData,
      id,
      attendance_stats: {
        total_events: 0,
        present: 0,
        late: 0,
        absent: 0,
        excused: 0,
        percentage: 100,
      },
    };
    setMembers((prev) => [newMember, ...prev]);
    logAuditAction('Member Created', 'member', id, `Added new member: ${newMember.full_name}`);
    return newMember;
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    logAuditAction('Member Updated', 'member', id, `Updated profile details for member ID ${id}`);
  };

  const updateMemberStatus = (id: string, newStatus: MemberStatus, note?: string) => {
    const target = members.find((m) => m.id === id);
    const oldStatus = target?.status || 'UNKNOWN';

    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
    );

    logAuditAction(
      'Status Changed',
      'member',
      id,
      `Changed status of ${target?.full_name || id} from ${oldStatus} to ${newStatus}${note ? ` (${note})` : ''}`
    );
  };

  const deleteMember = (id: string) => {
    const target = members.find((m) => m.id === id);
    // Soft archive rather than permanently destroy
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'ARCHIVED' } : m))
    );
    logAuditAction('Member Archived', 'member', id, `Archived member ${target?.full_name || id}`);
  };

  // Recruitment Operations
  const addProspect = (data: Omit<RecruitmentProspect, 'id' | 'history'>): RecruitmentProspect => {
    const id = `prosp-${Date.now()}`;
    const newProspect: RecruitmentProspect = {
      ...data,
      id,
      history: [
        {
          stage: data.current_stage,
          date: new Date().toISOString().split('T')[0],
          notes: 'Initial contact recorded',
          changed_by: currentMember.full_name,
        },
      ],
    };
    setProspects((prev) => [newProspect, ...prev]);
    logAuditAction('Prospect Added', 'recruitment', id, `Added recruitment prospect: ${data.name}`);
    return newProspect;
  };

  const updateProspect = (id: string, updates: Partial<RecruitmentProspect>) => {
    setProspects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const updateProspectStage = (id: string, stage: MemberStatus, notes: string) => {
    setProspects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newHistory = [
            ...p.history,
            {
              stage,
              date: new Date().toISOString().split('T')[0],
              notes,
              changed_by: currentMember.full_name,
            },
          ];
          return {
            ...p,
            current_stage: stage,
            notes: notes || p.notes,
            history: newHistory,
          };
        }
        return p;
      })
    );
    logAuditAction('Recruitment Stage Changed', 'recruitment', id, `Moved prospect to stage ${stage}`);
  };

  const convertProspectToMember = (prospectId: string): Member => {
    const prospect = prospects.find((p) => p.id === prospectId);
    if (!prospect) throw new Error('Prospect not found');

    const newMember = addMember({
      full_name: prospect.name,
      preferred_name: prospect.name.split(' ')[0],
      phone: prospect.phone,
      whatsapp: prospect.whatsapp,
      email: prospect.email,
      date_joined: new Date().toISOString().split('T')[0],
      role: 'MEMBER',
      status: 'ACTIVE_MEMBER',
      vocal_part: prospect.interested_role.includes('Soprano')
        ? 'Soprano'
        : prospect.interested_role.includes('Alto')
        ? 'Alto'
        : prospect.interested_role.includes('Tenor')
        ? 'Tenor'
        : prospect.interested_role.includes('Bass')
        ? 'Bass'
        : 'Multi-vocal',
      instrument: prospect.interested_role.includes('Drums')
        ? 'Drums'
        : prospect.interested_role.includes('Keys')
        ? 'Keys/Piano'
        : prospect.interested_role.includes('Sax')
        ? 'Saxophone'
        : prospect.interested_role.includes('Bass')
        ? 'Bass Guitar'
        : prospect.interested_role.includes('Guitar')
        ? 'Lead Guitar'
        : 'Vocals Only',
      music_experience: prospect.experience_level,
      strengths: [prospect.vocal_or_instrument_ability],
      development_areas: ['Repertoire mastering', 'Ministry integration'],
      skill_level: 'Developing',
      section: prospect.interested_role.includes('Soprano')
        ? 'Sopranos'
        : prospect.interested_role.includes('Alto')
        ? 'Altos'
        : prospect.interested_role.includes('Tenor')
        ? 'Tenors'
        : 'Choir & Band',
      leadership_role: 'None',
      recruitment_source: prospect.source,
      induction_status: 'Completed',
      availability: 'Full',
      church_connection: prospect.church_connection,
    });

    // Update prospect stage to ACTIVE_MEMBER
    updateProspectStage(prospectId, 'ACTIVE_MEMBER', `Successfully converted to full active member.`);

    logAuditAction(
      'Prospect Converted',
      'member',
      newMember.id,
      `Converted prospect ${prospect.name} to full active choir/band member!`
    );

    return newMember;
  };

  // Event Operations
  const addEvent = (eventData: Omit<EventItem, 'id' | 'qr_token' | 'is_attendance_open'>): EventItem => {
    const id = `evt-${Date.now()}`;
    const qrToken = `LH-${eventData.type.toUpperCase().replace(/\s+/g, '_')}-${Date.now().toString(36).toUpperCase()}`;
    const newEvent: EventItem = {
      ...eventData,
      id,
      qr_token: qrToken,
      is_attendance_open: false,
    };
    setEvents((prev) => [newEvent, ...prev]);
    logAuditAction('Event Created', 'event', id, `Created ${eventData.type}: ${eventData.title}`);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<EventItem>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
    logAuditAction('Event Updated', 'event', id, `Updated event details for ${id}`);
  };

  const toggleAttendanceOpen = (eventId: string, isOpen: boolean) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, is_attendance_open: isOpen } : e))
    );
    logAuditAction(
      isOpen ? 'Attendance Window Opened' : 'Attendance Window Closed',
      'event',
      eventId,
      `${isOpen ? 'Opened' : 'Closed'} attendance check-in for event ${eventId}`
    );
  };

  const regenerateQrToken = (eventId: string): string => {
    const newToken = `LH-TOKEN-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, qr_token: newToken } : e))
    );
    logAuditAction('QR Token Refreshed', 'event', eventId, `Generated fresh QR security token for event ${eventId}`);
    return newToken;
  };

  // Attendance Check-in with Security & Duplicate Prevention
  const recordAttendance = (
    eventId: string,
    memberId: string,
    status: AttendanceStatus,
    method: CheckinMethod,
    reason?: string
  ): { success: boolean; message: string; record?: AttendanceRecord } => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return { success: false, message: 'Member not found.' };

    const event = events.find((e) => e.id === eventId);
    if (!event) return { success: false, message: 'Event not found.' };

    // Check duplicate
    const existing = attendanceRecords.find(
      (r) => r.event_id === eventId && r.member_id === memberId
    );

    if (existing) {
      // If manual override by authorized officer or MD
      if (currentUserRole !== 'MEMBER') {
        const updatedRecord: AttendanceRecord = {
          ...existing,
          status,
          recorded_by: currentMember.full_name,
          reason: reason || existing.reason,
          timestamp: new Date().toISOString(),
        };

        setAttendanceRecords((prev) =>
          prev.map((r) => (r.id === existing.id ? updatedRecord : r))
        );

        logAuditAction(
          'Attendance Overridden',
          'attendance',
          existing.id,
          `Modified attendance for ${member.full_name}: ${existing.status} -> ${status}`
        );

        return {
          success: true,
          message: `Attendance updated to ${status.toUpperCase()} for ${member.full_name}.`,
          record: updatedRecord,
        };
      }

      return {
        success: false,
        message: `You are already checked in for this event (${existing.status.toUpperCase()}).`,
      };
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      event_id: eventId,
      member_id: memberId,
      member_name: member.full_name,
      member_section: member.section,
      status,
      checkin_method: method,
      timestamp: new Date().toISOString(),
      recorded_by: method === 'qr_scan' ? 'Self (QR Scan)' : currentMember.full_name,
      reason,
    };

    setAttendanceRecords((prev) => [newRecord, ...prev]);

    // Update member's calculated attendance statistics
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          const total = (m.attendance_stats?.total_events || 0) + 1;
          const pres = (m.attendance_stats?.present || 0) + (status === 'present' ? 1 : 0);
          const lte = (m.attendance_stats?.late || 0) + (status === 'late' ? 1 : 0);
          const abs = (m.attendance_stats?.absent || 0) + (status === 'absent' ? 1 : 0);
          const exc = (m.attendance_stats?.excused || 0) + (status === 'excused' ? 1 : 0);
          const pct = Math.round(((pres + lte * 0.75 + exc * 0.5) / Math.max(1, total)) * 100);

          return {
            ...m,
            attendance_stats: {
              total_events: total,
              present: pres,
              late: lte,
              absent: abs,
              excused: exc,
              percentage: Math.min(100, pct),
            },
          };
        }
        return m;
      })
    );

    logAuditAction(
      'Attendance Check-in',
      'attendance',
      newRecord.id,
      `${member.full_name} checked in as ${status.toUpperCase()} (${method})`
    );

    return {
      success: true,
      message: `Checked in successfully as ${status.toUpperCase()}!`,
      record: newRecord,
    };
  };

  const scanQrCheckin = (qrToken: string, memberId?: string) => {
    const targetMemberId = memberId || currentMemberId;
    const member = members.find((m) => m.id === targetMemberId);
    if (!member) {
      return { success: false, message: 'Member identity not recognized.' };
    }

    // Find event with this token
    const event = events.find((e) => e.qr_token === qrToken.trim());
    if (!event) {
      return {
        success: false,
        message: 'Invalid or unrecognized QR token. Please scan the official event screen.',
      };
    }

    if (!event.is_attendance_open) {
      return {
        success: false,
        message: 'Attendance check-in has closed for this event. Please speak with the Attendance Officer.',
      };
    }

    // Verify authorized participant
    if (
      event.assigned_participant_ids &&
      event.assigned_participant_ids.length > 0 &&
      !event.assigned_participant_ids.includes(targetMemberId)
    ) {
      return {
        success: false,
        message: 'You are not currently assigned to this event. Please contact the Music Ministry team.',
      };
    }

    // Duplicate check
    const alreadyChecked = attendanceRecords.find(
      (r) => r.event_id === event.id && r.member_id === targetMemberId
    );
    if (alreadyChecked) {
      return {
        success: false,
        message: `You are already checked in as ${alreadyChecked.status.toUpperCase()} at ${new Date(alreadyChecked.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      };
    }

    // Determine if present or late based on event start time
    // For demo/real-time verification, if current time is past start_time, mark as late
    let determinedStatus: AttendanceStatus = 'present';
    const now = new Date();
    const eventDate = new Date(`${event.date}T${event.start_time}:00`);
    if (now > eventDate && (now.getTime() - eventDate.getTime()) > 15 * 60 * 1000) {
      determinedStatus = 'late';
    }

    const result = recordAttendance(event.id, targetMemberId, determinedStatus, 'qr_scan');
    return {
      ...result,
      event,
    };
  };

  // Repertoire
  const addSong = (songData: Omit<Song, 'id'>): Song => {
    const id = `song-${Date.now()}`;
    const newSong: Song = { ...songData, id };
    setSongs((prev) => [newSong, ...prev]);
    logAuditAction('Song Added', 'song', id, `Added song: ${newSong.title}`);
    return newSong;
  };

  const updateSong = (id: string, updates: Partial<Song>) => {
    setSongs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    logAuditAction('Song Updated', 'song', id, `Updated song details for ${id}`);
  };

  const deleteSong = (id: string) => {
    setSongs((prev) => prev.filter((s) => s.id !== id));
    logAuditAction('Song Removed', 'song', id, `Deleted song ID ${id}`);
  };

  // Development Goals
  const addDevelopmentGoal = (goalData: Omit<DevelopmentGoal, 'id' | 'created_at'>): DevelopmentGoal => {
    const id = `goal-${Date.now()}`;
    const newGoal: DevelopmentGoal = {
      ...goalData,
      id,
      created_at: new Date().toISOString(),
    };
    setDevelopmentGoals((prev) => [newGoal, ...prev]);
    logAuditAction(
      'Goal Created',
      'member',
      goalData.member_id,
      `Created development goal: ${goalData.goal_title} for ${goalData.member_name}`
    );
    return newGoal;
  };

  const updateDevelopmentGoal = (id: string, updates: Partial<DevelopmentGoal>) => {
    setDevelopmentGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );
  };

  // Announcements
  const addAnnouncement = (data: Omit<Announcement, 'id' | 'date'>) => {
    const newAnn: Announcement = {
      ...data,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  // Settings
  const updateSettings = (newSettings: Partial<MinistrySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    logAuditAction('Settings Updated', 'setting', 'ministry', 'Updated ministry operational configuration');
  };

  // Calculated Stats
  const activeMembersCount = members.filter((m) => m.status === 'ACTIVE_MEMBER').length;
  const targetCount = settings.target_active_members || 30;
  const prospectsCount = prospects.filter((p) => p.current_stage !== 'ACTIVE_MEMBER').length;
  
  const totalAttended = attendanceRecords.filter((r) => r.status === 'present' || r.status === 'late').length;
  const recentAttendanceRate =
    attendanceRecords.length > 0
      ? Math.round((totalAttended / attendanceRecords.length) * 100)
      : 92;

  return (
    <MinistryContext.Provider
      value={{
        currentUserRole,
        currentMember,
        setCurrentUserRole,
        setCurrentMemberId,
        members,
        addMember,
        updateMember,
        updateMemberStatus,
        deleteMember,
        prospects,
        addProspect,
        updateProspect,
        updateProspectStage,
        convertProspectToMember,
        events,
        addEvent,
        updateEvent,
        toggleAttendanceOpen,
        regenerateQrToken,
        attendanceRecords,
        recordAttendance,
        scanQrCheckin,
        songs,
        addSong,
        updateSong,
        deleteSong,
        developmentGoals,
        addDevelopmentGoal,
        updateDevelopmentGoal,
        announcements,
        addAnnouncement,
        auditLogs,
        logAuditAction,
        settings,
        updateSettings,
        activeMembersCount,
        targetCount,
        prospectsCount,
        recentAttendanceRate,
      }}
    >
      {children}
    </MinistryContext.Provider>
  );
};

export const useMinistry = () => {
  const context = useContext(MinistryContext);
  if (!context) {
    throw new Error('useMinistry must be used within a MinistryProvider');
  }
  return context;
};
