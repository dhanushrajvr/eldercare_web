import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePatients } from '../../context/PatientContext';

export function Header({ onEmergencySOS, onToggleMobileSidebar }) {
  const { role, user, logout } = useAuth();
  const { showToast } = usePatients();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 min-h-16 h-16 md:h-20 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/20 shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-all ${
        role === 'family' ? 'md:left-72' : ''
      }`}
    >
      <div className="w-full h-full px-4 sm:px-6 md:px-gutter flex items-center justify-between gap-3">
        {/* Left: Mobile Toggle + Brand */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {role === 'family' && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="md:hidden w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all"
              aria-label="Toggle navigation menu"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
          )}

          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[22px] sm:text-[24px]">shield_with_heart</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-headline-md text-base sm:text-lg md:text-xl text-primary font-bold tracking-tight truncate leading-tight">
                ElderCare
              </span>
              <span className="font-label-sm text-xs text-secondary truncate">
                {role === 'patient' ? 'Senior Daily Care' : 'Family Portal'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {role === 'patient' && (
            <button
              type="button"
              onClick={onEmergencySOS}
              aria-label="Emergency Call"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full bg-error text-on-error hover:bg-error/90 active:scale-95 transition-all shadow-sm focus:outline-none cursor-pointer"
              title="Emergency Call Protocol"
            >
              <span className="material-symbols-outlined text-lg sm:text-xl">emergency</span>
              <span className="font-label-sm text-xs sm:text-sm font-bold whitespace-nowrap">SOS Call</span>
            </button>
          )}

          {role === 'family' && (
            <button
              type="button"
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary shadow-sm cursor-pointer"
              aria-label="Notifications (3 unread)"
              onClick={() => showToast('Viewing 3 recent caregiver notifications', 'notifications')}
            >
              <span className="material-symbols-outlined text-[20px] sm:text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest"></span>
            </button>
          )}

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-1 sm:pl-2">
            {user?.avatar ? (
              <img
                alt={user?.name || 'User'}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-primary/20 shrink-0"
                src={user.avatar}
              />
            ) : (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
            )}
            <div className="hidden lg:flex flex-col text-left">
              <span className="font-label-sm text-sm text-on-surface font-semibold leading-tight truncate max-w-[120px]">
                {user?.name || (role === 'patient' ? 'Eleanor Vance' : 'Sarah Vance')}
              </span>
              <span className="text-secondary text-[11px] truncate">
                {role === 'patient' ? 'Patient' : 'Primary Caregiver'}
              </span>
            </div>
          </div>

          {/* Logout / Switch Role */}
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-xs font-semibold transition-all cursor-pointer"
            title="Sign Out"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
