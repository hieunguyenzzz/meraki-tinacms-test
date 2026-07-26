import type { LetsConnectSubmission } from '../db';

const SITE_URL = 'https://merakiweddingplanner.com';

const COPY = {
  subject: {
    en: (name: string) => `Thank you, ${name} — Meraki has received your message`,
    vi: (name: string) => `Cảm ơn ${name} — Meraki đã nhận được tin nhắn của bạn`,
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
    en: 'Warmly,<br/>Meraki Wedding Planner',
    vi: 'Mong sớm được đồng hành cùng hai bạn,<br/>Meraki Wedding Planner',
  },
};

function greetingName(submission: LetsConnectSubmission, lang: 'en' | 'vi') {
  return submission.firstName || (lang === 'vi' ? 'bạn' : 'there');
}

export function buildLetsConnectThankYouEmail(submission: LetsConnectSubmission) {
  const lang = submission.lang === 'vi' ? 'vi' : 'en';
  const name = greetingName(submission, lang);
  const subject = COPY.subject[lang](name);
  const paragraphs = [COPY.greeting[lang], ...COPY.body[lang]]
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
                ${paragraphs}
                <p style="margin:32px 0 0;font-size:14px;line-height:1.7;color:#535d44;">${COPY.signoff[lang]}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background-color:#374220;text-align:center;font-family:Arial,Helvetica,sans-serif;">
                <p style="margin:0;font-size:12px;color:#fef5e3;">
                  ${SITE_URL.replace('https://', '')} &middot; contact@merakiweddingplanner.com &middot; (+82) 965492092
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `${COPY.greeting[lang]}\n\n${COPY.body[lang].join('\n\n')}\n\n${COPY.signoff[lang].replace('<br/>', '\n')}`;

  return { subject, html, text };
}
