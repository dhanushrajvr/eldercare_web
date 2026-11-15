import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const defaultPatients = [
  {
    id: 'eleanor-vance',
    patientCode: 'EC-78294',
    name: 'Eleanor Vance',
    age: 78,
    relation: 'Mother',
    residence: 'Residence Suite 402',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHYHapAKFDD4sgE_2PEuftlgnG0HOsLP0lccAxSCf7aQR_E0OyMrrj4fkI1m2SpGKvNX70GcMo4cOaRyxCP6Bs2IN7FPId_EYg7DL2pxMNb8gHy6zZ0jK61W2rFW_TX6MsBtE7c646O0hrHDJ_1QknPSsZMp9K1dMMnSNM4U-N1sGpXRxfC7q-B2UDdswx6XBTG2ufy_hY091RsVeNBBKcBGTRW-Cu_u0gEWDSruw',
    status: 'Active',
    adherenceScore: 94,
    conditions: ['Type 2 Diabetes', 'Hypertension'],
    assignedDoctor: 'Dr. Sarah Jenkins',
    doctorSpecialty: 'Cardiology',
    nextDoctorVisit: {
      doctor: 'Dr. Sarah Jenkins',
      clinic: 'St. Jude Heart Clinic',
      specialty: 'Cardiology',
      date: 'Oct 24, 2026',
      time: '10:30 AM',
      purpose: 'Routine Hypertension & Heart Valve Review',
      transportNotes: 'Wheelchair transport confirmed',
      status: 'Confirmed'
    },
    medications: [
      {
        id: 'med-1',
        name: 'Metformin',
        fullName: 'Metformin Hydrochloride',
        dosage: '500 mg',
        type: 'Oral Tablet',
        description: '1 White Oval Tablet • Blood sugar',
        frequency: 'Twice Daily',
        times: ['8:00 AM (Breakfast)', '1:00 PM (Lunch)'],
        instructions: 'Take with food and a full glass of cool water.',
        nextDue: 'Today, 1:00 PM',
        status: 'pending',
        takenToday: false,
        icon: 'pill'
      },
      {
        id: 'med-2',
        name: 'CoQ10',
        fullName: 'Coenzyme Q10',
        dosage: '100 mg',
        type: 'Softgel',
        description: '1 Amber Softgel • Heart vitamin',
        frequency: 'Once Daily',
        times: ['1:00 PM (Lunch)'],
        instructions: 'Take with lunch.',
        nextDue: 'Today, 1:00 PM',
        status: 'pending',
        takenToday: false,
        icon: 'hevc'
      },
      {
        id: 'med-3',
        name: 'Lisinopril',
        fullName: 'Lisinopril Dihydrate',
        dosage: '10 mg',
        type: 'Oral Tablet',
        description: 'Blood pressure control',
        frequency: 'Once Daily',
        times: ['8:00 AM (Morning)'],
        instructions: 'Full glass of water',
        nextDue: 'Tomorrow, 8:00 AM',
        status: 'completed',
        takenToday: true,
        lastTaken: '8:12 AM',
        icon: 'cardiology'
      },
      {
        id: 'med-4',
        name: 'Vitamin D3',
        fullName: 'Cholecalciferol',
        dosage: '1000 IU',
        type: 'Softgel',
        description: 'Bone support supplement',
        frequency: 'Daily',
        times: ['12:00 PM (Midday)'],
        instructions: 'Daily midday support',
        nextDue: 'Tomorrow, 12:00 PM',
        status: 'completed',
        takenToday: true,
        lastTaken: '12:05 PM',
        icon: 'vital_signs'
      }
    ]
  },
  {
    id: 'arthur-vance',
    patientCode: 'EC-65102',
    name: 'Arthur Vance',
    age: 82,
    relation: 'Uncle',
    residence: 'Assisted Living Wing B',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD99byptjuhNgCpydCJ16Hz_u_ZwJfqSRxclPZrtP416owqTMZzluxrdWg5KmtITrgFspnVZilMdkGKNNWMhUn6vK7mho-aKAMpXaw-8yrIbFJZ--m39KTPcPeFXqb726pHlVGQOzDHaIJO7UoGfXAG3oYLxr9BZ4pUwFKXy7wI9t5aH0OQ1k6nkoZgQNI21oK4tMrmor4LzWsOoIEKmTho80rO4onBcCN2ed8aX4g',
    status: 'Assisted Care',
    adherenceScore: 88,
    conditions: ['Mild Cognitive Impairment'],
    assignedDoctor: 'Dr. Robert Chen',
    doctorSpecialty: 'Neurology',
    nextDoctorVisit: {
      doctor: 'Dr. Robert Chen',
      clinic: 'Memory & Cognitive Center',
      specialty: 'Neurology',
      date: 'Oct 24, 2026',
      time: '2:00 PM',
      purpose: 'Cognitive Baseline Check & Medication Review',
      transportNotes: 'Accompanied by care attendant',
      status: 'Confirmed'
    },
    medications: [
      {
        id: 'med-a1',
        name: 'Donepezil',
        fullName: 'Donepezil Hydrochloride',
        dosage: '5 mg',
        type: 'Oral Tablet',
        description: 'Cognitive function support',
        frequency: 'Once Daily',
        times: ['7:00 PM (Dinner)'],
        instructions: 'Take right before bedtime.',
        nextDue: 'Today, 7:00 PM',
        status: 'pending',
        takenToday: false,
        icon: 'pill'
      }
    ]
  },
  {
    id: 'martha-vance',
    patientCode: 'EC-44910',
    name: 'Martha Vance',
    age: 75,
    relation: 'Aunt',
    residence: 'Independent Living Apt 12B',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCl3Luy93g6qs-rkbF79yp2l7HmZkrHcVJzSbdtvrYyefjhYmldH7T6i2CoqSwXk6GGA8RFTUIoucggE_tapYCn6Rd30nNUwI7u6gY4LyI7QahLPWEg7vtBaWyPCqYAxL4cAHm3jaB-Yu6XP3D1s-U45XQK5OMyoRaj_iNb9tDL3jLoj-Wseh0pRu5znOduL1SRWVS-XAbhaKaj6pQUGyzg_WgDGJmJABJ1qPomgf0',
    status: 'Active',
    adherenceScore: 100,
    conditions: ['Mild Osteoarthritis'],
    assignedDoctor: 'Dr. Emily Taylor',
    doctorSpecialty: 'Geriatrics',
    nextDoctorVisit: {
      doctor: 'Dr. Emily Taylor',
      clinic: 'Comprehensive Senior Care',
      specialty: 'Geriatrics',
      date: 'Nov 2, 2026',
      time: '11:15 AM',
      purpose: 'Annual Geriatric Wellness Review',
      transportNotes: 'Self-transport via senior shuttle',
      status: 'Confirmed'
    },
    medications: [
      {
        id: 'med-m1',
        name: 'Lisinopril',
        fullName: 'Lisinopril',
        dosage: '10 mg',
        type: 'Oral Tablet',
        description: 'Morning blood pressure',
        frequency: 'Once Daily',
        times: ['8:00 AM'],
        instructions: 'Take with breakfast.',
        nextDue: 'Tomorrow, 8:00 AM',
        status: 'completed',
        takenToday: true,
        lastTaken: '8:05 AM',
        icon: 'pill'
      }
    ]
  }
];

const PatientContext = createContext(null);

export function PatientProvider({ children }) {
  const [patients, setPatients] = useState(defaultPatients);
  const [selectedPatientId, setSelectedPatientId] = useState('eleanor-vance');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function fetchPatients() {
      const data = await api.getPatients();
      if (data && data.length > 0) {
        setPatients(data);
      }
    }
    fetchPatients();
  }, []);

  const showToast = (message, icon = 'check_circle') => {
    setToast({ message, icon });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const takeMedicine = async (patientId, medicationIds) => {
    const pId = patientId || selectedPatientId;
    // Optimistic UI update
    setPatients(prev => prev.map(p => {
      if (p.id !== pId) return p;
      const updatedMeds = p.medications.map(m => {
        if (!medicationIds || medicationIds.includes(m.id) || m.nextDue.includes('1:00 PM')) {
          return {
            ...m,
            takenToday: true,
            status: 'completed',
            lastTaken: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }
        return m;
      });
      const completed = updatedMeds.filter(m => m.takenToday).length;
      const adherence = Math.min(100, Math.round((completed / updatedMeds.length) * 100));
      return {
        ...p,
        medications: updatedMeds,
        adherenceScore: adherence
      };
    }));

    showToast('Medicine marked as taken! Caregivers notified.', 'task_alt');
    await api.takeMedication(pId, medicationIds);
  };

  const addMedication = async (patientId, medData) => {
    const pId = patientId || selectedPatientId;
    const newMed = {
      id: 'med-' + Date.now(),
      name: medData.name,
      fullName: medData.fullName || medData.name,
      dosage: medData.dosage,
      type: medData.type || 'Oral Tablet',
      description: `${medData.dosage} oral dose`,
      frequency: medData.frequency || 'Once Daily',
      times: medData.times || ['8:00 AM'],
      instructions: medData.instructions || 'Take with water',
      nextDue: 'Today, 8:00 AM',
      status: 'pending',
      takenToday: false,
      icon: 'pill'
    };

    setPatients(prev => prev.map(p => {
      if (p.id !== pId) return p;
      return {
        ...p,
        medications: [...p.medications, newMed]
      };
    }));

    showToast(`Added ${medData.name} to medication routine`, 'medication');
    await api.addMedication(pId, medData);
  };

  const updateMedication = (patientId, medId, updatedFields) => {
    const pId = patientId || selectedPatientId;
    setPatients(prev => prev.map(p => {
      if (p.id !== pId) return p;
      return {
        ...p,
        medications: p.medications.map(m => m.id === medId ? { ...m, ...updatedFields } : m)
      };
    }));
    showToast('Medication updated successfully', 'tune');
  };

  const deleteMedication = async (patientId, medId) => {
    const pId = patientId || selectedPatientId;
    setPatients(prev => prev.map(p => {
      if (p.id !== pId) return p;
      return {
        ...p,
        medications: p.medications.filter(m => m.id !== medId)
      };
    }));

    showToast('Medication removed from schedule', 'delete');
    await api.deleteMedication(pId, medId);
  };

  const updateDoctorVisit = async (patientId, appointmentData) => {
    const pId = patientId || selectedPatientId;
    setPatients(prev => prev.map(p => {
      if (p.id !== pId) return p;
      return {
        ...p,
        nextDoctorVisit: {
          ...p.nextDoctorVisit,
          ...appointmentData
        }
      };
    }));

    showToast('Doctor appointment updated', 'event_available');
    await api.updateAppointment(pId, appointmentData);
  };

  const addPatient = async (patientData) => {
    const res = await api.addPatient(patientData);
    if (res && res.data) {
      setPatients(prev => [...prev, res.data]);
      setSelectedPatientId(res.data.id);
      showToast(`Enrolled ${res.data.name}! ID: ${res.data.patientCode}`, 'badge');
      return res;
    }
    return null;
  };

  return (
    <PatientContext.Provider value={{
      patients,
      selectedPatientId,
      setSelectedPatientId,
      selectedPatient,
      takeMedicine,
      addPatient,
      addMedication,
      updateMedication,
      deleteMedication,
      updateDoctorVisit,
      showToast,
      toast
    }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients() {
  const context = useContext(PatientContext);
  if (!context) throw new Error('usePatients must be used within a PatientProvider');
  return context;
}
