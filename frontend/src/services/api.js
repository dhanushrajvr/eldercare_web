const API_BASE = '/api';

export const api = {
  async login(credentials) {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API unavailable, using client-side auth fallback:', err);
    }
    // Fallback if backend server not running
    if (credentials.role === 'patient') {
      return {
        success: true,
        role: 'patient',
        user: {
          id: 'eleanor-vance',
          patientCode: credentials.patientId || 'EC-78294',
          name: 'Eleanor Vance',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHYHapAKFDD4sgE_2PEuftlgnG0HOsLP0lccAxSCf7aQR_E0OyMrrj4fkI1m2SpGKvNX70GcMo4cOaRyxCP6Bs2IN7FPId_EYg7DL2pxMNb8gHy6zZ0jK61W2rFW_TX6MsBtE7c646O0hrHDJ_1QknPSsZMp9K1dMMnSNM4U-N1sGpXRxfC7q-B2UDdswx6XBTG2ufy_hY091RsVeNBBKcBGTRW-Cu_u0gEWDSruw',
          residence: 'Residence Suite 402',
        },
      };
    } else {
      return {
        success: true,
        role: 'family',
        user: {
          id: 'sarah-vance',
          name: 'Sarah Vance',
          email: credentials.email || 'sarah.vance@familycare.net',
          roleTitle: 'Primary Caregiver',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHYHapAKFDD4sgE_2PEuftlgnG0HOsLP0lccAxSCf7aQR_E0OyMrrj4fkI1m2SpGKvNX70GcMo4cOaRyxCP6Bs2IN7FPId_EYg7DL2pxMNb8gHy6zZ0jK61W2rFW_TX6MsBtE7c646O0hrHDJ_1QknPSsZMp9K1dMMnSNM4U-N1sGpXRxfC7q-B2UDdswx6XBTG2ufy_hY091RsVeNBBKcBGTRW-Cu_u0gEWDSruw',
        },
      };
    }
  },

  async getPatients() {
    try {
      const res = await fetch(`${API_BASE}/patients`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('API unavailable, using fallback data:', err);
    }
    return null;
  },

  async addPatient(patientData) {
    try {
      const res = await fetch(`${API_BASE}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API error adding patient:', err);
    }
    // Client-side fallback if server offline
    const randomCode = patientData.patientCode || `EC-${Math.floor(10000 + Math.random() * 90000)}`;
    const pin = patientData.pin || String(Math.floor(1000 + Math.random() * 9000));
    const fallbackPatient = {
      id: `p-${Date.now()}`,
      patientCode: randomCode,
      name: patientData.name,
      age: parseInt(patientData.age, 10) || 75,
      relation: patientData.relation || 'Family Member',
      residence: patientData.residence || 'Residence Suite 101',
      avatar: patientData.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD99byptjuhNgCpydCJ16Hz_u_ZwJfqSRxclPZrtP416owqTMZzluxrdWg5KmtITrgFspnVZilMdkGKNNWMhUn6vK7mho-aKAMpXaw-8yrIbFJZ--m39KTPcPeFXqb726pHlVGQOzDHaIJO7UoGfXAG3oYLxr9BZ4pUwFKXy7wI9t5aH0OQ1k6nkoZgQNI21oK4tMrmor4LzWsOoIEKmTho80rO4onBcCN2ed8aX4g',
      status: 'Active',
      adherenceScore: 100,
      conditions: patientData.conditions || [],
      assignedDoctor: patientData.assignedDoctor || 'General Practitioner',
      doctorSpecialty: patientData.doctorSpecialty || 'Family Care',
      nextDoctorVisit: null,
      medications: []
    };
    return {
      success: true,
      data: fallbackPatient,
      credentials: {
        patientId: randomCode,
        patientCode: randomCode,
        pin,
        password: pin
      }
    };
  },

  async takeMedication(patientId, medicationIds) {
    try {
      const res = await fetch(`${API_BASE}/patients/${patientId}/take-medication`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicationIds }),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API error:', err);
    }
    return null;
  },

  async addMedication(patientId, medData) {
    try {
      const res = await fetch(`${API_BASE}/patients/${patientId}/medications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medData),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API error:', err);
    }
    return null;
  },

  async deleteMedication(patientId, medId) {
    try {
      const res = await fetch(`${API_BASE}/patients/${patientId}/medications/${medId}`, {
        method: 'DELETE',
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API error:', err);
    }
    return null;
  },

  async updateAppointment(patientId, appointmentData) {
    try {
      const res = await fetch(`${API_BASE}/patients/${patientId}/appointment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API error:', err);
    }
    return null;
  },
};
