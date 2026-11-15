import React, { useState } from 'react';

export function MedicationModal({ isOpen, onClose, onSave, patientName, initialData }) {
  const [name, setName] = useState(initialData?.name || '');
  const [dosage, setDosage] = useState(initialData?.dosage || '500 mg');
  const [frequency, setFrequency] = useState(initialData?.frequency || 'Twice Daily');
  const [times, setTimes] = useState(initialData?.times?.join(', ') || '8:00 AM, 1:00 PM');
  const [instructions, setInstructions] = useState(initialData?.instructions || 'Take with food and full glass of water');
  const [type, setType] = useState(initialData?.type || 'Oral Tablet');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      fullName: name.trim(),
      dosage: dosage.trim(),
      frequency,
      times: times.split(',').map((t) => t.trim()).filter(Boolean),
      instructions: instructions.trim(),
      type,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/50 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-outline-variant/30 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-primary text-2xl shrink-0">medication</span>
            <h3 className="text-base sm:text-lg font-bold text-on-surface truncate">
              {initialData ? `Edit Medication (${name})` : `Add Medication for ${patientName}`}
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
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface">
              Medication Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Metformin Hydrochloride"
              className="h-10 px-3 bg-surface-container-low rounded-xl text-on-surface text-xs sm:text-sm border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface">
                Dosage
              </label>
              <input
                type="text"
                required
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 500 mg"
                className="h-10 px-3 bg-surface-container-low rounded-xl text-on-surface text-xs sm:text-sm border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="h-10 px-3 bg-surface-container-low rounded-xl text-on-surface text-xs sm:text-sm border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
              >
                <option>Oral Tablet</option>
                <option>Softgel</option>
                <option>Capsule</option>
                <option>Liquid Solution</option>
                <option>Topical / Cream</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface">
              Intake Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="h-10 px-3 bg-surface-container-low rounded-xl text-on-surface text-xs sm:text-sm border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
            >
              <option>Twice Daily</option>
              <option>Once Daily</option>
              <option>Three Times Daily</option>
              <option>As Needed (PRN)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface">
              Scheduled Times (comma separated)
            </label>
            <input
              type="text"
              value={times}
              onChange={(e) => setTimes(e.target.value)}
              placeholder="e.g. 8:00 AM, 1:00 PM"
              className="h-10 px-3 bg-surface-container-low rounded-xl text-on-surface text-xs sm:text-sm border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface">
              Caregiver Instructions
            </label>
            <textarea
              rows="2"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Administer with meal to avoid upset stomach..."
              className="p-3 bg-surface-container-low rounded-xl text-on-surface text-xs sm:text-sm border border-outline-variant/30 focus:border-primary focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
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
              {initialData ? 'Update Routine' : 'Save Medication'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
