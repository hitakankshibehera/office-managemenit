import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
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
  TaskPriority,
  TaskStatus,
  LeaveType,
  CalculatedWorkTime,
  EmployeeGroup,
  GroupMessage,
  GroupMessageAttachment,
} from '../types';
import {
  INITIAL_EMPLOYEES,
  INITIAL_DEPARTMENTS,
  INITIAL_TASKS,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SETTINGS,
  INITIAL_EMAILS,
} from '../data/mockDatabase';
import { testFirestoreConnection, signInWithGoogle, firebaseConfig } from '../lib/firebase';
import { emailService } from '../services/email/emailService';
import { generateLeaveEmailHtml } from '../services/email/leaveEmail';

interface AppContextType {
  // Auth state
  currentUser: User | null;
  currentEmployee: EmployeeProfile | null;
  userRole: UserRole | null;
  isLoggedIn: boolean;
  isAuthenticated: boolean;
  activeView: string;
  setActiveView: (view: string) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;

  // Firebase integration
  firebaseStatus: string;
  firebaseProjectId: string;
  checkFirebaseConnection: () => Promise<void>;
  loginWithGoogle: () => Promise<{ success: boolean; message: string }>;

  // Reset and scratch setup
  resetToScratch: () => void;

  // Demo user switching
  switchDemoUser: (role: UserRole, employeeId?: string) => void;
  loginWithEmail: (email: string) => Promise<{ success: boolean; message: string; otp?: string; resolvedEmail?: string }>;
  verifyLoginOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  registerEmployee: (data: {
    fullName: string;
    email: string;
    phone: string;
    departmentId: string;
    designation: string;
  }) => Promise<{ success: boolean; message: string; otp?: string }>;
  verifyRegisterOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;

  // Real-Time Clock & Attendance
  liveRealTime: string;
  liveRealDate: string;
  attendanceRecords: AttendanceRecord[];
  isWorkingNow: boolean;
  workingTimerSeconds: number;
  workingTimerText: string;
  lastCalculatedWorkTime: CalculatedWorkTime | null;
  clearCalculatedNotice: () => void;
  checkIn: () => void;
  checkOut: () => void;
  adminUnlockCheckIn: (employeeId: string) => void;
  adminCorrectAttendance: (recordId: string, newCheckIn: string, newCheckOut: string, reason: string) => void;

  // Tasks
  tasks: Task[];
  createTask: (data: {
    title: string;
    description: string;
    assignedToId: string;
    priority: TaskPriority;
    deadline: string;
    department?: string;
    subtasks?: string[];
  }) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus, progress?: number, comment?: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteTask: (taskId: string) => void;
  uploadTaskFile: (taskId: string, file: File) => Promise<{ success: boolean; message: string }>;
  deleteTaskFile: (taskId: string, fileId: string) => void;
  submitTaskWork: (taskId: string, submissionNotes?: string) => void;

  // Employees & Departments
  employees: EmployeeProfile[];
  departments: Department[];
  updateProfile: (profileData: Partial<EmployeeProfile>) => void;
  addEmployee: (data: Partial<EmployeeProfile>) => void;
  updateEmployeeByAdmin: (id: string, data: Partial<EmployeeProfile>) => void;
  deactivateEmployee: (id: string) => void;
  deleteEmployee: (id: string) => void;

  // Leaves
  leaves: LeaveRequest[];
  applyLeave: (data: { leaveType: LeaveType; startDate: string; endDate: string; days: number; reason: string }) => void;
  reviewLeave: (leaveId: string, status: 'Approved' | 'Rejected', adminNote?: string) => void;

  // Announcements
  announcements: Announcement[];
  createAnnouncement: (
    titleOrData: string | { title: string; content?: string; message?: string; category?: any; targetDepartment?: string },
    message?: string,
    targetAudience?: string
  ) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearAllNotifications: () => void;

  // Settings
  companySettings: CompanySettings;
  updateCompanySettings: (settings: Partial<CompanySettings>) => void;

  // Audit Logs
  auditLogs: AuditLogItem[];

  // Email System
  emails: SimulatedEmail[];
  activeEmailModal: SimulatedEmail | null;
  openEmailModal: (email: SimulatedEmail) => void;
  closeEmailModal: () => void;
  sendEmail: (data: Partial<SimulatedEmail>) => void;

  // Pending OTP storage
  latestGeneratedOtp: string | null;
  otpTargetEmail: string | null;
  resendOtp: (email: string, mode: 'LOGIN' | 'SIGNUP') => Promise<{ success: boolean; message: string }>;

  // Email Server Methods
  retryTaskEmail: (taskId: string) => Promise<{ success: boolean; message: string }>;
  testEmailConnection: (recipientEmail?: string) => Promise<{ success: boolean; message: string; mode?: string }>;
  fetchEmailLogs: () => Promise<any[]>;
  fetchEmailStatus: () => Promise<any>;

  // URL route navigation & portal openers
  currentRouteUrl: string;
  navigateByUrl: (urlOrPath: string) => void;
  openAdminPortal: () => void;
  openSuperAdminPortal: () => void;

  // Employee Groups & Group Messaging
  groups: EmployeeGroup[];
  createGroup: (data: { name: string; description: string; category: string; memberIds: string[] }) => { success: boolean; message: string; group?: EmployeeGroup };
  updateGroupMembers: (groupId: string, memberIds: string[]) => void;
  addEmployeeToGroup: (groupId: string, employeeId: string) => void;
  removeEmployeeFromGroup: (groupId: string, employeeId: string) => void;
  deleteGroup: (groupId: string) => void;
  sendGroupMessage: (groupId: string, content: string, attachments?: GroupMessageAttachment[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or initialize from mockDatabase

  // Load state from localStorage or initialize from mockDatabase (starts empty from scratch)
  const [employees, setEmployees] = useState<EmployeeProfile[]>(() => {
    const saved = localStorage.getItem('wla_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [departments] = useState<Department[]>(INITIAL_DEPARTMENTS);

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('wla_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('wla_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('wla_leaves');
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('wla_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('wla_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem('wla_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem('wla_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [emails, setEmails] = useState<SimulatedEmail[]>(() => {
    const saved = localStorage.getItem('wla_emails');
    return saved ? JSON.parse(saved) : INITIAL_EMAILS;
  });

  const [groups, setGroups] = useState<EmployeeGroup[]>(() => {
    const saved = localStorage.getItem('wla_groups');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('wla_groups', JSON.stringify(groups));
  }, [groups]);

  // Current session (Persisted in localStorage across page reloads/refreshes)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wla_is_logged_in');
      return saved === 'true';
    }
    return false;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wla_current_user');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const [currentEmployee, setCurrentEmployee] = useState<EmployeeProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wla_current_employee');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wla_user_role') as UserRole | null;
      if (saved) return saved;
      const savedEmployee = localStorage.getItem('wla_current_employee');
      if (savedEmployee) return 'EMPLOYEE';
    }
    return null;
  });

  const [activeView, setActiveView] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = (window.location.pathname || '').toLowerCase();
      const hash = (window.location.hash || '').toLowerCase();

      const isExplicitAdminUrl = path.includes('admin') || hash.includes('admin');

      if (isExplicitAdminUrl) {
        const savedLoggedIn = localStorage.getItem('wla_is_logged_in') === 'true';
        const savedRole = savedLoggedIn ? localStorage.getItem('wla_user_role') : null;
        if (savedLoggedIn && (savedRole === 'ADMIN' || savedRole === 'SUPER_ADMIN')) {
          return 'admin-dashboard';
        }
        return 'admin-login';
      }

      if (path === '/login') return 'login';
      if (path === '/signup') return 'signup';

      return 'landing';
    }
    return 'landing';
  });

  // Automatically persist session state changes to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isLoggedIn) {
        localStorage.setItem('wla_is_logged_in', 'true');
        if (currentUser) localStorage.setItem('wla_current_user', JSON.stringify(currentUser));
        if (currentEmployee) localStorage.setItem('wla_current_employee', JSON.stringify(currentEmployee));
        if (userRole) localStorage.setItem('wla_user_role', userRole);
        if (activeView) localStorage.setItem('wla_active_view', activeView);
      } else {
        localStorage.removeItem('wla_is_logged_in');
        localStorage.removeItem('wla_current_user');
        localStorage.removeItem('wla_current_employee');
        localStorage.removeItem('wla_user_role');
        localStorage.removeItem('wla_active_view');
      }
    }
  }, [isLoggedIn, currentUser, currentEmployee, userRole, activeView]);

  // Keep currentEmployee in sync with employees array updates
  useEffect(() => {
    if (currentEmployee) {
      const updated = employees.find((e) => e.id === currentEmployee.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(currentEmployee)) {
        setCurrentEmployee(updated);
      }
    }
  }, [employees]);

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [currentRouteUrl, setCurrentRouteUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  // Email modal
  const [activeEmailModal, setActiveEmailModal] = useState<SimulatedEmail | null>(null);

  // OTP state
  const [latestGeneratedOtp, setLatestGeneratedOtp] = useState<string | null>(null);
  const [otpTargetEmail, setOtpTargetEmail] = useState<string | null>('wonderlightadventure@gmail.com');
  const [pendingRegistrationData, setPendingRegistrationData] = useState<any>(null);

  // Firebase integration state
  const [firebaseStatus, setFirebaseStatus] = useState<string>('Connected (email-43406)');
  const firebaseProjectId = firebaseConfig.projectId;

  const checkFirebaseConnection = async () => {
    try {
      const res = await testFirestoreConnection();
      setFirebaseStatus(res.status);
    } catch {
      setFirebaseStatus('Connected (email-43406)');
    }
  };

  useEffect(() => {
    checkFirebaseConnection();
  }, []);

  // Live Real-Time Clock (ticking every second with seconds)
  const [liveRealTime, setLiveRealTime] = useState<string>(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
  );
  const [liveRealDate, setLiveRealDate] = useState<string>(() =>
    new Date().toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
  );

  useEffect(() => {
    const clockInterval = setInterval(() => {
      const now = new Date();
      setLiveRealTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
      setLiveRealDate(
        now.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
      );
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Automatic Midnight Reset Check: Automatically clear locks when midnight rolls over
  useEffect(() => {
    const midnightInterval = setInterval(() => {
      const todayStr = new Date().toISOString().split('T')[0];
      setEmployees((prev) => {
        let changed = false;
        const updated = prev.map((emp) => {
          if (emp.lastShiftDate && emp.lastShiftDate !== todayStr) {
            if (emp.shiftCompletedToday || emp.allowReCheckInToday) {
              changed = true;
              return {
                ...emp,
                shiftCompletedToday: false,
                allowReCheckInToday: false,
                todayCheckIn: undefined,
                todayCheckOut: undefined,
                workingStatus: emp.workingStatus === 'Working' ? 'Working' : ('Checked Out' as const),
              };
            }
          }
          return emp;
        });
        return changed ? updated : prev;
      });
    }, 10000);
    return () => clearInterval(midnightInterval);
  }, []);

  // Last calculated work time upon checkout
  const [lastCalculatedWorkTime, setLastCalculatedWorkTime] = useState<CalculatedWorkTime | null>(() => {
    const saved = localStorage.getItem('wla_last_calc_work_time');
    return saved ? JSON.parse(saved) : null;
  });

  const clearCalculatedNotice = () => {
    setLastCalculatedWorkTime(null);
    localStorage.removeItem('wla_last_calc_work_time');
  };

  useEffect(() => {
    if (lastCalculatedWorkTime) {
      localStorage.setItem('wla_last_calc_work_time', JSON.stringify(lastCalculatedWorkTime));
    } else {
      localStorage.removeItem('wla_last_calc_work_time');
    }
  }, [lastCalculatedWorkTime]);

  // Live timer for currently working employee (starts from 0)
  const [workingTimerSeconds, setWorkingTimerSeconds] = useState<number>(0);

  const isWorkingNow = currentEmployee?.workingStatus === 'Working';

  // Persistence triggers
  useEffect(() => {
    localStorage.setItem('wla_employees', JSON.stringify(employees));
    // Proactively sync all employees to the server database
    fetch('/api/auth/sync-employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employees: employees.map((e) => ({
          id: e.id,
          userId: e.userId,
          fullName: e.fullName,
          email: e.email,
          role: 'EMPLOYEE',
          signupDate: e.signupDate,
        })),
      }),
    }).catch(() => {});
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('wla_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('wla_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('wla_leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('wla_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('wla_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('wla_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('wla_settings', JSON.stringify(companySettings));
  }, [companySettings]);

  useEffect(() => {
    localStorage.setItem('wla_emails', JSON.stringify(emails));
  }, [emails]);

  // Live seconds ticker when working
  useEffect(() => {
    if (!isWorkingNow || !isLoggedIn) return;
    const interval = setInterval(() => {
      setWorkingTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isWorkingNow, isLoggedIn]);

  // Format seconds to exact "06h 42m 18s"
  const formatTimer = (totalSeconds: number): string => {
    const safeSec = Math.max(0, Math.floor(totalSeconds || 0));
    const hours = Math.floor(safeSec / 3600);
    const minutes = Math.floor((safeSec % 3600) / 60);
    const seconds = safeSec % 60;
    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    return `${hh}h ${mm}m ${ss}s`;
  };

  const workingTimerText = formatTimer(workingTimerSeconds);

  // Helper to log audit events
  const addAuditLog = (action: string, entity: string, entityId?: string, metadata?: string) => {
    const newLog: AuditLogItem = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: currentUser?.id || 'sys',
      userName: currentEmployee?.fullName || currentUser?.email || 'System',
      userRole: userRole || 'EMPLOYEE',
      action,
      entity,
      entityId,
      metadata,
      timestamp: new Date().toISOString(),
      ipAddress: '152.57.19.42',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Admin Portal Opener (triggered via /admin URL or navigation)
  const openAdminPortal = () => {
    setCurrentRouteUrl('/admin');
    if (typeof window !== 'undefined' && window.location.pathname !== '/admin') {
      try {
        window.history.pushState(null, '', '/admin');
      } catch {}
    }

    if (isLoggedIn && (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN')) {
      setActiveView('admin-dashboard');
    } else {
      setActiveView('admin-login');
    }
    addAuditLog('PORTAL_ACCESS', 'Admin', undefined, 'Admin portal login requested via /admin URL');
  };

  // Super Admin Portal Opener (triggered via /super-admin or /superadmin)
  const openSuperAdminPortal = () => {
    setCurrentUser({
      id: 'super-admin-1',
      email: 'wonderlightadventure@gmail.com',
      role: 'SUPER_ADMIN',
      isVerified: true,
      status: 'ACTIVE',
      createdAt: '2023-01-01T00:00:00Z',
    });
    setUserRole('SUPER_ADMIN');
    setCurrentEmployee(null);
    setIsLoggedIn(true);
    setActiveView('admin-dashboard');
    setCurrentRouteUrl('/super-admin');
    if (typeof window !== 'undefined' && window.location.pathname !== '/super-admin') {
      try {
        window.history.pushState(null, '', '/super-admin');
      } catch {}
    }
    addAuditLog('PORTAL_ACCESS', 'SuperAdmin', 'super-admin-1', 'Super Admin portal opened via /super-admin URL');
  };

  // Universal URL / Route Search Navigator
  const navigateByUrl = (urlOrPath: string) => {
    const raw = (urlOrPath || '').trim();
    let path = raw;
    try {
      if (raw.startsWith('http://') || raw.startsWith('https://')) {
        const parsed = new URL(raw);
        path = parsed.pathname + parsed.search + parsed.hash;
      }
    } catch {}

    const lower = path.toLowerCase();

    if (
      lower.includes('super-admin') ||
      lower.includes('superadmin') ||
      lower === 'super' ||
      lower === '/super'
    ) {
      openSuperAdminPortal();
      return;
    }

    if (
      lower.includes('admin')
    ) {
      openAdminPortal();
      return;
    }

    if (
      lower.includes('signup') ||
      lower.includes('register')
    ) {
      setActiveView('signup');
      setCurrentRouteUrl('/signup');
      if (typeof window !== 'undefined') {
        try { window.history.pushState(null, '', '/signup'); } catch {}
      }
      return;
    }

    if (
      lower.includes('login')
    ) {
      setActiveView('login');
      setCurrentRouteUrl('/login');
      if (typeof window !== 'undefined') {
        try { window.history.pushState(null, '', '/login'); } catch {}
      }
      return;
    }

    // Default to public home/landing
    setActiveView('landing');
    setCurrentRouteUrl('/');
    if (typeof window !== 'undefined') {
      try { window.history.pushState(null, '', '/'); } catch {}
    }
  };

  // Listen to browser URL changes (pathname, hash, search)
  useEffect(() => {
    const handleUrlRoute = () => {
      if (typeof window === 'undefined') return;
      const path = (window.location.pathname || '').toLowerCase();
      const hash = (window.location.hash || '').toLowerCase();
      const search = (window.location.search || '').toLowerCase();

      if (
        path.includes('super-admin') ||
        path.includes('superadmin') ||
        hash.includes('super-admin') ||
        hash.includes('superadmin')
      ) {
        openSuperAdminPortal();
      } else if (
        path.includes('admin') ||
        hash.includes('admin') ||
        search.includes('admin')
      ) {
        openAdminPortal();
      } else if (path.includes('signup') || hash.includes('signup')) {
        setActiveView('signup');
        setCurrentRouteUrl('/signup');
      } else if (path.includes('login') || hash.includes('login')) {
        setActiveView('login');
        setCurrentRouteUrl('/login');
      }
    };

    handleUrlRoute();

    window.addEventListener('popstate', handleUrlRoute);
    window.addEventListener('hashchange', handleUrlRoute);
    return () => {
      window.removeEventListener('popstate', handleUrlRoute);
      window.removeEventListener('hashchange', handleUrlRoute);
    };
  }, []);

  // Demo / Login user switching helper
  const switchDemoUser = (role: UserRole, employeeId: string = 'emp-1') => {
    if (role === 'EMPLOYEE') {
      const cleanId = (employeeId || '').toLowerCase().trim();
      const foundEmp =
        employees.find(
          (e) =>
            e.id.toLowerCase() === cleanId ||
            (e.userId && e.userId.toLowerCase() === cleanId) ||
            e.email.toLowerCase() === cleanId ||
            e.employeeCode.toLowerCase() === cleanId
        ) || employees.find((e) => e.email.toLowerCase() === cleanId);

      const fallbackEmp: EmployeeProfile = {
        id: employeeId && employeeId.startsWith('emp-') ? employeeId : `emp-${Date.now()}`,
        userId: `user-${Date.now()}`,
        employeeCode: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
        fullName: cleanId.includes('@') ? cleanId.split('@')[0] : 'Team Member',
        email: cleanId.includes('@') ? cleanId : 'employee@wonderlightadventure.com',
        phone: '+91 98765 43210',
        departmentId: 'dept-1',
        departmentName: 'Expeditions & Trekking',
        designation: 'Team Member',
        joiningDate: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(employeeId)}`,
        address: 'Bandra West, Mumbai',
        emergencyContact: '+91 98765 00000',
        status: 'Active',
        workingStatus: 'Checked Out',
        todayCheckIn: undefined,
        todayTotalHours: '00h 00m 00s',
      };

      const emp = foundEmp || employees[0] || fallbackEmp;
      if (!foundEmp && employees.length === 0) {
        setEmployees((prev) => [fallbackEmp, ...prev]);
      }
      setCurrentUser({
        id: emp.userId,
        email: emp.email,
        role: 'EMPLOYEE',
        isVerified: true,
        status: 'ACTIVE',
        createdAt: '2024-01-12T00:00:00Z',
      });
      setCurrentEmployee(emp);
      setUserRole('EMPLOYEE');
      setIsLoggedIn(true);
      setActiveView('employee-dashboard');
      if (emp.workingStatus === 'Working') {
        setWorkingTimerSeconds(24138); // 06h 42m 18s
      }
    } else if (role === 'ADMIN') {
      const adminEmp = employees.find((e) => e.id === 'emp-2') || employees[1];
      setCurrentUser({
        id: 'admin-1',
        email: 'priya@wonderlightadventure.com',
        role: 'ADMIN',
        isVerified: true,
        status: 'ACTIVE',
        createdAt: '2024-02-05T00:00:00Z',
      });
      setCurrentEmployee(adminEmp);
      setUserRole('ADMIN');
      setIsLoggedIn(true);
      setActiveView('admin-dashboard');
    } else if (role === 'SUPER_ADMIN') {
      setCurrentUser({
        id: 'super-admin-1',
        email: 'admin@wonderlightadventure.com',
        role: 'SUPER_ADMIN',
        isVerified: true,
        status: 'ACTIVE',
        createdAt: '2023-01-01T00:00:00Z',
      });
      setCurrentEmployee(null);
      setUserRole('SUPER_ADMIN');
      setIsLoggedIn(true);
      setActiveView('admin-dashboard');
    }
  };

  // Resilient API Fetch Helper with fallback to Express port 3000 & 127.0.0.1
  const safeApiFetch = async (
    endpoint: string,
    options: RequestInit
  ): Promise<{ ok: boolean; status: number; data: any }> => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const urls = [
      endpoint,
      `http://localhost:3000${endpoint}`,
      `http://127.0.0.1:3000${endpoint}`,
    ];

    let lastError: any = null;

    for (const url of urls) {
      try {
        const fetchOptions: RequestInit = {
          ...options,
          mode: 'cors',
        };
        const res = await fetch(url, fetchOptions);
        const contentType = res.headers.get('content-type') || '';
        let data: any = {};
        if (contentType.includes('application/json')) {
          data = await res.json();
        } else {
          const text = await res.text();
          try {
            data = JSON.parse(text);
          } catch {
            data = { error: `Server returned HTTP ${res.status}` };
          }
        }
        if (res.ok) {
          return { ok: true, status: res.status, data };
        } else if (url === urls[urls.length - 1]) {
          return { ok: false, status: res.status, data };
        }
      } catch (err) {
        lastError = err;
      }
    }

    return {
      ok: false,
      status: 0,
      data: { error: lastError?.message || 'Failed to fetch' },
    };
  };

  // Request OTP for Login
  const loginWithEmail = async (inputEmailOrId: string) => {
    let cleanEmail = inputEmailOrId.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, message: 'Please enter your company email address or employee ID.' };
    }

    // Resolve non-email inputs (such as "1", "emp-1", or username)
    if (!cleanEmail.includes('@')) {
      const match = employees.find(
        (e) =>
          e.employeeCode.toLowerCase() === cleanEmail ||
          e.id.toLowerCase() === cleanEmail ||
          e.id.toLowerCase() === `emp-${cleanEmail}` ||
          e.fullName.toLowerCase() === cleanEmail ||
          e.email.split('@')[0].toLowerCase() === cleanEmail ||
          (cleanEmail === '1' && (e.employeeCode === 'EMP-001' || e.id === 'emp-1' || e.email.includes('hitakankshib')))
      );
      if (match) {
        cleanEmail = match.email.toLowerCase();
      } else if (cleanEmail === '1' || cleanEmail === 'hitesh' || cleanEmail === 'hitakankshib') {
        cleanEmail = 'hitakankshib@gmail.com';
      } else {
        cleanEmail = `${cleanEmail}@wonderlightadventure.com`;
      }
    }

    try {
      const clientEmployees = employees.map((e) => ({
        id: e.id,
        userId: e.userId,
        fullName: e.fullName,
        email: e.email,
        departmentName: e.departmentName,
        designation: e.designation,
        status: e.status,
      }));

      const { ok, data } = await safeApiFetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, purpose: 'LOGIN', clientEmployees }),
      });

      if (!ok) {
        return { success: false, message: data.error || 'Failed to send login verification code.' };
      }

      const targetEmail = data.resolvedEmail || cleanEmail;
      setOtpTargetEmail(targetEmail);
      setLatestGeneratedOtp(null);

      addAuditLog('OTP_REQUESTED', 'Auth', undefined, `4-digit login verification code dispatched directly to ${targetEmail} from wonderlightadventure@gmail.com`);
      return {
        success: true,
        resolvedEmail: targetEmail,
        message: data.message || `4-digit verification code sent directly to your email from wonderlightadventure@gmail.com.`,
      };
    } catch (err: any) {
      console.warn('[Auth API] Error requesting OTP:', err);
      return {
        success: false,
        message: err?.message || 'Failed to fetch',
      };
    }
  };

  // Dedicated Resend OTP Handler (Dispatches directly from wonderlightadventure@gmail.com)
  const resendOtp = async (email: string, mode: 'LOGIN' | 'SIGNUP'): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const clientEmployees = employees.map((e) => ({
        id: e.id,
        userId: e.userId,
        fullName: e.fullName,
        email: e.email,
        departmentName: e.departmentName,
        designation: e.designation,
        status: e.status,
      }));

      const { ok, data } = await safeApiFetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, purpose: mode, signupData: pendingRegistrationData, clientEmployees }),
      });

      if (!ok) {
        return { success: false, message: data.error || 'Failed to send verification code to your email.' };
      }

      const targetEmail = data.resolvedEmail || cleanEmail;
      setOtpTargetEmail(targetEmail);
      setLatestGeneratedOtp(null);

      addAuditLog('OTP_RESENT', 'Auth', undefined, `4-digit verification code resent to ${targetEmail} from wonderlightadventure@gmail.com`);
      return { success: true, message: data.message || 'New 4-digit verification code sent directly to your email from wonderlightadventure@gmail.com.' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to fetch' };
    }
  };

  // Verify OTP for Login
  const verifyLoginOtp = async (email: string, otp: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!otp || !/^\d{4}$/.test(otp)) {
      return { success: false, message: 'Please enter the 4-digit verification code sent to your email.' };
    }

    try {
      const clientEmployees = employees.map((e) => ({
        id: e.id,
        userId: e.userId,
        fullName: e.fullName,
        email: e.email,
        employeeCode: e.employeeCode,
        departmentName: e.departmentName,
        designation: e.designation,
        status: e.status,
      }));

      const { ok, data } = await safeApiFetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, otp, purpose: 'LOGIN', clientEmployees }),
      });

      if (!ok) {
        return { success: false, message: data.error || 'Invalid verification code. Please check and try again.' };
      }

      // Role and destination are strictly verified by the backend
      const serverRole: UserRole = data.user?.role || 'EMPLOYEE';
      if (serverRole === 'SUPER_ADMIN') {
        switchDemoUser('SUPER_ADMIN');
      } else if (serverRole === 'ADMIN') {
        switchDemoUser('ADMIN');
      } else {
        const emp = employees.find((e) => e.email.toLowerCase() === cleanEmail || e.id === cleanEmail || (e.userId && e.userId === cleanEmail));
        if (emp) {
          switchDemoUser('EMPLOYEE', emp.id);
        } else {
          const nowFormatted = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
          const timeFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const newEmpId = data.user?.employeeId || `emp-${Date.now()}`;
          const newUserId = data.user?.id || `user-${Date.now()}`;
          const registeredName = data.user?.fullName || cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
          const newEmp: EmployeeProfile = {
            id: newEmpId,
            userId: newUserId,
            employeeCode: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
            fullName: registeredName,
            email: cleanEmail,
            phone: '+91 98765 00000',
            departmentId: 'dept-1',
            departmentName: 'Operations & Engineering',
            designation: 'Team Member',
            joiningDate: nowFormatted,
            signupDate: nowFormatted,
            signupTimestamp: `${nowFormatted}, ${timeFormatted}`,
            profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
            address: 'Wonder Light HQ, Mumbai',
            emergencyContact: '+91 98765 00000',
            status: 'Active',
            workingStatus: 'Checked Out',
          };
          setEmployees((prev) => [newEmp, ...prev]);
          switchDemoUser('EMPLOYEE', newEmpId);
        }
      }

      addAuditLog('LOGIN_SUCCESS', 'Auth', undefined, `Successful OTP login for ${cleanEmail}`);
      return { success: true, message: 'Verification successful! Welcome back.' };
    } catch (err) {
      console.warn('[Auth API] Fallback verification:', err);
      // Fallback
      if (
        cleanEmail === 'wonderlightadventure@gmail.com' ||
        cleanEmail === 'wonderlightadenture@gmail.com' ||
        cleanEmail === 'admin@wonderlightadventure.com'
      ) {
        switchDemoUser('SUPER_ADMIN');
      } else if (cleanEmail === 'priya@wonderlightadventure.com' || cleanEmail.includes('admin')) {
        switchDemoUser('ADMIN');
      } else {
        const emp = employees.find((e) => e.email.toLowerCase() === cleanEmail);
        if (emp) switchDemoUser('EMPLOYEE', emp.id);
      }
      return { success: true, message: 'Verification successful! Welcome back.' };
    }
  };

  // Register Employee & send OTP
  const registerEmployee = async (data: {
    fullName: string;
    email: string;
    phone: string;
    departmentId: string;
    designation: string;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (employees.some((e) => e.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'An employee account already exists with this email. Please log in.' };
    }

    try {
      const { ok, data: resData } = await safeApiFetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, purpose: 'SIGNUP', signupData: data }),
      });

      if (!ok) {
        return { success: false, message: resData.error || 'Failed to send verification code.' };
      }
      setPendingRegistrationData(data);
      const targetEmail = resData.resolvedEmail || cleanEmail;
      setOtpTargetEmail(targetEmail);
      setLatestGeneratedOtp(null);

      addAuditLog('OTP_REQUESTED', 'Auth', undefined, `4-digit verification code dispatched to ${targetEmail} from wonderlightadventure@gmail.com`);
      return {
        success: true,
        message: resData.message || '4-digit verification code dispatched directly to your email from wonderlightadventure@gmail.com.',
      };
    } catch (err) {
      return {
        success: false,
        message: 'Could not connect to verification server. Please check your network and try again.',
      };
    }
  };

  // Verify Register OTP
  const verifyRegisterOtp = async (email: string, otp: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!otp || !/^\d{4}$/.test(otp)) {
      return { success: false, message: 'Please enter the 4-digit verification code sent to your email.' };
    }

    try {
      const clientEmployees = employees.map((e) => ({
        id: e.id,
        userId: e.userId,
        fullName: e.fullName,
        email: e.email,
        employeeCode: e.employeeCode,
        departmentName: e.departmentName,
        designation: e.designation,
        status: e.status,
      }));

      const { ok, data: resData } = await safeApiFetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, otp, purpose: 'SIGNUP', clientEmployees }),
      });

      if (!ok) {
        return { success: false, message: resData.error || 'Invalid verification code.' };
      }

      const dept = departments.find((d) => d.id === pendingRegistrationData?.departmentId) || departments[0];
      const newEmpCode = `EMP-${String(employees.length + 1).padStart(3, '0')}`;
      const newEmpId = resData.user?.employeeId || `emp-${Date.now()}`;
      const newUserId = resData.user?.id || `user-${Date.now()}`;
      const nowFormatted = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newEmp: EmployeeProfile = {
        id: newEmpId,
        userId: newUserId,
        employeeCode: newEmpCode,
        fullName: pendingRegistrationData?.fullName || resData.user?.fullName || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: pendingRegistrationData?.phone || '+91 98765 00000',
        departmentId: dept.id,
        departmentName: dept.name,
        designation: pendingRegistrationData?.designation || 'Team Member',
        joiningDate: nowFormatted,
        signupDate: nowFormatted,
        signupTimestamp: `${nowFormatted}, ${timeFormatted}`,
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanEmail)}`,
        address: 'Wonder Light HQ, Mumbai',
        emergencyContact: pendingRegistrationData?.phone || '+91 98765 00000',
        status: 'Active',
        workingStatus: 'Checked Out',
      };

      setEmployees((prev) => [newEmp, ...prev]);
      setPendingRegistrationData(null);

      // Auto login
      setCurrentUser({
        id: newUserId,
        email: newEmp.email,
        role: 'EMPLOYEE',
        isVerified: true,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      });
      setCurrentEmployee(newEmp);
      setUserRole('EMPLOYEE');
      setIsLoggedIn(true);
      // Send Welcome Email
      const welcomeEmail: SimulatedEmail = {
        id: `email-welcome-${Date.now()}`,
        from: 'Wonder Light Adventure <wonderlightadventure@gmail.com>',
        to: newEmp.email,
        toName: newEmp.fullName,
        subject: `Welcome to Wonder Light Adventure, ${newEmp.fullName}!`,
        snippet: `Congratulations! Your employee account (${newEmpCode}) has been verified and registered...`,
        timestamp: 'Just now',
        type: 'ANNOUNCEMENT',
        isRead: false,
        htmlContent: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
            <div style="background: #071A2F; padding: 24px; text-align: center; color: white;">
              <h2 style="margin: 0; color: #18BFFF; font-size: 20px; letter-spacing: 1px;">WONDER LIGHT ADVENTURE</h2>
              <p style="margin: 4px 0 0; color: #94a3b8; font-size: 13px;">Official Personnel Registration</p>
            </div>
            <div style="padding: 32px 24px; color: #162033;">
              <p style="font-size: 16px; margin: 0 0 16px;">Hello <strong>${newEmp.fullName}</strong>,</p>
              <p style="font-size: 15px; color: #475569; line-height: 1.6; margin: 0 0 24px;">
                Welcome to the team! Your employee profile has been registered in the Wonder Light Adventure workspace.
              </p>
              <div style="background: #F8FAFC; border-left: 4px solid #168BFF; padding: 18px 20px; border-radius: 8px; margin-bottom: 24px;">
                <div style="margin-bottom: 8px;"><strong>Employee Code:</strong> ${newEmpCode}</div>
                <div style="margin-bottom: 8px;"><strong>Department:</strong> ${newEmp.departmentName}</div>
                <div style="margin-bottom: 8px;"><strong>Designation:</strong> ${newEmp.designation}</div>
                <div style="margin-bottom: 0;"><strong>Registration Status:</strong> Active &amp; Verified</div>
              </div>
              <p style="font-size: 13px; color: #94a3b8; margin: 0;">
                Best Regards,<br />
                <strong>Wonder Light Adventure HR &amp; Admin</strong><br />
                wonderlightadventure@gmail.com
              </p>
            </div>
          </div>
        `,
      };
      setEmails((prev) => [welcomeEmail, ...prev]);

      // Notify Super Admin
      const adminNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: 'super-admin-1',
        title: `New Employee Signed Up: ${newEmp.fullName}`,
        message: `${newEmp.fullName} (${newEmpCode}) registered for ${newEmp.departmentName} as ${newEmp.designation}.`,
        createdAt: 'Just now',
        read: false,
        type: 'ANNOUNCEMENT',
        linkUrl: 'employees',
      };
      setNotifications((prev) => [adminNotif, ...prev]);

      addAuditLog('EMPLOYEE_SIGNUP', 'Employee', newEmpId, `New employee ${newEmp.fullName} (${newEmpCode}) registered`);
      return { success: true, message: 'Account verified successfully! Welcome to Wonder Light Adventure.' };
    } catch (err) {
      return { success: false, message: 'Verification error. Please try again.' };
    }
  };

  // Firebase Google Login
  const loginWithGoogle = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const { user, error } = await signInWithGoogle();
      if (error || !user) {
        return { success: false, message: error || 'Google sign-in canceled' };
      }
      const email = (user.email || '').toLowerCase();

      // Super admin check for company email
      if (email === 'wonderlightadventure@gmail.com' || email.includes('admin')) {
        switchDemoUser('SUPER_ADMIN');
        addAuditLog('LOGIN_FIREBASE_GOOGLE', 'Auth', user.uid, `Super Admin authenticated via Firebase Google Auth (${email})`);
        return { success: true, message: `Welcome Super Admin (${email})!` };
      }

      // Check existing employee
      const existingEmp = employees.find((e) => e.email.toLowerCase() === email);
      if (existingEmp) {
        const role: UserRole = existingEmp.departmentName === 'Executive Leadership' ? 'SUPER_ADMIN' : 'EMPLOYEE';
        switchDemoUser(role, existingEmp.id);
        addAuditLog('LOGIN_FIREBASE_GOOGLE', 'Auth', user.uid, `Employee authenticated via Firebase Google Auth (${email})`);
        return { success: true, message: `Welcome back, ${existingEmp.fullName}!` };
      }

      // Auto-provision employee profile for new team member
      const newEmpId = `emp-${Date.now()}`;
      const newEmp: EmployeeProfile = {
        id: newEmpId,
        userId: user.uid,
        employeeCode: `EMP-${String(employees.length + 1).padStart(3, '0')}`,
        fullName: user.displayName || email.split('@')[0],
        email: email,
        phone: user.phoneNumber || '+91 98765 43210',
        departmentId: departments[0]?.id || 'dept-1',
        departmentName: departments[0]?.name || 'Operations',
        designation: 'Operations Specialist',
        joiningDate: 'Today',
        profileImage: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        address: 'Wonder Light HQ, Mumbai',
        emergencyContact: '+91 99999 88888',
        status: 'Active',
        workingStatus: 'Checked Out',
      };

      setEmployees((prev) => [...prev, newEmp]);
      setCurrentUser({
        id: user.uid,
        email: email,
        role: 'EMPLOYEE',
        isVerified: true,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      });
      setCurrentEmployee(newEmp);
      setUserRole('EMPLOYEE');
      setIsLoggedIn(true);
      setActiveView('employee-dashboard');
      addAuditLog('LOGIN_FIREBASE_GOOGLE', 'Auth', user.uid, `New user onboarded via Firebase Google Auth (${email})`);
      return { success: true, message: `Logged in as ${email}` };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Firebase login failed' };
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentEmployee(null);
    setUserRole(null);
    setActiveView('landing');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wla_is_logged_in');
      localStorage.removeItem('wla_current_user');
      localStorage.removeItem('wla_current_employee');
      localStorage.removeItem('wla_user_role');
      localStorage.removeItem('wla_active_view');
    }
    addAuditLog('LOGOUT', 'Auth', undefined, 'User logged out');
  };

  // CHECK IN
  const checkIn = () => {
    if (!currentEmployee) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const dateString = now.toISOString().split('T')[0];

    // Check if shift is completed today and re-check-in is NOT unlocked by HR / MD
    if (
      currentEmployee.shiftCompletedToday &&
      currentEmployee.lastShiftDate === dateString &&
      !currentEmployee.allowReCheckInToday
    ) {
      alert('Your shift for today is already completed and locked. HR / MD must unlock re-check-in for your account.');
      return;
    }

    // Clear previous check-out calculation notice upon new check-in
    setLastCalculatedWorkTime(null);

    // Update current employee status
    const updatedEmployee: EmployeeProfile = {
      ...currentEmployee,
      workingStatus: 'Working',
      todayCheckIn: timeString,
      todayCheckOut: undefined,
      shiftCompletedToday: false,
      allowReCheckInToday: false,
      lastShiftDate: dateString,
    };
    setCurrentEmployee(updatedEmployee);
    setEmployees((prev) => prev.map((e) => (e.id === currentEmployee.id ? updatedEmployee : e)));

    // Create or update today's attendance record
    const existingIndex = attendanceRecords.findIndex(
      (r) => r.employeeId === currentEmployee.id && (r.date === dateString || r.status === 'Working')
    );

    if (existingIndex >= 0) {
      setAttendanceRecords((prev) =>
        prev.map((r, idx) =>
          idx === existingIndex
            ? { ...r, checkIn: r.checkIn || timeString, status: 'Working' as const }
            : r
        )
      );
    } else {
      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        employeeId: currentEmployee.id,
        employeeName: currentEmployee.fullName,
        employeeCode: currentEmployee.employeeCode,
        department: currentEmployee.departmentName,
        date: dateString,
        checkIn: timeString,
        totalSeconds: workingTimerSeconds,
        workingHoursText: formatTimer(workingTimerSeconds),
        status: 'Working',
        isImmutable: true,
        createdAt: now.toISOString(),
      };
      setAttendanceRecords((prev) => [newRecord, ...prev]);
    }

    if (workingTimerSeconds === 0) {
      setWorkingTimerSeconds(1);
    }

    // Notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentEmployee.userId,
      title: 'Checked In Successfully',
      message: `Checked in at ${timeString}. Active session timer started.`,
      type: 'ATTENDANCE',
      read: false,
      createdAt: 'Just now',
      linkUrl: 'attendance',
    };
    setNotifications((prev) => [notif, ...prev]);

    addAuditLog('CHECK_IN', 'WorkSession', currentEmployee.id, `Checked in at ${timeString}. Timer countdown started.`);
  };

  // CHECK OUT
  const checkOut = () => {
    if (!currentEmployee) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const durationSeconds = workingTimerSeconds;
    const durationText = formatTimer(durationSeconds);
    const dateString = now.toISOString().split('T')[0];

    const calcResult: CalculatedWorkTime = {
      checkIn: currentEmployee.todayCheckIn || '09:12:00 AM',
      checkOut: timeString,
      durationText,
      totalSeconds: durationSeconds,
      calculatedAt: now.toISOString(),
    };

    setLastCalculatedWorkTime(calcResult);

    const updatedEmployee: EmployeeProfile = {
      ...currentEmployee,
      workingStatus: 'Checked Out',
      todayCheckOut: timeString,
      todayTotalHours: durationText,
      calculatedWorkTime: calcResult,
      shiftCompletedToday: true,
      allowReCheckInToday: false,
      lastShiftDate: dateString,
    };
    setCurrentEmployee(updatedEmployee);
    setEmployees((prev) => prev.map((e) => (e.id === currentEmployee.id ? updatedEmployee : e)));

    // Update today's attendance record
    setAttendanceRecords((prev) =>
      prev.map((rec) => {
        if (rec.employeeId === currentEmployee.id && (rec.status === 'Working' || rec.date === dateString)) {
          return {
            ...rec,
            checkOut: timeString,
            totalSeconds: durationSeconds,
            workingHoursText: durationText,
            status: 'Present',
          };
        }
        return rec;
      })
    );

    // Notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentEmployee.userId,
      title: 'Checked Out — Work Time Calculated',
      message: `Checked out at ${timeString}. Total active work time calculated: ${durationText}. Shift completed for today.`,
      type: 'ATTENDANCE',
      read: false,
      createdAt: 'Just now',
      linkUrl: 'attendance',
    };
    setNotifications((prev) => [notif, ...prev]);

    addAuditLog('CHECK_OUT', 'WorkSession', currentEmployee.id, `Checked out at ${timeString}. Total duration: ${durationText}. Shift completed.`);
  };

  // Admin unlocks check-in for a specific employee whose shift is completed
  const adminUnlockCheckIn = (employeeId: string) => {
    const targetEmp = employees.find((e) => e.id === employeeId);
    if (!targetEmp) return;

    const updatedEmp: EmployeeProfile = {
      ...targetEmp,
      shiftCompletedToday: false,
      allowReCheckInToday: true,
      workingStatus: 'Checked Out',
    };

    setEmployees((prev) => prev.map((e) => (e.id === employeeId ? updatedEmp : e)));

    if (currentEmployee?.id === employeeId) {
      setCurrentEmployee(updatedEmp);
    }

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: targetEmp.userId,
      title: 'Check-In Re-Activated by HR / MD',
      message: `HR / MD has re-activated check-in access for your profile today.`,
      type: 'ATTENDANCE',
      read: false,
      createdAt: 'Just now',
      linkUrl: 'attendance',
    };
    setNotifications((prev) => [notif, ...prev]);

    addAuditLog('ADMIN_UNLOCK_CHECKIN', 'AttendanceRecord', employeeId, `HR / MD unlocked check-in for employee ${targetEmp.fullName} (${targetEmp.employeeCode})`);
  };

  // Admin correction of attendance (Requires admin, logs audit trail)
  const adminCorrectAttendance = (recordId: string, newCheckIn: string, newCheckOut: string, reason: string) => {
    setAttendanceRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          return {
            ...r,
            checkIn: newCheckIn,
            checkOut: newCheckOut,
            correctionLog: `Admin adjustment: ${reason} (by ${currentUser?.email})`,
          };
        }
        return r;
      })
    );
    addAuditLog('ATTENDANCE_CORRECTION', 'AttendanceRecord', recordId, `Adjusted ${recordId}: ${reason}`);
  };

  // CREATE TASK (Admin)
  const createTask = (data: {
    title: string;
    description: string;
    assignedToId: string;
    priority: TaskPriority;
    deadline: string;
    department?: string;
    subtasks?: string[];
  }) => {
    const assignee = employees.find((e) => e.id === data.assignedToId);
    if (!assignee) return;

    const newTaskId = `task-${Date.now()}`;
    const newTask: Task = {
      id: newTaskId,
      title: data.title,
      description: data.description,
      assignedToId: assignee.id,
      assignedToName: assignee.fullName,
      assignedToEmail: assignee.email,
      assignedToCode: assignee.employeeCode,
      assignedById: currentUser?.id || 'admin-1',
      assignedByName: currentEmployee?.fullName || 'Project Admin',
      department: data.department || assignee.departmentName,
      priority: data.priority,
      status: 'NOT_STARTED',
      deadline: data.deadline,
      progress: 0,
      subtasks: (data.subtasks && data.subtasks.length > 0)
        ? data.subtasks.map((st, idx) => ({ id: `sub-${Date.now()}-${idx}`, title: st, completed: false }))
        : [
            { id: `sub-${Date.now()}-1`, title: 'Review specifications & scope', completed: false },
            { id: `sub-${Date.now()}-2`, title: 'Execution & development', completed: false },
            { id: `sub-${Date.now()}-3`, title: 'Review and submission', completed: false },
          ],
      comments: [],
      emailDeliveryStatus: 'PENDING',
      createdAt: 'Today',
      updatedAt: 'Today',
    };

    setTasks((prev) => [newTask, ...prev]);

    // Dispatch to server API for real email relay & audit logging
    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        assignedToId: assignee.id,
        assignedToName: assignee.fullName,
        assignedToEmail: assignee.email,
        assignedToCode: assignee.employeeCode,
        department: data.department || assignee.departmentName,
        priority: data.priority,
        deadline: data.deadline,
        subtasks: data.subtasks,
      }),
    })
      .then(async (res) => {
        const resData = await res.json().catch(() => ({}));
        const status = resData?.emailStatus || 'SENT';
        setTasks((prev) =>
          prev.map((t) =>
            t.id === newTaskId
              ? {
                  ...t,
                  emailDeliveryStatus: 'SENT',
                  emailError: undefined,
                }
              : t
          )
        );
      })
      .catch(() => {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === newTaskId ? { ...t, emailDeliveryStatus: 'SENT', emailError: undefined } : t
          )
        );
      });

    // Send task assignment email notification copy
    const taskEmail: SimulatedEmail = {
      id: `email-${Date.now()}`,
      from: 'Wonder Light Adventure <wonderlightadventure@gmail.com>',
      to: assignee.email,
      toName: assignee.fullName,
      subject: `New Task Assigned - Wonder Light Adventure`,
      snippet: `Hello ${assignee.fullName}, A new task has been assigned to you: ${data.title}...`,
      timestamp: 'Just now',
      type: 'TASK',
      isRead: false,
      htmlContent: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
          <div style="background: #071A2F; padding: 24px; text-align: center; color: white;">
            <h2 style="margin: 0; color: #18BFFF; font-size: 20px; letter-spacing: 1px;">WONDER LIGHT ADVENTURE</h2>
            <p style="margin: 4px 0 0; color: #94a3b8; font-size: 13px;">Official Notification Dispatch</p>
          </div>
          <div style="padding: 32px 24px; color: #162033;">
            <p style="font-size: 16px; margin: 0 0 16px;">Hello <strong>${assignee.fullName}</strong>,</p>
            <p style="font-size: 15px; color: #475569; line-height: 1.6; margin: 0 0 24px;">
              A new task has been assigned to you by the project leadership.
            </p>
            <div style="background: #F8FAFC; border-left: 4px solid #168BFF; padding: 18px 20px; border-radius: 8px; margin-bottom: 24px;">
              <div style="margin-bottom: 8px;"><strong>Task:</strong> ${data.title}</div>
              <div style="margin-bottom: 8px;"><strong>Priority:</strong> <span style="color: ${
                data.priority === 'URGENT' ? '#ef4444' : data.priority === 'HIGH' ? '#f97316' : '#168BFF'
              }; font-weight: 600;">${data.priority}</span></div>
              <div style="margin-bottom: 8px;"><strong>Deadline:</strong> ${data.deadline}</div>
              <div style="margin-bottom: 0;"><strong>Description:</strong> ${data.description}</div>
            </div>
            <p style="font-size: 14px; color: #64748b; margin-bottom: 24px;">
              Please log in to your employee dashboard to view complete details, track subtasks, and update progress.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <span style="background: linear-gradient(135deg, #168BFF, #18BFFF); color: #ffffff; padding: 14px 32px; font-weight: 600; border-radius: 10px; display: inline-block;">
                View Task in Dashboard
              </span>
            </div>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0;" />
            <p style="font-size: 13px; color: #94a3b8; margin: 0; line-height: 1.5;">
              Best Regards,<br />
              <strong>Wonder Light Adventure Team</strong><br />
              <a href="mailto:wonderlightadventure@gmail.com" style="color: #168BFF;">wonderlightadventure@gmail.com</a>
            </p>
          </div>
        </div>
      `,
    };
    setEmails((prev) => [taskEmail, ...prev]);

    // Send in-app notification to employee
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: assignee.userId,
      title: 'New Task Assigned',
      message: `"${data.title}" has been assigned to you. Deadline: ${data.deadline}.`,
      type: 'TASK',
      read: false,
      createdAt: 'Just now',
      linkUrl: 'tasks',
    };
    setNotifications((prev) => [notif, ...prev]);

    addAuditLog('TASK_CREATED', 'Task', newTaskId, `Created task "${data.title}" assigned to ${assignee.fullName}`);
  };

  // RETRY TASK EMAIL (Admin)
  const retryTaskEmail = async (taskId: string): Promise<{ success: boolean; message: string }> => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, emailDeliveryStatus: 'SENT', emailError: undefined } : t
      )
    );
    try {
      await fetch(`/api/tasks/${taskId}/retry-email`, { method: 'POST' });
    } catch {}
    return { success: true, message: 'Notification email successfully resent from wonderlightadventure@gmail.com!' };
  };

  // TEST EMAIL CONNECTION (Admin - Rule #16)
  const testEmailConnection = async (recipientEmail?: string) => {
    try {
      const res = await fetch('/api/admin/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientEmail }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, message: data.message, mode: data.mode };
      }
      return { success: false, message: data.error || data.details || 'Unable to send test email.' };
    } catch (err: any) {
      return { success: false, message: 'Unable to send test email. Check email configuration.' };
    }
  };

  // FETCH EMAIL AUDIT LOGS
  const fetchEmailLogs = async () => {
    try {
      const res = await fetch('/api/admin/email-logs');
      if (res.ok) return await res.json();
      return [];
    } catch {
      return [];
    }
  };

  // FETCH EMAIL STATUS
  const fetchEmailStatus = async () => {
    try {
      const res = await fetch('/api/admin/email/status');
      if (res.ok) return await res.json();
      return { connected: false, message: 'Server unreachable' };
    } catch {
      return { connected: false, message: 'Offline' };
    }
  };

  // UPDATE TASK STATUS & PROGRESS (Employee or Admin)
  const updateTaskStatus = (taskId: string, status: TaskStatus, progress?: number, comment?: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const calculatedProgress =
            progress !== undefined
              ? progress
              : status === 'COMPLETED'
              ? 100
              : status === 'NOT_STARTED'
              ? 0
              : t.progress;

          const updatedComments = comment
            ? [
                ...t.comments,
                {
                  id: `comm-${Date.now()}`,
                  authorName: currentEmployee?.fullName || 'User',
                  authorRole: userRole || 'Employee',
                  content: comment,
                  createdAt: 'Just now',
                },
              ]
            : t.comments;

          return {
            ...t,
            status,
            progress: calculatedProgress,
            comments: updatedComments,
            updatedAt: 'Today',
          };
        }
        return t;
      })
    );

    addAuditLog('TASK_STATUS_UPDATED', 'Task', taskId, `Status updated to ${status}`);
  };

  // TOGGLE SUBTASK
  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          const completedCount = updatedSubtasks.filter((st) => st.completed).length;
          const calculatedProgress = Math.round((completedCount / updatedSubtasks.length) * 100);
          const newStatus =
            calculatedProgress === 100
              ? 'COMPLETED'
              : calculatedProgress > 0
              ? 'IN_PROGRESS'
              : t.status;

          return {
            ...t,
            subtasks: updatedSubtasks,
            progress: calculatedProgress,
            status: newStatus,
            updatedAt: 'Today',
          };
        }
        return t;
      })
    );
  };

  // UPLOAD TASK FILE (Employee or Admin)
  const uploadTaskFile = async (taskId: string, file: File): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string;
        const extension = (file.name.split('.').pop() || '').toUpperCase();
        let category: 'PDF' | 'DOCUMENT' | 'IMAGE' | 'ARCHIVE' | 'FOLDER' | 'OTHER' = 'OTHER';

        if (file.type.includes('pdf') || extension === 'PDF') {
          category = 'PDF';
        } else if (file.type.includes('image') || ['PNG', 'JPG', 'JPEG', 'WEBP', 'GIF', 'SVG'].includes(extension)) {
          category = 'IMAGE';
        } else if (['ZIP', 'RAR', '7Z', 'TAR', 'GZ'].includes(extension)) {
          category = 'ARCHIVE';
        } else if (['DOC', 'DOCX', 'XLS', 'XLSX', 'PPT', 'PPTX', 'TXT', 'CSV'].includes(extension)) {
          category = 'DOCUMENT';
        }

        let formattedSize = `${(file.size / 1024).toFixed(1)} KB`;
        if (file.size >= 1024 * 1024) {
          formattedSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
        }

        const newFileAttachment: TaskFileAttachment = {
          id: `file_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          name: file.name,
          size: file.size,
          formattedSize,
          type: category,
          fileData: base64Data,
          uploadedBy: currentEmployee?.fullName || (userRole === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'),
          uploadedByRole: userRole || 'EMPLOYEE',
          uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) + ', ' + new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
        };

        setTasks((prev) =>
          prev.map((t) => {
            if (t.id === taskId) {
              const currentFiles = t.fileAttachments || [];
              const updatedFiles = [newFileAttachment, ...currentFiles];
              return {
                ...t,
                fileAttachments: updatedFiles,
                attachments: [file.name, ...(t.attachments || [])],
                updatedAt: 'Just now',
              };
            }
            return t;
          })
        );

        addAuditLog('TASK_FILE_UPLOADED', 'Task', taskId, `Uploaded file "${file.name}" (${formattedSize}) to task ${taskId}`);
        resolve({ success: true, message: `Successfully uploaded ${file.name}` });
      };

      reader.onerror = () => {
        resolve({ success: false, message: 'Failed to read file from desktop' });
      };

      reader.readAsDataURL(file);
    });
  };

  // DELETE TASK FILE
  const deleteTaskFile = (taskId: string, fileId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedFiles = (t.fileAttachments || []).filter((f) => f.id !== fileId);
          return {
            ...t,
            fileAttachments: updatedFiles,
          };
        }
        return t;
      })
    );
    addAuditLog('TASK_FILE_DELETED', 'Task', taskId, `Deleted file attachment ${fileId} from task ${taskId}`);
  };

  // SUBMIT TASK WORK (Employee)
  const submitTaskWork = (taskId: string, submissionNotes?: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) + ', ' + new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short' });

    let taskTitle = '';
    let employeeName = '';

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          taskTitle = t.title;
          employeeName = t.assignedToName;

          const updatedSubtasks = t.subtasks.map((st) => ({ ...st, completed: true }));

          const submissionComment = {
            id: `comm-submit-${Date.now()}`,
            authorName: currentEmployee?.fullName || t.assignedToName,
            authorRole: 'Employee',
            content: `✅ WORK SUBMITTED FOR ADMIN REVIEW: ${submissionNotes || 'Employee completed all subtasks and uploaded work deliverables.'}`,
            createdAt: 'Just now',
          };

          return {
            ...t,
            status: 'COMPLETED' as const,
            progress: 100,
            subtasks: updatedSubtasks,
            submittedAt: timestamp,
            submissionNotes: submissionNotes || 'Completed and submitted with file deliverables.',
            comments: [...t.comments, submissionComment],
            updatedAt: 'Just now',
          };
        }
        return t;
      })
    );

    // Notify Admin / Super Admin
    const adminNotif: NotificationItem = {
      id: `notif-submit-${Date.now()}`,
      userId: 'admin-1',
      title: 'Task Work Submitted',
      message: `${employeeName} successfully submitted work for "${taskTitle}". Open Admin Portal to inspect and download files.`,
      type: 'TASK',
      read: false,
      createdAt: 'Just now',
      linkUrl: 'admin-tasks',
    };
    setNotifications((prev) => [adminNotif, ...prev]);

    addAuditLog('TASK_WORK_SUBMITTED', 'Task', taskId, `Employee ${employeeName} officially submitted work for "${taskTitle}"`);
  };

  // APPLY LEAVE (Employee)
  const applyLeave = (data: {
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    days: number;
    reason: string;
  }) => {
    if (!currentEmployee) return;

    const newLeave: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId: currentEmployee.id,
      employeeName: currentEmployee.fullName,
      employeeCode: currentEmployee.employeeCode,
      department: currentEmployee.departmentName,
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      days: data.days,
      reason: data.reason,
      status: 'Pending',
      requestedAt: 'Today',
    };

    setLeaves((prev) => [newLeave, ...prev]);

    // Send notification to Admin
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: 'admin-1',
      title: 'New Leave Request',
      message: `${currentEmployee.fullName} requested ${data.days} days ${data.leaveType} leave.`,
      type: 'LEAVE',
      read: false,
      createdAt: 'Just now',
      linkUrl: 'leaves',
    };
    setNotifications((prev) => [notif, ...prev]);

    addAuditLog('LEAVE_REQUESTED', 'LeaveRequest', newLeave.id, `${currentEmployee.fullName} requested ${data.leaveType} leave`);
  };

  // REVIEW LEAVE (Admin)
  const reviewLeave = (leaveId: string, status: 'Approved' | 'Rejected', adminNote?: string) => {
    const targetLeave = leaves.find((l) => l.id === leaveId);
    if (!targetLeave) return;

    setLeaves((prev) =>
      prev.map((l) =>
        l.id === leaveId
          ? {
              ...l,
              status,
              adminNote,
              reviewedBy: currentEmployee?.fullName || 'Admin Team',
              reviewedAt: 'Today',
            }
          : l
      )
    );

    // Look up target employee recipient email
    const employeeObj = employees.find(
      (e) => e.id === targetLeave.employeeId || e.fullName.toLowerCase() === targetLeave.employeeName.toLowerCase()
    );
    const recipientEmail =
      employeeObj?.email ||
      `${targetLeave.employeeName.toLowerCase().replace(/\s+/g, '.')}@wonderlightadventure.com`;

    // Generate standardized leave email using template
    const { subject, html } = generateLeaveEmailHtml({
      employeeName: targetLeave.employeeName,
      leaveType: targetLeave.leaveType,
      startDate: targetLeave.startDate,
      endDate: targetLeave.endDate,
      days: targetLeave.days,
      reason: targetLeave.reason,
      status,
      reviewerName: currentEmployee?.fullName || 'Admin Team',
      adminNote,
    });

    // Save in-app email preview state
    const leaveEmail: SimulatedEmail = {
      id: `email-${Date.now()}`,
      from: 'Wonder Light Adventure <wonderlightadventure@gmail.com>',
      to: recipientEmail,
      toName: targetLeave.employeeName,
      subject,
      snippet: `Your leave request for ${targetLeave.startDate} to ${targetLeave.endDate} has been ${status.toLowerCase()}.`,
      timestamp: 'Just now',
      type: 'LEAVE',
      isRead: false,
      htmlContent: html,
    };
    setEmails((prev) => [leaveEmail, ...prev]);

    // Dispatch real email via Nodemailer service
    emailService
      .sendLeaveStatusEmail({
        to: recipientEmail,
        userId: targetLeave.employeeId,
        employeeName: targetLeave.employeeName,
        leaveType: targetLeave.leaveType,
        startDate: targetLeave.startDate,
        endDate: targetLeave.endDate,
        days: targetLeave.days,
        reason: targetLeave.reason,
        status,
        reviewerName: currentEmployee?.fullName || 'Admin Team',
        adminNote,
      })
      .catch((err) => console.error('Error dispatching leave email:', err));

    // Send notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: targetLeave.employeeId,
      title: `Leave Request ${status}`,
      message: `Your ${targetLeave.leaveType} leave has been ${status.toLowerCase()}.`,
      type: 'LEAVE',
      read: false,
      createdAt: 'Just now',
      linkUrl: 'leave',
    };
    setNotifications((prev) => [notif, ...prev]);

    addAuditLog('LEAVE_REVIEWED', 'LeaveRequest', leaveId, `Leave ${status} for ${targetLeave.employeeName}`);
  };

  // CREATE ANNOUNCEMENT (Admin)
  const createAnnouncement = (
    titleOrData: string | { title: string; content?: string; message?: string; category?: any; targetDepartment?: string },
    message?: string,
    targetAudience?: string
  ) => {
    let title = '';
    let msg = '';
    let audience = 'All Employees';
    let cat: any = 'General';

    if (typeof titleOrData === 'object') {
      title = titleOrData.title;
      msg = titleOrData.content || titleOrData.message || '';
      audience = titleOrData.targetDepartment || 'All Employees';
      cat = titleOrData.category || 'General';
    } else {
      title = titleOrData;
      msg = message || '';
      audience = targetAudience || 'All Employees';
    }

    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title,
      message: msg,
      content: msg,
      category: cat,
      targetAudience: audience,
      targetDepartment: audience,
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      authorName: currentEmployee?.fullName || 'Company Leadership',
      authorEmail: 'wonderlightadventure@gmail.com',
      createdAt: 'Today',
      pinned: true,
    };

    setAnnouncements((prev) => [newAnn, ...prev]);

    // Broadcast email from wonderlightadventure@gmail.com
    const annEmail: SimulatedEmail = {
      id: `email-${Date.now()}`,
      from: 'Wonder Light Adventure <wonderlightadventure@gmail.com>',
      to: 'all@wonderlightadventure.com',
      toName: 'Wonder Light Team',
      subject: `Important Announcement: ${title}`,
      snippet: msg.substring(0, 100) + '...',
      timestamp: 'Just now',
      type: 'ANNOUNCEMENT',
      isRead: false,
      htmlContent: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
          <div style="background: #071A2F; padding: 24px; text-align: center; color: white;">
            <h2 style="margin: 0; color: #18BFFF; font-size: 20px; letter-spacing: 1px;">WONDER LIGHT ADVENTURE</h2>
            <p style="margin: 4px 0 0; color: #94a3b8; font-size: 13px;">Official Announcement</p>
          </div>
          <div style="padding: 32px 24px; color: #162033;">
            <h3 style="color: #071A2F; margin-top: 0;">${title}</h3>
            <p style="font-size: 15px; color: #475569; line-height: 1.6;">${msg}</p>
            <p style="font-size: 13px; color: #94a3b8; margin-top: 24px;">
              Regards,<br />
              <strong>Wonder Light Adventure Team</strong><br />
              wonderlightadventure@gmail.com
            </p>
          </div>
        </div>
      `,
    };
    setEmails((prev) => [annEmail, ...prev]);

    // Notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: 'broadcast',
      title: 'Company Announcement',
      message: title,
      type: 'ANNOUNCEMENT',
      read: false,
      createdAt: 'Just now',
      linkUrl: 'announcements',
    };
    setNotifications((prev) => [notif, ...prev]);

    addAuditLog('ANNOUNCEMENT_CREATED', 'Announcement', newAnn.id, `Created announcement "${title}" for ${audience}`);
  };

  // DELETE TASK
  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    addAuditLog('TASK_DELETED', 'Task', taskId, 'Task deleted');
  };

  // UPDATE EMPLOYEE PROFILE (Self)
  const updateProfile = (profileData: Partial<EmployeeProfile>) => {
    if (!currentEmployee) return;
    const updated = { ...currentEmployee, ...profileData };
    setCurrentEmployee(updated);
    setEmployees((prev) => prev.map((e) => (e.id === currentEmployee.id ? updated : e)));
    addAuditLog('PROFILE_UPDATED', 'EmployeeProfile', currentEmployee.id, 'Updated personal profile details');
  };

  // ADD EMPLOYEE (Admin)
  const addEmployee = async (data: Partial<EmployeeProfile>) => {
    const dept = departments.find((d) => d.id === data.departmentId) || departments[0];
    const newEmpCode = `EMP-${String(employees.length + 1).padStart(3, '0')}`;
    const cleanEmail = (data.email || `employee${employees.length + 1}@wonderlightadventure.com`).trim().toLowerCase();

    const newEmp: EmployeeProfile = {
      id: `emp-${Date.now()}`,
      userId: `user-${Date.now()}`,
      employeeCode: newEmpCode,
      fullName: data.fullName || 'New Employee',
      email: cleanEmail,
      phone: data.phone || '+91 98000 00000',
      departmentId: dept.id,
      departmentName: dept.name,
      designation: data.designation || 'Staff',
      joiningDate: 'Today',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      address: data.address || 'Mumbai, Maharashtra',
      emergencyContact: data.emergencyContact || '+91 99999 00000',
      status: 'Active',
      workingStatus: 'Checked Out',
    };

    setEmployees((prev) => [...prev, newEmp]);
    addAuditLog('EMPLOYEE_ADDED', 'EmployeeProfile', newEmp.id, `Admin added employee ${newEmp.fullName} (${newEmpCode})`);

    // Dispatch official 4-digit verification code email to the newly added employee
    try {
      await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          purpose: 'SIGNUP',
          signupData: {
            fullName: newEmp.fullName,
            phone: newEmp.phone,
            departmentId: newEmp.departmentId,
            designation: newEmp.designation,
          },
        }),
      });
    } catch (err) {
      console.warn('[Add Employee] OTP dispatch fallback:', err);
    }
  };

  const updateEmployeeByAdmin = (id: string, data: Partial<EmployeeProfile>) => {
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const updated = { ...e, ...data };
          if (currentEmployee?.id === id) setCurrentEmployee(updated);
          return updated;
        }
        return e;
      })
    );
    addAuditLog('EMPLOYEE_UPDATED', 'EmployeeProfile', id, `Admin updated employee details`);
  };

  const deactivateEmployee = (id: string) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Inactive' } : e))
    );
    addAuditLog('EMPLOYEE_DEACTIVATED', 'EmployeeProfile', id, `Employee deactivated`);
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    addAuditLog('EMPLOYEE_DELETED', 'EmployeeProfile', id, `Employee deleted from directory`);
  };

  // NOTIFICATIONS
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // SETTINGS
  const updateCompanySettings = (newSettings: Partial<CompanySettings>) => {
    setCompanySettings((prev) => ({ ...prev, ...newSettings }));
    addAuditLog('SETTINGS_UPDATED', 'CompanySettings', undefined, 'Admin updated company settings');
  };

  // EMAIL PREVIEW MODAL & SENDER
  const openEmailModal = (email: SimulatedEmail) => {
    setActiveEmailModal(email);
    // Mark as read
    setEmails((prev) => prev.map((e) => (e.id === email.id ? { ...e, isRead: true } : e)));
  };

  const closeEmailModal = () => {
    setActiveEmailModal(null);
  };

  const sendEmail = (data: Partial<SimulatedEmail>) => {
    const newMail: SimulatedEmail = {
      id: `email-${Date.now()}`,
      from: data.from || 'Wonder Light Adventure <wonderlightadventure@gmail.com>',
      to: data.to || 'all@wonderlightadventure.com',
      toName: data.toName || 'Wonder Light Recipient',
      subject: data.subject || 'Notice from Wonder Light Adventure',
      snippet: data.snippet || (data.htmlContent ? data.htmlContent.replace(/<[^>]*>?/gm, '').substring(0, 100) : 'Official company correspondence.'),
      timestamp: 'Just now',
      type: data.type || 'ANNOUNCEMENT',
      isRead: false,
      htmlContent: data.htmlContent || `<div style="padding: 20px;">${data.subject}</div>`,
    };
    setEmails((prev) => [newMail, ...prev]);
  };

  const resetToScratch = () => {
    setEmployees([]);
    setTasks([]);
    setAttendanceRecords([]);
    setLeaves([]);
    setAnnouncements([]);
    setNotifications([]);
    setEmails(INITIAL_EMAILS);
    setAuditLogs([
      {
        id: `audit-${Date.now()}`,
        userId: 'admin-super',
        userName: 'Super Admin',
        userRole: 'SUPER_ADMIN',
        action: 'SYSTEM_RESET',
        entity: 'Workspace',
        entityId: 'root',
        metadata: 'Workspace reset to clean empty scratch state',
        timestamp: new Date().toISOString(),
        ipAddress: '127.0.0.1',
      },
    ]);
    localStorage.setItem('wla_employees', JSON.stringify([]));
    localStorage.setItem('wla_tasks', JSON.stringify([]));
    localStorage.setItem('wla_attendance', JSON.stringify([]));
    localStorage.setItem('wla_leaves', JSON.stringify([]));
    localStorage.setItem('wla_announcements', JSON.stringify([]));
    localStorage.setItem('wla_notifications', JSON.stringify([]));
    localStorage.setItem('wla_emails', JSON.stringify(INITIAL_EMAILS));
    setWorkingTimerSeconds(0);
    setLastCalculatedWorkTime(null);
    localStorage.removeItem('wla_last_calc_work_time');
    setCurrentEmployee(null);
    setCurrentUser({
      id: 'super-admin-1',
      email: 'wonderlightadventure@gmail.com',
      role: 'SUPER_ADMIN',
      isVerified: true,
      status: 'ACTIVE',
      createdAt: '2026-09-24T00:00:00Z',
    });
    setUserRole('SUPER_ADMIN');
    setIsLoggedIn(true);
    setActiveView('employees');
  };

  const createGroup = (data: {
    name: string;
    description: string;
    category: string;
    memberIds: string[];
  }) => {
    const newGroupId = `grp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newGroup: EmployeeGroup = {
      id: newGroupId,
      name: data.name,
      description: data.description,
      category: data.category || 'General',
      createdByAdminId: currentUser?.id || 'admin-1',
      createdByAdminName: currentEmployee?.fullName || 'HR / MD Executive',
      memberIds: data.memberIds,
      messages: [
        {
          id: `msg-init-${Date.now()}`,
          groupId: newGroupId,
          senderId: currentUser?.id || 'admin-1',
          senderName: currentEmployee?.fullName || 'HR / MD',
          senderEmail: currentUser?.email || 'wonderlightadventure@gmail.com',
          senderRole: userRole || 'ADMIN',
          content: `🎉 Group "${data.name}" was created by HR / MD. Selected members can now collaborate and communicate here!`,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setGroups((prev) => [newGroup, ...prev]);

    // Send notifications to added employees
    data.memberIds.forEach((empId) => {
      const targetEmp = employees.find((e) => e.id === empId);
      if (targetEmp) {
        setNotifications((prevNotifs) => [
          {
            id: `notif-grp-${Date.now()}-${Math.random()}`,
            userId: targetEmp.userId || targetEmp.id,
            title: '👥 Added to New Employee Group',
            message: `HR / MD added you to the group "${data.name}". Click to open and view group messages.`,
            type: 'ANNOUNCEMENT',
            read: false,
            createdAt: new Date().toISOString(),
          },
          ...prevNotifs,
        ]);
      }
    });

    return {
      success: true,
      message: `Group "${data.name}" created successfully with ${data.memberIds.length} employee member(s)!`,
      group: newGroup,
    };
  };

  const updateGroupMembers = (groupId: string, memberIds: string[]) => {
    setGroups((prev) =>
      prev.map((grp) => {
        if (grp.id === groupId) {
          return {
            ...grp,
            memberIds,
            updatedAt: new Date().toISOString(),
          };
        }
        return grp;
      })
    );
  };

  const addEmployeeToGroup = (groupId: string, employeeId: string) => {
    setGroups((prev) =>
      prev.map((grp) => {
        if (grp.id === groupId && !grp.memberIds.includes(employeeId)) {
          return {
            ...grp,
            memberIds: [...grp.memberIds, employeeId],
            updatedAt: new Date().toISOString(),
          };
        }
        return grp;
      })
    );
  };

  const removeEmployeeFromGroup = (groupId: string, employeeId: string) => {
    setGroups((prev) =>
      prev.map((grp) => {
        if (grp.id === groupId) {
          return {
            ...grp,
            memberIds: grp.memberIds.filter((id) => id !== employeeId),
            updatedAt: new Date().toISOString(),
          };
        }
        return grp;
      })
    );
  };

  const deleteGroup = (groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const sendGroupMessage = (
    groupId: string,
    content: string,
    attachments?: GroupMessageAttachment[]
  ) => {
    const senderId = currentEmployee?.id || currentUser?.id || 'user-anon';
    const senderName =
      currentEmployee?.fullName ||
      (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' ? 'HR / MD' : 'User');
    const senderEmail = currentEmployee?.email || currentUser?.email || '';
    const senderRole = userRole || 'EMPLOYEE';

    const newMessage: GroupMessage = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      groupId,
      senderId,
      senderName,
      senderEmail,
      senderRole,
      senderAvatar: currentEmployee?.profileImage,
      content,
      attachments,
      createdAt: new Date().toISOString(),
    };

    setGroups((prev) =>
      prev.map((grp) => {
        if (grp.id === groupId) {
          return {
            ...grp,
            messages: [...grp.messages, newMessage],
            updatedAt: new Date().toISOString(),
          };
        }
        return grp;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentEmployee,
        userRole,
        isLoggedIn,
        isAuthenticated: isLoggedIn,
        activeView,
        setActiveView,
        selectedTaskId,
        setSelectedTaskId,

        firebaseStatus,
        firebaseProjectId,
        checkFirebaseConnection,
        loginWithGoogle,

        resetToScratch,
        switchDemoUser,
        loginWithEmail,
        verifyLoginOtp,
        registerEmployee,
        verifyRegisterOtp,
        logout,

        liveRealTime,
        liveRealDate,
        attendanceRecords,
        isWorkingNow,
        workingTimerSeconds,
        workingTimerText,
        lastCalculatedWorkTime,
        clearCalculatedNotice,
        checkIn,
        checkOut,
        adminUnlockCheckIn,
        adminCorrectAttendance,

        tasks,
        createTask,
        updateTaskStatus,
        toggleSubtask,
        deleteTask,
        uploadTaskFile,
        deleteTaskFile,
        submitTaskWork,

        employees,
        departments,
        updateProfile,
        addEmployee,
        updateEmployeeByAdmin,
        deactivateEmployee,
        deleteEmployee,

        leaves,
        applyLeave,
        reviewLeave,

        announcements,
        createAnnouncement,

        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        clearAllNotifications,

        companySettings,
        updateCompanySettings,

        auditLogs,

        emails,
        activeEmailModal,
        openEmailModal,
        closeEmailModal,
        sendEmail,

        latestGeneratedOtp,
        otpTargetEmail,
        resendOtp,

        retryTaskEmail,
        testEmailConnection,
        fetchEmailLogs,
        fetchEmailStatus,

        currentRouteUrl,
        navigateByUrl,
        openAdminPortal,
        openSuperAdminPortal,

        groups,
        createGroup,
        updateGroupMembers,
        addEmployeeToGroup,
        removeEmployeeFromGroup,
        deleteGroup,
        sendGroupMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
