import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { api } from '../src/services/api.js';

describe('Frontend API Service - Client Fallback & Contract Tests', () => {
  let originalWarn;

  before(() => {
    originalWarn = console.warn;
    console.warn = () => {};
  });

  after(() => {
    console.warn = originalWarn;
  });

  describe('api.login()', () => {
    it('returns valid patient profile when logging in as patient (offline fallback)', async () => {
      const result = await api.login({ role: 'patient', patientId: 'EC-78294' });

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.role, 'patient');
      assert.ok(result.user);
      assert.strictEqual(result.user.patientCode, 'EC-78294');
      assert.strictEqual(result.user.name, 'Eleanor Vance');
      assert.ok(result.user.residence);
      assert.ok(result.user.avatar);
    });

    it('defaults patient code to EC-78294 if none provided', async () => {
      const result = await api.login({ role: 'patient' });

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.user.patientCode, 'EC-78294');
    });

    it('returns valid family caregiver profile when logging in as family (offline fallback)', async () => {
      const result = await api.login({
        role: 'family',
        email: 'sarah.vance@familycare.net'
      });

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.role, 'family');
      assert.ok(result.user);
      assert.strictEqual(result.user.name, 'Sarah Vance');
      assert.strictEqual(result.user.roleTitle, 'Primary Caregiver');
      assert.strictEqual(result.user.email, 'sarah.vance@familycare.net');
    });
  });

  describe('api.getPatients() with network disconnection', () => {
    it('returns null gracefully without unhandled promise rejection', async () => {
      const data = await api.getPatients();
      // When backend is not running at /api/patients, api returns null
      assert.strictEqual(data, null);
    });
  });

  describe('api.addPatient()', () => {
    it('creates and returns patient with generated credentials in offline fallback mode', async () => {
      const newPatientData = {
        name: 'Robert Vance',
        age: 80,
        relation: 'Father',
        residence: 'Room 204',
        patientCode: 'EC-99123',
        pin: '1234'
      };

      const result = await api.addPatient(newPatientData);
      assert.strictEqual(result.success, true);
      assert.ok(result.data);
      assert.strictEqual(result.data.name, 'Robert Vance');
      assert.strictEqual(result.data.patientCode, 'EC-99123');
      assert.strictEqual(result.credentials.patientId, 'EC-99123');
      assert.strictEqual(result.credentials.pin, '1234');
    });
  });

  describe('api mutation operations fail safely when disconnected', () => {
    it('takeMedication returns null on connection failure', async () => {
      const res = await api.takeMedication('p-1', ['med-1']);
      assert.strictEqual(res, null);
    });

    it('addMedication returns null on connection failure', async () => {
      const res = await api.addMedication('p-1', { name: 'Aspirin', dosage: '81mg' });
      assert.strictEqual(res, null);
    });

    it('deleteMedication returns null on connection failure', async () => {
      const res = await api.deleteMedication('p-1', 'med-1');
      assert.strictEqual(res, null);
    });

    it('updateAppointment returns null on connection failure', async () => {
      const res = await api.updateAppointment('p-1', { doctor: 'Dr. Smith' });
      assert.strictEqual(res, null);
    });
  });
});
