import React, { useState, useEffect } from 'react';
import { usePatients } from '../context/PatientContext';
import { Header } from '../components/layout/Header';
import { HelpModal } from '../components/modals/HelpModal';

export function PatientDashboard() {
  const { selectedPatient, takeMedicine, showToast } = usePatients();
  const [timeString, setTimeString] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSOS, setIsSOS] = useState(false);
  const [medsTaken, setMedsTaken] = useState(false);

  // Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleTakeMedication = () => {
    setMedsTaken(true);
    takeMedicine(selectedPatient.id, ['med-1', 'med-2']);
  };

  const handleSOS = () => {
    setIsSOS(true);
    setIsHelpOpen(true);
  };

  const handlePromptHelp = () => {
    setIsSOS(false);
    setIsHelpOpen(true);
  };

  const handleCallCaregiver = () => {
    setIsHelpOpen(false);
    showToast('Connecting audio call to Sarah Vance...', 'call');
  };

  const handleDelay = () => {
    setIsHelpOpen(false);
    showToast('Reminder snoozed for 15 minutes', 'snooze');
  };

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen flex flex-col">
      <Header onEmergencySOS={handleSOS} />

      <main className="relative pt-20 sm:pt-28 pb-16 w-full flex-1 flex flex-col">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-gutter py-space-sm sm:py-space-md flex flex-col gap-6 sm:gap-8">
          {/* Comforting Senior Greeting & Living Time Header */}
          <header className="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm p-5 sm:p-6 md:p-8 border border-outline-variant/30">
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-secondary-container/40 pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-5 relative z-10">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-sm shrink-0 bg-secondary-fixed ring-4 ring-secondary-container/60">
                  <img
                    className="w-full h-full object-cover"
                    alt="Eleanor Vance"
                    src={selectedPatient?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuBHYHapAKFDD4sgE_2PEuftlgnG0HOsLP0lccAxSCf7aQR_E0OyMrrj4fkI1m2SpGKvNX70GcMo4cOaRyxCP6Bs2IN7FPId_EYg7DL2pxMNb8gHy6zZ0jK61W2rFW_TX6MsBtE7c646O0hrHDJ_1QknPSsZMp9K1dMMnSNM4U-N1sGpXRxfC7q-B2UDdswx6XBTG2ufy_hY091RsVeNBBKcBGTRW-Cu_u0gEWDSruw"}
                  />
                </div>
                <div className="flex flex-col items-center sm:items-start gap-1 min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-primary text-xs sm:text-sm font-semibold mb-0.5">
                    <span className="material-symbols-outlined text-base sm:text-lg" style={{ fontVariationSettings: '"FILL" 1' }}>
                      mobile_hand_left
                    </span>
                    <span>Daytime Safe Mode</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl text-primary font-bold tracking-tight leading-tight">
                    Good Afternoon, {selectedPatient?.name?.split(' ')[0] || 'Eleanor'}!
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-on-surface-variant">
                    Today is Thursday, October 24
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 bg-surface-container-low px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shrink-0 shadow-xs border border-outline-variant/20">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-2xl sm:text-3xl">schedule</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] sm:text-xs text-secondary uppercase tracking-wider font-bold">
                    Current Time
                  </span>
                  <span className="text-2xl sm:text-3xl md:text-4xl text-primary font-bold leading-none">
                    {timeString || '11:54 AM'}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* SECTION 1: FULL-WIDTH CENTER STAGE MEDICATION CARD */}
          <section className="w-full">
            <div className="rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow overflow-hidden p-5 sm:p-6 md:p-8 border border-outline-variant/30">
              {/* Urgent Pill Alert Banner */}
              <div className="bg-secondary-container text-on-secondary-container rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4 text-center sm:text-left">
                  <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-2xl sm:text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>
                      medication
                    </span>
                  </span>
                  <div>
                    <span className="text-xs uppercase tracking-wide text-primary font-bold block">
                      Scheduled Right Now
                    </span>
                    <p className="text-lg sm:text-xl md:text-2xl text-primary font-bold leading-tight">
                      1:00 PM Lunchtime Medication
                    </p>
                  </div>
                </div>

                <span className="px-4 py-2 rounded-full bg-surface-container-lowest text-primary text-xs sm:text-sm shadow-xs font-bold shrink-0">
                  {medsTaken ? 'Completed Today ✓' : 'Due in 15 Minutes'}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
                {/* Visual Photo representation */}
                <div className="lg:col-span-5 flex flex-col gap-2">
                  <div className="relative w-full aspect-[4/3] max-h-72 sm:max-h-80 rounded-2xl overflow-hidden shadow-xs bg-surface-container-low flex items-center justify-center border border-outline-variant/20">
                    <img
                      className="w-full h-full object-cover"
                      alt="Macro close-up photo of two prescribed pills"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIQw4JOfHgtJp9aZ7i44tVvGW0m4q6KkVTz44wA7QBCmQITBDXhD897ReXKazc_B9dwxmxja6JbAaaK_Z5JM685nMfTiw4HULKvL_YhBosCLwUMOesA8T3u1GkeeUjbpKxFaOXYeuEhINnm6gKWkiUp_dAuE1r4Yz6ykxqKQxsJltaImDVDX8mVMzr6R-4leEE-d3vfPaAL-39p7dUVHsNnYyhUCiH9EmSe_3I-TA"
                    />
                    <div className="absolute bottom-3 left-3 bg-surface-container-lowest/95 backdrop-blur-xs px-3.5 py-1.5 rounded-xl shadow-xs border border-outline-variant/30">
                      <span className="text-xs sm:text-sm text-primary font-bold">
                        2 Pills to take together
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant text-center">
                    Pills photographed above match your daily organizer box.
                  </p>
                </div>

                {/* Medication details & instructions */}
                <div className="lg:col-span-7 flex flex-col justify-center gap-4 sm:gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* Pill 1 */}
                    <div className="p-4 rounded-xl bg-surface-container-low flex items-start gap-3 shadow-xs border border-outline-variant/20">
                      <span className="material-symbols-outlined text-2xl sm:text-3xl text-primary shrink-0 mt-0.5" style={{ fontVariationSettings: '"FILL" 1' }}>
                        pill
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg text-on-surface font-bold leading-snug truncate">
                          Metformin 500mg
                        </h3>
                        <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                          1 White Oval Tablet • Blood sugar
                        </p>
                      </div>
                    </div>

                    {/* Pill 2 */}
                    <div className="p-4 rounded-xl bg-surface-container-low flex items-start gap-3 shadow-xs border border-outline-variant/20">
                      <span className="material-symbols-outlined text-2xl sm:text-3xl text-tertiary-container shrink-0 mt-0.5" style={{ fontVariationSettings: '"FILL" 1' }}>
                        hevc
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg text-on-surface font-bold leading-snug truncate">
                          CoQ10 100mg
                        </h3>
                        <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                          1 Amber Softgel • Heart vitamin
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Plain-Language Instructions Notice */}
                  <div className="bg-surface-container-highest p-3.5 sm:p-4 rounded-xl flex items-center gap-3">
                    <span className="material-symbols-outlined text-2xl sm:text-3xl text-primary shrink-0">local_drink</span>
                    <p className="text-sm sm:text-base text-on-surface font-semibold leading-snug">
                      Take with food and a full glass of cool water.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-1 w-full">
                    <button
                      type="button"
                      onClick={handleTakeMedication}
                      className={`flex-1 min-h-[56px] sm:min-h-[64px] px-4 sm:px-6 rounded-2xl text-base sm:text-lg font-bold shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2.5 text-center cursor-pointer ${
                        medsTaken
                          ? 'bg-primary-container text-on-primary ring-4 ring-primary-fixed'
                          : 'bg-primary hover:bg-primary-container text-on-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl sm:text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>
                        check_circle
                      </span>
                      <span className="whitespace-nowrap">{medsTaken ? '✓ Taken Today' : '✓ I Have Taken My Medicine'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePromptHelp}
                      className="min-h-[56px] sm:min-h-[64px] px-5 sm:px-6 rounded-2xl bg-secondary-container text-on-secondary-container text-sm sm:text-base font-bold hover:bg-secondary-fixed active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                    >
                      <span className="material-symbols-outlined text-xl sm:text-2xl">help_outline</span>
                      <span className="whitespace-nowrap">Need Help / Not Yet</span>
                    </button>
                  </div>

                  {/* Feedback Banner */}
                  {medsTaken && (
                    <div className="p-4 rounded-xl bg-primary-container text-on-primary shadow-sm flex items-center gap-3.5 animate-fade-in">
                      <span className="material-symbols-outlined text-3xl shrink-0">task_alt</span>
                      <div className="flex flex-col">
                        <span className="text-sm sm:text-base font-bold">
                          Wonderful! Dose Recorded
                        </span>
                        <span className="text-xs sm:text-sm text-on-primary-container">
                          Your caregiver Sarah has been notified. Keep up the great health routine!
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Quick Contacts */}
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={handleCallCaregiver}
              className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-sm flex items-center gap-3.5 text-left transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary-container text-primary flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shrink-0">
                <span className="material-symbols-outlined">call</span>
              </div>
              <div className="min-w-0">
                <span className="text-xs text-secondary block">Primary Family Contact</span>
                <h3 className="text-sm sm:text-base font-bold text-on-surface truncate">Call Sarah (Daughter)</h3>
                <span className="text-xs text-primary block mt-0.5">Tap for direct line</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => showToast('Calling Dr. Jenkins Clinic at St. Jude Heart Center...', 'call')}
              className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-sm flex items-center gap-3.5 text-left transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-surface-container text-primary flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shrink-0">
                <span className="material-symbols-outlined">stethoscope</span>
              </div>
              <div className="min-w-0">
                <span className="text-xs text-secondary block">Assigned Clinician</span>
                <h3 className="text-sm sm:text-base font-bold text-on-surface truncate">Call Dr. Jenkins</h3>
                <span className="text-xs text-secondary block mt-0.5">Cardiology Clinic</span>
              </div>
            </button>

            <button
              type="button"
              onClick={handleSOS}
              className="p-4 sm:p-5 rounded-2xl bg-error-container text-on-error-container shadow-xs hover:shadow-sm flex items-center gap-3.5 text-left transition-all cursor-pointer group sm:col-span-2 md:col-span-1"
            >
              <div className="w-12 h-12 rounded-xl bg-error text-on-error flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shrink-0">
                <span className="material-symbols-outlined">emergency</span>
              </div>
              <div className="min-w-0">
                <span className="text-xs text-error font-bold block">24/7 Urgent Station</span>
                <h3 className="text-sm sm:text-base font-bold text-on-error-container truncate">Emergency Helpline</h3>
                <span className="text-xs block mt-0.5">Immediate on-site responder</span>
              </div>
            </button>
          </section>
        </div>
      </main>

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onCallCaregiver={handleCallCaregiver}
        onDelay={handleDelay}
        isSOS={isSOS}
      />
    </div>
  );
}
