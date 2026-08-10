import type { LetsConnectSubmission } from '../db';
import { LOGO_URL } from './logo';

const SITE_URL = 'https://merakiweddingplanner.com';

// The team reads these in Ho Chi Minh City, so the submission is stamped in
// their own clock rather than the server's.
const TIMEZONE = 'Asia/Ho_Chi_Minh';

// Pads the preheader so clients don't pull body copy into the inbox preview.
const PREHEADER_SPACER = '&#847;&zwnj;&nbsp;'.repeat(4);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatSubmittedAt(now: Date) {
  const date = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(now);
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now);
  return `${date} at ${time} (GMT+7)`;
}

// The form posts an <input type="date"> value (YYYY-MM-DD); staff read dates the
// other way round. Anything unexpected is passed through untouched.
function formatWeddingDate(value: string | undefined) {
  const match = (value ?? '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value ?? '';
}

// Vietnamese submissions read family name first, English ones given name first.
function coupleNames(submission: LetsConnectSubmission) {
  const enquirer =
    submission.lang === 'vi'
      ? `${submission.lastName} ${submission.firstName}`
      : `${submission.firstName} ${submission.lastName}`;
  return submission.partnerName ? `${enquirer} & ${submission.partnerName}` : enquirer;
}

const LABEL_CELL =
  "padding:8px 12px 8px 0;vertical-align:top;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:20px;letter-spacing:0.6px;text-transform:uppercase;color:#63684A";

const VALUE_CELL =
  "padding:8px 0;vertical-align:top;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#3C4632";

const ROW_DIVIDER =
  `<tr><td colspan="2" height="1" style="height:1px;line-height:1px;font-size:0;background-color:#EDE2C4">&nbsp;</td></tr>`;

const SECTION_DIVIDER = (topPadding: number) =>
  `<tr><td style="padding:${topPadding}px 48px 0 48px" class="pad"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%"><tr><td height="1" style="height:1px;line-height:1px;font-size:0;background-color:#E3D6B4">&nbsp;</td></tr></table></td></tr>`;

const SECTION_HEADING = (title: string, topPadding: number) =>
  `<tr><td style="padding:${topPadding}px 48px 0 48px" class="pad">
<div class="sec" style="font-family:Georgia,'Times New Roman',serif;font-size:18px;line-height:26px;mso-line-height-rule:exactly;color:#324020">${title}</div>
</td></tr>`;

// Values arrive pre-escaped because a few of them are anchors, not plain text.
// Only the first label cell carries the column width; the rest inherit it.
const FIELD_TABLE = (rows: Array<[string, string]>) =>
  `<tr><td style="padding:14px 48px 0 48px" class="pad"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%">
${rows
  .map(
    ([label, value], index) =>
      `<tr><td class="lbl"${index === 0 ? ' width="180"' : ''} style="${
        index === 0 ? 'width:180px;' : ''
      }${LABEL_CELL}">${label}</td><td class="val" style="${VALUE_CELL}">${value || '&mdash;'}</td></tr>`
  )
  .join(`\n${ROW_DIVIDER}\n`)}
</table></td></tr>`;

export function buildLetsConnectNotificationEmail(
  submission: LetsConnectSubmission,
  now: Date = new Date()
) {
  const lang = submission.lang === 'vi' ? 'vi' : 'en';
  const couple = coupleNames(submission);
  const weddingDate = formatWeddingDate(submission.weddingDate);
  const guestCount = submission.guestCount != null ? String(submission.guestCount) : '';
  const extraEvents = submission.extraEvents.join(' · ');
  const referralSource = submission.referralSource.join(' · ');

  const emailLink = `<a href="mailto:${escapeHtml(submission.email)}" style="color:#324020;text-decoration:underline">${escapeHtml(submission.email)}</a>`;
  const phoneLink = submission.phone
    ? `<a href="tel:${escapeHtml(submission.phone.replace(/[^\d+]/g, ''))}" style="color:#324020;text-decoration:underline">${escapeHtml(submission.phone)}</a>`
    : '';

  const preheader = [couple, weddingDate, submission.venue, guestCount && `${guestCount} guests`]
    .filter(Boolean)
    .map((part) => escapeHtml(String(part)))
    .join(' — ');

  const personalRows: Array<[string, string]> = [
    ['Last name', escapeHtml(submission.lastName)],
    ['First name', escapeHtml(submission.firstName)],
    ['I am…', escapeHtml(submission.role ?? '')],
    ['Partner’s name', escapeHtml(submission.partnerName ?? '')],
    ['Email address', emailLink],
    ['Phone number', phoneLink],
    ['Current location', escapeHtml(submission.location ?? '')],
  ];

  const weddingRows: Array<[string, string]> = [
    ['Wedding date', escapeHtml(weddingDate)],
    ['Venue / city', escapeHtml(submission.venue ?? '')],
    ['Guest count', escapeHtml(guestCount)],
    ['Estimated budget', escapeHtml(submission.budget ?? '')],
    ['Additional events', escapeHtml(extraEvents)],
  ];

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"><title>New enquiry — Meraki Wedding Planner</title>
<!--[if mso]><style>body,table,td,a{font-family:Arial,sans-serif !important}</style><![endif]-->
<style>@media only screen and (max-width:620px){.wrap{width:100% !important}.pad{padding-left:24px !important;padding-right:24px !important}.lgo{width:130px !important}.lbl,.val{display:block !important;width:100% !important;padding-left:0 !important;padding-right:0 !important}.lbl{padding-bottom:2px !important;font-size:13px !important;line-height:21px !important}.val{font-size:17px !important;line-height:26px !important}.sec{font-size:20px !important;line-height:28px !important}.note{font-size:17px !important;line-height:28px !important}.meta{font-size:14px !important;line-height:23px !important}}</style>
</head>
<body style="margin:0;padding:0;background-color:#EFE6CE;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">
<span style="display:none;font-size:1px;color:#EFE6CE;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">${preheader}${PREHEADER_SPACER}</span>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#EFE6CE;margin:0;padding:0"><tr><td align="center" style="padding:0">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="wrap" style="width:600px;max-width:600px;background-color:#FFF1D5">

<tr><td align="center" style="padding:44px 48px 0 48px" class="pad">
<img src="${LOGO_URL}" alt="Meraki" width="150" class="lgo" style="display:block;border:0;outline:none;text-decoration:none;width:150px;height:auto">
</td></tr>

<tr><td align="center" style="padding:16px 48px 0 48px" class="pad">
<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:16px;mso-line-height-rule:exactly;letter-spacing:3.2px;text-transform:uppercase;color:#5F6733">New enquiry from the website</div>
</td></tr>

<tr><td align="center" style="padding:26px 48px 0 48px" class="pad">
<div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:34px;mso-line-height-rule:exactly;color:#324020">${escapeHtml(couple)}</div>
<div class="meta" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:22px;mso-line-height-rule:exactly;color:#63684A;padding-top:6px">Submitted ${formatSubmittedAt(now)} · ${lang.toUpperCase()} form</div>
</td></tr>

${SECTION_DIVIDER(32)}

${SECTION_HEADING('Personal information', 30)}
${FIELD_TABLE(personalRows)}

${SECTION_HEADING('Wedding information', 34)}
${FIELD_TABLE(weddingRows)}

${SECTION_HEADING('A few more details', 34)}
${FIELD_TABLE([['Heard about us via', escapeHtml(referralSource)]])}

<tr><td style="padding:20px 48px 0 48px" class="pad">
<div class="lbl" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:20px;letter-spacing:0.6px;text-transform:uppercase;color:#63684A">Anything else you would love us to know</div>
</td></tr>
<tr><td style="padding:10px 48px 0 48px" class="pad">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;background-color:#F7EBCB"><tr><td style="padding:18px 20px">
<p class="note" style="margin:0;font-family:'BT Beau Sans',Arial,Helvetica,sans-serif;font-size:15px;line-height:26px;mso-line-height-rule:exactly;color:#3C4632;white-space:pre-line">${escapeHtml(submission.otherNotes ?? '')}</p>
</td></tr></table>
</td></tr>

${SECTION_DIVIDER(40)}

<tr><td align="center" style="padding:24px 48px 48px 48px" class="pad">
<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:18px;mso-line-height-rule:exactly;letter-spacing:1.2px;text-transform:uppercase;color:#6E7355">Internal notification · ${SITE_URL.replace('https://', '')}/${lang}/lets-connect</div>
</td></tr>

</table>
</td></tr></table>
</body></html>`;

  const text = [
    `New enquiry from the website (${lang.toUpperCase()} form)`,
    `${couple} — submitted ${formatSubmittedAt(now)}`,
    '',
    'Personal information',
    `Last name: ${submission.lastName}`,
    `First name: ${submission.firstName}`,
    `I am…: ${submission.role ?? ''}`,
    `Partner's name: ${submission.partnerName ?? ''}`,
    `Email address: ${submission.email}`,
    `Phone number: ${submission.phone ?? ''}`,
    `Current location: ${submission.location ?? ''}`,
    '',
    'Wedding information',
    `Wedding date: ${weddingDate}`,
    `Venue / city: ${submission.venue ?? ''}`,
    `Guest count: ${guestCount}`,
    `Estimated budget: ${submission.budget ?? ''}`,
    `Additional events: ${extraEvents}`,
    '',
    'A few more details',
    `Heard about us via: ${referralSource}`,
    '',
    'Anything else you would love us to know',
    submission.otherNotes ?? '',
  ].join('\n');

  return { html, text };
}
