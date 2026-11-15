import React, { useState } from 'react';

const PRESET_AVATARS = [
  {
    label: 'Senior Male 1',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD99byptjuhNgCpydCJ16Hz_u_ZwJfqSRxclPZrtP416owqTMZzluxrdWg5KmtITrgFspnVZilMdkGKNNWMhUn6vK7mho-aKAMpXaw-8yrIbFJZ--m39KTPcPeFXqb726pHlVGQOzDHaIJO7UoGfXAG3oYLxr9BZ4pUwFKXy7wI9t5aH0OQ1k6nkoZgQNI21oK4tMrmor4LzWsOoIEKmTho80rO4onBcCN2ed8aX4g'
  },
  {
    label: 'Senior Female 1',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHYHapAKFDD4sgE_2PEuftlgnG0HOsLP0lccAxSCf7aQR_E0OyMrrj4fkI1m2SpGKvNX70GcMo4cOaRyxCP6Bs2IN7FPId_EYg7DL2pxMNb8gHy6zZ0jK61W2rFW_TX6MsBtE7c646O0hrHDJ_1QknPSsZMp9K1dMMnSNM4U-N1sGpXRxfC7q-B2UDdswx6XBTG2ufy_hY091RsVeNBBKcBGTRW-Cu_u0gEWDSruw'
  },
  {
    label: 'Senior Female 2',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCl3Luy93g6qs-rkbF79yp2l7HmZkrHcVJzSbdtvrYyefjhYmldH7T6i2CoqSwXk6GGA8RFTUIoucggE_tapYCn6Rd30nNUwI7u6gY4LyI7QahLPWEg7vtBaWyPCqYAxL4cAHm3jaB-Yu6XP3D1s-U45XQK5OMyoRaj_iNb9tDL3jLoj-Wseh0pRu5znOduL1SRWVS-XAbhaKaj6pQUGyzg_WgDGJmJABJ1qPomgf0'
  }
];

export function AddPatientModal({ isOpen, onClose, onSave }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('78');
  const [relation, setRelation] = useState('Father');
  const [residence, setResidence] = useState('Assisted Living Wing A');
  const [conditions, setConditions] = useState('');
  const [assignedDoctor, setAssignedDoctor] = useState('Dr. Sarah Jenkins');
  const [doctorSpecialty, setDoctorSpecialty] = useState('Geriatrics');
  
  // Auto-generate unique Patient Code (EC-XXXXX) & PIN
  const [patientCode, setPatientCode] = useState(() => `EC-${Math.floor(10000 + Math.random() * 90000)}`);
  const [patientPin, setPatientPin] = useState(() => String(Math.floor(1000 + Math.random() * 9000)));
  const [showPin, setShowPin] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0].url);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleRegenerateCredentials = () => {
    setPatientCode(`EC-${Math.floor(10000 + Math.random() * 90000)}`);
    setPatientPin(String(Math.floor(1000 + Math.random() * 9000)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        name: name.trim(),
        age: parseInt(age, 10) || 75,
        relation,
        residence: residence.trim() || 'Residence Suite 101',
        conditions: conditions ? conditions.split(',').map((c) => c.trim()).filter(Boolean) : [],
        assignedDoctor: assignedDoctor.trim() || 'General Practitioner',
        doctorSpecialty: doctorSpecialty.trim() || 'Family Care',
        patientCode: patientCode.trim(),
        pin: patientPin.trim(),
        password: patientPin.trim(),
        avatar: selectedAvatar
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/50 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-outline-variant/30 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">person_add</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-on-surface truncate">
              Enroll New Family Patient
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container hover:text-on-surface shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Patient ID and Password Generator Callout */}
          <div className="p-3.5 rounded-xl bg-primary-fixed/30 border border-primary/20 flex flex-col gap-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-primary font-bold text-xs sm:text-sm">
                <span className="material-symbols-outlined text-[18px]">key</span>
                <span>Patient Portal Login Credentials</span>
              </div>
              <button
                type="button"
                onClick={handleRegenerateCredentials}
                className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">refresh</span>
                <span>Generate New</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-secondary font-medium">
                  Patient ID (Login Code)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={patientCode}
                    onChange={(e) => setPatientCode(e.target.value.toUpperCase())}
                    className="w-full h-9 px-3 bg-surface-container-lowest rounded-lg font-mono font-bold text-primary text-xs sm:text-sm border border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs"
                  />
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary text-[16px] pointer-events-none">
                    badge
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-secondary font-medium">
                  Patient PIN / Password
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    required
                    value={patientPin}
                    onChange={(e) => setPatientPin(e.target.value)}
                    className="w-full h-9 px-3 bg-surface-container-lowest rounded-lg font-mono font-bold text-on-surface text-xs sm:text-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface cursor-pointer p-0.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {showPin ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-secondary">
              The patient will use this ID and PIN to log into their simplified medication dashboard.
            </p>
          </div>

          {/* Demographic Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-xs font-semibold text-on-surface">
                Patient Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Robert Vance"
                className="h-10 px-3 bg-surface-container-low rounded-xl text-on-surface text-xs sm:text-sm border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface">
                Age
              </label>
              <input
                type="number"
                min="50"
                max="120"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="h-10 px-3 bg-surface-container-low rounded-xl text-on-surface text-xs sm:text-sm border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface">
                Relationship to You
              </label>
              <select
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                className="h-10 px-3 bg-surface-container-low rounded-xl text-on-surface text-xs sm:text-sm border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Spouse">Spouse</option>
                <option value="Uncle">Uncle</option>
                <option value="Aunt">Aunt</option>
                <option value="Grandfather">Grandfather</option>
                <option value="Grandmother">Grandmother</option>
                <option value="Sibling">Sibling</option>
                <option value="Family Member">Family Member</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-xs font-semibold text-on-surface">
                Living Residence / Suite
              </label>
              <input
                type="text"
                required
                value={residence}
                onChange={(e) => setResidence(e.target.value)}
                placeholder="e.g. Assisted Living Suite 204 or Home"
                className="h-10 px-3 bg-surface-container-low rounded-xl text-on-surface text-xs sm:text-sm border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
              />
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-xs font-semibold text-on-surface">
                Known Conditions (comma-separated)
              </label>
              <input
                type="text"
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                placeholder="e.g. Hypertension, Mild Arthritis, High Cholesterol"
                className="h-10 px-3 bg-surface-container-low rounded-xl text-on-surface text-xs sm:text-sm border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface">
                Primary Doctor
              </label>
              <input
                type="text"
                value={assignedDoctor}
                onChange={(e) => setAssignedDoctor(e.target.value)}
                placeholder="e.g. Dr. Sarah Jenkins"
                className="h-10 px-3 bg-surface-container-low rounded-xl text-on-surface text-xs sm:text-sm border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface">
                Doctor Specialty
              </label>
              <input
                type="text"
                value={doctorSpecialty}
                onChange={(e) => setDoctorSpecialty(e.target.value)}
                placeholder="e.g. Geriatrics, Cardiology"
                className="h-10 px-3 bg-surface-container-low rounded-xl text-on-surface text-xs sm:text-sm border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
              />
            </div>
          </div>

          {/* Avatar Preset Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface">
              Choose Patient Profile Photo
            </label>
            <div className="flex items-center gap-3">
              {PRESET_AVATARS.map((av, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(av.url)}
                  className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedAvatar === av.url
                      ? 'border-primary ring-2 ring-primary/30 scale-105'
                      : 'border-outline-variant/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-surface-container mt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-10 px-4 rounded-xl bg-surface-container text-secondary text-xs sm:text-sm font-semibold hover:bg-surface-container-high transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="h-10 px-5 rounded-xl bg-primary text-on-primary text-xs sm:text-sm font-semibold flex items-center gap-1.5 hover:bg-primary-container transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isSubmitting ? 'hourglass_top' : 'check'}
              </span>
              <span>{isSubmitting ? 'Creating Patient...' : 'Enroll Patient'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
