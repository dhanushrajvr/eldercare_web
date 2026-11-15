import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PatientProvider, usePatients } from './context/PatientContext';
import { LoginPage } from './pages/LoginPage';
import { PatientDashboard } from './pages/PatientDashboard';
import { FamilyDashboard } from './pages/FamilyDashboard';
import { ManagePatients } from './pages/ManagePatients';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';

function AppContent() {
  const { role, isAuthenticated } = useAuth();
  const { toast } = usePatients();
  const [currentFamilyView, setCurrentFamilyView] = useState('dashboard'); // 'dashboard' | 'manage-patients' | 'settings'
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Not logged in -> Show Login Page
  if (!isAuthenticated || !role) {
    return <LoginPage />;
  }

  // Patient view
  if (role === 'patient') {
    return (
      <div className="w-full min-h-screen bg-surface">
        <PatientDashboard />
        {/* Global Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-inverse-surface text-inverse-on-surface shadow-2xl animate-fade-in max-w-sm">
            <span className="material-symbols-outlined text-primary-fixed text-2xl shrink-0">{toast.icon}</span>
            <span className="text-sm font-semibold leading-snug">{toast.message}</span>
          </div>
        )}
      </div>
    );
  }

  // Family Member View (linked via Sidebar)
  return (
    <div className="bg-background min-h-screen text-on-surface flex w-full overflow-x-hidden">
      {/* Sidebar navigation */}
      <Sidebar
        currentView={currentFamilyView}
        setCurrentView={setCurrentFamilyView}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main portal layout */}
      <div className="flex-1 md:pl-72 flex flex-col min-h-screen w-full min-w-0">
        <Header
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        <main className="w-full pt-20 sm:pt-24 px-4 sm:px-6 md:px-8 bg-background min-h-screen flex-1">
          {currentFamilyView === 'dashboard' && (
            <FamilyDashboard onNavigateToManage={() => setCurrentFamilyView('manage-patients')} />
          )}

          {currentFamilyView === 'manage-patients' && <ManagePatients />}

          {currentFamilyView === 'settings' && (
            <div className="max-w-3xl py-4 sm:py-6 mx-auto">
              <h1 className="text-xl sm:text-2xl font-bold text-primary mb-1">Portal Settings</h1>
              <p className="text-secondary text-xs sm:text-sm mb-6">Manage system alerts, biometric authentication, and HIPAA data access permissions.</p>
              
              <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xs border border-outline-variant/30 flex flex-col gap-4">
                <div className="flex items-center justify-between py-2 border-b border-surface-container">
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-on-surface">Emergency SMS Broadcast</h3>
                    <p className="text-xs text-secondary">Instantly alert all designated guardians on SOS trigger</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold">Enabled</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-surface-container">
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-on-surface">Automatic Pill Dispenser Sync</h3>
                    <p className="text-xs text-secondary">Bedside IoT telemetry synced with MedCenter Hub</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold">Connected</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-on-surface">Voice Assistance &amp; High Contrast Default</h3>
                    <p className="text-xs text-secondary">Enhance senior patient clarity with larger interactive controls</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-bold">Active</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Global Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-inverse-surface text-inverse-on-surface shadow-2xl animate-fade-in max-w-sm">
          <span className="material-symbols-outlined text-primary-fixed text-2xl shrink-0">{toast.icon}</span>
          <span className="text-sm font-semibold leading-snug">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PatientProvider>
        <AppContent />
      </PatientProvider>
    </AuthProvider>
  );
}
