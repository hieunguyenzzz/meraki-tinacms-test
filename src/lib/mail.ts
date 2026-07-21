import nodemailer from 'nodemailer';
import type { LetsConnectSubmission } from './db';
import { buildLetsConnectNotificationEmail } from './email-templates/lets-connect-notification';
import { buildLetsConnectThankYouEmail } from './email-templates/lets-connect-thank-you';

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD,
  },
});

const CONTACT_EMAIL_TO = process.env.CONTACT_EMAIL_TO || 'contact@merakiwp.com';

export async function sendLetsConnectNotification(submission: LetsConnectSubmission) {
  const { html, text } = buildLetsConnectNotificationEmail(submission);

  await transporter.sendMail({
    from: `"Meraki Let's Connect" <${process.env.ZOHO_EMAIL}>`,
    to: CONTACT_EMAIL_TO,
    replyTo: submission.email,
    subject: `Let's Connect: ${submission.firstName} ${submission.lastName}`,
    text,
    html,
  });
}

export async function sendLetsConnectThankYou(submission: LetsConnectSubmission) {
  const { subject, html, text } = buildLetsConnectThankYouEmail(submission);

  await transporter.sendMail({
    from: `"Meraki Wedding Planner" <${process.env.ZOHO_EMAIL}>`,
    to: submission.email,
    replyTo: CONTACT_EMAIL_TO,
    subject,
    text,
    html,
  });
}
