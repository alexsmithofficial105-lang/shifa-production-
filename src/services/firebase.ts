import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  type Firestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocFromServer,
  type Unsubscribe,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, type FirebaseStorage } from 'firebase/storage';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  onAuthStateChanged,
  type Auth,
  type User as FirebaseUser,
} from 'firebase/auth';
import firebaseAppletConfig from '../../firebase-applet-config.json';
import {
  initialSettings,
  initialServices,
  initialPortfolio,
  initialPackages,
  initialTestimonials,
  initialFaqs,
  initialTeam,
} from '../data/initialData.ts';

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

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const auth = getFirebaseAuth();
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo:
        auth?.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface FirebaseConfigParams {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  firestoreDatabaseId?: string;
}

let app: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let firebaseStorage: FirebaseStorage | null = null;
let firebaseAuth: Auth | null = null;
let isConfigured = false;
let configSource = 'none';

// Detect Firebase configuration from applet config, env vars, or user runtime settings
export function detectFirebaseConfig(): FirebaseConfigParams | null {
  // 1. Check generated applet configuration file from ProvisionFirebase
  if (firebaseAppletConfig && firebaseAppletConfig.apiKey && firebaseAppletConfig.projectId) {
    configSource = 'firebase-applet-config.json';
    return firebaseAppletConfig as FirebaseConfigParams;
  }

  // 2. Check Vite environment variables
  const envConfig: FirebaseConfigParams = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID,
  };

  if (envConfig.apiKey && envConfig.projectId) {
    configSource = 'env';
    return envConfig;
  }

  // 3. Check dynamic runtime configuration saved in browser
  try {
    const saved = localStorage.getItem('shifa_cloud_firebase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.apiKey && parsed.projectId) {
        configSource = 'runtime_settings';
        return parsed;
      }
    }
  } catch {
    // fallback
  }

  return null;
}

// Initialize Firebase if configuration exists
export function initFirebase(): boolean {
  if (isConfigured && firestoreDb) return true;

  const config = detectFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    return false;
  }

  try {
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApps()[0];
    }
    
    // Connect to specific provisioned database if provided, or default
    firestoreDb = config.firestoreDatabaseId
      ? getFirestore(app, config.firestoreDatabaseId)
      : getFirestore(app);

    try {
      firebaseStorage = getStorage(app);
    } catch (e) {
      console.warn('Storage initialization note:', e);
    }
    try {
      firebaseAuth = getAuth(app);
    } catch (e) {
      console.warn('Auth initialization note:', e);
    }
    isConfigured = true;

    // Validate connection to Firestore
    validateFirestoreConnection();

    // Ensure initial baseline content exists in cloud
    seedFirestoreIfEmpty().catch(() => {});

    return true;
  } catch (err) {
    console.warn('Firebase initialization note:', err);
    isConfigured = false;
    return false;
  }
}

// Save dynamic configuration from Admin Panel
export function saveDynamicFirebaseConfig(config: FirebaseConfigParams): boolean {
  try {
    if (!config.apiKey || !config.projectId) return false;
    localStorage.setItem('shifa_cloud_firebase_config', JSON.stringify(config));
    isConfigured = false;
    firestoreDb = null;
    firebaseStorage = null;
    firebaseAuth = null;
    app = null;
    const ok = initFirebase();
    if (ok) {
      seedFirestoreIfEmpty().catch(() => {});
    }
    return ok;
  } catch {
    return false;
  }
}

export function clearDynamicFirebaseConfig(): void {
  try {
    localStorage.removeItem('shifa_cloud_firebase_config');
    isConfigured = false;
    firestoreDb = null;
    firebaseStorage = null;
    firebaseAuth = null;
    app = null;
  } catch {
    // fallback
  }
}

// Validate connection per system skill
async function validateFirestoreConnection(): Promise<void> {
  if (!firestoreDb) return;
  try {
    await getDocFromServer(doc(firestoreDb, '_health', 'ping'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is currently running in offline/cached mode.');
    }
  }
}

export function isFirebaseActive(): boolean {
  if (!isConfigured) {
    return initFirebase();
  }
  return isConfigured && firestoreDb !== null;
}

export function getDb(): Firestore | null {
  if (!isConfigured) initFirebase();
  return firestoreDb;
}

export function getStorageInstance(): FirebaseStorage | null {
  if (!isConfigured) initFirebase();
  return firebaseStorage;
}

export function getFirebaseAuth(): Auth | null {
  if (!isConfigured) initFirebase();
  return firebaseAuth;
}

export async function loginWithFirebaseAuth(email: string, pass: string): Promise<FirebaseUser> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase Authentication is not configured yet');
  const res = await signInWithEmailAndPassword(auth, email, pass);
  return res.user;
}

export async function loginWithGoogleAuth(): Promise<FirebaseUser> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase Authentication is not configured yet');
  const provider = new GoogleAuthProvider();
  const res = await signInWithPopup(auth, provider);
  return res.user;
}

export async function logoutFirebaseAuth(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth) {
    await fbSignOut(auth);
  }
}

export function subscribeToFirebaseAuth(onUserChange: (user: FirebaseUser | null) => void): (() => void) | null {
  const auth = getFirebaseAuth();
  if (!auth) return null;
  return onAuthStateChanged(auth, onUserChange);
}

export function getConfigSource(): string {
  return configSource;
}

// ----------------- Real-time Listeners -----------------

export function subscribeToSiteContent(
  onData: (data: any) => void,
  onError?: (err: Error) => void
): Unsubscribe | null {
  const db = getDb();
  if (!db) return null;

  try {
    const docRef = doc(db, 'siteContent', 'main');
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          onData(snapshot.data());
        }
      },
      (err) => {
        console.warn('siteContent subscription note:', err);
        onError?.(err);
      }
    );
  } catch (err: any) {
    onError?.(err);
    return null;
  }
}

export function subscribeToSettings(
  onData: (settings: any) => void,
  onError?: (err: Error) => void
): Unsubscribe | null {
  const db = getDb();
  if (!db) return null;

  try {
    const docRef = doc(db, 'settings', 'global');
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          onData(snapshot.data());
        }
      },
      (err) => {
        console.warn('Settings subscription warning:', err);
        onError?.(err);
      }
    );
  } catch (err: any) {
    onError?.(err);
    return null;
  }
}

export function subscribeToCollection<T>(
  collectionName: string,
  onData: (items: T[]) => void,
  orderByField?: string,
  onError?: (err: Error) => void
): Unsubscribe | null {
  const db = getDb();
  if (!db) return null;

  try {
    const colRef = collection(db, collectionName);
    const q = orderByField ? query(colRef, orderBy(orderByField)) : query(colRef);

    return onSnapshot(
      q,
      (snapshot) => {
        const items: T[] = [];
        snapshot.forEach((d) => {
          items.push({ id: d.id, ...d.data() } as T);
        });
        onData(items);
      },
      (err) => {
        console.warn(`Realtime subscription error for ${collectionName}:`, err);
        onError?.(err);
      }
    );
  } catch (err: any) {
    onError?.(err);
    return null;
  }
}

// ----------------- CRUD Operations -----------------

export async function saveDocument(collectionName: string, docId: string, data: any): Promise<void> {
  const db = getDb();
  if (!db) throw new Error('Firebase connected nahi hai! Please configure Firebase credentials first.');
  const docRef = doc(db, collectionName, docId);
  const now = new Date().toISOString();
  try {
    await setDoc(docRef, { ...data, updatedAt: now }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${collectionName}/${docId}`);
  }

  // Also touch siteContent/main so single-listener devices update immediately
  try {
    await setDoc(
      doc(db, 'siteContent', 'main'),
      {
        [collectionName]: { [docId]: data },
        lastUpdated: new Date().toLocaleTimeString(),
        updatedAt: now,
      },
      { merge: true }
    );
  } catch {
    // collection write succeeded
  }
}

export async function deleteDocument(collectionName: string, docId: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error('Firebase connected nahi hai! Please configure Firebase credentials first.');
  const docRef = doc(db, collectionName, docId);
  try {
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${collectionName}/${docId}`);
  }

  try {
    await setDoc(
      doc(db, 'siteContent', 'main'),
      {
        lastUpdated: new Date().toLocaleTimeString(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch {
    // ignore
  }
}

export async function uploadFileToCloud(file: File, folder = 'uploads'): Promise<string> {
  const storage = getStorageInstance();
  if (storage) {
    const cleanName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const fileRef = ref(storage, `${folder}/${cleanName}`);
    const snapshot = await uploadBytes(fileRef, file);
    return await getDownloadURL(snapshot.ref);
  }
  throw new Error('Firebase Storage not configured');
}

// ----------------- Safe Cloud Seeding -----------------
// Seeds Firestore ONLY IF completely empty. NEVER overwrites existing cloud data.
export async function seedFirestoreIfEmpty(): Promise<void> {
  const db = getDb();
  if (!db) return;

  try {
    // 1. Settings
    const settingsDoc = await getDoc(doc(db, 'settings', 'global'));
    if (!settingsDoc.exists()) {
      await setDoc(doc(db, 'settings', 'global'), initialSettings);
      console.log('Seeded initial settings to Firestore.');
    }

    // 2. Services
    const servicesSnap = await getDocs(collection(db, 'services'));
    if (servicesSnap.empty) {
      for (const s of initialServices) {
        await setDoc(doc(db, 'services', s.id), s);
      }
      console.log('Seeded initial services to Firestore.');
    }

    // 3. Portfolio
    const portSnap = await getDocs(collection(db, 'portfolio'));
    if (portSnap.empty) {
      for (const p of initialPortfolio) {
        await setDoc(doc(db, 'portfolio', p.id), p);
      }
      console.log('Seeded initial portfolio to Firestore.');
    }

    // 4. Packages
    const pkgSnap = await getDocs(collection(db, 'packages'));
    if (pkgSnap.empty) {
      for (const pkg of initialPackages) {
        await setDoc(doc(db, 'packages', pkg.id), pkg);
      }
      console.log('Seeded initial packages to Firestore.');
    }

    // 5. Testimonials
    const testSnap = await getDocs(collection(db, 'testimonials'));
    if (testSnap.empty) {
      for (const t of initialTestimonials) {
        await setDoc(doc(db, 'testimonials', t.id), t);
      }
      console.log('Seeded initial testimonials to Firestore.');
    }

    // 6. FAQs
    const faqSnap = await getDocs(collection(db, 'faqs'));
    if (faqSnap.empty) {
      for (const f of initialFaqs) {
        await setDoc(doc(db, 'faqs', f.id), f);
      }
      console.log('Seeded initial FAQs to Firestore.');
    }

    // 7. Team
    const teamSnap = await getDocs(collection(db, 'team'));
    if (teamSnap.empty) {
      for (const tm of initialTeam) {
        await setDoc(doc(db, 'team', tm.id), tm);
      }
      console.log('Seeded initial team members to Firestore.');
    }

    // 8. Site Content Unified Document
    const siteContentDoc = await getDoc(doc(db, 'siteContent', 'main'));
    if (!siteContentDoc.exists()) {
      await setDoc(doc(db, 'siteContent', 'main'), {
        settings: initialSettings,
        services: initialServices,
        portfolio: initialPortfolio,
        packages: initialPackages,
        testimonials: initialTestimonials,
        faqs: initialFaqs,
        team: initialTeam,
        lastUpdated: new Date().toLocaleTimeString(),
        updatedAt: new Date().toISOString(),
      });
      console.log('Seeded initial siteContent/main snapshot to Firestore.');
    }
  } catch (err) {
    console.warn('Seeding check note:', err);
  }
}
