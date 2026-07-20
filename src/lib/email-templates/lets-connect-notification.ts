import type { LetsConnectSubmission } from '../db';

const SITE_URL = 'https://merakiweddingplanner.com';

const FIELD_LABELS: Record<string, string> = {
  role: 'Role',
  partnerName: "Partner's name",
  phone: 'Phone',
  location: 'Location',
  weddingDate: 'Wedding date',
  venue: 'Venue/city',
  guestCount: 'Guest count',
  budget: 'Budget',
  extraEvents: 'Extra events',
  referralSource: 'Referral source',
  otherNotes: 'Notes',
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #e7e0cf;font-size:13px;color:#535d44;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #e7e0cf;font-size:14px;color:#374220;">${value}</td>
    </tr>`;
}

export function buildLetsConnectNotificationEmail(submission: LetsConnectSubmission) {
  const fields: Array<[string, string | undefined]> = [
    [FIELD_LABELS.role, submission.role],
    [FIELD_LABELS.partnerName, submission.partnerName],
    [FIELD_LABELS.phone, submission.phone],
    [FIELD_LABELS.location, submission.location],
    [FIELD_LABELS.weddingDate, submission.weddingDate],
    [FIELD_LABELS.venue, submission.venue],
    [FIELD_LABELS.guestCount, submission.guestCount != null ? String(submission.guestCount) : undefined],
    [FIELD_LABELS.budget, submission.budget],
    [FIELD_LABELS.extraEvents, submission.extraEvents.length ? submission.extraEvents.join(', ') : undefined],
    [FIELD_LABELS.referralSource, submission.referralSource.length ? submission.referralSource.join(', ') : undefined],
  ];

  const rowsHtml = fields
    .filter(([, value]) => Boolean(value))
    .map(([label, value]) => row(label, escapeHtml(value as string)))
    .join('');

  const notesHtml = submission.otherNotes
    ? `
      <tr>
        <td colspan="2" style="padding:16px;background-color:#fff1d5;">
          <p style="margin:0 0 6px;font-size:12px;color:#838978;text-transform:uppercase;letter-spacing:0.06em;">Notes</p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#374220;white-space:pre-line;">${escapeHtml(submission.otherNotes)}</p>
        </td>
      </tr>`
    : '';

  const html = `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#fef5e3;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fef5e3;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;">
            <tr>
              <td style="padding:32px 32px 20px;text-align:center;border-bottom:2px solid #ae89cb;">
                <a href="${SITE_URL}" style="text-decoration:none;">
                  <span style="font-size:26px;letter-spacing:0.08em;color:#374220;">Meraki</span>
                </a>
                <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#838978;">Wedding Planner</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 8px;font-family:Arial,Helvetica,sans-serif;">
                <h1 style="margin:0 0 4px;font-size:18px;color:#374220;">New Let's Connect inquiry</h1>
                <p style="margin:0;font-size:13px;color:#838978;">${escapeHtml(submission.firstName)} ${escapeHtml(submission.lastName)} &middot; ${submission.lang === 'vi' ? 'Vietnamese form' : 'English form'}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 16px 24px;font-family:Arial,Helvetica,sans-serif;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${row('Name', escapeHtml(`${submission.firstName} ${submission.lastName}`))}
                  ${row('Email', `<a href="mailto:${escapeHtml(submission.email)}" style="color:#374220;">${escapeHtml(submission.email)}</a>`)}
                  ${rowsHtml}
                  ${notesHtml}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background-color:#374220;text-align:center;font-family:Arial,Helvetica,sans-serif;">
                <p style="margin:0;font-size:12px;color:#fef5e3;">
                  Sent from the Let's Connect form on <a href="${SITE_URL}" style="color:#fef5e3;">${SITE_URL.replace('https://', '')}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    `New Let's Connect inquiry (${submission.lang === 'vi' ? 'Vietnamese' : 'English'} form)`,
    `Name: ${submission.firstName} ${submission.lastName}`,
    `Email: ${submission.email}`,
    ...fields.filter(([, value]) => Boolean(value)).map(([label, value]) => `${label}: ${value}`),
    submission.otherNotes && `Notes: ${submission.otherNotes}`,
  ]
    .filter(Boolean)
    .join('\n');

  return { html, text };
}
