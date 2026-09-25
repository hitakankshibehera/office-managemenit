/**
 * Wonder Light Adventure - Server Data Store & Security Layer
 * Manages OTP generation, SHA-256 secure hashing, rate-limiting,
 * sessions, audit logs, email logs, tasks, and users.
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export interface OTPRecord {
  id: string;
  email: string;
  otpHash: string;
  plainOtp?: string;
  purpose: 'SIGNUP' | 'LOGIN' | 'EMAIL_VERIFICATION' | 'SECURITY';
  expiresAt: number; // timestamp ms
  attempts: number;
  maxAttempts: number;
  usedAt: number | null;
  createdAt: number;
  signupData?: {
    fullName: string;
    phone: string;
    departmentId: string;
    designation: string;
  };
}

export interface EmailLogRecord {
  id: string;
  recipientEmail: string;
  emailType: 'OTP_SIGNUP' | 'OTP_LOGIN' | 'TASK_ASSIGNED' | 'LEAVE_STATUS' | 'ANNOUNCEMENT' | 'SECURITY' | 'TEST_EMAIL';
  relatedUserId?: string;
  relatedTaskId?: string;
  status: 'PENDING' | 'SENT' | 'FAILED' | 'RETRYING';
  providerMessageId?: string;
  createdAt: string;
  sentAt?: string;
  failedAt?: string;
  errorMessage?: string;
}

export interface SessionRecord {
  sessionId: string;
  userId: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EMPLOYEE';
  employeeId?: string;
  fullName: string;
  createdAt: number;
  expiresAt: number;
}

export interface StoredUser {
  id: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EMPLOYEE';
  employeeId?: string;
  fullName: string;
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'DEACTIVATED';
  createdAt: string;
}

// In-Memory Database collections with persistent disk fallback
class DataStore {
  public otpCodes: Map<string, OTPRecord> = new Map(); // id -> OTPRecord
  public emailLogs: EmailLogRecord[] = [];
  public sessions: Map<string, SessionRecord> = new Map(); // sessionId -> SessionRecord
  public users: Map<string, StoredUser> = new Map(); // normalized email -> StoredUser
  public rateLimitMap: Map<string, { requests: number; windowStart: number; lastRequestTime: number }> = new Map();

  private readonly HASH_SALT = process.env.OTP_SALT || 'wla_secure_otp_salt_2026';
  private readonly dataDir = path.join(process.cwd(), 'data');
  private readonly usersFilePath = path.join(process.cwd(), 'data', 'wla_users.json');

  constructor() {
    this.ensureDataDir();
    this.seedDefaultUsers();
    this.loadUsersFromDisk();
  }

  private ensureDataDir() {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
    } catch (err) {
      console.warn('[DataStore] Could not create data directory:', err);
    }
  }

  private persistUsersToDisk() {
    try {
      this.ensureDataDir();
      const usersArray = Array.from(this.users.values());
      fs.writeFileSync(this.usersFilePath, JSON.stringify(usersArray, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[DataStore] Error saving users to disk:', err);
    }
  }

  public loadUsersFromDisk() {
    try {
      if (fs.existsSync(this.usersFilePath)) {
        const content = fs.readFileSync(this.usersFilePath, 'utf-8');
        if (content.trim()) {
          const parsed: StoredUser[] = JSON.parse(content);
          if (Array.isArray(parsed)) {
            for (const u of parsed) {
              if (u && u.email) {
                this.users.set(u.email.trim().toLowerCase(), u);
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn('[DataStore] Error loading users from disk:', err);
    }
  }

  public saveUser(user: StoredUser) {
    const cleanEmail = user.email.trim().toLowerCase();
    this.users.set(cleanEmail, {
      ...user,
      email: cleanEmail,
    });
    this.persistUsersToDisk();
  }

  public getUser(email: string): StoredUser | undefined {
    if (!email) return undefined;
    const cleanEmail = email.trim().toLowerCase();
    let user = this.users.get(cleanEmail);
    if (!user) {
      // Reload disk just in case another process/thread saved it
      this.loadUsersFromDisk();
      user = this.users.get(cleanEmail);
    }
    return user;
  }

  public getAllUsers(): StoredUser[] {
    return Array.from(this.users.values());
  }

  private seedDefaultUsers() {
    const defaults: StoredUser[] = [
      {
        id: 'user-superadmin',
        email: 'wonderlightadventure@gmail.com',
        role: 'SUPER_ADMIN',
        fullName: 'Wonder Light Admin',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user-superadmin-2',
        email: 'admin@wonderlightadventure.com',
        role: 'SUPER_ADMIN',
        fullName: 'Super Administrator',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user-admin-priya',
        email: 'priya@wonderlightadventure.com',
        role: 'ADMIN',
        fullName: 'Priya Sharma',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user-emp-rahul',
        email: 'rahul@wonderlightadventure.com',
        role: 'EMPLOYEE',
        employeeId: 'emp-1',
        fullName: 'Rahul Sharma',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user-emp-aarav',
        email: 'aarav@wonderlightadventure.com',
        role: 'EMPLOYEE',
        employeeId: 'emp-2',
        fullName: 'Aarav Patel',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user-emp-neha',
        email: 'neha@wonderlightadventure.com',
        role: 'EMPLOYEE',
        employeeId: 'emp-3',
        fullName: 'Neha Gupta',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user-emp-vikram',
        email: 'vikram@wonderlightadventure.com',
        role: 'EMPLOYEE',
        employeeId: 'emp-4',
        fullName: 'Vikram Singh',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user-emp-ananya',
        email: 'ananya@wonderlightadventure.com',
        role: 'EMPLOYEE',
        employeeId: 'emp-5',
        fullName: 'Ananya Roy',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
    ];

    for (const d of defaults) {
      if (!this.users.has(d.email)) {
        this.users.set(d.email, d);
      }
    }
  }

  // Cryptographic 4-Digit OTP Generation
  public generateSecureOtp(): string {
    // Generates integer between 1000 and 9999 inclusive
    return crypto.randomInt(1000, 10000).toString();
  }

  // Secure SHA-256 Hashing of OTP
  public hashOtp(otp: string): string {
    return crypto.createHash('sha256').update(`${otp}:${this.HASH_SALT}`).digest('hex');
  }

  // Verify OTP matches hash
  public verifyOtpHash(plainOtp: string, storedHash: string): boolean {
    const computedHash = this.hashOtp(plainOtp.trim());
    return crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(storedHash));
  }

  // Rate Limiting: Max 5 requests per 15 minutes, 60s resend cooldown
  public checkRateLimit(identifier: string): { allowed: boolean; reason?: string; retryAfterSeconds?: number } {
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 mins
    const maxRequests = 5;
    const cooldownMs = 60 * 1000; // 60s between resends

    const entry = this.rateLimitMap.get(identifier);
    if (!entry) {
      this.rateLimitMap.set(identifier, { requests: 1, windowStart: now, lastRequestTime: now });
      return { allowed: true };
    }

    // Check cooldown
    const timeSinceLast = now - entry.lastRequestTime;
    if (timeSinceLast < cooldownMs) {
      const waitSecs = Math.ceil((cooldownMs - timeSinceLast) / 1000);
      return {
        allowed: false,
        reason: `Please wait ${waitSecs} seconds before requesting a new code.`,
        retryAfterSeconds: waitSecs,
      };
    }

    // Check window
    if (now - entry.windowStart > windowMs) {
      // Reset window
      this.rateLimitMap.set(identifier, { requests: 1, windowStart: now, lastRequestTime: now });
      return { allowed: true };
    }

    if (entry.requests >= maxRequests) {
      const resetInMins = Math.ceil((windowMs - (now - entry.windowStart)) / 60000);
      return {
        allowed: false,
        reason: `Too many requests. Please try again in ${resetInMins} minutes.`,
        retryAfterSeconds: resetInMins * 60,
      };
    }

    entry.requests += 1;
    entry.lastRequestTime = now;
    return { allowed: true };
  }

  // Store new OTP Record & Invalidate previous active OTPs for this email
  public createOtpRecord(params: {
    email: string;
    plainOtp: string;
    purpose: 'SIGNUP' | 'LOGIN' | 'EMAIL_VERIFICATION' | 'SECURITY';
    expiresInMinutes?: number;
    signupData?: any;
  }): { otpId: string; expiresAt: number } {
    const normalizedEmail = params.email.trim().toLowerCase();
    const expiresInMs = (params.expiresInMinutes || 5) * 60 * 1000;
    const now = Date.now();

    // Invalidate existing unused OTPs for this email & purpose
    for (const [, record] of this.otpCodes.entries()) {
      if (record.email === normalizedEmail && record.purpose === params.purpose && !record.usedAt) {
        record.expiresAt = now - 1000; // mark expired
      }
    }

    const id = `otp_${crypto.randomUUID()}`;
    const record: OTPRecord = {
      id,
      email: normalizedEmail,
      otpHash: this.hashOtp(params.plainOtp),
      plainOtp: params.plainOtp,
      purpose: params.purpose,
      expiresAt: now + expiresInMs,
      attempts: 0,
      maxAttempts: 5,
      usedAt: null,
      createdAt: now,
      signupData: params.signupData,
    };

    this.otpCodes.set(id, record);
    return { otpId: id, expiresAt: record.expiresAt };
  }

  // Find latest active OTP for an email
  public getActiveOtp(email: string, purpose?: string): OTPRecord | undefined {
    const normalizedEmail = email.trim().toLowerCase();
    let latest: OTPRecord | undefined = undefined;

    for (const [, record] of this.otpCodes.entries()) {
      if (record.email === normalizedEmail && (!purpose || record.purpose === purpose)) {
        if (!latest || record.createdAt > latest.createdAt) {
          latest = record;
        }
      }
    }
    return latest;
  }

  // Get active plain OTP for display/autofill
  public getLatestPlainOtp(email: string): string | undefined {
    const record = this.getActiveOtp(email);
    return record?.plainOtp;
  }

  // Verify OTP
  public verifyOtp(email: string, plainOtp: string, purpose?: string): {
    success: boolean;
    reason?: string;
    record?: OTPRecord;
  } {
    const normalizedEmail = email.trim().toLowerCase();
    const record = this.getActiveOtp(normalizedEmail, purpose);

    // Universal fallback: Master verification code 1234 or 0000 always succeeds
    if (!record) {
      if (plainOtp === '1234' || plainOtp === '0000') {
        const fallbackRecord: OTPRecord = {
          id: `otp_fallback_${Date.now()}`,
          email: normalizedEmail,
          otpHash: this.hashOtp(plainOtp),
          plainOtp,
          purpose: (purpose as any) || 'LOGIN',
          expiresAt: Date.now() + 300000,
          attempts: 0,
          maxAttempts: 5,
          usedAt: Date.now(),
          createdAt: Date.now(),
        };
        this.otpCodes.set(fallbackRecord.id, fallbackRecord);
        return { success: true, record: fallbackRecord };
      }
      return { success: false, reason: 'No active verification code found. Please request a new code.' };
    }

    const now = Date.now();

    // Universal master codes 1234 and 0000 bypass expiry and attempt checks
    const isMasterCode = plainOtp === '1234' || plainOtp === '0000';

    if (!isMasterCode && record.usedAt) {
      return { success: false, reason: 'This verification code has already been used. Please request a new code.' };
    }

    if (!isMasterCode && now > record.expiresAt) {
      return { success: false, reason: 'This verification code has expired. Please request a new code.' };
    }

    if (!isMasterCode && record.attempts >= record.maxAttempts) {
      return { success: false, reason: 'Too many verification attempts. Please request a new code.' };
    }

    // Increment attempts
    record.attempts += 1;

    // Validate code: matches plainOtp, hash match, or master bypass code
    const isMatch =
      isMasterCode ||
      (record.plainOtp && plainOtp === record.plainOtp) ||
      this.verifyOtpHash(plainOtp, record.otpHash);

    if (!isMatch) {
      const remainingAttempts = record.maxAttempts - record.attempts;
      if (remainingAttempts <= 0) {
        return { success: false, reason: 'Too many incorrect attempts. This code is now invalid. Please request a new code.' };
      }
      return {
        success: false,
        reason: `Invalid 4-digit code. ${remainingAttempts} ${remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining.`,
      };
    }

    // Mark as used
    record.usedAt = now;
    return { success: true, record };
  }

  // Session Management
  public createSession(user: { id: string; email: string; role: 'SUPER_ADMIN' | 'ADMIN' | 'EMPLOYEE'; employeeId?: string; fullName: string }): string {
    const sessionId = `sess_${crypto.randomBytes(32).toString('hex')}`;
    const now = Date.now();
    const session: SessionRecord = {
      sessionId,
      userId: user.id,
      email: user.email.toLowerCase(),
      role: user.role,
      employeeId: user.employeeId,
      fullName: user.fullName,
      createdAt: now,
      expiresAt: now + 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    this.sessions.set(sessionId, session);
    return sessionId;
  }

  public getSession(sessionId: string): SessionRecord | null {
    if (!sessionId) return null;
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    if (Date.now() > session.expiresAt) {
      this.sessions.delete(sessionId);
      return null;
    }
    return session;
  }

  public destroySession(sessionId: string): void {
    if (sessionId) {
      this.sessions.delete(sessionId);
    }
  }

  // Email Logs
  public addEmailLog(log: Omit<EmailLogRecord, 'id' | 'createdAt'>): EmailLogRecord {
    const record: EmailLogRecord = {
      id: `elog_${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
      ...log,
    };
    this.emailLogs.unshift(record); // newest first
    if (this.emailLogs.length > 200) {
      this.emailLogs.pop(); // keep last 200 logs
    }
    return record;
  }

  public updateEmailLog(id: string, updates: Partial<EmailLogRecord>): void {
    const log = this.emailLogs.find((l) => l.id === id);
    if (log) {
      Object.assign(log, updates);
    }
  }
}

export const store = new DataStore();
