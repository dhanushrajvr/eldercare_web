const { describe, it } = require('node:test');
const assert = require('node:assert');
const { formatPatient } = require('../index');

describe('formatPatient Helper Function', () => {
  const mockPatientRow = {
    id: 'p-1',
    patient_code: 'EC-78294',
    name: 'Eleanor Vance',
    age: 78,
    relation: 'Mother',
    residence: 'Residence Suite 402',
    avatar: 'https://example.com/avatar.jpg',
    status: 'Stable',
    adherence_score: 94,
    conditions: ['Hypertension', 'Mild Arthritis'],
    assigned_doctor: 'Dr. Robert Chen',
    doctor_specialty: 'Geriatric Specialist'
  };

  const mockMedications = [
    {
      id: 'med-1',
      patient_id: 'p-1',
      name: 'Lisinopril',
      full_name: 'Lisinopril 10mg',
      dosage: '10 mg',
      type: 'Tablet',
      description: 'Blood pressure regulation',
      frequency: 'Once Daily',
      times: ['8:00 AM (Breakfast)'],
      instructions: 'Take with food',
      next_due: '8:00 AM',
      status: 'completed',
      taken_today: true,
      last_taken: '08:05 AM',
      icon: 'pill'
    },
    {
      id: 'med-2',
      patient_id: 'p-2', // Belongs to different patient
      name: 'Metformin',
      dosage: '500 mg',
      taken_today: false
    }
  ];

  const mockVisits = [
    {
      id: 'visit-1',
      patient_id: 'p-1',
      doctor: 'Dr. Robert Chen',
      clinic: 'Oakview Health Center',
      specialty: 'Geriatric Care',
      date: 'Thursday, Oct 24',
      time: '10:30 AM',
      purpose: 'Cardiovascular follow-up',
      transport_notes: 'Wheelchair accessible transport arranged',
      status: 'Confirmed'
    },
    {
      id: 'visit-2',
      patient_id: 'p-2',
      doctor: 'Dr. Sarah Lee'
    }
  ];

  it('correctly maps patient demographic and clinical fields', () => {
    const result = formatPatient(mockPatientRow, [], []);

    assert.strictEqual(result.id, 'p-1');
    assert.strictEqual(result.patientCode, 'EC-78294');
    assert.strictEqual(result.name, 'Eleanor Vance');
    assert.strictEqual(result.age, 78);
    assert.strictEqual(result.relation, 'Mother');
    assert.strictEqual(result.residence, 'Residence Suite 402');
    assert.strictEqual(result.status, 'Stable');
    assert.strictEqual(result.adherenceScore, 94);
    assert.deepStrictEqual(result.conditions, ['Hypertension', 'Mild Arthritis']);
    assert.strictEqual(result.assignedDoctor, 'Dr. Robert Chen');
    assert.strictEqual(result.doctorSpecialty, 'Geriatric Specialist');
  });

  it('filters and formats only medications belonging to the target patient', () => {
    const result = formatPatient(mockPatientRow, mockMedications, []);

    assert.strictEqual(result.medications.length, 1);
    const med = result.medications[0];
    assert.strictEqual(med.id, 'med-1');
    assert.strictEqual(med.name, 'Lisinopril');
    assert.strictEqual(med.fullName, 'Lisinopril 10mg');
    assert.strictEqual(med.dosage, '10 mg');
    assert.strictEqual(med.takenToday, true);
    assert.strictEqual(med.status, 'completed');
    assert.strictEqual(med.icon, 'pill');
  });

  it('attaches the matching doctor visit when available', () => {
    const result = formatPatient(mockPatientRow, [], mockVisits);

    assert.ok(result.nextDoctorVisit);
    assert.strictEqual(result.nextDoctorVisit.id, 'visit-1');
    assert.strictEqual(result.nextDoctorVisit.doctor, 'Dr. Robert Chen');
    assert.strictEqual(result.nextDoctorVisit.date, 'Thursday, Oct 24');
    assert.strictEqual(result.nextDoctorVisit.time, '10:30 AM');
    assert.strictEqual(result.nextDoctorVisit.status, 'Confirmed');
  });

  it('returns nextDoctorVisit as null when no visit matches the patient', () => {
    const result = formatPatient(mockPatientRow, [], [{ patient_id: 'other-patient', doctor: 'Dr. Strange' }]);
    assert.strictEqual(result.nextDoctorVisit, null);
  });

  it('handles empty or missing optional properties gracefully with fallbacks', () => {
    const barePatient = {
      id: 'p-bare',
      patient_code: 'EC-00000',
      name: 'John Doe'
    };
    const medMissingOptional = [
      {
        id: 'med-bare',
        patient_id: 'p-bare',
        name: 'Aspirin'
      }
    ];

    const result = formatPatient(barePatient, medMissingOptional, []);

    assert.strictEqual(result.name, 'John Doe');
    assert.deepStrictEqual(result.conditions, []);
    assert.strictEqual(result.medications.length, 1);
    assert.strictEqual(result.medications[0].fullName, 'Aspirin');
    assert.strictEqual(result.medications[0].icon, 'pill');
    assert.deepStrictEqual(result.medications[0].times, []);
  });
});
