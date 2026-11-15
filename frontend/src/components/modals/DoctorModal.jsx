import React, { useState } from 'react';

export function DoctorModal({ isOpen, onClose, onSave, patientName, initialData }) {
  const [doctor, setDoctor] = useState(initialData?.doctor || 'Dr. Sarah Jenkins');
  const [clinic, setClinic] = useState(initialData?.clinic || 'St. Jude Heart Clinic');
  const [specialty, setSpecialty] = useState(initialData?.specialty || 'Cardiology');
  const [date, setDate] = useState(initialData?.date || 'Oct 24, 2026');
  const [time, setTime] = useState(initialData?.time || '10:30 AM');
  const [purpose, setPurpose] = useState(initialData?.purpose || 'Routine Hypertension & Heart Valve Review');
  const [transportNotes, setTransportNotes] = useState(initialData?.transportNotes || 'Wheelchair transport confirmed');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      doctor,
      clinic,
      specialty,
      date,
      time,
      purpose,
      transportNotes,
      status: 'Confirmed',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/50 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-outline-variant/30 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-primary text-2xl shrink-0">calendar_month</span>
            <h3 className="text-base sm:text-lg font-bold text-on-surface truncate">
              Schedule Doctor Visit ({patientName})
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface">
                Doctor Name
              </label>
              <input
                type="text"
                required
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                placeholder="e.g. Dr. Sarah Jenkins"
                className="h-10 px-3 bg-surface-container-low rounded-xl text-on-surface text-xs sm:text-sm border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface">
                Specialty
              </label>
              <input
                type="text"
                required
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="e.g. Cardiology"
                className="h-10 px-3 bg-surface-container-low rounded-xl text-on-surface text-xs sm:text-sm border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface">
              Clinic or Hospital Location
            </label>
            <input
              type="text"
              required
              value={clinic}
              onChange={(e) => setClinic(e.target.value)}
              placeholder="e.g. St. Jude Heart Pavilion"
              className="h-10 px-3 bg-surface-container-low rounded-xl text-on-surface text-xs sm:text-sm border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface">
                Date
              </label>
              <input
                type="text"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. Tomorrow or Oct 24, 2026"
                className="h-10 px-3 bg-surface-container-low rounded-xl text-on-surface text-xs sm:text-sm border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface">
                Time
              </label>
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 10:30 AM"
                className="h-10 px-3 bg-surface-container-low rounded-xl text-on-surface text-xs sm:text-sm border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface">
              Purpose of Visit
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Routine checkup & medication review"
              className="h-10 px-3 bg-surface-container-low rounded-xl text-on-surface text-xs sm:text-sm border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface">
              Medical Transit / Wheelchair Transport Notes
            </label>
            <input
              type="text"
              value={transportNotes}
              onChange={(e) => setTransportNotes(e.target.value)}
              placeholder="e.g. Wheelchair accessible transit driver requested"
              className="h-10 px-3 bg-surface-container-low rounded-xl text-on-surface text-xs sm:text-sm border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-surface-container text-on-surface text-xs sm:text-sm font-semibold hover:bg-surface-container-high transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs sm:text-sm font-semibold hover:bg-primary-container transition-all shadow-xs cursor-pointer active:scale-95"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
