export type UserRole =
  | 'SUPER_ADMIN_PASTOR'
  | 'MUSIC_DIRECTOR'
  | 'MUSIC_LEADER'
  | 'ATTENDANCE_OFFICER'
  | 'MEMBER';

export type MemberStatus =
  | 'PROSPECT'
  | 'INTERESTED'
  | 'CONNECTED'
  | 'ASSESSMENT'
  | 'INDUCTION'
  | 'DEVELOPING'
  | 'ACTIVE_MEMBER'
  | 'LEADER'
  | 'INACTIVE'
  | 'ARCHIVED';

export type VocalPart =
  | 'Soprano'
  | 'Alto'
  | 'Tenor'
  | 'Bass'
  | 'Multi-vocal'
  | 'Not Applicable';

export type PrimaryInstrument =
  | 'Keys/Piano'
  | 'Bass Guitar'
  | 'Drums'
  | 'Lead Guitar'
  | 'Acoustic Guitar'
  | 'Saxophone'
  | 'Strings'
  | 'Vocals Only'
  | 'Auxiliary Percussion'
  | 'Sound / Media'
  | 'Other';

export type ChurchConnection =
  | 'Existing Lighthouse Member'
  | 'New Church Attendee'
  | 'Invited by Member'
  | 'Music Recruitment'
  | 'Community Contact'
  | 'Event Contact'
  | 'Other';

export type EventType =
  | 'Rehearsal'
  | 'Sunday Service'
  | 'Special Service'
  | 'Training'
  | 'Meeting'
  | 'Outreach'
  | 'Music Activity'
  | 'Other';

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'excused';

export type CheckinMethod = 'qr_scan' | 'manual' | 'officer_checkin';

export type SongStatus = 'READY' | 'DEVELOPING' | 'FUTURE';

export type SongCategory =
  | 'Praise'
  | 'Worship'
  | 'Special Ministration'
  | 'Choir Anthem'
  | 'Hymn'
  | 'Contemporary Gospel'
  | 'African Praise'
  | 'Medley';

export type DevelopmentCategory =
  | 'Vocal Development'
  | 'Harmony'
  | 'Ear Training'
  | 'Musicianship'
  | 'Instrumental Skills'
  | 'Stage/Service Skills'
  | 'Worship Skills'
  | 'Music Direction'
  | 'Leadership'
  | 'Songwriting'
  | 'Production'
  | 'Technology'
  | 'Other';

export type DevelopmentGoalStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface LeadershipRatings {
  reliability: number; // 1-5
  musical_competence: number; // 1-5
  teamwork: number; // 1-5
  initiative: number; // 1-5
  teachability: number; // 1-5
  responsibility: number; // 1-5
  notes: string;
  updated_at: string;
}

export interface Member {
  id: string;
  user_id?: string;
  full_name: string;
  preferred_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  photo_url?: string;
  date_joined: string;
  role: UserRole;
  status: MemberStatus;
  
  // Music Details
  vocal_part: VocalPart;
  instrument: PrimaryInstrument;
  secondary_instrument?: string;
  music_experience: string; // e.g. "5 years church choir"
  musical_training?: string;
  strengths: string[];
  development_areas: string[];
  skill_level: 'Beginner' | 'Developing' | 'Intermediate' | 'Advanced' | 'Expert';

  // Ministry Details
  section: string; // e.g. "Sopranos", "Altos", "Tenors", "Rhythm Section", "Brass"
  leadership_role: string; // e.g. "Section Leader", "Vocal Leader", "None"
  recruitment_source: string;
  induction_status: 'Completed' | 'In Progress' | 'Pending' | 'Not Started';
  availability: 'Full' | 'Sundays Only' | 'Saturdays Only' | 'Variable';
  church_connection: ChurchConnection;

  // Attendance stats (calculated)
  attendance_stats: {
    total_events: number;
    present: number;
    late: number;
    absent: number;
    excused: number;
    percentage: number;
  };

  // Private Leadership / Director Notes (Protected)
  private_notes?: string;
  leadership_ratings?: LeadershipRatings;
}

export interface RecruitmentProspect {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  source: string;
  date_discovered: string;
  interested_role: string; // Vocal (Soprano, etc) or Instrument
  vocal_or_instrument_ability: string;
  experience_level: string;
  current_stage: MemberStatus;
  follow_up_date: string;
  assigned_leader_id: string;
  assigned_leader_name: string;
  notes: string;
  outcome?: string;
  church_connection: ChurchConnection;
  history: {
    stage: MemberStatus;
    date: string;
    notes: string;
    changed_by: string;
  }[];
}

export interface PostRehearsalReview {
  worked_on: string;
  improved: string;
  needs_work: string;
  next_focus: string;
  recorded_by: string;
  recorded_at: string;
}

export interface OrderOfService {
  opening_prayer?: string;
  praise_leader?: string;
  worship_leader?: string;
  special_ministration?: string;
  choir_presentation?: string;
  keyboardist?: string;
  bass_player?: string;
  drummer?: string;
  lead_guitarist?: string;
  sound_lead?: string;
  notes?: string;
}

export interface EventItem {
  id: string;
  title: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  location: string;
  attendance_window_before_mins: number; // default 30
  attendance_window_after_mins: number; // default 30
  notes?: string;
  assigned_participant_ids: string[];
  
  // Rehearsal specifics
  focus_topics?: string[];
  post_rehearsal_review?: PostRehearsalReview;

  // Service specifics
  order_of_service?: OrderOfService;

  // Songs attached
  song_ids: string[];

  // Attendance token
  qr_token: string;
  is_attendance_open: boolean;
}

export interface AttendanceRecord {
  id: string;
  event_id: string;
  member_id: string;
  member_name: string;
  member_section: string;
  status: AttendanceStatus;
  checkin_method: CheckinMethod;
  timestamp: string; // ISO string
  recorded_by: string;
  reason?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  key: string; // e.g. "G", "C#", "Bb"
  tempo_bpm: number;
  category: SongCategory;
  status: SongStatus;
  lyrics: string;
  audio_url?: string;
  chord_chart_url?: string;
  vocal_notes?: string;
  arrangement_notes?: string;
  last_ministered?: string;
}

export interface DevelopmentGoal {
  id: string;
  member_id: string;
  member_name: string;
  category: DevelopmentCategory;
  goal_title: string;
  current_level: string;
  target_action: string;
  assigned_by: string;
  status: DevelopmentGoalStatus;
  notes: string;
  review_date: string;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'normal' | 'important' | 'urgent';
  date: string;
  author: string;
  audience: 'all' | 'leaders' | 'singers' | 'musicians';
}

export interface AuditLogItem {
  id: string;
  user_name: string;
  user_role: string;
  action: string;
  target_type: 'member' | 'attendance' | 'event' | 'recruitment' | 'song' | 'setting';
  target_id: string;
  details: string;
  timestamp: string;
}

export interface MinistrySettings {
  ministry_name: string;
  target_active_members: number; // Default 30
  default_attendance_window_before_mins: number;
  default_attendance_window_after_mins: number;
  default_rehearsal_day: string;
  default_rehearsal_time: string;
  weekly_focus: string[];
}
