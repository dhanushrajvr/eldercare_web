import React from 'react';
import { useAuth } from '../../context/AuthContext';

export function Sidebar({ currentView, setCurrentView, isMobileOpen, setIsMobileOpen }) {
  const { logout } = useAuth();

  const handleNavClick = (view) => {
    setCurrentView(view);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-inverse-surface/40 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-surface-container-low border-r border-outline-variant/30 z-50 flex flex-col justify-between py-space-md transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Brand header */}
          <div className="h-16 px-space-md flex items-center justify-between gap-space-sm mb-space-sm">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm shrink-0">
                <span className="material-symbols-outlined text-on-primary text-[24px]">vital_signs</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-primary leading-tight font-bold">
                  ElderCare
                </span>
                <span className="font-label-sm text-label-sm text-secondary">
                  Family Portal
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container"
              aria-label="Close sidebar"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-space-xs px-space-sm mt-space-sm">
            <button
              type="button"
              onClick={() => handleNavClick('dashboard')}
              className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-xl font-label-md text-label-md transition-all text-left cursor-pointer ${
                currentView === 'dashboard'
                  ? 'bg-primary-container text-on-primary shadow-[0_4px_16px_rgba(13,92,88,0.12)]'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">space_dashboard</span>
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('manage-patients')}
              className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-xl font-label-md text-label-md transition-all text-left cursor-pointer ${
                currentView === 'manage-patients'
                  ? 'bg-primary-container text-on-primary shadow-[0_4px_16px_rgba(13,92,88,0.12)]'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">diversity_1</span>
              <span>Manage Patients</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('settings')}
              className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-xl font-label-md text-label-md transition-all text-left cursor-pointer ${
                currentView === 'settings'
                  ? 'bg-primary-container text-on-primary shadow-[0_4px_16px_rgba(13,92,88,0.12)]'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">settings</span>
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Footer Strip */}
        <div className="px-space-md pt-space-md border-t border-outline-variant/20 flex flex-col gap-3">
          <div className="bg-surface-container-lowest rounded-xl p-space-sm flex items-center gap-space-sm shadow-[0_2px_12px_rgba(13,92,88,0.04)]">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-secondary-container text-[20px]">
                shield_with_heart
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-on-surface truncate font-semibold">
                Clinical Sync Active
              </span>
              <span className="font-label-sm text-label-sm text-secondary truncate text-xs">
                Updated 2m ago
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-secondary hover:text-error hover:bg-error-container/20 font-label-sm text-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
