import type { LetsConnectSubmission } from '../db';

const SITE_URL = 'https://merakiweddingplanner.com';

const COPY = {
  subject: {
    en: (name: string) => `Thank you, ${name} — Meraki has received your message`,
    vi: (name: string) => `Cảm ơn ${name} — Meraki đã nhận được tin nhắn của bạn`,
  },
  heading: {
    en: "Let's connect soon",
    vi: 'Meraki sẽ sớm liên hệ với bạn',
  },
  body: {
    en: [
      'Thank you for sharing your story with us. We are so excited to learn more about your wedding day.',
      'Our team usually replies within two working days. In the meantime, feel free to browse our recent weddings on Instagram for inspiration.',
    ],
    vi: [
      'Cảm ơn bạn đã chia sẻ câu chuyện của mình với Meraki. Tụi mình rất mong được hiểu thêm về ngày cưới của bạn.',
      'Đội ngũ Meraki thường phản hồi trong vòng 2 ngày làm việc. Trong lúc chờ đợi, bạn có thể ghé thăm Instagram của Meraki để xem thêm các đám cưới gần đây.',
    ],
  },
  cta: {
    en: 'View our Instagram',
    vi: 'Xem Instagram của Meraki',
  },
  signoff: {
    en: 'With warmth,<br/>The Meraki Wedding Planner team',
    vi: 'Thân mến,<br/>Đội ngũ Meraki Wedding Planner',
  },
};

function greetingName(submission: LetsConnectSubmission) {
  return submission.firstName || (submission.lang === 'vi' ? 'bạn' : 'there');
}

export function buildLetsConnectThankYouEmail(submission: LetsConnectSubmission) {
  const lang = submission.lang === 'vi' ? 'vi' : 'en';
  const name = greetingName(submission);
  const subject = COPY.subject[lang](name);
  const paragraphs = COPY.body[lang]
    .map(
      (paragraph) =>
        `<p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#374220;">${paragraph}</p>`
    )
    .join('');

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
              <td style="padding:32px;">
                <h1 style="margin:0 0 16px;font-size:22px;color:#374220;">${COPY.heading[lang]}</h1>
                ${paragraphs}
                <p style="text-align:center;margin:28px 0 8px;">
                  <a href="https://www.instagram.com/meraki.wedding.planner" style="display:inline-block;padding:10px 24px;border:1px solid #374220;color:#374220;font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;">${COPY.cta[lang]}</a>
                </p>
                <p style="margin:32px 0 0;font-size:14px;line-height:1.7;color:#535d44;">${COPY.signoff[lang]}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background-color:#374220;text-align:center;font-family:Arial,Helvetica,sans-serif;">
                <p style="margin:0;font-size:12px;color:#fef5e3;">
                  ${SITE_URL.replace('https://', '')} &middot; contact@merakiwp.com &middot; (+82) 965492092
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `${COPY.heading[lang]}\n\n${COPY.body[lang].join('\n\n')}\n\nInstagram: https://www.instagram.com/meraki.wedding.planner\n\n${COPY.signoff[lang].replace('<br/>', '\n')}`;

  return { subject, html, text };
}
