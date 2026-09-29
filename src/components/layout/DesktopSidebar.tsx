import React from 'react';
import { useMinistry } from '../../context/MinistryContext';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Calendar,
  Clock,
  Target,
  Music,
  Award,
  FileText,
  Settings,
  User,
  HeartHandshake,
  TrendingUp,
} from 'lucide-react';
import { LighthouseLogo } from '../brand/LighthouseLogo';

interface DesktopSidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onCloseMobile?: () => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  activeTab,
  onSelectTab,
  onCloseMobile,
}) => {
  const { currentUserRole, activeMembersCount, targetCount, prospectsCount } = useMinistry();

  // Navigation items based on user role
  const getNavItems = () => {
    if (currentUserRole === 'MEMBER') {
      return [
        { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
        { id: 'events', label: 'Events & Rehearsals', icon: Calendar },
        { id: 'attendance', label: 'My Attendance', icon: Clock },
        { id: 'services', label: 'Service Assignments', icon: Music },
        { id: 'repertoire', label: 'Song Library', icon: Music },
        { id: 'development', label: 'My Development', icon: Target },
        { id: 'members', label: 'My Profile', icon: User },
      ];
    }

    if (currentUserRole === 'SUPER_ADMIN_PASTOR') {
      return [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'members', label: 'Ministry Members', icon: Users },
        { id: 'recruitment', label: 'Recruitment & Growth', icon: HeartHandshake },
        { id: 'attendance', label: 'Attendance Health', icon: Clock },
        { id: 'events', label: 'Ministry Calendar', icon: Calendar },
        { id: 'leadership', label: 'Leadership Pipeline', icon: Award },
        { id: 'reports', label: 'Pastoral Reports', icon: FileText },
        { id: 'settings', label: 'Ministry Settings', icon: Settings },
      ];
    }

    if (currentUserRole === 'ATTENDANCE_OFFICER') {
      return [
        { id: 'attendance', label: 'Attendance Roll & QR', icon: Clock },
        { id: 'events', label: 'Upcoming Events', icon: Calendar },
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'members', label: 'Ensemble Roster', icon: Users },
        { id: 'reports', label: 'Attendance Reports', icon: FileText },
      ];
    }

    if (currentUserRole === 'MUSIC_LEADER') {
      return [
        { id: 'dashboard', label: 'Section Dashboard', icon: LayoutDashboard },
        { id: 'members', label: 'Section Members', icon: Users },
        { id: 'rehearsals', label: 'Rehearsals & Review', icon: Calendar },
        { id: 'services', label: 'Sunday Services', icon: Calendar },
        { id: 'attendance', label: 'Section Attendance', icon: Clock },
        { id: 'repertoire', label: 'Repertoire & Harmonies', icon: Music },
        { id: 'development', label: 'Vocal Development', icon: Target },
      ];
    }

    // Default: MUSIC_DIRECTOR (Full Suite)
    return [
      { id: 'dashboard', label: 'Director Dashboard', icon: LayoutDashboard },
      { id: 'members', label: 'Members', icon: Users },
      { id: 'recruitment', label: 'Recruitment Pipeline', icon: UserPlus },
      { id: 'events', label: 'Events & Calendar', icon: Calendar },
      { id: 'attendance', label: 'Attendance & QR', icon: Clock },
      { id: 'rehearsals', label: 'Rehearsal Reviews', icon: Calendar },
      { id: 'services', label: 'Service Management', icon: Calendar },
      { id: 'repertoire', label: 'Repertoire & Songs', icon: Music },
      { id: 'development', label: 'Musician Development', icon: Target },
      { id: 'leadership', label: 'Leadership Tracker', icon: Award },
      { id: 'reports', label: 'Reports & Analytics', icon: FileText },
      { id: 'settings', label: 'Settings & Audit', icon: Settings },
    ];
  };

  const navItems = getNavItems();
  const targetPct = Math.round((activeMembersCount / targetCount) * 100);

  return (
    <aside className="w-64 bg-[#0B1F1C] border-r border-[#173B2D] flex flex-col justify-between h-full overflow-y-auto">
      {/* Top logo area */}
      <div>
        <div className="p-5 border-b border-[#173B2D]">
          <LighthouseLogo variant="compact" />
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-[#24513B] text-[#F3D21A] border border-[#D4AF37]/40 shadow'
                    : 'text-[#AAB8B2] hover:text-white hover:bg-[#173B2D]/40'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-[#F3D21A]' : 'text-[#AAB8B2]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom 30-Member Target Widget */}
      <div className="p-4 m-3 rounded-2xl bg-[#173B2D]/50 border border-[#D4AF37]/30 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
            30-Member Target
          </span>
          <span className="text-xs font-black text-[#F3D21A]">{targetPct}%</span>
        </div>

        <div className="w-full bg-[#0B1F1C] h-2 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-[#24513B] to-[#F3D21A] rounded-full"
            style={{ width: `${targetPct}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#AAB8B2] mt-2">
          <span>{activeMembersCount} / {targetCount} Active</span>
          <span>{prospectsCount} in Pipeline</span>
        </div>
      </div>
    </aside>
  );
};
