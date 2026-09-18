import { Resend } from "resend";

export const FOUNDER_EMAIL = "lakshitsoni26@gmail.com";

// Lazy singleton — returns null if RESEND_API_KEY is unset, preventing runtime crashes
let _resend: Resend | null = null;
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM_SENDER = process.env.RESEND_FROM_EMAIL || "Tactile <onboarding@resend.dev>";

export interface WaitlistEmailData {
  to: string;
  name: string;
  ticketNumber: number;
  position: number;
  role?: string;
  devicePreference?: string;
}

export interface FeatureRequestEmailData {
  to?: string;
  requestId: string;
  appName: string;
  title: string;
  description: string;
  category: string;
}

/**
 * Send a VIP waitlist confirmation email to the applicant via Resend.
 */
export async function sendWaitlistEmail(data: WaitlistEmailData): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.log(`[resend:mock] Waitlist confirmation for ${data.to} (#${data.ticketNumber}) - RESEND_API_KEY not set.`);
    return;
  }

  const { to, name, ticketNumber, position } = data;

  try {
    await resend.emails.send({
      from: FROM_SENDER,
      to,
      subject: `You're on the Tactile waitlist — #${ticketNumber}`,
      headers: {
        "X-Entity-Ref-ID": `waitlist-${to}-${ticketNumber}`,
      },
      html: buildWaitlistEmailHtml({ name, ticketNumber, position }),
    });
  } catch (error) {
    console.error("[resend] Failed to send waitlist email:", error);
  }
}

/**
 * Send an immediate founder notification to Lakshit whenever a new user joins the waitlist.
 */
export async function sendFounderWaitlistAlert(data: WaitlistEmailData): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.log(`[resend:mock] Founder alert for ${FOUNDER_EMAIL}: New waitlist signup ${data.to} (#${data.ticketNumber})`);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_SENDER,
      to: FOUNDER_EMAIL,
      subject: `🚀 New Tactile Waitlist Signup: #${data.ticketNumber} (${data.to})`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e5e5e5;border-radius:12px;background:#FAF9F5;color:#111;">
          <h2 style="margin:0 0 12px;font-size:20px;color:#111;">New Waitlist Reservation</h2>
          <p style="margin:0 0 16px;font-size:14px;color:#666;">A new developer has joined the Tactile VIP queue.</p>
          <div style="background:#ffffff;border:1px solid rgba(0,0,0,0.08);border-radius:8px;padding:16px;margin-bottom:16px;">
            <p style="margin:0 0 8px;font-size:14px;"><strong>Ticket Number:</strong> #${data.ticketNumber}</p>
            <p style="margin:0 0 8px;font-size:14px;"><strong>Email:</strong> <a href="mailto:${data.to}" style="color:#D97706;">${data.to}</a></p>
            <p style="margin:0 0 8px;font-size:14px;"><strong>Role:</strong> ${data.role || "Software Engineer"}</p>
            <p style="margin:0;font-size:14px;"><strong>Target Device:</strong> ${data.devicePreference || "iPhone / Android"}</p>
          </div>
          <p style="font-size:12px;color:#888;margin:0;">Tactile Early Access Notification · <a href="https://tactile.lakshitsoni.in" style="color:#888;">tactile.lakshitsoni.in</a></p>
        </div>
      `,
    });
  } catch (error) {
    console.error("[resend] Failed to send founder waitlist alert:", error);
  }
}

/**
 * Send an immediate founder notification to Lakshit whenever a feature request is submitted.
 */
export async function sendFounderFeatureAlert(data: FeatureRequestEmailData): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.log(`[resend:mock] Founder alert for ${FOUNDER_EMAIL}: Feature request ${data.requestId} for ${data.appName}`);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_SENDER,
      to: FOUNDER_EMAIL,
      subject: `💡 New Tactile Feature Request: [${data.appName}] ${data.title} (${data.requestId})`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:580px;margin:0 auto;padding:24px;border:1px solid #e5e5e5;border-radius:12px;background:#FAF9F5;color:#111;">
          <div style="display:inline-block;padding:4px 10px;border-radius:20px;background:#FEF3C7;color:#92400E;font-size:11px;font-weight:600;margin-bottom:12px;">
            ${data.requestId} · ${data.category}
          </div>
          <h2 style="margin:0 0 6px;font-size:20px;color:#111;">${data.title}</h2>
          <p style="margin:0 0 16px;font-size:13px;color:#666;">Requested for <strong>${data.appName}</strong></p>
          
          <div style="background:#ffffff;border:1px solid rgba(0,0,0,0.08);border-radius:8px;padding:16px;margin-bottom:16px;">
            <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#71717A;font-weight:600;">Developer Workflow Need:</p>
            <p style="margin:0;font-size:14px;color:#333;line-height:1.6;white-space:pre-wrap;">${data.description}</p>
          </div>

          <div style="background:#F4F4F5;border-radius:6px;padding:10px 14px;margin-bottom:16px;font-size:13px;">
            <strong>Submitted by:</strong> ${data.to ? `<a href="mailto:${data.to}" style="color:#D97706;">${data.to}</a>` : "Anonymous Developer"}
          </div>

          <p style="font-size:12px;color:#888;margin:0;">Tactile Roadmap Feedback System · lakshitsoni26@gmail.com</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("[resend] Failed to send founder feature alert:", error);
  }
}

/**
 * Send user confirmation receipt for their feature request.
 */
export async function sendFeatureRequestEmail(data: FeatureRequestEmailData): Promise<void> {
  if (!data.to) return;
  const resend = getResend();
  if (!resend) {
    console.log(`[resend:mock] Feature request receipt for ${data.to} (${data.requestId})`);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_SENDER,
      to: data.to,
      subject: `We received your Tactile workflow request — ${data.requestId}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;border:1px solid #e5e5e5;border-radius:16px;background:#FAF9F5;color:#111;">
          <div style="margin-bottom:20px;">
            <span style="font-size:16px;font-weight:700;color:#111;letter-spacing:-0.02em;">● Tactile</span>
          </div>
          <h2 style="margin:0 0 10px;font-size:22px;color:#111;">Your workflow proposal is logged.</h2>
          <p style="margin:0 0 20px;font-size:14px;color:#555;line-height:1.6;">
            Thank you for helping shape the future of Tactile. Our engineering team reviews every community workflow to prioritize hardware macro decks and gesture layers.
          </p>

          <div style="background:#ffffff;border:1px solid rgba(0,0,0,0.08);border-radius:10px;padding:18px;margin-bottom:20px;">
            <p style="margin:0 0 4px;font-size:11px;font-family:monospace;color:#71717A;text-transform:uppercase;">Reference ID: ${data.requestId}</p>
            <p style="margin:0 0 10px;font-size:16px;font-weight:600;color:#111;">${data.title}</p>
            <p style="margin:0;font-size:13px;color:#666;line-height:1.5;">Target Application: <strong>${data.appName}</strong> (${data.category})</p>
          </div>

          <p style="font-size:13px;color:#666;line-height:1.6;margin-bottom:20px;">
            We'll email you at this address the moment this feature enters active development or ships in a public build.
          </p>

          <p style="font-size:12px;color:#888;margin:0;">— Lakshit & the Tactile Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("[resend] Failed to send feature request confirmation:", error);
  }
}

function buildWaitlistEmailHtml({
  name,
  ticketNumber,
  position,
}: {
  name: string;
  ticketNumber: number;
  position: number;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're on the Tactile waitlist</title>
</head>
<body style="margin:0;padding:0;background:#F5F5F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111111;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F5F0;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid rgba(0,0,0,0.08);border-radius:20px;padding:36px;box-shadow:0 4px 20px rgba(0,0,0,0.04);">

          <!-- Logo & Amber Dot -->
          <tr>
            <td style="padding-bottom:24px;">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#D97706;margin-right:6px;vertical-align:middle;"></span>
              <span style="font-size:16px;font-weight:700;letter-spacing:-0.03em;color:#111111;vertical-align:middle;">
                Tactile
              </span>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td style="padding-bottom:12px;">
              <h1 style="margin:0;font-size:26px;font-weight:600;letter-spacing:-0.03em;color:#111111;line-height:1.2;">
                You're in line, ${name.split(" ")[0]}.
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom:24px;font-size:14.5px;line-height:1.6;color:#555555;">
              Your early access reservation has been confirmed. You're part of the founding cohort bringing zero-latency physical companion control to Mac.
            </td>
          </tr>

          <!-- Ticket Box -->
          <tr>
            <td style="padding-bottom:24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF9F5;border:1px solid rgba(0,0,0,0.06);border-radius:14px;padding:20px;">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-size:10px;font-family:monospace;letter-spacing:0.08em;color:#71717A;text-transform:uppercase;font-weight:600;">
                      Priority Access Pass
                    </p>
                    <p style="margin:0;font-size:34px;font-weight:700;font-family:monospace;letter-spacing:-0.03em;color:#D97706;">
                      #${ticketNumber.toString().padStart(5, "0")}
                    </p>
                  </td>
                  <td align="right">
                    <p style="margin:0 0 4px;font-size:10px;font-family:monospace;letter-spacing:0.08em;color:#71717A;text-transform:uppercase;font-weight:600;">
                      Queue Position
                    </p>
                    <p style="margin:0;font-size:34px;font-weight:700;font-family:monospace;letter-spacing:-0.03em;color:#111111;">
                      ${position.toLocaleString()}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Specifications -->
          <tr>
            <td style="padding-bottom:24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.06);font-size:13px;color:#111111;font-weight:500;">
                    Sub-15ms Local DMA Pipeline
                  </td>
                  <td align="right" style="padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.06);font-size:12px;font-family:monospace;color:#D97706;">
                    Unlocked
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.06);font-size:13px;color:#111111;font-weight:500;">
                    Application Macro Decks (VS Code, Figma, Terminal)
                  </td>
                  <td align="right" style="padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.06);font-size:12px;font-family:monospace;color:#D97706;">
                    Active
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;font-size:13px;color:#111111;font-weight:500;">
                    Zero-Cloud Local Encryption
                  </td>
                  <td align="right" style="padding:10px 0;font-size:12px;font-family:monospace;color:#D97706;">
                    Guaranteed
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding-top:12px;font-size:13px;color:#71717A;line-height:1.5;">
              Warm regards,<br />
              <strong>Lakshit</strong> &amp; the Tactile Team
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
