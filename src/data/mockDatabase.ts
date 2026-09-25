import {
  EmployeeProfile,
  Department,
  Task,
  AttendanceRecord,
  LeaveRequest,
  Announcement,
  NotificationItem,
  AuditLogItem,
  CompanySettings,
  SimulatedEmail,
} from '../types';

export const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'dept-1', name: 'Expeditions & Trekking', code: 'EXP', headName: 'Unassigned', totalEmployees: 0 },
  { id: 'dept-2', name: 'Operations & Logistics', code: 'OPS', headName: 'Unassigned', totalEmployees: 0 },
  { id: 'dept-3', name: 'Engineering & Tech', code: 'TECH', headName: 'Unassigned', totalEmployees: 0 },
  { id: 'dept-4', name: 'Marketing & Media', code: 'MKT', headName: 'Unassigned', totalEmployees: 0 },
  { id: 'dept-5', name: 'Sales & Bookings', code: 'SLS', headName: 'Unassigned', totalEmployees: 0 },
  { id: 'dept-6', name: 'Human Resources', code: 'HR', headName: 'Unassigned', totalEmployees: 0 },
];

// All initialized empty from scratch
export const INITIAL_EMPLOYEES: EmployeeProfile[] = [];

export const INITIAL_TASKS: Task[] = [];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];

export const INITIAL_LEAVES: LeaveRequest[] = [];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'audit-init',
    userId: 'admin-super',
    userName: 'Super Admin',
    userRole: 'SUPER_ADMIN',
    action: 'WORKSPACE_INITIALIZED',
    entity: 'System',
    entityId: 'root',
    metadata: 'Workspace initialized from scratch. Awaiting new employee signups.',
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1',
  },
];

export const INITIAL_SETTINGS: CompanySettings = {
  companyName: 'Wonder Light Adventure',
  officialEmail: 'wonderlightadventure@gmail.com',
  timezone: 'Asia/Kolkata (IST +05:30)',
  workingHoursStart: '09:00 AM',
  workingHoursEnd: '06:00 PM',
  workingDays: 'Monday to Friday',
  annualLeaveQuota: 24,
  casualLeaveQuota: 12,
  sickLeaveQuota: 12,
  requireOtpEveryLogin: true,
  sessionTimeoutMinutes: 480,
  logoUrl: '',
};

export const INITIAL_EMAILS: SimulatedEmail[] = [
  {
    id: 'email-init',
    from: 'Wonder Light Adventure <wonderlightadventure@gmail.com>',
    to: 'wonderlightadventure@gmail.com',
    toName: 'Super Admin',
    subject: 'Welcome to Wonder Light Adventure Workspace (Fresh Instance)',
    snippet: 'Workspace initialized from scratch. When new employees sign up, you will see them in your Admin Portal...',
    timestamp: 'Just now',
    type: 'ANNOUNCEMENT',
    isRead: false,
    htmlContent: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
        <div style="background: #071A2F; padding: 24px; text-align: center; color: white;">
          <h2 style="margin: 0; color: #18BFFF; font-size: 20px; letter-spacing: 1px;">WONDER LIGHT ADVENTURE</h2>
          <p style="margin: 4px 0 0; color: #94a3b8; font-size: 13px;">Workspace Initialization</p>
        </div>
        <div style="padding: 32px 24px; color: #162033;">
          <p style="font-size: 16px; margin: 0 0 16px;">Hello <strong>Super Admin</strong>,</p>
          <p style="font-size: 15px; color: #475569; line-height: 1.6; margin: 0 0 24px;">
            Your workspace has been started from scratch. All employee rosters, tasks, attendance, and leave requests are currently clean and empty.
          </p>
          <div style="background: #F8FAFC; border-left: 4px solid #168BFF; padding: 18px 20px; border-radius: 8px; margin-bottom: 24px;">
            <div style="margin-bottom: 8px;"><strong>Admin Portal:</strong> Ready to monitor incoming registrations</div>
            <div style="margin-bottom: 8px;"><strong>Sign-Up Portal:</strong> Open for new employee onboarding</div>
            <div style="margin-bottom: 0;"><strong>Official Email:</strong> wonderlightadventure@gmail.com</div>
          </div>
          <p style="font-size: 14px; color: #64748b;">
            Whenever a team member submits the Sign-Up form, their profile will immediately appear in your Admin Portal under <strong>Employees</strong>.
          </p>
        </div>
      </div>
    `,
  },
];
