/**
 * Email helpers powered by Resend.
 *
 * Configure via env vars:
 *   RESEND_API_KEY       — required for emails to actually send
 *   EMAIL_FROM           — sender address (default: onboarding@resend.dev)
 *   NEXT_PUBLIC_APP_URL  — used in email links to point back at your site
 *
 * If RESEND_API_KEY is missing, every send is a silent no-op so local dev
 * and previews don't break.
 */
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY ?? "";
const FROM   = process.env.EMAIL_FROM ?? "ElonEdge <onboarding@resend.dev>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://elonedge.vercel.app";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "ElonEdge";

const resend = apiKey ? new Resend(apiKey) : null;

async function safeSend(opts: { to: string; subject: string; html: string }) {
  if (!resend) {
    console.log(`[email] RESEND_API_KEY missing — would have sent to ${opts.to}: ${opts.subject}`);
    return;
  }
  try {
    await resend.emails.send({ from: FROM, ...opts });
  } catch (e) {
    console.error("[email] send failed:", e);
  }
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Templates                                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

function shell(title: string, body: string) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#050508;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#eee2c0;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#050508;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px;background:#0e0d14;border:1px solid #2c2818;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:24px 28px;border-bottom:1px solid #2c2818;">
          <div style="font-size:22px;font-weight:700;letter-spacing:-0.01em;">
            <span style="color:#eee2c0;">Elon</span><span style="color:#d4af37;">Edge</span>
          </div>
        </td></tr>
        <tr><td style="padding:28px;">
          ${body}
        </td></tr>
        <tr><td style="padding:18px 28px;border-top:1px solid #2c2818;font-size:11px;color:#8c7c5e;">
          You're receiving this because you signed up at ${APP_NAME}.<br/>
          <a href="${APP_URL}" style="color:#d4af37;text-decoration:none;">${APP_URL}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export async function sendWelcomeEmail(opts: { to: string; name: string }) {
  const body = `
    <h1 style="margin:0 0 12px 0;font-size:24px;color:#eee2c0;">Welcome to ${APP_NAME}, ${escapeHtml(opts.name)}.</h1>
    <p style="margin:0 0 16px 0;font-size:15px;line-height:1.55;color:#aea48a;">
      Your account is live and pre-funded with a $10,000 starting balance — ready to explore
      the world's most ambitious portfolio of Musk-linked ventures.
    </p>
    <p style="margin:0 0 24px 0;font-size:15px;line-height:1.55;color:#aea48a;">
      Tesla, SpaceX, Starlink, xAI, Neuralink, X Corp, Boring Co. — all in one beautifully
      designed dashboard.
    </p>
    <a href="${APP_URL}/dashboard" style="display:inline-block;background:#d4af37;color:#050508;font-weight:600;padding:12px 22px;border-radius:10px;text-decoration:none;font-size:15px;">
      Open your dashboard →
    </a>
    <p style="margin:28px 0 0 0;font-size:13px;color:#8c7c5e;line-height:1.5;">
      Need help? Just reply to this email — we read every one.
    </p>`;
  await safeSend({
    to: opts.to,
    subject: `Welcome to ${APP_NAME}`,
    html: shell(`Welcome to ${APP_NAME}`, body),
  });
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
