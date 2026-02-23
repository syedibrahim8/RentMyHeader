import nodemailer from "nodemailer";
import { env, isProd } from "../config/env";

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});

let verifyPromise: Promise<void> | null = null;

function ensureTransportReady() {
  if (isProd) return Promise.resolve();

  if (!verifyPromise) {
    verifyPromise = transporter.verify().then(() => undefined).catch((err) => {
      verifyPromise = null;
      throw err;
    });
  }

  return verifyPromise;
}

function escapeHtml(raw: string) {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function appEmailLayout(title: string, intro: string, ctaLabel: string, ctaLink: string, outro: string) {
  const safeTitle = escapeHtml(title);
  const safeIntro = escapeHtml(intro);
  const safeCtaLabel = escapeHtml(ctaLabel);
  const safeCtaLink = escapeHtml(ctaLink);
  const safeOutro = escapeHtml(outro);

  return `
    <div style="font-family: Inter, Arial, sans-serif; line-height:1.6; color:#111827; max-width: 640px; margin: 0 auto;">
      <h2 style="margin-bottom:8px">${safeTitle}</h2>
      <p style="margin-top:0">${safeIntro}</p>
      <p>
        <a href="${safeCtaLink}" style="display:inline-block;padding:10px 14px;background:#111827;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">
          ${safeCtaLabel}
        </a>
      </p>
      <p style="color:#374151">${safeOutro}</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
      <p style="font-size:12px;color:#6b7280">If the button does not work, copy and paste this link into your browser:</p>
      <p style="font-size:12px;word-break:break-all;color:#6b7280">${safeCtaLink}</p>
    </div>
  `;
}

export async function sendEmail(input: SendEmailInput | string, subject?: string, html?: string) {
  const payload: SendEmailInput =
    typeof input === "string"
      ? {
          to: input,
          subject: subject || "",
          html: html || "",
        }
      : input;

  if (!payload.to || !payload.subject || !payload.html) {
    throw new Error("sendEmail requires to, subject, and html");
  }

  await ensureTransportReady();

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
    replyTo: payload.replyTo,
  });
}

export function verificationEmailTemplate(link: string) {
  return appEmailLayout(
    "Verify your email",
    "Please verify your account to continue using RentMyHeader.",
    "Verify Email",
    link,
    "If you did not create an account, you can ignore this email.",
  );
}

export function verificationEmailText(link: string) {
  return [
    "Verify your email",
    "",
    "Please verify your account to continue using RentMyHeader.",
    `Verify link: ${link}`,
    "",
    "If you did not create an account, you can ignore this email.",
  ].join("\n");
}

export function resetPasswordTemplate(link: string) {
  return appEmailLayout(
    "Reset your password",
    "A password reset was requested for your account.",
    "Reset Password",
    link,
    "If you did not request this, you can ignore this email.",
  );
}

export function resetPasswordText(link: string) {
  return [
    "Reset your password",
    "",
    "A password reset was requested for your account.",
    `Reset link: ${link}`,
    "",
    "If you did not request this, you can ignore this email.",
  ].join("\n");
}
