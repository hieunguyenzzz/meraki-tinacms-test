import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { saveLetsConnectSubmission, type LetsConnectSubmission } from '../../../lib/db';
import { sendLetsConnectNotification, sendLetsConnectThankYou } from '../../../lib/mail';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const correlationId = randomUUID();

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch (error) {
    console.error(`[lets-connect:${correlationId}] invalid JSON body`, error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Honeypot: real users never fill the hidden "company" field; bots do.
  // Pretend success without processing so bots can't tell they were caught.
  if (String(body.company || '').trim() !== '') {
    console.warn(`[lets-connect:${correlationId}] honeypot triggered, dropping submission`);
    return NextResponse.json({ ok: true });
  }

  const text = (value: unknown) => String(value ?? '').trim();

  const firstName = text(body.firstName);
  const lastName = text(body.lastName);
  const email = text(body.email);
  const role = text(body.role);
  const partnerName = text(body.partnerName);
  const phone = text(body.phone);
  const location = text(body.location);
  const weddingDate = text(body.weddingDate);
  const venue = text(body.venue);
  const budget = text(body.budget);
  const otherNotes = text(body.otherNotes);
  const extraEvents = Array.isArray(body.extraEvents) ? body.extraEvents.map(String) : [];
  const referralSource = Array.isArray(body.referralSource) ? body.referralSource.map(String) : [];
  const guestCountRaw = body.guestCount != null ? Number(body.guestCount) : NaN;

  // Mirror the browser-side `required` attributes so a client that skips them
  // can't create a partial lead. The extra-event picks and the free-text notes
  // are the only optional fields.
  const missing = Object.entries({
    firstName,
    lastName,
    role,
    partnerName,
    phone,
    location,
    weddingDate,
    venue,
    budget,
  })
    .filter(([, value]) => !value)
    .map(([field]) => field);

  if (!EMAIL_RE.test(email)) missing.push('email');
  if (!Number.isFinite(guestCountRaw)) missing.push('guestCount');
  if (referralSource.length === 0) missing.push('referralSource');

  if (missing.length > 0) {
    console.warn(
      `[lets-connect:${correlationId}] rejected submission, missing fields: ${missing.join(', ')}`
    );
    return NextResponse.json(
      { error: 'Required fields are missing', missing },
      { status: 400 }
    );
  }

  const submission: LetsConnectSubmission = {
    lang: body.lang === 'vi' ? 'vi' : 'en',
    firstName,
    lastName,
    role,
    partnerName,
    email,
    phone,
    location,
    weddingDate,
    venue,
    guestCount: guestCountRaw,
    budget,
    extraEvents,
    referralSource,
    otherNotes,
  };

  // Best-effort audit row. A missing or unreachable database must not cost us the
  // enquiry, so carry on to the ERP lead and the notification email regardless.
  try {
    await saveLetsConnectSubmission(submission, correlationId);
  } catch (error) {
    console.error(`[lets-connect:${correlationId}] failed to save submission`, error);
  }

  // Best-effort sync to the ERP CRM (creates a Lead). Never block the couple's
  // submission on it.
  try {
    const erpUrl = process.env.ERP_INQUIRY_URL;
    const erpSecret = process.env.ERP_INQUIRY_SECRET;
    if (erpUrl && erpSecret) {
      const res = await fetch(erpUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Inquiry-Secret': erpSecret },
        body: JSON.stringify(submission),
      });
      if (!res.ok) {
        console.error(`[lets-connect:${correlationId}] ERP lead create failed`, res.status);
      }
    }
  } catch (error) {
    console.error(`[lets-connect:${correlationId}] ERP lead create error`, error);
  }

  try {
    await sendLetsConnectNotification(submission);
  } catch (error) {
    // Submission is already stored, so a notification failure shouldn't fail the request for the couple.
    console.error(`[lets-connect:${correlationId}] failed to send notification email`, error);
  }

  // The thank-you language follows the page the couple submitted from (/en or /vi).
  try {
    await sendLetsConnectThankYou(submission);
  } catch (error) {
    console.error(`[lets-connect:${correlationId}] failed to send thank-you email`, error);
  }

  return NextResponse.json({ ok: true });
}
