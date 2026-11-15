import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('patient'); // 'patient' or 'family'

  // Family credentials
  const [familyEmail, setFamilyEmail] = useState('sarah.vance@familycare.net');
  const [familyPassword, setFamilyPassword] = useState('password123');
  const [showFamilyPassword, setShowFamilyPassword] = useState(false);

  // Patient credentials
  const [patientId, setPatientId] = useState('EC-78294');
  const [patientPin, setPatientPin] = useState('1946');
  const [showPatientPin, setShowPatientPin] = useState(false);

  // Audio Assist
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const toggleVoiceAssist = () => {
    if (!isVoiceActive) {
      setIsVoiceActive(true);
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          "Elder Care portal ready. Please choose 'I am Family Member' or 'I am Patient' to sign in."
        );
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    } else {
      setIsVoiceActive(false);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const handleFamilySubmit = (e) => {
    e.preventDefault();
    login({ role: 'family', email: familyEmail, password: familyPassword });
  };

  const handlePatientSubmit = (e) => {
    e.preventDefault();
    login({ role: 'patient', patientId, pin: patientPin });
  };

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 sm:h-20 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/20 shadow-xs">
        <div className="w-full h-full max-w-7xl mx-auto px-4 sm:px-6 md:px-gutter flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[22px] sm:text-[24px]">shield_with_heart</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-headline-md text-lg sm:text-xl text-primary font-bold tracking-tight truncate leading-tight">
                Elder Care
              </span>
              <span className="font-label-sm text-xs text-secondary truncate">
                Connected Caregiving
              </span>
            </div>
          </div>

          {/* Voice Assist Accessible Pill */}
          <button
            type="button"
            onClick={toggleVoiceAssist}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full border transition-all text-xs sm:text-sm font-semibold cursor-pointer shrink-0 ${
              isVoiceActive
                ? 'bg-primary-fixed text-on-primary-fixed border-primary shadow-xs'
                : 'bg-surface-container-lowest text-secondary border-outline-variant/50 hover:text-primary hover:border-primary/50'
            }`}
          >
            <span className="material-symbols-outlined text-base sm:text-lg">
              {isVoiceActive ? 'volume_up' : 'record_voice_over'}
            </span>
            <span className="hidden xs:inline">{isVoiceActive ? 'Reading...' : 'Audio Assist'}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative pt-20 sm:pt-28 pb-16 w-full flex-1 flex flex-col justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-gutter flex flex-col gap-6 sm:gap-8">
          {/* Ambient Glows */}
          <div className="absolute -top-16 right-1/4 w-80 h-80 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-1/2 -left-16 w-72 h-72 bg-surface-container/60 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Heading */}
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-on-surface font-bold tracking-tight">
              Who are You?
            </h1>
            <p className="text-secondary text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
              Please choose who is signing in today. Tailored viewports provide serene simplicity for seniors and comprehensive clinical oversight for family guardians.
            </p>
          </div>

          {/* STEP 1: Two Prominent Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Button 1: I am Family Member */}
            <button
              type="button"
              onClick={() => setSelectedRole('family')}
              className={`text-left relative p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 flex items-start justify-between gap-3 cursor-pointer ${
                selectedRole === 'family'
                  ? 'border-primary bg-surface-container-low shadow-md ring-2 ring-primary/20'
                  : 'border-outline-variant/60 bg-surface-container-lowest hover:border-primary/50 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    selectedRole === 'family'
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-secondary-container text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl sm:text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>
                    diversity_1
                  </span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-base sm:text-lg font-bold text-on-surface leading-snug">
                    I am Family Member
                  </span>
                  <p className="text-secondary text-xs sm:text-sm leading-relaxed">
                    Guardian &amp; Caregiver Portal for prescription schedules, clinician visits, and real-time vital telemetry.
                  </p>
                </div>
              </div>

              <div
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  selectedRole === 'family'
                    ? 'bg-primary text-on-primary border-primary'
                    : 'text-transparent border-outline-variant/60'
                }`}
              >
                <span className="material-symbols-outlined text-base font-bold">check</span>
              </div>
            </button>

            {/* Button 2: I am Patient */}
            <button
              type="button"
              onClick={() => setSelectedRole('patient')}
              className={`text-left relative p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 flex items-start justify-between gap-3 cursor-pointer ${
                selectedRole === 'patient'
                  ? 'border-primary bg-surface-container-low shadow-md ring-2 ring-primary/20'
                  : 'border-outline-variant/60 bg-surface-container-lowest hover:border-primary/50 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    selectedRole === 'patient'
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-primary-fixed text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl sm:text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>
                    elderly
                  </span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-base sm:text-lg font-bold text-on-surface leading-snug">
                    I am Patient
                  </span>
                  <p className="text-secondary text-xs sm:text-sm leading-relaxed">
                    Serene, large-print daily reminders, morning &amp; evening pill schedules, and 1-tap calls to family.
                  </p>
                </div>
              </div>

              <div
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  selectedRole === 'patient'
                    ? 'bg-primary text-on-primary border-primary'
                    : 'text-transparent border-outline-variant/60'
                }`}
              >
                <span className="material-symbols-outlined text-base font-bold">check</span>
              </div>
            </button>
          </div>

          {/* STEP 2: Interactive Sign In Form Container */}
          <div className="w-full bg-surface-container-lowest rounded-2xl p-5 sm:p-8 shadow-sm border border-outline-variant/30">
            {/* FORM A: Family Member Sign In */}
            {selectedRole === 'family' && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 pb-4 border-b border-surface-container">
                  <div className="w-10 h-10 rounded-xl bg-secondary-container text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-on-surface">
                      Family Member Sign In
                    </h2>
                    <p className="text-xs sm:text-sm text-secondary">
                      Authorized access for designated family guardians and caregivers
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container-low flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary text-xl shrink-0 mt-0.5">info</span>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    Family admins have full access to medication scheduling, dispenser alerts, and doctor appointment coordination.
                  </p>
                </div>

                <form onSubmit={handleFamilySubmit} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-on-surface" htmlFor="familyEmail">
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-secondary text-xl pointer-events-none">
                        mail
                      </span>
                      <input
                        id="familyEmail"
                        type="email"
                        required
                        value={familyEmail}
                        onChange={(e) => setFamilyEmail(e.target.value)}
                        placeholder="sarah.vance@familycare.net"
                        className="w-full h-12 pl-11 pr-4 rounded-xl bg-surface-container-low text-on-surface text-sm sm:text-base border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold text-on-surface" htmlFor="familyPassword">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={(e) => e.preventDefault()}
                        className="text-xs sm:text-sm text-primary hover:underline font-semibold"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-secondary text-xl pointer-events-none">
                        lock
                      </span>
                      <input
                        id="familyPassword"
                        type={showFamilyPassword ? 'text' : 'password'}
                        required
                        value={familyPassword}
                        onChange={(e) => setFamilyPassword(e.target.value)}
                        className="w-full h-12 pl-11 pr-11 rounded-xl bg-surface-container-low text-on-surface text-sm sm:text-base border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowFamilyPassword(!showFamilyPassword)}
                        className="absolute right-2.5 text-secondary hover:text-on-surface p-1.5 rounded-lg transition-colors cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        <span className="material-symbols-outlined text-xl">
                          {showFamilyPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-4 h-4 rounded text-primary focus:ring-primary bg-surface-container border-outline-variant"
                      />
                      <span className="text-xs sm:text-sm text-on-surface-variant">
                        Stay signed in on this station
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={handleFamilySubmit}
                      className="flex items-center gap-1.5 text-primary hover:underline font-semibold text-xs sm:text-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">fingerprint</span>
                      <span>Sign In with Passkey</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[52px] sm:min-h-[56px] px-6 bg-primary hover:bg-primary-container text-on-primary rounded-xl text-base sm:text-lg font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all mt-2 cursor-pointer active:scale-[0.99]"
                  >
                    <span className="material-symbols-outlined text-2xl">login</span>
                    <span>Sign In as Family Member</span>
                  </button>
                </form>
              </div>
            )}

            {/* FORM B: Patient Sign In */}
            {selectedRole === 'patient' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 sm:gap-4 pb-4 border-b border-surface-container">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-2xl sm:text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>
                      elderly
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-primary">
                      Patient Sign In
                    </h2>
                    <p className="text-secondary text-xs sm:text-sm md:text-base mt-0.5 leading-snug">
                      Large, clear buttons designed for serene simplicity and peace of mind
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePatientSubmit} className="space-y-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-base sm:text-lg font-bold text-on-surface" htmlFor="patientIdInput">
                      Patient ID or Care Card Number
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-4 text-primary text-2xl pointer-events-none">
                        badge
                      </span>
                      <input
                        id="patientIdInput"
                        type="text"
                        required
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                        placeholder="e.g. EC-78294"
                        className="w-full h-14 sm:h-16 pl-14 pr-4 rounded-xl bg-surface-container-low text-on-surface text-lg sm:text-xl font-bold tracking-wider border-2 border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-4 focus:ring-primary/20 shadow-xs transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-base sm:text-lg font-bold text-on-surface" htmlFor="patientPinInput">
                        Password / 4-Digit PIN
                      </label>
                      <button
                        type="button"
                        onClick={(e) => e.preventDefault()}
                        className="text-xs sm:text-sm text-primary hover:underline font-semibold"
                      >
                        Need Help Signing In?
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-4 text-primary text-2xl pointer-events-none">
                        lock
                      </span>
                      <input
                        id="patientPinInput"
                        type={showPatientPin ? 'text' : 'password'}
                        required
                        value={patientPin}
                        onChange={(e) => setPatientPin(e.target.value)}
                        placeholder="••••"
                        className="w-full h-14 sm:h-16 pl-14 pr-14 rounded-xl bg-surface-container-low text-on-surface text-lg sm:text-xl font-bold tracking-widest border-2 border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-4 focus:ring-primary/20 shadow-xs transition-all"
                      />
                      <button
                        type="button"
                        aria-label="Toggle PIN Visibility"
                        onClick={() => setShowPatientPin(!showPatientPin)}
                        className="absolute right-3.5 text-secondary hover:text-on-surface p-2 rounded-lg cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-2xl">
                          {showPatientPin ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 pt-1">
                    <input
                      id="rememberMe"
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded text-primary focus:ring-primary bg-surface-container border-outline-variant"
                    />
                    <label htmlFor="rememberMe" className="text-sm sm:text-base font-semibold text-on-surface cursor-pointer">
                      Remember me on this tablet / device
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[60px] sm:min-h-[68px] px-6 bg-primary hover:bg-primary-container text-on-primary rounded-xl text-lg sm:text-xl font-bold flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all mt-3 cursor-pointer active:scale-[0.99]"
                  >
                    <span className="material-symbols-outlined text-2xl sm:text-3xl">login</span>
                    <span>Sign In to My Care Portal</span>
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Bottom Brand Signature */}
          <div className="flex flex-col sm:flex-row items-center justify-between py-4 border-t border-outline-variant/20 text-secondary text-xs sm:text-sm gap-2 mt-2">
            <div className="flex items-center gap-1.5 text-center sm:text-left">
              <span className="material-symbols-outlined text-primary text-lg">home_health</span>
              <span className="font-semibold">
                Elder Care Health Technologies • Connected Families
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Emergency Protocol</span>
              <span>•</span>
              <span>Caregiver Guide</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
