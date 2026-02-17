import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
});

export async function sendEmail(to: string, subject: string, html: string) {
  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

export function verificationEmailTemplate(link: string) {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.5">
      <h2>Verify your email</h2>
      <p>Click the button below to verify your email address.</p>
      <p><a href="${link}" style="display:inline-block;padding:10px 14px;background:#111;color:#fff;text-decoration:none;border-radius:8px">Verify Email</a></p>
      <p>If you did not create an account, you can ignore this email.</p>
    </div>
  `;
}

export function resetPasswordTemplate(link: string) {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.5">
      <h2>Reset your password</h2>
      <p>Click the button below to reset your password.</p>
      <p><a href="${link}" style="display:inline-block;padding:10px 14px;background:#111;color:#fff;text-decoration:none;border-radius:8px">Reset Password</a></p>
      <p>If you did not request this, you can ignore this email.</p>
    </div>
  `;
}