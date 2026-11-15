const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Mock Database
let patients = [
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

// Routes

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ElderCare API', timestamp: new Date().toISOString() });
});

// 2. Authentication
app.post('/api/login', (req, res) => {
  const { role, email, password, patientId, pin } = req.body;

  if (role === 'patient') {
    // Eleanor Vance is default patient
    const patient = patients.find(p => p.patientCode.toLowerCase() === (patientId || '').trim().toLowerCase()) || patients[0];
    return res.json({
      success: true,
      role: 'patient',
      user: {
        id: patient.id,
        patientCode: patient.patientCode,
        name: patient.name,
        avatar: patient.avatar,
        residence: patient.residence
      }
    });
  } else if (role === 'family') {
    return res.json({
      success: true,
      role: 'family',
      user: {
        id: 'sarah-vance',
        name: 'Sarah Vance',
        email: email || 'sarah.vance@familycare.net',
        roleTitle: 'Primary Caregiver',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHYHapAKFDD4sgE_2PEuftlgnG0HOsLP0lccAxSCf7aQR_E0OyMrrj4fkI1m2SpGKvNX70GcMo4cOaRyxCP6Bs2IN7FPId_EYg7DL2pxMNb8gHy6zZ0jK61W2rFW_TX6MsBtE7c646O0hrHDJ_1QknPSsZMp9K1dMMnSNM4U-N1sGpXRxfC7q-B2UDdswx6XBTG2ufy_hY091RsVeNBBKcBGTRW-Cu_u0gEWDSruw'
      }
    });
  }

  res.status(400).json({ success: false, message: 'Invalid role' });
});

// 3. Get all patients
app.get('/api/patients', (req, res) => {
  res.json({ success: true, data: patients });
});

// 4. Get specific patient
app.get('/api/patients/:id', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
  res.json({ success: true, data: patient });
});

// 5. Patient logs medication as taken
app.post('/api/patients/:id/take-medication', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

  const { medicationIds } = req.body;
  if (medicationIds && Array.isArray(medicationIds)) {
    patient.medications.forEach(m => {
      if (medicationIds.includes(m.id)) {
        m.takenToday = true;
        m.status = 'completed';
        m.lastTaken = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    });
  } else {
    // Mark first pending ones (e.g. lunchtime batch) as taken
    patient.medications.forEach(m => {
      if (m.nextDue.includes('1:00 PM') || m.times.some(t => t.includes('1:00 PM'))) {
        m.takenToday = true;
        m.status = 'completed';
        m.lastTaken = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    });
  }

  // Recalculate adherence
  const completedCount = patient.medications.filter(m => m.takenToday).length;
  patient.adherenceScore = Math.min(100, Math.round((completedCount / patient.medications.length) * 100));

  res.json({ success: true, message: 'Medication marked as taken', data: patient });
});

// 6. Add or update medication for a patient
app.post('/api/patients/:id/medications', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

  const { name, dosage, frequency, times, instructions, type } = req.body;
  const newMed = {
    id: 'med-' + Date.now(),
    name: name || 'New Medication',
    fullName: name,
    dosage: dosage || '10 mg',
    type: type || 'Oral Tablet',
    description: `${dosage} oral dose`,
    frequency: frequency || 'Once Daily',
    times: times || ['8:00 AM'],
    instructions: instructions || 'Take with water',
    nextDue: 'Today, 8:00 AM',
    status: 'pending',
    takenToday: false,
    icon: 'pill'
  };

  patient.medications.push(newMed);
  res.json({ success: true, message: 'Medication added successfully', data: patient });
});

// 7. Delete medication
app.delete('/api/patients/:id/medications/:medId', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

  patient.medications = patient.medications.filter(m => m.id !== req.params.medId);
  res.json({ success: true, message: 'Medication deleted', data: patient });
});

// 8. Update doctor visit
app.put('/api/patients/:id/appointment', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

  patient.nextDoctorVisit = { ...patient.nextDoctorVisit, ...req.body };
  res.json({ success: true, message: 'Appointment updated', data: patient });
});

app.listen(PORT, () => {
  console.log(`ElderCare Express server running on port ${PORT}`);
});
