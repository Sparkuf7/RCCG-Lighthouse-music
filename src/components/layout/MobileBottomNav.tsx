import React from 'react';
import { useMinistry } from '../../context/MinistryContext';
import {
  LayoutDashboard,
  Calendar,
  QrCode,
  Music,
  Users,
  Clock,
  Target,
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenQRScanner: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenQRScanner,
}) => {
  const { currentUserRole } = useMinistry();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B1F1C]/95 backdrop-blur-lg border-t border-[#173B2D] px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around">
        {/* Tab 1: Home / Dashboard */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center justify-center p-1.5 transition ${
            activeTab === 'dashboard' ? 'text-[#F3D21A]' : 'text-[#AAB8B2]'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Home</span>
        </button>

        {/* Tab 2: Events / Calendar */}
        <button
          onClick={() => onSelectTab('events')}
          className={`flex flex-col items-center justify-center p-1.5 transition ${
            activeTab === 'events' ? 'text-[#F3D21A]' : 'text-[#AAB8B2]'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Events</span>
        </button>

        {/* Tab 3: Prominent Center QR Scanner Trigger */}
        <button
          onClick={onOpenQRScanner}
          className="flex flex-col items-center justify-center -mt-5 relative group"
        >
          <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F3D21A] p-0.5 shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center transform active:scale-95 transition">
            <div className="w-full h-full rounded-full bg-[#0B1F1C] flex items-center justify-center group-hover:bg-[#173B2D] transition">
              <QrCode className="w-6 h-6 text-[#F3D21A]" />
            </div>
          </div>
          <span className="text-[10px] font-black text-[#F3D21A] mt-1">Scan QR</span>
        </button>

        {/* Tab 4: Repertoire / Songs */}
        <button
          onClick={() => onSelectTab('repertoire')}
          className={`flex flex-col items-center justify-center p-1.5 transition ${
            activeTab === 'repertoire' ? 'text-[#F3D21A]' : 'text-[#AAB8B2]'
          }`}
        >
          <Music className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Songs</span>
        </button>

        {/* Tab 5: Attendance / Roll */}
        <button
          onClick={() =>
            onSelectTab(currentUserRole === 'MEMBER' ? 'attendance' : 'members')
          }
          className={`flex flex-col items-center justify-center p-1.5 transition ${
            activeTab === 'attendance' || activeTab === 'members'
              ? 'text-[#F3D21A]'
              : 'text-[#AAB8B2]'
          }`}
        >
          {currentUserRole === 'MEMBER' ? (
            <>
              <Clock className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-0.5">Attendance</span>
            </>
          ) : (
            <>
              <Users className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-0.5">Members</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
};
