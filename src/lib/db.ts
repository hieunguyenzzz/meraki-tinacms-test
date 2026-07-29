import { Pool } from 'pg';

// Built lazily so a deployment without DATABASE_URL never opens a connection.
let pool: Pool | null = null;

function getPool() {
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

let schemaReady: Promise<void> | null = null;
let warnedMissingDatabaseUrl = false;

function ensureSchema() {
  if (!schemaReady) {
    schemaReady = getPool().query(`
      CREATE TABLE IF NOT EXISTS lets_connect_submissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        lang VARCHAR(2) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        partner_name VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        location VARCHAR(255),
        wedding_date DATE,
        venue VARCHAR(255),
        guest_count INTEGER,
        budget VARCHAR(255),
        extra_events JSONB NOT NULL DEFAULT '[]',
        referral_source JSONB NOT NULL DEFAULT '[]',
        other_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `).then(() => undefined);
  }
  return schemaReady;
}

export interface LetsConnectSubmission {
  lang: string;
  firstName: string;
  lastName: string;
  role?: string;
  partnerName?: string;
  email: string;
  phone?: string;
  location?: string;
  weddingDate?: string;
  venue?: string;
  guestCount?: number;
  budget?: string;
  extraEvents: string[];
  referralSource: string[];
  otherNotes?: string;
}

export async function saveLetsConnectSubmission(
  submission: LetsConnectSubmission,
  correlationId: string
) {
  // Postgres only holds an audit copy of the submission, so an unconfigured
  // database must not stop the enquiry reaching the ERP and the inbox.
  if (!process.env.DATABASE_URL) {
    if (!warnedMissingDatabaseUrl) {
      warnedMissingDatabaseUrl = true;
      console.warn(
        `[lets-connect:${correlationId}] DATABASE_URL not configured, skipping submission audit row`
      );
    }
    return;
  }

  await ensureSchema();

  await getPool().query(
    `INSERT INTO lets_connect_submissions
      (lang, first_name, last_name, role, partner_name, email, phone, location,
       wedding_date, venue, guest_count, budget, extra_events, referral_source, other_notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
    [
      submission.lang,
      submission.firstName,
      submission.lastName,
      submission.role || null,
      submission.partnerName || null,
      submission.email,
      submission.phone || null,
      submission.location || null,
      submission.weddingDate || null,
      submission.venue || null,
      submission.guestCount ?? null,
      submission.budget || null,
      JSON.stringify(submission.extraEvents),
      JSON.stringify(submission.referralSource),
      submission.otherNotes || null,
    ]
  );
}
