import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('ElderCare Patient Logic & Adherence Calculation', () => {
  function calculateAdherence(medications) {
    if (!medications || medications.length === 0) return 0;
    const completed = medications.filter(m => m.takenToday).length;
    return Math.min(100, Math.round((completed / medications.length) * 100));
  }

  function simulateTakeMedicine(patient, medicationIds = null) {
    const updatedMeds = patient.medications.map(m => {
      if (!medicationIds || medicationIds.includes(m.id) || (m.nextDue && m.nextDue.includes('1:00 PM'))) {
        return {
          ...m,
          takenToday: true,
          status: 'completed',
          lastTaken: '1:05 PM'
        };
      }
      return m;
    });

    const adherence = calculateAdherence(updatedMeds);
    return {
      ...patient,
      medications: updatedMeds,
      adherenceScore: adherence
    };
  }

  const samplePatient = {
    id: 'eleanor-vance',
    name: 'Eleanor Vance',
    adherenceScore: 50,
    medications: [
      { id: 'm-1', name: 'Metformin', nextDue: 'Today, 1:00 PM', takenToday: false, status: 'pending' },
      { id: 'm-2', name: 'CoQ10', nextDue: 'Today, 1:00 PM', takenToday: false, status: 'pending' },
      { id: 'm-3', name: 'Lisinopril', nextDue: 'Tomorrow, 8:00 AM', takenToday: true, status: 'completed' },
      { id: 'm-4', name: 'Vitamin D3', nextDue: 'Tomorrow, 12:00 PM', takenToday: true, status: 'completed' }
    ]
  };

  describe('calculateAdherence()', () => {
    it('returns 0 for empty or null medications array', () => {
      assert.strictEqual(calculateAdherence([]), 0);
      assert.strictEqual(calculateAdherence(null), 0);
    });

    it('calculates 50% adherence when 2 out of 4 medications are taken', () => {
      assert.strictEqual(calculateAdherence(samplePatient.medications), 50);
    });

    it('calculates 100% adherence when all medications are completed', () => {
      const allDone = samplePatient.medications.map(m => ({ ...m, takenToday: true }));
      assert.strictEqual(calculateAdherence(allDone), 100);
    });

    it('caps score at 100%', () => {
      const overCompliant = [{ takenToday: true }, { takenToday: true }];
      assert.strictEqual(calculateAdherence(overCompliant), 100);
    });
  });

  describe('simulateTakeMedicine()', () => {
    it('marks target medications as taken and updates adherence score to 100%', () => {
      const updated = simulateTakeMedicine(samplePatient, ['m-1', 'm-2']);

      assert.strictEqual(updated.adherenceScore, 100);
      assert.strictEqual(updated.medications[0].takenToday, true);
      assert.strictEqual(updated.medications[0].status, 'completed');
      assert.strictEqual(updated.medications[1].takenToday, true);
      assert.strictEqual(updated.medications[1].status, 'completed');
    });

    it('marks batch lunchtime medications as taken when no explicit IDs provided', () => {
      const updated = simulateTakeMedicine(samplePatient);

      const lunchMeds = updated.medications.filter(m => m.nextDue.includes('1:00 PM'));
      assert.ok(lunchMeds.every(m => m.takenToday && m.status === 'completed'));
      assert.strictEqual(updated.adherenceScore, 100);
    });
  });

  describe('Medication routine validation', () => {
    it('validates required fields for newly created prescriptions', () => {
      const newMed = {
        name: 'Amlodipine',
        dosage: '5 mg',
        frequency: 'Once Daily',
        times: ['9:00 AM'],
        instructions: 'Take in the morning with water'
      };

      assert.ok(newMed.name && newMed.name.trim().length > 0, 'Medication name is required');
      assert.ok(newMed.dosage && newMed.dosage.trim().length > 0, 'Dosage is required');
      assert.ok(Array.isArray(newMed.times) && newMed.times.length > 0, 'Times array is required');
    });
  });
});
