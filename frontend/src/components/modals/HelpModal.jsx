import React from 'react';

export function HelpModal({ isOpen, onClose, onCallCaregiver, onDelay, isSOS }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border-2 border-primary/20 text-center flex flex-col gap-5">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto flex items-center justify-center shadow-xs bg-secondary-container text-primary shrink-0">
          <span className="material-symbols-outlined text-3xl sm:text-4xl" style={{ fontVariationSettings: '"FILL" 1' }}>
            {isSOS ? 'emergency' : 'help_outline'}
          </span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary">
            {isSOS ? 'Emergency Assistance' : 'Need Help with Medicine?'}
          </h2>
          <p className="text-secondary text-xs sm:text-sm md:text-base mt-2 leading-relaxed">
            {isSOS
              ? 'Our 24/7 care station and your primary guardian are being contacted right now.'
              : 'Choose what you would like to do. Your caregiver Sarah is always here for you.'}
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onCallCaregiver}
            className="w-full min-h-[54px] sm:min-h-[60px] px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm sm:text-base font-bold flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-2xl">call</span>
            <span className="truncate">Call Sarah Vance (Daughter)</span>
          </button>

          {!isSOS && (
            <button
              type="button"
              onClick={onDelay}
              className="w-full min-h-[50px] sm:min-h-[54px] px-4 rounded-xl bg-secondary-container hover:bg-secondary-fixed text-primary text-sm sm:text-base font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-xl">snooze</span>
              <span>Remind Me in 15 Minutes</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs sm:text-sm font-semibold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
