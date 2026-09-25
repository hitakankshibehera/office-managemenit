import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
} from 'firebase/firestore';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDJYgyeo8ZxVva2JliIm1DmZany_hDHFrg",
  authDomain: "email-43406.firebaseapp.com",
  databaseURL: "https://email-43406-default-rtdb.firebaseio.com",
  projectId: "email-43406",
  storageBucket: "email-43406.firebasestorage.app",
  messagingSenderId: "587972523396",
  appId: "1:587972523396:web:825c947db36f98211b99d1",
  measurementId: "G-S1PP638HYK"
};

// Initialize Firebase App safely (singleton)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleAuthProvider = new GoogleAuthProvider();

// Safe Analytics Initialization
let analyticsInstance: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      try {
        analyticsInstance = getAnalytics(app);
      } catch (e) {
        console.warn('Firebase Analytics init warning:', e);
      }
    }
  }).catch(() => {});
}

export const getAnalyticsInstance = () => analyticsInstance;

// Error Handling Specification
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Error Info:', JSON.stringify(errInfo));
  return errInfo;
}

// Connection test helper
export async function testFirestoreConnection(): Promise<{ connected: boolean; status: string }> {
  try {
    await getDocFromServer(doc(db, '_connection_test', 'status'));
    return { connected: true, status: 'Online & Synchronized' };
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      // Reaching Firestore and receiving permission check confirms online connectivity
      return { connected: true, status: 'Connected (Rules Active)' };
    }
    if (error?.message?.includes('the client is offline')) {
      return { connected: false, status: 'Offline' };
    }
    return { connected: true, status: 'Configured (email-43406)' };
  }
}

// Auth Helpers
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error?.message || 'Google sign-in failed' };
  }
}

export async function signOutFirebase() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message };
  }
}
