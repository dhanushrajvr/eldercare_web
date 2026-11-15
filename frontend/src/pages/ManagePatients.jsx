import React, { useState } from 'react';
import { usePatients } from '../context/PatientContext';
import { MedicationModal } from '../components/modals/MedicationModal';
import { DoctorModal } from '../components/modals/DoctorModal';

export function ManagePatients() {
  const {
    patients,
    setSelectedPatientId,
    selectedPatient,
    addMedication,
    updateMedication,
    deleteMedication,
    updateDoctorVisit,
    showToast,
  } = usePatients();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingMed, setEditingMed] = useState(null);
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  // Quick modifier state for inline editor
  const [quickMedName, setQuickMedName] = useState(selectedPatient.medications[0]?.name || 'Metformin');
  const [quickDosage, setQuickDosage] = useState(selectedPatient.medications[0]?.dosage || '500 mg');
  const [quickFrequency, setQuickFrequency] = useState(selectedPatient.medications[0]?.frequency || 'Twice Daily');
  const [quickInstructions, setQuickInstructions] = useState(
    selectedPatient.medications[0]?.instructions || 'Administer with meal to avoid gastrointestinal upset.'
  );

  const activePatient = selectedPatient || patients[0];

  const handleSelectPatient = (id) => {
    setSelectedPatientId(id);
    const p = patients.find((pat) => pat.id === id);
    if (p && p.medications.length > 0) {
      setQuickMedName(p.medications[0].name);
      setQuickDosage(p.medications[0].dosage);
      setQuickFrequency(p.medications[0].frequency);
      setQuickInstructions(p.medications[0].instructions);
    }
  };

  const handleQuickModifierSave = () => {
    const med = activePatient.medications.find(
      (m) => m.name.toLowerCase() === quickMedName.toLowerCase()
    ) || activePatient.medications[0];

    if (med) {
      updateMedication(activePatient.id, med.id, {
        name: quickMedName,
        dosage: quickDosage,
        frequency: quickFrequency,
        instructions: quickInstructions,
      });
      showToast(`Updated quick settings for ${quickMedName}`, 'tune');
    }
  };

  return (
    <div className="flex flex-col w-full pb-20 max-w-7xl mx-auto gap-6 sm:gap-8">
      {/* Top Page Header Strip */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1 max-w-2xl">
          <div className="flex items-center gap-1.5 text-secondary text-xs sm:text-sm">
            <span className="uppercase tracking-wider">Clinical Care Hub</span>
            <span>•</span>
            <span className="text-primary font-semibold">Active Portal Sync</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl text-on-surface font-bold tracking-tight">
            Manage Patients
          </h1>
          <p className="text-secondary text-xs sm:text-sm md:text-base leading-relaxed">
            Select a family member to manage their care profile, edit daily medication schedule, and update doctor appointments.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          <div className="relative flex-1 md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px] pointer-events-none">
              search
            </span>
            <input
              className="w-full bg-surface-container-lowest text-on-surface text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-outline-variant/30 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Search by name or room..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => showToast('Enrollment form initialized for new family member', 'person_add')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-secondary-container text-primary text-xs sm:text-sm font-semibold hover:bg-secondary-fixed transition-all shadow-xs shrink-0 cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Add New Patient</span>
          </button>
        </div>
      </div>

      {/* Step 1: Visual Patient Selector Grid */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-xs font-bold">
              1
            </div>
            <h2 className="text-base sm:text-lg font-bold text-on-surface">
              Select Patient to Manage
            </h2>
          </div>
          <span className="text-xs sm:text-sm text-secondary">
            {patients.length} Family Members Linked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((p) => {
            const isSelected = p.id === activePatient.id;

            return (
              <div
                key={p.id}
                onClick={() => handleSelectPatient(p.id)}
                className={`relative bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-sm flex flex-col justify-between gap-4 transition-all cursor-pointer ${
                  isSelected ? 'ring-2 ring-primary shadow-sm' : 'border border-outline-variant/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-surface-container ring-2 ring-primary/20 shrink-0">
                      <img
                        className="w-full h-full object-cover"
                        src={p.avatar}
                        alt={`${p.name} portrait`}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-base font-bold text-on-surface truncate">
                        {p.name}
                      </span>
                      <span className="text-xs text-secondary truncate">
                        {p.age} yrs • {p.relation}
                      </span>
                    </div>
                  </div>

                  {isSelected ? (
                    <span className="px-2.5 py-1 rounded-full bg-primary-container text-on-primary text-[11px] font-semibold flex items-center gap-1 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-pulse" />
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-medium shrink-0">
                      {p.status}
                    </span>
                  )}
                </div>

                <div className="bg-surface-container-low rounded-xl p-3 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-secondary">Adherence</span>
                    <span className="text-base sm:text-lg font-bold text-primary">
                      {p.adherenceScore}%
                    </span>
                  </div>
                  <div className="w-14 h-8 flex items-center">
                    <svg
                      className="w-full h-full text-primary"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                      viewBox="0 0 50 24"
                    >
                      <path d="M 2 18 L 12 14 L 22 16 L 32 8 L 42 10 L 48 4" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-primary font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Profile Active
                  </span>
                  <span className="text-secondary truncate">
                    {p.residence.split('•')[0]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Patient Care Editor for Selected Patient */}
      <div className="flex flex-col gap-6 sm:gap-8">
        {/* Active Patient Summary Banner */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border border-outline-variant/30">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-primary-container ring-4 ring-primary-fixed/50 shrink-0">
              <img
                className="w-full h-full object-cover"
                src={activePatient.avatar}
                alt={activePatient.name}
              />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-on-surface truncate">
                  {activePatient.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-medium">
                  {activePatient.residence}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-primary text-xs font-medium">
                  Primary: Sarah Vance
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {activePatient.conditions?.map((c, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary text-xs font-semibold"
                  >
                    {c}
                  </span>
                ))}
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-primary text-xs font-semibold">
                  {activePatient.assignedDoctor}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end flex-wrap">
            <button
              type="button"
              onClick={() => showToast('Draft discarded, live medical records retained', 'restore')}
              className="px-3.5 py-2 rounded-xl bg-surface-container text-on-surface text-xs sm:text-sm font-semibold hover:bg-surface-dim transition-all cursor-pointer"
            >
              Discard Draft
            </button>
            <button
              type="button"
              onClick={() => showToast('All care plan changes saved to HIPAA registry', 'save')}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs sm:text-sm font-semibold hover:bg-primary-container transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Save All Changes</span>
            </button>
          </div>
        </div>

        {/* Section A: Medication Routine Manager */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col gap-4 border border-outline-variant/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[22px]">medication</span>
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-on-surface truncate">
                  Medical Tablet Intake &amp; Routine
                </h3>
                <span className="text-xs sm:text-sm text-secondary truncate">
                  Manage prescribed dosages, delivery frequencies, and food guidelines
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAddMedOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-on-primary text-xs sm:text-sm font-semibold hover:bg-primary-container transition-all self-start sm:self-auto shadow-xs cursor-pointer active:scale-95 shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Add Medication</span>
            </button>
          </div>

          {/* Medication Schedule Cards */}
          <div className="flex flex-col gap-3">
            {activePatient.medications.map((med) => (
              <div
                key={med.id}
                className="bg-surface-container-low rounded-2xl p-3.5 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 hover:bg-surface-container transition-all border border-outline-variant/20"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-lowest flex items-center justify-center shrink-0 shadow-xs text-primary">
                    <span className="material-symbols-outlined text-[24px]">{med.icon || 'pill'}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm sm:text-base font-bold text-on-surface truncate">
                        {med.name}
                      </span>
                      <span className="px-2 py-0.2 rounded-full bg-primary-fixed text-primary text-[11px] font-semibold">
                        {med.dosage}
                      </span>
                      <span className="px-2 py-0.2 rounded-full bg-surface-container-highest text-on-surface text-[11px]">
                        {med.type || 'Oral Tablet'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 text-secondary text-xs flex-wrap">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        {med.frequency} ({med.times.join(', ')})
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">restaurant</span>
                        {med.instructions}
                      </span>
                      <span className="text-primary font-semibold">
                        Next due: {med.nextDue}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end lg:self-center flex-wrap shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setQuickMedName(med.name);
                      setQuickDosage(med.dosage);
                      setQuickFrequency(med.frequency);
                      setQuickInstructions(med.instructions);
                      showToast(`Adjusting dose for ${med.name} in modifier panel below`, 'tune');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all shadow-xs cursor-pointer"
                  >
                    Adjust Dose
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingMed(med)}
                    className="px-3 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all shadow-xs cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMedication(activePatient.id, med.id)}
                    className="p-1.5 rounded-lg text-error hover:bg-error-container/40 transition-all cursor-pointer"
                    title="Delete medication"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Edit Medication Inline Panel */}
          <div className="bg-surface-container-high rounded-2xl p-4 sm:p-5 flex flex-col gap-4 mt-1 border border-outline-variant/30">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                <span className="text-sm sm:text-base font-bold text-on-surface">
                  Quick Intake Modifier: {quickMedName}
                </span>
              </div>
              <span className="text-xs text-secondary">
                Active Prescriber: {activePatient.assignedDoctor}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface">
                  Medication Name
                </label>
                <input
                  className="h-10 px-3 bg-surface-container-lowest rounded-xl text-on-surface text-xs sm:text-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
                  type="text"
                  value={quickMedName}
                  onChange={(e) => setQuickMedName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface">
                  Dosage (mg/IU)
                </label>
                <input
                  className="h-10 px-3 bg-surface-container-lowest rounded-xl text-on-surface text-xs sm:text-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
                  type="text"
                  value={quickDosage}
                  onChange={(e) => setQuickDosage(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2 md:col-span-1">
                <label className="text-xs font-semibold text-on-surface">
                  Intake Frequency
                </label>
                <select
                  className="h-10 px-3 bg-surface-container-lowest rounded-xl text-on-surface text-xs sm:text-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={quickFrequency}
                  onChange={(e) => setQuickFrequency(e.target.value)}
                >
                  <option>Twice Daily</option>
                  <option>Once Daily</option>
                  <option>Three Times Daily</option>
                  <option>As Needed (PRN)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-on-surface">
                Caregiver Guidance &amp; Instructions
              </label>
              <textarea
                className="p-3 bg-surface-container-lowest rounded-xl text-on-surface text-xs sm:text-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary"
                rows="2"
                value={quickInstructions}
                onChange={(e) => setQuickInstructions(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => showToast('Changes canceled', 'cancel')}
                className="px-3.5 py-2 rounded-xl bg-surface-container-lowest text-on-surface text-xs sm:text-sm font-semibold hover:bg-surface-container transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleQuickModifierSave}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs sm:text-sm font-semibold hover:bg-primary-container transition-all shadow-xs cursor-pointer active:scale-95"
              >
                Update Medication
              </button>
            </div>
          </div>
        </div>

        {/* Section B: Doctor Visits & Clinical Appointments */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col gap-4 border border-outline-variant/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[22px]">calendar_month</span>
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-on-surface truncate">
                  Edit &amp; Manage Doctor Visits
                </h3>
                <span className="text-xs sm:text-sm text-secondary truncate">
                  Clinical appointments, consultations, and routine senior check-ups
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsDocModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-on-primary text-xs sm:text-sm font-semibold hover:bg-primary-container transition-all self-start sm:self-auto shadow-xs cursor-pointer active:scale-95 shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Schedule Visit</span>
            </button>
          </div>

          {/* Scheduled Visits List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activePatient.nextDoctorVisit && (
              <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col justify-between gap-4 border border-outline-variant/20">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary text-xs font-semibold">
                      {activePatient.nextDoctorVisit.status || 'Confirmed'}
                    </span>
                    <span className="text-xs text-secondary">
                      {activePatient.nextDoctorVisit.date} • {activePatient.nextDoctorVisit.time}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 mt-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-xs font-bold shrink-0">
                      {activePatient.nextDoctorVisit.doctor
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .substring(0, 2)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm sm:text-base font-bold text-on-surface truncate">
                        {activePatient.nextDoctorVisit.doctor}
                      </span>
                      <span className="text-xs text-secondary truncate">
                        {activePatient.nextDoctorVisit.specialty} • {activePatient.nextDoctorVisit.clinic}
                      </span>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest rounded-xl p-3 flex flex-col gap-1 border border-outline-variant/10 text-xs">
                    <span className="text-secondary font-semibold">Purpose of Visit</span>
                    <span className="text-on-surface">
                      {activePatient.nextDoctorVisit.purpose}
                    </span>
                    <span className="text-primary flex items-center gap-1 mt-1 font-semibold">
                      <span className="material-symbols-outlined text-[15px]">accessible</span>
                      {activePatient.nextDoctorVisit.transportNotes}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setIsDocModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-primary text-xs font-semibold transition-all shadow-xs cursor-pointer"
                  >
                    Edit Details
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Reschedule request submitted to clinic dispatch', 'update')}
                    className="px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-dim text-on-surface text-xs font-semibold transition-all cursor-pointer"
                  >
                    Request Reschedule
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isAddMedOpen && (
        <MedicationModal
          isOpen={isAddMedOpen}
          onClose={() => setIsAddMedOpen(false)}
          onSave={(data) => addMedication(activePatient.id, data)}
          patientName={activePatient.name}
        />
      )}

      {editingMed && (
        <MedicationModal
          isOpen={!!editingMed}
          onClose={() => setEditingMed(null)}
          onSave={(data) => {
            updateMedication(activePatient.id, editingMed.id, data);
            setEditingMed(null);
          }}
          patientName={activePatient.name}
          initialData={editingMed}
        />
      )}

      {isDocModalOpen && (
        <DoctorModal
          isOpen={isDocModalOpen}
          onClose={() => setIsDocModalOpen(false)}
          onSave={(data) => updateDoctorVisit(activePatient.id, data)}
          patientName={activePatient.name}
          initialData={activePatient.nextDoctorVisit}
        />
      )}
    </div>
  );
}
