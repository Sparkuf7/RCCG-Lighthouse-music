import React, { useState } from 'react';
import { useMinistry } from '../../context/MinistryContext';
import { UserRole } from '../../types';
import { LighthouseLogo } from '../brand/LighthouseLogo';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import {
  Bell,
  QrCode,
  ChevronDown,
  Shield,
  User,
  Music,
  UserCheck,
  Crown,
  Menu,
} from 'lucide-react';

interface AppHeaderProps {
  onOpenQRScanner: () => void;
  onToggleSidebar?: () => void;
  activeTab: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenQRScanner,
  onToggleSidebar,
  activeTab,
}) => {
  const { currentUserRole, currentMember, setCurrentUserRole, members, announcements } = useMinistry();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const roles: { role: UserRole; title: string; subtitle: string; icon: React.ReactNode }[] = [
    {
      role: 'MUSIC_DIRECTOR',
      title: 'Music Director',
      subtitle: 'Brother David Okon (Full Control)',
      icon: <Music className="w-4 h-4 text-[#F3D21A]" />,
    },
    {
      role: 'SUPER_ADMIN_PASTOR',
      title: 'Senior Pastor / Super Admin',
      subtitle: 'Pastor Daniel Adeleke (Executive Overview)',
      icon: <Crown className="w-4 h-4 text-[#D4AF37]" />,
    },
    {
      role: 'MUSIC_LEADER',
      title: 'Music / Section Leader',
      subtitle: 'Sister Blessing Eze (Sopranos Leader)',
      icon: <Shield className="w-4 h-4 text-emerald-400" />,
    },
    {
      role: 'ATTENDANCE_OFFICER',
      title: 'Attendance Officer',
      subtitle: 'Brother Emmanuel Tobi (Roll Call & QR)',
      icon: <UserCheck className="w-4 h-4 text-amber-400" />,
    },
    {
      role: 'MEMBER',
      title: 'Choir / Band Member',
      subtitle: 'Sister Grace Adebayo (Member Portal)',
      icon: <User className="w-4 h-4 text-blue-400" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B1F1C]/95 backdrop-blur-md border-b border-[#173B2D] px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger + Brand logo */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-[#AAB8B2] hover:text-white hover:bg-white/5 transition"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="hidden sm:block">
            <LighthouseLogo variant="full" />
          </div>
          <div className="sm:hidden">
            <LighthouseLogo variant="compact" />
          </div>
        </div>

        {/* Right controls: Role switcher, Quick Scan, PWA Install, Notifications */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick QR Scan Button */}
          <button
            onClick={onOpenQRScanner}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3D21A] text-[#0B1F1C] font-extrabold text-xs shadow-md transition active:scale-95"
            title="Scan QR to Check In"
          >
            <QrCode className="w-4 h-4 text-[#0B1F1C]" />
            <span className="hidden sm:inline">Scan QR</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-[#173B2D]/50 hover:bg-[#173B2D] border border-white/5 text-[#AAB8B2] hover:text-white transition relative"
            >
              <Bell className="w-4 h-4" />
              {announcements.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F3D21A] animate-ping" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#0B1F1C] border border-[#D4AF37]/30 rounded-2xl p-4 shadow-2xl z-50 animate-scale-up space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-bold text-white uppercase">Ministry Notices</span>
                  <span className="text-[10px] text-[#AAB8B2]">{announcements.length} Recent</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {announcements.map((a) => (
                    <div key={a.id} className="p-2.5 rounded-xl bg-[#173B2D]/50 border border-white/5 text-xs">
                      <span className="font-bold text-white block">{a.title}</span>
                      <p className="text-[11px] text-[#AAB8B2] mt-0.5">{a.content}</p>
                      <span className="text-[9px] text-[#D4AF37] block mt-1">{a.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Demo Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#173B2D]/60 hover:bg-[#173B2D] border border-[#D4AF37]/30 transition text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-[#24513B] border border-[#D4AF37]/40 flex items-center justify-center font-bold text-xs text-[#F3D21A] shrink-0">
                {currentMember?.preferred_name?.charAt(0) || 'U'}
              </div>

              <div className="hidden md:block">
                <span className="text-xs font-bold text-white block leading-tight">
                  {currentMember?.preferred_name || 'David'}
                </span>
                <span className="text-[10px] text-[#D4AF37] block leading-tight font-semibold">
                  {currentUserRole === 'MUSIC_DIRECTOR'
                    ? 'Music Director'
                    : currentUserRole === 'SUPER_ADMIN_PASTOR'
                    ? 'Pastor'
                    : currentUserRole === 'MUSIC_LEADER'
                    ? 'Section Leader'
                    : currentUserRole === 'ATTENDANCE_OFFICER'
                    ? 'Attendance Officer'
                    : 'Member'}
                </span>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-[#AAB8B2]" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-[#0B1F1C] border border-[#D4AF37]/40 rounded-2xl p-2 shadow-2xl z-50 animate-scale-up space-y-1">
                <div className="px-3 py-2 border-b border-white/5">
                  <span className="text-[10px] uppercase font-bold text-[#AAB8B2] tracking-wider block">
                    Switch App Role Perspective
                  </span>
                  <span className="text-[11px] text-white">Experience the app as:</span>
                </div>

                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      setCurrentUserRole(r.role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full p-2 rounded-xl text-left flex items-start gap-2.5 transition text-xs ${
                      currentUserRole === r.role
                        ? 'bg-[#24513B] text-white'
                        : 'hover:bg-[#173B2D]/60 text-[#AAB8B2] hover:text-white'
                    }`}
                  >
                    <div className="p-1 rounded bg-[#0B1F1C] shrink-0 mt-0.5">{r.icon}</div>
                    <div>
                      <span className="font-bold text-white block leading-snug">{r.title}</span>
                      <span className="text-[10px] text-[#AAB8B2] block leading-tight">{r.subtitle}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
