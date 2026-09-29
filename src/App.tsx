import React, { useState } from 'react';
import { MinistryProvider, useMinistry } from './context/MinistryContext';
import { AppHeader } from './components/layout/AppHeader';
import { DesktopSidebar } from './components/layout/DesktopSidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { MusicDirectorDashboard } from './components/dashboard/MusicDirectorDashboard';
import { PastorDashboard } from './components/dashboard/PastorDashboard';
import { MemberDashboard } from './components/dashboard/MemberDashboard';
import { MemberList } from './components/members/MemberList';
import { RecruitmentPipeline } from './components/recruitment/RecruitmentPipeline';
import { ManualAttendanceSheet } from './components/attendance/ManualAttendanceSheet';
import { RehearsalManager } from './components/rehearsals/RehearsalManager';
import { ServiceManager } from './components/services/ServiceManager';
import { SongLibrary } from './components/repertoire/SongLibrary';
import { DevelopmentHub } from './components/development/DevelopmentHub';
import { LeadershipTracker } from './components/leadership/LeadershipTracker';
import { ReportsViewer } from './components/reports/ReportsViewer';
import { MinistrySettingsView } from './components/settings/MinistrySettingsView';
import { CalendarView } from './components/calendar/CalendarView';
import { MemberQRScanner } from './components/attendance/MemberQRScanner';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

const MainAppContent: React.FC = () => {
  const { currentUserRole } = useMinistry();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showQRScanner, setShowQRScanner] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Render appropriate view based on activeTab and role
  const renderCurrentView = () => {
    switch (activeTab) {
      case 'dashboard':
        if (currentUserRole === 'SUPER_ADMIN_PASTOR') {
          return <PastorDashboard onNavigateTab={setActiveTab} />;
        }
        if (currentUserRole === 'MEMBER') {
          return (
            <MemberDashboard
              onNavigateTab={setActiveTab}
              onOpenQRScanner={() => setShowQRScanner(true)}
            />
          );
        }
        return (
          <MusicDirectorDashboard
            onNavigateTab={setActiveTab}
            onOpenQRScanner={() => setShowQRScanner(true)}
          />
        );

      case 'members':
        return <MemberList />;

      case 'recruitment':
        return <RecruitmentPipeline />;

      case 'events':
        return <CalendarView />;

      case 'attendance':
        return <ManualAttendanceSheet />;

      case 'rehearsals':
        return <RehearsalManager />;

      case 'services':
        return <ServiceManager />;

      case 'repertoire':
        return <SongLibrary />;

      case 'development':
        return <DevelopmentHub />;

      case 'leadership':
        return <LeadershipTracker />;

      case 'reports':
        return <ReportsViewer />;

      case 'settings':
        return <MinistrySettingsView />;

      default:
        return <MusicDirectorDashboard onNavigateTab={setActiveTab} onOpenQRScanner={() => setShowQRScanner(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1F1C] text-[#F7F7F2] flex flex-col antialiased selection:bg-[#D4AF37]/30 selection:text-[#F3D21A]">
      {/* Top Header */}
      <AppHeader
        activeTab={activeTab}
        onOpenQRScanner={() => setShowQRScanner(true)}
        onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (Left) */}
        <div className="hidden lg:block h-[calc(100vh-61px)] sticky top-[61px]">
          <DesktopSidebar activeTab={activeTab} onSelectTab={setActiveTab} />
        </div>

        {/* Mobile Drawer Sidebar */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-72 max-w-[80vw] bg-[#0B1F1C] h-full shadow-2xl z-10 flex flex-col">
              <DesktopSidebar
                activeTab={activeTab}
                onSelectTab={setActiveTab}
                onCloseMobile={() => setMobileSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Center Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12 max-w-7xl mx-auto w-full">
          {renderCurrentView()}
        </main>
      </div>

      {/* Mobile Android Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenQRScanner={() => setShowQRScanner(true)}
      />

      {/* Fullscreen Member QR Scanner Modal */}
      {showQRScanner && (
        <MemberQRScanner onClose={() => setShowQRScanner(false)} />
      )}

      {/* Offline Status Toast */}
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <MinistryProvider>
      <MainAppContent />
    </MinistryProvider>
  );
}
