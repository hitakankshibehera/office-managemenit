/**
 * Wonder Light Adventure - OTP Email Template
 * Official Sender: Wonder Light Adventure <wonderlightadventure@gmail.com>
 */

export interface OTPEmailParams {
  employeeName: string;
  otp: string;
  purpose: 'SIGNUP' | 'LOGIN' | 'SECURITY';
  expiresInMinutes?: number;
}

export function generateOTPEmailHtml({
  employeeName,
  otp,
  purpose,
  expiresInMinutes = 10,
}: OTPEmailParams): { subject: string; html: string; text: string } {
  const nameToDisplay = employeeName || 'Team Member';
  const subject = '✨ Verify Your Account — Wonderlight Adventure';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #F1F5F9;
      color: #0F172A;
    }
    .email-container {
      max-width: 560px;
      margin: 32px auto;
      background: #FFFFFF;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid #E2E8F0;
      box-shadow: 0 10px 25px -5px rgba(7, 26, 47, 0.08);
    }
    .brand-header {
      background: #071A2F;
      padding: 28px 24px;
      text-align: center;
      border-bottom: 3px solid #18BFFF;
    }
    .brand-header h1 {
      margin: 0;
      color: #FFFFFF;
      font-size: 20px;
      font-weight: 900;
      letter-spacing: 1.5px;
    }
    .brand-header span {
      color: #18BFFF;
    }
    .email-body {
      padding: 36px 32px;
    }
    .title-heading {
      font-size: 22px;
      font-weight: 800;
      color: #071A2F;
      margin: 0 0 16px 0;
      display: flex;
      items-center: center;
      gap: 8px;
    }
    .greeting {
      font-size: 15px;
      font-weight: 600;
      color: #1E293B;
      margin-bottom: 12px;
    }
    .sub-text {
      font-size: 14px;
      color: #475569;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .otp-card {
      text-align: center;
      margin: 28px 0;
      background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%);
      border: 2px solid #BAE6FD;
      border-radius: 16px;
      padding: 24px 20px;
    }
    .otp-subtitle {
      font-size: 12px;
      font-weight: 700;
      color: #0284C7;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .otp-digits {
      font-size: 42px;
      font-weight: 900;
      font-family: 'SFMono-Regular', Consolas, 'Courier New', monospace;
      letter-spacing: 10px;
      color: #071A2F;
      margin: 8px 0;
      padding-left: 10px;
    }
    .instruction-text {
      font-size: 13px;
      font-weight: 700;
      color: #0369A1;
      margin-top: 10px;
    }
    .divider {
      height: 1px;
      background: #E2E8F0;
      margin: 28px 0;
    }
    .notice-item {
      font-size: 13px;
      color: #475569;
      line-height: 1.6;
      margin-bottom: 8px;
    }
    .notice-item strong {
      color: #0F172A;
    }
    .ignore-text {
      font-size: 12px;
      color: #94A3B8;
      margin-top: 20px;
      line-height: 1.5;
    }
    .slogan-footer {
      margin-top: 32px;
      padding-top: 20px;
      border-top: 1px border-slate-100;
      text-align: center;
    }
    .slogan-text {
      font-size: 15px;
      font-weight: 800;
      color: #0284C7;
      margin-bottom: 8px;
    }
    .company-sign {
      font-size: 13px;
      font-weight: 700;
      color: #071A2F;
    }
    .sub-sign {
      font-size: 11px;
      color: #64748B;
      margin-top: 2px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="brand-header">
      <h1>🌍 WONDER<span>LIGHT</span> ADVENTURE</h1>
    </div>

    <div class="email-body">
      <div class="title-heading">✨ Verify Your Account</div>

      <div class="greeting">Hello <strong>${nameToDisplay}</strong>,</div>
      <div class="sub-text">We received a request to verify your employee account.</div>

      <div class="otp-card">
        <div class="otp-subtitle">Your secure 4-digit verification code is:</div>
        <div class="otp-digits">🔐 ${otp}</div>
        <div class="instruction-text">Enter this code to continue</div>
      </div>

      <div class="divider"></div>

      <div class="notice-item">⏳ <strong>Valid for:</strong> 10 minutes</div>
      <div class="notice-item">🛡️ <strong>Keep it confidential:</strong> Never share this code with anyone.</div>

      <div class="ignore-text">
        If you didn't request this verification code, you can safely ignore this email.
      </div>

      <div class="slogan-footer">
        <div class="slogan-text">Travel. Explore. Experience. ✈️</div>
        <div class="company-sign">Wonderlight Adventure</div>
        <div class="sub-sign">Employee Verification System</div>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
🌍 WONDERLIGHT ADVENTURE

✨ Verify Your Account

Hello ${nameToDisplay},

We received a request to verify your employee account.

Your secure 4-digit verification code is:

🔐 ${otp}

Enter this code to continue

━━━━━━━━━━━━━━━━━━━━

⏳ Valid for: 10 minutes
🛡️ Keep it confidential: Never share this code with anyone.

If you didn't request this verification code, you can safely ignore this email.

Travel. Explore. Experience. ✈️

Wonderlight Adventure
Employee Verification System
  `.trim();

  return { subject, html, text };
}
