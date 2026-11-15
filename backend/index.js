const express = require('express');
const db = require('./db');

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

// Helper to format patient record with nested medications and nextDoctorVisit
function formatPatient(patientRow, medications = [], visits = []) {
  const patientMeds = medications
    .filter(m => m.patient_id === patientRow.id)
    .map(m => ({
      id: m.id,
      name: m.name,
      fullName: m.full_name || m.name,
      dosage: m.dosage,
      type: m.type,
      description: m.description,
      frequency: m.frequency,
      times: m.times || [],
      instructions: m.instructions,
      nextDue: m.next_due,
      status: m.status,
      takenToday: m.taken_today,
      lastTaken: m.last_taken,
      icon: m.icon || 'pill'
    }));

  const visitRow = visits.find(v => v.patient_id === patientRow.id);
  const nextDoctorVisit = visitRow ? {
    id: visitRow.id,
    doctor: visitRow.doctor,
    clinic: visitRow.clinic,
    specialty: visitRow.specialty,
    date: visitRow.date,
    time: visitRow.time,
    purpose: visitRow.purpose,
    transportNotes: visitRow.transport_notes,
    status: visitRow.status || 'Confirmed'
  } : null;

  return {
    id: patientRow.id,
    patientCode: patientRow.patient_code,
    name: patientRow.name,
    age: patientRow.age,
    relation: patientRow.relation,
    residence: patientRow.residence,
    avatar: patientRow.avatar,
    status: patientRow.status,
    adherenceScore: patientRow.adherence_score,
    conditions: patientRow.conditions || [],
    assignedDoctor: patientRow.assigned_doctor,
    doctorSpecialty: patientRow.doctor_specialty,
    nextDoctorVisit,
    medications: patientMeds
  };
}

// Routes

// 1. Health check with DB status
app.get('/api/health', async (req, res) => {
  try {
    const dbRes = await db.query('SELECT NOW()');
    res.json({
      status: 'ok',
      service: 'ElderCare API',
      database: 'connected',
      dbTime: dbRes.rows[0].now,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      status: 'degraded',
      service: 'ElderCare API',
      database: 'disconnected',
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 2. Authentication
app.post('/api/login', async (req, res) => {
  const { role, email, patientId, pin } = req.body;

  try {
    if (role === 'patient') {
      const code = (patientId || 'EC-78294').trim();
      const patientRes = await db.query(
        'SELECT * FROM patients WHERE LOWER(patient_code) = LOWER($1)',
        [code]
      );

      let patient = patientRes.rows[0];
      if (!patient) {
        // Fallback to Eleanor if not found
        const fallbackRes = await db.query('SELECT * FROM patients LIMIT 1');
        patient = fallbackRes.rows[0];
      }

      return res.json({
        success: true,
        role: 'patient',
        user: {
          id: patient.id,
          patientCode: patient.patient_code,
          name: patient.name,
          avatar: patient.avatar,
          residence: patient.residence
        }
      });
    } else if (role === 'family') {
      const caregiverEmail = (email || 'sarah.vance@familycare.net').trim();
      const userRes = await db.query(
        'SELECT * FROM users WHERE LOWER(email) = LOWER($1) AND role = $2',
        [caregiverEmail, 'family']
      );

      let user = userRes.rows[0];
      if (!user) {
        user = {
          id: 'sarah-vance',
          name: 'Sarah Vance',
          email: caregiverEmail,
          roleTitle: 'Primary Caregiver',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHYHapAKFDD4sgE_2PEuftlgnG0HOsLP0lccAxSCf7aQR_E0OyMrrj4fkI1m2SpGKvNX70GcMo4cOaRyxCP6Bs2IN7FPId_EYg7DL2pxMNb8gHy6zZ0jK61W2rFW_TX6MsBtE7c646O0hrHDJ_1QknPSsZMp9K1dMMnSNM4U-N1sGpXRxfC7q-B2UDdswx6XBTG2ufy_hY091RsVeNBBKcBGTRW-Cu_u0gEWDSruw'
        };
      }

      return res.json({
        success: true,
        role: 'family',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          roleTitle: user.role_title || 'Primary Caregiver',
          avatar: user.avatar
        }
      });
    }

    res.status(400).json({ success: false, message: 'Invalid role' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Authentication failed', error: err.message });
  }
});

// 3. Get all patients
app.get('/api/patients', async (req, res) => {
  try {
    const patientsRes = await db.query('SELECT * FROM patients ORDER BY name ASC');
    const medsRes = await db.query('SELECT * FROM medications ORDER BY created_at ASC');
    const visitsRes = await db.query('SELECT * FROM doctor_visits');

    const formatted = patientsRes.rows.map(p => formatPatient(p, medsRes.rows, visitsRes.rows));
    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ success: false, message: 'Error retrieving patients', error: err.message });
  }
});

// 4. Get specific patient
app.get('/api/patients/:id', async (req, res) => {
  try {
    const patientRes = await db.query('SELECT * FROM patients WHERE id = $1', [req.params.id]);
    if (patientRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const medsRes = await db.query('SELECT * FROM medications WHERE patient_id = $1 ORDER BY created_at ASC', [req.params.id]);
    const visitsRes = await db.query('SELECT * FROM doctor_visits WHERE patient_id = $1', [req.params.id]);

    const formatted = formatPatient(patientRes.rows[0], medsRes.rows, visitsRes.rows);
    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error('Error fetching patient:', err);
    res.status(500).json({ success: false, message: 'Error retrieving patient', error: err.message });
  }
});

// 5. Patient logs medication as taken
app.post('/api/patients/:id/take-medication', async (req, res) => {
  const patientId = req.params.id;
  const { medicationIds } = req.body;
  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  try {
    if (medicationIds && Array.isArray(medicationIds) && medicationIds.length > 0) {
      await db.query(`
        UPDATE medications 
        SET taken_today = TRUE, status = 'completed', last_taken = $1, updated_at = NOW()
        WHERE patient_id = $2 AND id = ANY($3)
      `, [nowTime, patientId, medicationIds]);
    } else {
      // Mark lunchtime batch as taken
      await db.query(`
        UPDATE medications 
        SET taken_today = TRUE, status = 'completed', last_taken = $1, updated_at = NOW()
        WHERE patient_id = $2 AND (next_due LIKE '%1:00 PM%' OR '1:00 PM (Lunch)' = ANY(times))
      `, [nowTime, patientId]);
    }

    // Recalculate adherence score
    const allMeds = await db.query('SELECT taken_today FROM medications WHERE patient_id = $1', [patientId]);
    if (allMeds.rows.length > 0) {
      const completed = allMeds.rows.filter(m => m.taken_today).length;
      const newScore = Math.min(100, Math.round((completed / allMeds.rows.length) * 100));
      await db.query('UPDATE patients SET adherence_score = $1, updated_at = NOW() WHERE id = $2', [newScore, patientId]);
    }

    // Fetch updated patient
    const patientRes = await db.query('SELECT * FROM patients WHERE id = $1', [patientId]);
    const medsRes = await db.query('SELECT * FROM medications WHERE patient_id = $1 ORDER BY created_at ASC', [patientId]);
    const visitsRes = await db.query('SELECT * FROM doctor_visits WHERE patient_id = $1', [patientId]);

    const formatted = formatPatient(patientRes.rows[0], medsRes.rows, visitsRes.rows);
    res.json({ success: true, message: 'Medication marked as taken in database', data: formatted });
  } catch (err) {
    console.error('Error updating medication intake:', err);
    res.status(500).json({ success: false, message: 'Failed to update medication status', error: err.message });
  }
});

// 6. Add medication for a patient
app.post('/api/patients/:id/medications', async (req, res) => {
  const patientId = req.params.id;
  const { name, dosage, frequency, times, instructions, type } = req.body;
  const newId = 'med-' + Date.now();

  try {
    await db.query(`
      INSERT INTO medications (id, patient_id, name, full_name, dosage, type, description, frequency, times, instructions, next_due, status, taken_today, icon)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending', FALSE, 'pill')
    `, [
      newId,
      patientId,
      name || 'New Medication',
      name,
      dosage || '10 mg',
      type || 'Oral Tablet',
      `${dosage} oral dose`,
      frequency || 'Once Daily',
      times || ['8:00 AM'],
      instructions || 'Take with water',
      'Today, 8:00 AM'
    ]);

    const patientRes = await db.query('SELECT * FROM patients WHERE id = $1', [patientId]);
    const medsRes = await db.query('SELECT * FROM medications WHERE patient_id = $1 ORDER BY created_at ASC', [patientId]);
    const visitsRes = await db.query('SELECT * FROM doctor_visits WHERE patient_id = $1', [patientId]);

    const formatted = formatPatient(patientRes.rows[0], medsRes.rows, visitsRes.rows);
    res.json({ success: true, message: 'Medication saved to database', data: formatted });
  } catch (err) {
    console.error('Error adding medication:', err);
    res.status(500).json({ success: false, message: 'Failed to add medication', error: err.message });
  }
});

// 7. Delete medication
app.delete('/api/patients/:id/medications/:medId', async (req, res) => {
  const { id: patientId, medId } = req.params;

  try {
    await db.query('DELETE FROM medications WHERE id = $1 AND patient_id = $2', [medId, patientId]);

    const patientRes = await db.query('SELECT * FROM patients WHERE id = $1', [patientId]);
    const medsRes = await db.query('SELECT * FROM medications WHERE patient_id = $1 ORDER BY created_at ASC', [patientId]);
    const visitsRes = await db.query('SELECT * FROM doctor_visits WHERE patient_id = $1', [patientId]);

    const formatted = formatPatient(patientRes.rows[0], medsRes.rows, visitsRes.rows);
    res.json({ success: true, message: 'Medication deleted from database', data: formatted });
  } catch (err) {
    console.error('Error deleting medication:', err);
    res.status(500).json({ success: false, message: 'Failed to delete medication', error: err.message });
  }
});

// 8. Update doctor visit
app.put('/api/patients/:id/appointment', async (req, res) => {
  const patientId = req.params.id;
  const { doctor, clinic, specialty, date, time, purpose, transportNotes, status } = req.body;

  try {
    const existing = await db.query('SELECT id FROM doctor_visits WHERE patient_id = $1', [patientId]);

    if (existing.rows.length > 0) {
      await db.query(`
        UPDATE doctor_visits 
        SET doctor = COALESCE($1, doctor),
            clinic = COALESCE($2, clinic),
            specialty = COALESCE($3, specialty),
            date = COALESCE($4, date),
            time = COALESCE($5, time),
            purpose = COALESCE($6, purpose),
            transport_notes = COALESCE($7, transport_notes),
            status = COALESCE($8, status),
            updated_at = NOW()
        WHERE patient_id = $9
      `, [doctor, clinic, specialty, date, time, purpose, transportNotes, status, patientId]);
    } else {
      const newId = 'doc-' + Date.now();
      await db.query(`
        INSERT INTO doctor_visits (id, patient_id, doctor, clinic, specialty, date, time, purpose, transport_notes, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [newId, patientId, doctor, clinic, specialty, date, time, purpose, transportNotes, status || 'Confirmed']);
    }

    const patientRes = await db.query('SELECT * FROM patients WHERE id = $1', [patientId]);
    const medsRes = await db.query('SELECT * FROM medications WHERE patient_id = $1 ORDER BY created_at ASC', [patientId]);
    const visitsRes = await db.query('SELECT * FROM doctor_visits WHERE patient_id = $1', [patientId]);

    const formatted = formatPatient(patientRes.rows[0], medsRes.rows, visitsRes.rows);
    res.json({ success: true, message: 'Appointment updated in database', data: formatted });
  } catch (err) {
    console.error('Error updating appointment:', err);
    res.status(500).json({ success: false, message: 'Failed to update appointment', error: err.message });
  }
});

// 9. 404 Catch-All
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`ElderCare Express server connected to Supabase and running on port ${PORT}`);
  });
}

module.exports = { app, formatPatient };
