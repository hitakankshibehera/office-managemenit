export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EMPLOYEE';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'DEACTIVATED';
  createdAt: string;
}

export interface CalculatedWorkTime {
  checkIn: string;
  checkOut: string;
  durationText: string;
  totalSeconds: number;
  calculatedAt: string;
}

export interface EmployeeProfile {
  id: string;
  userId: string;
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName: string;
  designation: string;
  joiningDate: string;
  profileImage: string;
  address: string;
  emergencyContact: string;
  status: 'Active' | 'Pending' | 'On Leave' | 'Inactive';
  workingStatus?: 'Working' | 'Checked Out' | 'Absent' | 'On Leave';
  todayCheckIn?: string;
  todayCheckOut?: string;
  todayTotalHours?: string;
  signupTimestamp?: string;
  signupDate?: string;
  calculatedWorkTime?: CalculatedWorkTime;
  shiftCompletedToday?: boolean;
  allowReCheckInToday?: boolean;
  lastShiftDate?: string;
}

export type Employee = EmployeeProfile;

export interface Department {
  id: string;
  name: string;
  code: string;
  headName: string;
  leadName?: string;
  totalEmployees: number;
  employeeCount?: number;
}

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED';

export interface TaskSubtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
}

export interface TaskFileAttachment {
  id: string;
  name: string;
  size: number;
  formattedSize: string;
  type: 'PDF' | 'DOCUMENT' | 'IMAGE' | 'ARCHIVE' | 'FOLDER' | 'OTHER';
  fileData?: string; // Data URL / Base64 for instant desktop download
  uploadedBy: string;
  uploadedByRole: 'EMPLOYEE' | 'ADMIN' | 'SUPER_ADMIN';
  uploadedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedToId: string; // employeeId
  assignedToName: string;
  assignedToEmail: string;
  assignedToCode: string;
  assignedById: string;
  assignedByName: string;
  department: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string;
  progress: number; // 0 - 100
  subtasks: TaskSubtask[];
  comments: TaskComment[];
  attachments?: string[];
  fileAttachments?: TaskFileAttachment[];
  submittedAt?: string;
  submissionNotes?: string;
  emailDeliveryStatus?: 'PENDING' | 'SENT' | 'FAILED' | 'RETRYING';
  emailError?: string;
  createdAt: string;
  updatedAt: string;
}

export type AttendanceStatus = 'Present' | 'Working' | 'Late' | 'Half Day' | 'Absent' | 'Leave';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  date: string; // YYYY-MM-DD
  checkIn: string; // HH:mm:ss or HH:mm AM/PM
  checkOut?: string;
  totalSeconds: number;
  workingHoursText: string; // e.g. "08h 51m"
  status: AttendanceStatus;
  isImmutable: boolean;
  correctionLog?: string;
  createdAt: string;
}

export type LeaveType = 'Casual' | 'Sick' | 'Emergency' | 'Personal' | 'Other';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  requestedAt: string;
  appliedAt?: string;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  adminNote?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  content?: string;
  category?: 'General' | 'Holiday' | 'Event' | 'Emergency';
  targetAudience: string;
  targetDepartment?: string;
  authorName: string;
  authorEmail: string;
  date?: string;
  createdAt: string;
  pinned?: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'TASK' | 'ATTENDANCE' | 'LEAVE' | 'ANNOUNCEMENT' | 'SECURITY';
  read: boolean;
  createdAt: string;
  linkUrl?: string;
}

export interface AuditLogItem {
  id: string;
  userId: string;
  userName: string;
  performedByName?: string;
  userRole: UserRole;
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
  metadata?: string;
  timestamp: string;
  ipAddress: string;
}

export interface CompanySettings {
  companyName: string;
  companyEmail?: string;
  tagline?: string;
  phone?: string;
  officialEmail: string;
  timezone: string;
  workingHoursStart: string;
  workingHoursEnd: string;
  shiftStart?: string;
  shiftEnd?: string;
  gracePeriodMins?: number;
  workingDays: string;
  annualLeaveQuota: number;
  casualLeaveQuota: number;
  sickLeaveQuota: number;
  requireOtpEveryLogin: boolean;
  requireOtpForLogin?: boolean;
  emailNotificationsEnabled?: boolean;
  sessionTimeoutMinutes: number;
  logoUrl?: string;
}

export interface SimulatedEmail {
  id: string;
  from: string;
  to: string;
  toName: string;
  subject: string;
  snippet: string;
  htmlContent: string;
  timestamp: string;
  type: 'OTP' | 'TASK' | 'LEAVE' | 'ANNOUNCEMENT' | 'SECURITY';
  isRead: boolean;
}

export interface GroupMessageAttachment {
  id: string;
  name: string;
  size: number;
  formattedSize: string;
  type: 'PDF' | 'DOCUMENT' | 'IMAGE' | 'ARCHIVE' | 'FOLDER' | 'OTHER';
  fileData?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderRole: 'ADMIN' | 'SUPER_ADMIN' | 'EMPLOYEE';
  senderAvatar?: string;
  content: string;
  attachments?: GroupMessageAttachment[];
  createdAt: string;
}

export interface EmployeeGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  createdByAdminId: string;
  createdByAdminName: string;
  memberIds: string[];
  messages: GroupMessage[];
  createdAt: string;
  updatedAt: string;
}

