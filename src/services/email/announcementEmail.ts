/**
 * Wonder Light Adventure - Announcement & Security Email Templates
 * Official Sender: Wonder Light Adventure <wonderlightadventure@gmail.com>
 */

export interface AnnouncementEmailParams {
  employeeName: string;
  title: string;
  message: string;
  authorName: string;
  category?: string;
  appUrl?: string;
}

export function generateAnnouncementEmailHtml({
  employeeName,
  title,
  message,
  authorName,
  category = 'General',
  appUrl = '',
}: AnnouncementEmailParams): { subject: string; html: string; text: string } {
  const subject = `Company Announcement: ${title} — Wonder Light Adventure`;
  const portalUrl = `${appUrl.replace(/\/$/, '')}/announcements`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F4F7FB; margin: 0; padding: 0; }
    .wrapper { max-width: 580px; margin: 24px auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; }
    .header { background: #071A2F; padding: 24px; text-align: center; border-bottom: 3px solid #168BFF; color: white; }
    .content { padding: 32px 24px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h2 style="margin: 0; color: #18BFFF; font-size: 18px;">WONDER LIGHT ADVENTURE</h2>
      <p style="margin: 4px 0 0 0; color: #94A3B8; font-size: 12px;">Official Company Announcement</p>
    </div>
    <div class="content">
      <p style="font-size: 15px; font-weight: 600; color: #0F172A;">Hello ${employeeName},</p>
      <div style="margin: 16px 0; padding: 20px; background: #F8FAFC; border-left: 4px solid #168BFF; border-radius: 8px;">
        <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #168BFF; letter-spacing: 1px;">${category} Announcement</span>
        <h3 style="margin: 6px 0 12px 0; font-size: 18px; color: #0F172A;">${title}</h3>
        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0; white-space: pre-line;">${message}</p>
        <p style="font-size: 12px; color: #64748B; margin: 16px 0 0 0;">Posted by: <strong>${authorName}</strong></p>
      </div>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${portalUrl}" style="background: #168BFF; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 700;">View in Portal</a>
      </div>
      <div style="font-size: 12px; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 16px;">
        Official Company Communication · wonderlightadventure@gmail.com
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
WONDER LIGHT ADVENTURE - ANNOUNCEMENT
${title}
Category: ${category}
Posted by: ${authorName}

${message}

View details: ${portalUrl}
wonderlightadventure@gmail.com
  `.trim();

  return { subject, html, text };
}

export interface SecurityEmailParams {
  employeeName: string;
  eventType: string;
  details: string;
  ipAddress?: string;
  timestamp?: string;
}

export function generateSecurityEmailHtml({
  employeeName,
  eventType,
  details,
  ipAddress,
  timestamp = new Date().toLocaleString(),
}: SecurityEmailParams): { subject: string; html: string; text: string } {
  const subject = `Security Alert: ${eventType} — Wonder Light Adventure`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${subject}</title>
</head>
<body style="font-family: sans-serif; background: #F4F7FB; padding: 20px;">
  <div style="max-width: 580px; margin: 0 auto; background: white; border-radius: 12px; border: 1px solid #E2E8F0; overflow: hidden;">
    <div style="background: #071A2F; padding: 20px; text-align: center; border-bottom: 3px solid #EF4444; color: white;">
      <h3 style="margin: 0; color: #FCA5A5;">SECURITY NOTIFICATION</h3>
      <p style="margin: 4px 0 0; color: #94A3B8; font-size: 12px;">Wonder Light Adventure Account Security</p>
    </div>
    <div style="padding: 24px; font-size: 14px; color: #334155;">
      <p>Hello <strong>${employeeName}</strong>,</p>
      <p>A notable security event was recorded on your Wonder Light Adventure profile:</p>
      <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; padding: 14px; margin: 16px 0;">
        <p style="margin: 0 0 6px; font-weight: bold; color: #991B1B;">${eventType}</p>
        <p style="margin: 0 0 6px; color: #4B5563;">${details}</p>
        <p style="margin: 0; font-size: 12px; color: #6B7280;">Time: ${timestamp} ${ipAddress ? `| IP: ${ipAddress}` : ''}</p>
      </div>
      <p style="font-size: 12px; color: #64748B;">If you did not initiate this activity, please immediately notify your administrator or reply to wonderlightadventure@gmail.com.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
SECURITY ALERT - WONDER LIGHT ADVENTURE
Hello ${employeeName},
Event: ${eventType}
Details: ${details}
Time: ${timestamp}
If this wasn't you, contact wonderlightadventure@gmail.com immediately.
  `.trim();

  return { subject, html, text };
}
