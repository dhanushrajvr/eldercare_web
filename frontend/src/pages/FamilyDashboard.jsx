import React, { useState } from 'react';
import { usePatients } from '../context/PatientContext';
import { MedicationModal } from '../components/modals/MedicationModal';
import { DoctorModal } from '../components/modals/DoctorModal';

export function FamilyDashboard({ onNavigateToManage }) {
  const { patients, addMedication, updateDoctorVisit, showToast } = usePatients();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientForMed, setSelectedPatientForMed] = useState(null);
  const [selectedPatientForDoc, setSelectedPatientForDoc] = useState(null);

  const filteredPatients = patients.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.relation.toLowerCase().includes(q) ||
      p.residence.toLowerCase().includes(q) ||
      p.medications.some((m) => m.name.toLowerCase().includes(q))
    );
  });

  const handleOpenMedModal = (patient) => {
    setSelectedPatientForMed(patient);
  };

  const handleOpenDocModal = (patient) => {
    setSelectedPatientForDoc(patient);
  };

  const handleSaveMedication = (medData) => {
    if (selectedPatientForMed) {
      addMedication(selectedPatientForMed.id, medData);
      setSelectedPatientForMed(null);
    }
  };

  const handleSaveDoctorVisit = (docData) => {
    if (selectedPatientForDoc) {
      updateDoctorVisit(selectedPatientForDoc.id, docData);
      setSelectedPatientForDoc(null);
    }
  };

  return (
    <div className="flex flex-col w-full pb-16 max-w-7xl mx-auto">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl text-primary font-bold tracking-tight">
            Family Care Dashboard
          </h1>
          <p className="text-secondary text-xs sm:text-sm md:text-base mt-1">
            Overview of family member medication routines, daily adherence status, and upcoming clinical appointments.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients or meds..."
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
            />
          </div>
          <button
            type="button"
            className="h-10 px-3.5 sm:px-4 rounded-xl bg-primary text-on-primary text-xs sm:text-sm font-semibold flex items-center gap-1.5 hover:bg-primary-container transition-all shadow-xs shrink-0 cursor-pointer active:scale-95"
            onClick={() => showToast('New family patient enrollment wizard ready', 'person_add')}
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>Add Patient</span>
          </button>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {filteredPatients.map((patient) => {
          const nextPendingMed = patient.medications.find((m) => !m.takenToday) || patient.medications[0];

          return (
            <div
              key={patient.id}
              className="bg-surface-container-lowest rounded-2xl shadow-xs hover:shadow-sm p-4 sm:p-6 border border-outline-variant/30 transition-shadow"
            >
              <div className="flex flex-col gap-4">
                {/* Header Row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-surface-container pb-4">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shadow-xs ring-2 ring-primary/20"
                        src={patient.avatar}
                        alt={`${patient.name} photo`}
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-surface-container-lowest ${
                          patient.status === 'Active' ? 'bg-primary' : 'bg-secondary'
                        }`}
                        title={patient.status}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base sm:text-lg md:text-xl font-bold text-on-surface truncate">
                          {patient.name}
                        </h2>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary text-xs font-semibold shrink-0">
                          {patient.age} yrs
                        </span>
                      </div>
                      <span className="text-secondary text-xs sm:text-sm block mt-0.5 truncate">
                        {patient.relation} • {patient.residence}
                      </span>
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    <button
                      type="button"
                      className="h-9 sm:h-10 px-3 sm:px-3.5 rounded-xl bg-primary-container text-on-primary text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-primary transition-all shadow-xs cursor-pointer active:scale-95"
                      onClick={() => handleOpenMedModal(patient)}
                    >
                      <span className="material-symbols-outlined text-[18px]">medication</span>
                      <span>+ Add Med</span>
                    </button>

                    <button
                      type="button"
                      className="h-9 sm:h-10 px-3 sm:px-3.5 rounded-xl bg-surface-container text-primary text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 hover:bg-surface-container-high transition-all cursor-pointer active:scale-95"
                      onClick={() => handleOpenDocModal(patient)}
                    >
                      <span className="material-symbols-outlined text-[18px]">event_available</span>
                      <span>Doctor Visit</span>
                    </button>

                    {onNavigateToManage && (
                      <button
                        type="button"
                        className="h-9 sm:h-10 px-3 sm:px-3.5 rounded-xl bg-surface-container-high text-on-surface text-xs sm:text-sm font-semibold flex items-center justify-center gap-1 hover:bg-primary-container hover:text-on-primary transition-all cursor-pointer active:scale-95"
                        onClick={() => onNavigateToManage(patient.id)}
                      >
                        <span className="material-symbols-outlined text-[18px]">tune</span>
                        <span className="hidden sm:inline">Manage</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Clinical Detail Lines */}
                <div className="flex flex-col gap-2.5 w-full">
                  {/* Line 1: Daily Adherence */}
                  <div className="p-3 sm:p-3.5 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 w-full">
                    <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm">
                      <span className="material-symbols-outlined text-primary text-[20px] shrink-0">task_alt</span>
                      <span className="font-semibold text-on-surface">Daily Adherence:</span>
                      <span className="font-bold text-primary text-base sm:text-lg">{patient.adherenceScore}%</span>
                      <span className="text-secondary">(on schedule)</span>
                    </div>
                    <div className="w-full sm:w-48 md:w-60 bg-surface-container-high rounded-full h-2.5 overflow-hidden shrink-0">
                      <div
                        className="bg-primary-container h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${patient.adherenceScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Line 2: Next Dose */}
                  <div className="p-3 sm:p-3.5 rounded-xl bg-surface-container-low flex items-center gap-2 flex-wrap text-xs sm:text-sm w-full">
                    <span className="material-symbols-outlined text-primary text-[20px] shrink-0">alarm</span>
                    <span className="font-semibold text-primary">Next Dose:</span>
                    <span className="font-bold text-on-surface">
                      {nextPendingMed ? `${nextPendingMed.name} ${nextPendingMed.dosage}` : 'All complete for today'}
                    </span>
                    <span className="text-secondary hidden sm:inline">•</span>
                    <span className="text-secondary font-medium">
                      {nextPendingMed ? nextPendingMed.nextDue : 'Tomorrow morning'}
                    </span>
                    {nextPendingMed && !nextPendingMed.takenToday && (
                      <span className="ml-auto px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-medium text-xs">
                        Due soon
                      </span>
                    )}
                  </div>

                  {/* Line 3: Next Doctor Visit */}
                  {patient.nextDoctorVisit && (
                    <div className="p-3 sm:p-3.5 rounded-xl bg-surface-container-low flex items-center gap-2 flex-wrap text-xs sm:text-sm w-full">
                      <span className="material-symbols-outlined text-primary text-[20px] shrink-0">calendar_month</span>
                      <span className="font-semibold text-on-surface">Next Doctor Visit:</span>
                      <span className="font-bold text-on-surface">
                        {patient.nextDoctorVisit.doctor}
                      </span>
                      <span className="text-secondary hidden sm:inline">•</span>
                      <span className="text-secondary">
                        {patient.nextDoctorVisit.specialty}
                      </span>
                      <span className="text-secondary hidden sm:inline">•</span>
                      <span className="text-on-surface font-medium">
                        {patient.nextDoctorVisit.date}, {patient.nextDoctorVisit.time}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Medication Modal */}
      {selectedPatientForMed && (
        <MedicationModal
          isOpen={!!selectedPatientForMed}
          onClose={() => setSelectedPatientForMed(null)}
          onSave={handleSaveMedication}
          patientName={selectedPatientForMed.name}
        />
      )}

      {/* Doctor Modal */}
      {selectedPatientForDoc && (
        <DoctorModal
          isOpen={!!selectedPatientForDoc}
          onClose={() => setSelectedPatientForDoc(null)}
          onSave={handleSaveDoctorVisit}
          patientName={selectedPatientForDoc.name}
          initialData={selectedPatientForDoc.nextDoctorVisit}
        />
      )}
    </div>
  );
}
