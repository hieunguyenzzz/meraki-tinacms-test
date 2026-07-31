import type { LetsConnectSubmission } from '../db';

const LOGO_URL = 'https://minio-api.hieunguyen.dev/media/8a8abfb3-8654-4896-95c9-2d22b6853aea.png';

// Pads the preheader so clients don't pull body copy into the inbox preview.
const PREHEADER_SPACER = '&#847;&zwnj;&nbsp;'.repeat(4);

const COPY = {
  subject: {
    en: 'Thank you for sharing with Meraki ~ We’ve received your story 💚',
    vi: (name: string) => `Cảm ơn ${name} ~ Meraki đã nhận được chia sẻ của bạn 💚`,
  },
  preheader: {
    en: 'We have safely received your submission — our team will reply within 2 working days.',
    vi: 'Meraki đã nhận được thông tin của hai bạn — tụi mình sẽ phản hồi trong vòng 2 ngày làm việc.',
  },
  greeting: {
    en: 'Dear our beloved couple,',
    vi: 'Chào hai bạn,',
  },
  body: {
    en: [
      'Thank you for taking the time to share your story and wedding details with us. We have safely received your submission.',
      'Our team will carefully review the information you’ve provided and prepare a quotation for your celebration. We’ll get back to you within 2 working days (excluding weekends and public holidays).',
      'In the meantime, if there’s anything you would like to add or clarify, please feel free to reply to this email. We’re here whenever you need us ~',
    ],
    vi: [
      'Meraki đã nhận được những chia sẻ đầu tiên của hai bạn về hành trình sắp tới. Cảm ơn hai bạn đã tin tưởng và dành thời gian để kể cho tụi mình nghe những dự định về ngày cưới ~',
      'Từ những thông tin này, Meraki sẽ chuẩn bị và gửi lại báo giá dịch vụ phù hợp với nhu cầu của hai bạn. Tụi mình sẽ phản hồi lại hai bạn trong vòng 2 ngày làm việc (không bao gồm Thứ Bảy, Chủ Nhật và các ngày Lễ, Tết).',
      'Nếu trong lúc này, hai bạn nhớ ra thêm điều gì, dù là một ý tưởng nhỏ hay một mong muốn còn đang ấp ủ, hãy cứ thoải mái chia sẻ thêm với tụi mình nhen.',
    ],
  },
  signoff: {
    en: 'Warmly,<br>Meraki Wedding Planner',
    vi: 'Mong sớm được đồng hành cùng hai bạn,<br>Meraki Wedding Planner',
  },
  address: {
    en: '64 Street No.37, Binh Trung Ward, HCMC',
    vi: '64 đường 37, Phường Bình Trưng, TP. HCM',
  },
};

const PARAGRAPH_STYLE =
  "margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:26px;mso-line-height-rule:exactly;color:#3C4632";

const DIVIDER_ROW = (topPadding: number) =>
  `<tr><td style="padding:${topPadding}px 48px 0 48px" class="pad"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%"><tr><td height="1" style="height:1px;line-height:1px;font-size:0;background-color:#E3D6B4">&nbsp;</td></tr></table></td></tr>`;

const FOOTER_LINK = (href: string, label: string) =>
  `<a href="${href}" style="color:#838D4C;text-decoration:none">${label}</a>`;

const FOOTER_LINKS = [
  FOOTER_LINK('https://merakiweddingplanner.com/', 'Website'),
  FOOTER_LINK('https://www.instagram.com/meraki.wedding.planner/', 'Instagram'),
  FOOTER_LINK('https://www.facebook.com/merakiplanning/', 'Facebook'),
  FOOTER_LINK('https://www.tiktok.com/@merakiweddingplanners', 'Tiktok'),
].join(' <span style="color:#CFC49E">&nbsp;|&nbsp;</span> ');

export function buildLetsConnectThankYouEmail(submission: LetsConnectSubmission) {
  const lang = submission.lang === 'vi' ? 'vi' : 'en';
  // Only the Vietnamese subject is personalised; the English one greets the couple.
  const subject =
    lang === 'vi' ? COPY.subject.vi(submission.firstName || 'bạn') : COPY.subject.en;

  const paragraphRows = COPY.body[lang]
    .map(
      (paragraph) =>
        `<tr><td style="padding:20px 48px 0 48px" class="pad">\n<p style="${PARAGRAPH_STYLE}">${paragraph}</p>\n</td></tr>`
    )
    .join('\n\n');

  const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark"><title>${subject}</title>
<!--[if mso]><style>body,table,td,a{font-family:Arial,sans-serif !important}</style><![endif]-->
<style>@media only screen and (max-width:620px){.wrap{width:100% !important}.pad{padding-left:24px !important;padding-right:24px !important}.lgo{width:140px !important}}</style>
</head>
<body style="margin:0;padding:0;background-color:#FFF1D5;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">
<span style="display:none;font-size:1px;color:#FFF1D5;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">${COPY.preheader[lang]}${PREHEADER_SPACER}</span>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#FFF1D5;margin:0;padding:0"><tr><td align="center" style="padding:0">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="wrap" style="width:600px;max-width:600px;background-color:#FFF1D5">

<tr><td align="center" style="padding:56px 48px 0 48px" class="pad">
<img src="${LOGO_URL}" alt="Meraki" width="170" class="lgo" style="display:block;border:0;outline:none;text-decoration:none;width:170px;height:auto">
</td></tr>

<tr><td align="center" style="padding:18px 48px 0 48px" class="pad">
<div style="font-family:Georgia,'Times New Roman',serif;font-size:11px;line-height:16px;mso-line-height-rule:exactly;letter-spacing:3.5px;text-transform:uppercase;color:#838D4C">Let there be love</div>
</td></tr>

${DIVIDER_ROW(36)}

<tr><td style="padding:40px 48px 0 48px" class="pad">
<p style="${PARAGRAPH_STYLE}">${COPY.greeting[lang]}</p>
</td></tr>

${paragraphRows}

<tr><td style="padding:20px 48px 0 48px" class="pad">
<p style="${PARAGRAPH_STYLE}">${COPY.signoff[lang]}</p>
</td></tr>

${DIVIDER_ROW(48)}

<tr><td align="center" style="padding:30px 48px 56px 48px" class="pad">
<div style="font-family:Georgia,'Times New Roman',serif;font-size:13px;line-height:22px;mso-line-height-rule:exactly;letter-spacing:0.4px;color:#324020">${COPY.address[lang]}</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:20px;mso-line-height-rule:exactly;letter-spacing:1.4px;text-transform:uppercase;padding-top:12px">${FOOTER_LINKS}</div>
</td></tr>

</table>
</td></tr></table>
</body></html>`;

  const text = [
    COPY.greeting[lang],
    ...COPY.body[lang],
    COPY.signoff[lang].replace('<br>', '\n'),
    COPY.address[lang],
    'https://merakiweddingplanner.com/',
  ].join('\n\n');

  return { subject, html, text };
}
