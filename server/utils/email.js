const nodemailer = require("nodemailer");

// Creates a transporter from env vars.
// Required in .env:
//   EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS
// Optional:
//   EMAIL_FROM  (defaults to EMAIL_USER)
//
// For Gmail: use an App Password (not your account password).
// For dev without SMTP: set EMAIL_PREVIEW=true to log emails to console instead.

function createTransporter() {
  if (process.env.EMAIL_PREVIEW === "true") return null;

  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;
  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) return null;

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: parseInt(EMAIL_PORT, 10) || 587,
    secure: parseInt(EMAIL_PORT, 10) === 465,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });
}

/**
 * Send a plain + HTML email.
 * @param {{ to: string, subject: string, html: string, text?: string }} opts
 * @returns {Promise<void>}  — resolves silently even if email is not configured
 */
async function sendEmail({ to, subject, html, text }) {
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER || "no-reply@campuscareers.edu";

  // Preview mode: log to console instead of sending
  if (process.env.EMAIL_PREVIEW === "true") {
    console.log("\n📧  EMAIL PREVIEW");
    console.log(`  To:      ${to}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Body:    ${text || "(html only)"}\n`);
    return;
  }

  const transporter = createTransporter();
  if (!transporter) {
    console.warn(`[email] Not configured — skipped email to ${to}: "${subject}"`);
    return;
  }

  try {
    await transporter.sendMail({ from, to, subject, html, text });
  } catch (err) {
    // Never crash the request over a failed email
    console.error(`[email] Failed to send to ${to}:`, err.message);
  }
}

// ── Email Templates ────────────────────────────────────────────────────────

function recruiterApprovedEmail(name) {
  return {
    subject: "Your Campus Careers recruiter account has been approved",
    text: `Hi ${name},\n\nYour recruiter account on Campus Careers has been approved. You can now log in and post job listings.\n\nWelcome aboard!\n\nThe Campus Careers Team`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <h2 style="border-bottom:2px solid #1a1a1a;padding-bottom:8px">Campus Careers</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Your recruiter account has been <strong>approved</strong>. You can now log in and post academic job listings on Campus Careers.</p>
        <p style="margin-top:32px">
          <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/login"
             style="background:#1a1a1a;color:#fff;padding:12px 24px;text-decoration:none;font-size:13px;text-transform:uppercase;letter-spacing:0.1em">
            Log In Now
          </a>
        </p>
        <p style="margin-top:40px;font-size:12px;color:#666">The Campus Careers Team</p>
      </div>`,
  };
}

function recruiterRejectedEmail(name) {
  return {
    subject: "Update on your Campus Careers recruiter application",
    text: `Hi ${name},\n\nAfter review, your recruiter application on Campus Careers has not been approved at this time.\n\nIf you believe this is an error, please contact us.\n\nThe Campus Careers Team`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <h2 style="border-bottom:2px solid #1a1a1a;padding-bottom:8px">Campus Careers</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>After review, your recruiter application has <strong>not been approved</strong> at this time.</p>
        <p>If you believe this is an error or have questions, please reply to this email.</p>
        <p style="margin-top:40px;font-size:12px;color:#666">The Campus Careers Team</p>
      </div>`,
  };
}

module.exports = { sendEmail, recruiterApprovedEmail, recruiterRejectedEmail };
