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

  const firstName = String(body.firstName || '').trim();
  const lastName = String(body.lastName || '').trim();
  const email = String(body.email || '').trim();

  if (!firstName || !lastName || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: 'First name, last name, and a valid email are required' },
      { status: 400 }
    );
  }

  const guestCountRaw = body.guestCount != null ? Number(body.guestCount) : NaN;

  const submission: LetsConnectSubmission = {
    lang: body.lang === 'vi' ? 'vi' : 'en',
    firstName,
    lastName,
    role: body.role ? String(body.role).trim() : undefined,
    partnerName: body.partnerName ? String(body.partnerName).trim() : undefined,
    email,
    phone: body.phone ? String(body.phone).trim() : undefined,
    location: body.location ? String(body.location).trim() : undefined,
    weddingDate: body.weddingDate ? String(body.weddingDate) : undefined,
    venue: body.venue ? String(body.venue).trim() : undefined,
    guestCount: Number.isFinite(guestCountRaw) ? guestCountRaw : undefined,
    budget: body.budget ? String(body.budget).trim() : undefined,
    extraEvents: Array.isArray(body.extraEvents) ? body.extraEvents.map(String) : [],
    referralSource: Array.isArray(body.referralSource) ? body.referralSource.map(String) : [],
    otherNotes: body.otherNotes ? String(body.otherNotes).trim() : undefined,
  };

  try {
    await saveLetsConnectSubmission(submission);
  } catch (error) {
    console.error(`[lets-connect:${correlationId}] failed to save submission`, error);
    return NextResponse.json({ error: 'Failed to submit, please try again' }, { status: 500 });
  }

  // Best-effort sync to the ERP CRM (creates a Lead). Never block the couple's
  // submission on it — the submission is already persisted above.
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

  try {
    await sendLetsConnectThankYou(submission);
  } catch (error) {
    console.error(`[lets-connect:${correlationId}] failed to send thank-you email`, error);
  }

  return NextResponse.json({ ok: true });
}
