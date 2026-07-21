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
