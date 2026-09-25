/**
 * Wonder Light Adventure - Task Email Template
 * Official Sender: Wonder Light Adventure <wonderlightadventure@gmail.com>
 */

export interface TaskEmailParams {
  employeeName: string;
  taskTitle: string;
  taskDescription: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  deadline: string;
  taskId: string;
  assignedByName: string;
  appUrl?: string;
}

export function generateTaskEmailHtml({
  employeeName,
  taskTitle,
  taskDescription,
  priority,
  deadline,
  taskId,
  assignedByName,
  appUrl = '',
}: TaskEmailParams): { subject: string; html: string; text: string } {
  const subject = `New Task Assigned — Wonder Light Adventure`;
  const taskUrl = `${appUrl.replace(/\/$/, '')}/employee/tasks/${taskId}`;

  const priorityColors: Record<string, { bg: string; text: string; border: string }> = {
    LOW: { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' },
    MEDIUM: { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
    HIGH: { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' },
    URGENT: { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
  };

  const priorityStyle = priorityColors[priority] || priorityColors.MEDIUM;

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
      background-color: #F4F7FB;
      color: #1E293B;
    }
    .wrapper {
      max-width: 580px;
      margin: 24px auto;
      background: #FFFFFF;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #E2E8F0;
      box-shadow: 0 4px 16px rgba(7, 26, 47, 0.06);
    }
    .header {
      background: linear-gradient(135deg, #071A2F 0%, #0B2B4E 100%);
      padding: 28px 24px;
      text-align: center;
      border-bottom: 3px solid #168BFF;
    }
    .header h1 {
      margin: 0;
      color: #18BFFF;
      font-size: 19px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    .header p {
      margin: 4px 0 0 0;
      color: #94A3B8;
      font-size: 12px;
    }
    .content {
      padding: 32px 28px;
    }
    .greeting {
      font-size: 16px;
      font-weight: 600;
      color: #0F172A;
      margin-bottom: 12px;
    }
    .task-card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }
    .task-title {
      font-size: 18px;
      font-weight: 700;
      color: #0F172A;
      margin: 0 0 12px 0;
    }
    .meta-grid {
      display: table;
      width: 100%;
      margin-bottom: 14px;
    }
    .meta-row {
      display: table-row;
    }
    .meta-cell {
      display: table-cell;
      padding: 4px 8px 4px 0;
      font-size: 13px;
    }
    .meta-label {
      color: #64748B;
      font-weight: 500;
    }
    .priority-badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      background: ${priorityStyle.bg};
      color: ${priorityStyle.text};
      border: 1px solid ${priorityStyle.border};
    }
    .task-desc {
      font-size: 14px;
      color: #334155;
      line-height: 1.6;
      border-top: 1px solid #E2E8F0;
      padding-top: 12px;
      margin-top: 12px;
      white-space: pre-line;
    }
    .cta-container {
      text-align: center;
      margin: 28px 0;
    }
    .btn-cta {
      display: inline-block;
      background: linear-gradient(135deg, #168BFF 0%, #18BFFF 100%);
      color: #FFFFFF !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      padding: 14px 32px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(22, 139, 255, 0.3);
    }
    .footer {
      background: #F8FAFC;
      border-top: 1px solid #E2E8F0;
      padding: 20px 24px;
      text-align: center;
      font-size: 12px;
      color: #94A3B8;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>WONDER LIGHT ADVENTURE</h1>
      <p>Task Assignment Notification</p>
    </div>

    <div class="content">
      <div class="greeting">Hello ${employeeName},</div>
      <p style="font-size: 14px; color: #475569; margin: 0 0 16px 0;">
        A new task has been assigned to you by <strong>${assignedByName}</strong>.
      </p>

      <div class="task-card">
        <div class="task-title">${taskTitle}</div>
        <div class="meta-grid">
          <div class="meta-row">
            <div class="meta-cell meta-label">Priority:</div>
            <div class="meta-cell"><span class="priority-badge">${priority}</span></div>
          </div>
          <div class="meta-row">
            <div class="meta-cell meta-label">Deadline:</div>
            <div class="meta-cell" style="font-weight: 600; color: #0F172A;">${deadline}</div>
          </div>
        </div>
        <div class="task-desc">
          <strong>Description:</strong><br>
          ${taskDescription}
        </div>
      </div>

      <p style="font-size: 13px; color: #64748B; text-align: center; margin-bottom: 20px;">
        Please log in to your employee dashboard to review the full details, update progress, and collaborate.
      </p>

      <div class="cta-container">
        <a href="${taskUrl}" class="btn-cta">VIEW TASK</a>
      </div>

      <div style="font-size: 11px; color: #94A3B8; text-align: center; margin-top: 16px;">
        Security Notice: You must be logged into your authorized employee account to view this task.
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px 0;">Wonder Light Adventure Automated System</p>
      <p style="margin: 0;">Official Sender: <a href="mailto:wonderlightadventure@gmail.com" style="color: #168BFF; text-decoration: none;">wonderlightadventure@gmail.com</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
WONDER LIGHT ADVENTURE
New Task Assigned

Hello ${employeeName},

A new task has been assigned to you by ${assignedByName}.

TASK: ${taskTitle}
PRIORITY: ${priority}
DEADLINE: ${deadline}

DESCRIPTION:
${taskDescription}

Please log in to your employee dashboard to view the complete task details:
${taskUrl}

Regards,
Wonder Light Adventure
wonderlightadventure@gmail.com
  `.trim();

  return { subject, html, text };
}
