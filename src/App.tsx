import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { TopNavbar } from './components/common/TopNavbar';
import { EmailPreviewModal } from './components/common/EmailPreviewModal';
import { OfflineBanner } from './components/common/OfflineBanner';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { NotFoundView } from './components/common/NotFoundView';
import { LandingPage } from './components/landing/LandingPage';
import { LoginView } from './components/auth/LoginView';
import { SignUpView } from './components/auth/SignUpView';
import { EmployeeDashboard } from './components/employee/EmployeeDashboard';
import { EmployeeTasks } from './components/employee/EmployeeTasks';
import { EmployeeAttendance } from './components/employee/EmployeeAttendance';
import { EmployeeProfile } from './components/employee/EmployeeProfile';
import { EmployeeLeave } from './components/employee/EmployeeLeave';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminEmployees } from './components/admin/AdminEmployees';
import { AdminTasks } from './components/admin/AdminTasks';
import { AdminLeave } from './components/admin/AdminLeave';
import { AnnouncementsView } from './components/common/AnnouncementsView';
import { EmailDispatchInbox } from './components/common/EmailDispatchInbox';
import { ReportsView } from './components/common/ReportsView';
import { DepartmentsView } from './components/common/DepartmentsView';
import { NotificationsView } from './components/common/NotificationsView';
import { AuditLogsView } from './components/common/AuditLogsView';
import { SettingsView } from './components/common/SettingsView';
import { SupportView } from './components/common/SupportView';
import { EmployeeGroupsView } from './components/groups/EmployeeGroupsView';
import { AdminLoginView } from './components/auth/AdminLoginView';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, activeView, userRole, currentEmployee } = useApp();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Render offline banner at the top of the viewport
  return (
    <>
      <OfflineBanner />
      {(() => {
        // If on landing or auth views
        if (activeView === 'landing') {
          return (
            <div className="min-h-screen flex flex-col bg-[#071A2F]">
              <LandingPage />
            </div>
          );
        }

        if (activeView === 'admin-login') {
          return (
            <div className="min-h-screen flex flex-col bg-[#071A2F]">
              <AdminLoginView />
            </div>
          );
        }

        if (activeView === 'login') {
          return (
            <div className="min-h-screen flex flex-col bg-[#F5F8FC] dark:bg-[#071A2F]">
              <LoginView />
            </div>
          );
        }

        if (activeView === 'signup') {
          return (
            <div className="min-h-screen flex flex-col bg-[#F5F8FC] dark:bg-[#071A2F]">
              <SignUpView />
            </div>
          );
        }

        // Fallback to login if not authenticated
        if (!isAuthenticated) {
          return (
            <div className="min-h-screen flex flex-col bg-[#F5F8FC] dark:bg-[#071A2F]">
              <LoginView />
            </div>
          );
        }

        // Render internal authenticated dashboard layout with strict Role Boundary protection
        const renderCurrentView = () => {
          const isEmp = userRole === 'EMPLOYEE' || Boolean(currentEmployee);

          switch (activeView) {
            case 'employee-dashboard':
              return <EmployeeDashboard />;
            case 'admin-dashboard':
              return isEmp ? <EmployeeDashboard /> : <AdminDashboard />;
            case 'tasks':
            case 'task-detail':
              return <EmployeeTasks />;
            case 'admin-tasks':
              return isEmp ? <EmployeeTasks /> : <AdminTasks />;
            case 'attendance':
            case 'admin-attendance':
              return isEmp ? <EmployeeAttendance /> : <AdminDashboard />;
            case 'profile':
              return <EmployeeProfile />;
            case 'leave':
              return <EmployeeLeave />;
            case 'admin-leave':
              return isEmp ? <EmployeeLeave /> : <AdminLeave />;
            case 'employees':
              return isEmp ? <EmployeeDashboard /> : <AdminEmployees />;
            case 'groups':
              return <EmployeeGroupsView />;
            case 'announcements':
              return <AnnouncementsView />;
            case 'inbox':
              return <EmailDispatchInbox />;
            case 'reports':
              return isEmp ? <EmployeeDashboard /> : <ReportsView />;
            case 'departments':
              return isEmp ? <EmployeeDashboard /> : <DepartmentsView />;
            case 'notifications':
              return <NotificationsView />;
            case 'audit-logs':
              return isEmp ? <EmployeeDashboard /> : <AuditLogsView />;
            case 'settings':
            case 'company-settings':
              return <SettingsView />;
            case 'support':
              return <SupportView />;
            case '404':
            case 'not-found':
              return <NotFoundView />;
            default:
              return isEmp ? <EmployeeDashboard /> : <LandingPage />;
          }
        };

        return (
          <div className="min-h-screen bg-[#F5F8FC] dark:bg-[#071A2F] flex flex-col text-slate-800 dark:text-slate-100 font-sans selection:bg-[#18BFFF]/30 pb-16 md:pb-0">
            <div className="flex-1 flex">
              {/* Sidebar Navigation */}
              <Sidebar
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />

              {/* Main Viewport */}
              <div
                className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
                  isCollapsed ? 'lg:pl-[78px]' : 'lg:pl-64'
                }`}
              >
                {/* Top Navbar */}
                <TopNavbar
                  onMenuClick={() => setIsMobileOpen(true)}
                  isSidebarCollapsed={isCollapsed}
                />

                {/* Content Area */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                  {renderCurrentView()}
                </main>
              </div>

              {/* Mobile Bottom Navigation Bar (< 768px) */}
              <MobileBottomNav />

              {/* Global Email Preview Modal */}
              <EmailPreviewModal />
            </div>
          </div>
        );
      })()}
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

