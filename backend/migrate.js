const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Read DATABASE_URL from .env or process.env
let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  try {
    const envPath = path.resolve(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const match = content.match(/DATABASE_URL\s*=\s*(.*)/);
      if (match) databaseUrl = match[1].trim();
    }
  } catch (err) {
    console.warn('Could not read .env file:', err);
  }
}

// Normalize password encoding if needed
if (databaseUrl && databaseUrl.includes("'")) {
  databaseUrl = databaseUrl.replace(/'/g, '');
}

console.log('Connecting to database...');
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('Connected! Creating tables...');
    await client.query('BEGIN');

    // 1. Users table (for authentication)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        role TEXT NOT NULL,
        patient_code TEXT UNIQUE,
        pin TEXT,
        password TEXT,
        avatar TEXT,
        role_title TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 2. Patients table
    await client.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id TEXT PRIMARY KEY,
        patient_code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        age INT NOT NULL,
        relation TEXT NOT NULL,
        residence TEXT NOT NULL,
        avatar TEXT,
        status TEXT NOT NULL DEFAULT 'Active',
        adherence_score INT DEFAULT 90,
        conditions TEXT[] DEFAULT '{}',
        assigned_doctor TEXT,
        doctor_specialty TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 3. Medications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS medications (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        full_name TEXT,
        dosage TEXT NOT NULL,
        type TEXT DEFAULT 'Oral Tablet',
        description TEXT,
        frequency TEXT DEFAULT 'Once Daily',
        times TEXT[] DEFAULT '{}',
        instructions TEXT,
        next_due TEXT,
        status TEXT DEFAULT 'pending',
        taken_today BOOLEAN DEFAULT FALSE,
        last_taken TEXT,
        icon TEXT DEFAULT 'pill',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_medications_patient_id ON medications(patient_id);
    `);

    // 4. Doctor Visits table
    await client.query(`
      CREATE TABLE IF NOT EXISTS doctor_visits (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        doctor TEXT NOT NULL,
        clinic TEXT,
        specialty TEXT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        purpose TEXT,
        transport_notes TEXT,
        status TEXT DEFAULT 'Confirmed',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_doctor_visits_patient_id ON doctor_visits(patient_id);
    `);

    // Enable RLS for all tables (Supabase Best Practice)
    await client.query(`
      ALTER TABLE users ENABLE ROW LEVEL SECURITY;
      ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
      ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
      ALTER TABLE doctor_visits ENABLE ROW LEVEL SECURITY;
    `);

    // Create RLS policies allowing access
    const tables = ['users', 'patients', 'medications', 'doctor_visits'];
    for (const t of tables) {
      await client.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = '${t}' AND policyname = 'Allow access to ${t}'
          ) THEN
            CREATE POLICY "Allow access to ${t}" ON ${t} FOR ALL USING (true) WITH CHECK (true);
          END IF;
        END $$;
      `);
    }

    // Seed Data if tables are empty
    const checkPatients = await client.query('SELECT COUNT(*) FROM patients');
    if (parseInt(checkPatients.rows[0].count, 10) === 0) {
      console.log('Seeding initial data...');

      // Seed Users
      await client.query(`
        INSERT INTO users (id, name, email, role, patient_code, pin, password, avatar, role_title)
        VALUES 
        ('sarah-vance', 'Sarah Vance', 'sarah.vance@familycare.net', 'family', NULL, NULL, 'password123', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHYHapAKFDD4sgE_2PEuftlgnG0HOsLP0lccAxSCf7aQR_E0OyMrrj4fkI1m2SpGKvNX70GcMo4cOaRyxCP6Bs2IN7FPId_EYg7DL2pxMNb8gHy6zZ0jK61W2rFW_TX6MsBtE7c646O0hrHDJ_1QknPSsZMp9K1dMMnSNM4U-N1sGpXRxfC7q-B2UDdswx6XBTG2ufy_hY091RsVeNBBKcBGTRW-Cu_u0gEWDSruw', 'Primary Caregiver'),
        ('eleanor-vance-user', 'Eleanor Vance', NULL, 'patient', 'EC-78294', '1946', NULL, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHYHapAKFDD4sgE_2PEuftlgnG0HOsLP0lccAxSCf7aQR_E0OyMrrj4fkI1m2SpGKvNX70GcMo4cOaRyxCP6Bs2IN7FPId_EYg7DL2pxMNb8gHy6zZ0jK61W2rFW_TX6MsBtE7c646O0hrHDJ_1QknPSsZMp9K1dMMnSNM4U-N1sGpXRxfC7q-B2UDdswx6XBTG2ufy_hY091RsVeNBBKcBGTRW-Cu_u0gEWDSruw', 'Patient')
        ON CONFLICT (id) DO NOTHING;
      `);

      // Seed Patients
      await client.query(`
        INSERT INTO patients (id, patient_code, name, age, relation, residence, avatar, status, adherence_score, conditions, assigned_doctor, doctor_specialty)
        VALUES 
        ('eleanor-vance', 'EC-78294', 'Eleanor Vance', 78, 'Mother', 'Residence Suite 402', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHYHapAKFDD4sgE_2PEuftlgnG0HOsLP0lccAxSCf7aQR_E0OyMrrj4fkI1m2SpGKvNX70GcMo4cOaRyxCP6Bs2IN7FPId_EYg7DL2pxMNb8gHy6zZ0jK61W2rFW_TX6MsBtE7c646O0hrHDJ_1QknPSsZMp9K1dMMnSNM4U-N1sGpXRxfC7q-B2UDdswx6XBTG2ufy_hY091RsVeNBBKcBGTRW-Cu_u0gEWDSruw', 'Active', 94, ARRAY['Type 2 Diabetes', 'Hypertension'], 'Dr. Sarah Jenkins', 'Cardiology'),
        ('arthur-vance', 'EC-65102', 'Arthur Vance', 82, 'Uncle', 'Assisted Living Wing B', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD99byptjuhNgCpydCJ16Hz_u_ZwJfqSRxclPZrtP416owqTMZzluxrdWg5KmtITrgFspnVZilMdkGKNNWMhUn6vK7mho-aKAMpXaw-8yrIbFJZ--m39KTPcPeFXqb726pHlVGQOzDHaIJO7UoGfXAG3oYLxr9BZ4pUwFKXy7wI9t5aH0OQ1k6nkoZgQNI21oK4tMrmor4LzWsOoIEKmTho80rO4onBcCN2ed8aX4g', 'Assisted Care', 88, ARRAY['Mild Cognitive Impairment'], 'Dr. Robert Chen', 'Neurology'),
        ('martha-vance', 'EC-44910', 'Martha Vance', 75, 'Aunt', 'Independent Living Apt 12B', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCl3Luy93g6qs-rkbF79yp2l7HmZkrHcVJzSbdtvrYyefjhYmldH7T6i2CoqSwXk6GGA8RFTUIoucggE_tapYCn6Rd30nNUwI7u6gY4LyI7QahLPWEg7vtBaWyPCqYAxL4cAHm3jaB-Yu6XP3D1s-U45XQK5OMyoRaj_iNb9tDL3jLoj-Wseh0pRu5znOduL1SRWVS-XAbhaKaj6pQUGyzg_WgDGJmJABJ1qPomgf0', 'Active', 100, ARRAY['Mild Osteoarthritis'], 'Dr. Emily Taylor', 'Geriatrics');
      `);

      // Seed Medications for Eleanor
      await client.query(`
        INSERT INTO medications (id, patient_id, name, full_name, dosage, type, description, frequency, times, instructions, next_due, status, taken_today, last_taken, icon)
        VALUES 
        ('med-1', 'eleanor-vance', 'Metformin', 'Metformin Hydrochloride', '500 mg', 'Oral Tablet', '1 White Oval Tablet • Blood sugar', 'Twice Daily', ARRAY['8:00 AM (Breakfast)', '1:00 PM (Lunch)'], 'Take with food and a full glass of cool water.', 'Today, 1:00 PM', 'pending', FALSE, NULL, 'pill'),
        ('med-2', 'eleanor-vance', 'CoQ10', 'Coenzyme Q10', '100 mg', 'Softgel', '1 Amber Softgel • Heart vitamin', 'Once Daily', ARRAY['1:00 PM (Lunch)'], 'Take with lunch.', 'Today, 1:00 PM', 'pending', FALSE, NULL, 'hevc'),
        ('med-3', 'eleanor-vance', 'Lisinopril', 'Lisinopril Dihydrate', '10 mg', 'Oral Tablet', 'Blood pressure control', 'Once Daily', ARRAY['8:00 AM (Morning)'], 'Full glass of water', 'Tomorrow, 8:00 AM', 'completed', TRUE, '8:12 AM', 'cardiology'),
        ('med-4', 'eleanor-vance', 'Vitamin D3', 'Cholecalciferol', '1000 IU', 'Softgel', 'Bone support supplement', 'Daily', ARRAY['12:00 PM (Midday)'], 'Daily midday support', 'Tomorrow, 12:00 PM', 'completed', TRUE, '12:05 PM', 'vital_signs');
      `);

      // Seed Medication for Arthur
      await client.query(`
        INSERT INTO medications (id, patient_id, name, full_name, dosage, type, description, frequency, times, instructions, next_due, status, taken_today, last_taken, icon)
        VALUES 
        ('med-a1', 'arthur-vance', 'Donepezil', 'Donepezil Hydrochloride', '5 mg', 'Oral Tablet', 'Cognitive function support', 'Once Daily', ARRAY['7:00 PM (Dinner)'], 'Take right before bedtime.', 'Today, 7:00 PM', 'pending', FALSE, NULL, 'pill');
      `);

      // Seed Medication for Martha
      await client.query(`
        INSERT INTO medications (id, patient_id, name, full_name, dosage, type, description, frequency, times, instructions, next_due, status, taken_today, last_taken, icon)
        VALUES 
        ('med-m1', 'martha-vance', 'Lisinopril', 'Lisinopril', '10 mg', 'Oral Tablet', 'Morning blood pressure', 'Once Daily', ARRAY['8:00 AM'], 'Take with breakfast.', 'Tomorrow, 8:00 AM', 'completed', TRUE, '8:05 AM', 'pill');
      `);

      // Seed Doctor Visits
      await client.query(`
        INSERT INTO doctor_visits (id, patient_id, doctor, clinic, specialty, date, time, purpose, transport_notes, status)
        VALUES 
        ('doc-1', 'eleanor-vance', 'Dr. Sarah Jenkins', 'St. Jude Heart Clinic', 'Cardiology', 'Oct 24, 2026', '10:30 AM', 'Routine Hypertension & Heart Valve Review', 'Wheelchair transport confirmed', 'Confirmed'),
        ('doc-2', 'arthur-vance', 'Dr. Robert Chen', 'Memory & Cognitive Center', 'Neurology', 'Oct 24, 2026', '2:00 PM', 'Cognitive Baseline Check & Medication Review', 'Accompanied by care attendant', 'Confirmed'),
        ('doc-3', 'martha-vance', 'Dr. Emily Taylor', 'Comprehensive Senior Care', 'Geriatrics', 'Nov 2, 2026', '11:15 AM', 'Annual Geriatric Wellness Review', 'Self-transport via senior shuttle', 'Confirmed');
      `);
    }

    await client.query('COMMIT');
    console.log('Migration and seeding completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().then(() => {
  console.log('Done.');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
