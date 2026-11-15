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
