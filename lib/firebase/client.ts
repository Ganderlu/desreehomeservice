import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  type Auth,
} from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  type Firestore,
} from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";
import {
  getAnalytics,
  isSupported as isAnalyticsSupported,
  type Analytics,
} from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const isBrowser = typeof window !== "undefined";
const hasRequiredConfig = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId,
);

let app: FirebaseApp | undefined;
if (isBrowser && hasRequiredConfig) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
}

export const firebaseEnabled = isBrowser && hasRequiredConfig;

export const auth: Auth = app ? getAuth(app) : (null as unknown as Auth);
export const db: Firestore = app
  ? (() => {
      try {
        return initializeFirestore(app, {
          experimentalAutoDetectLongPolling: true,
          experimentalForceLongPolling: true,
          useFetchStreams: false,
        } as any);
      } catch {
        return getFirestore(app);
      }
    })()
  : (null as unknown as Firestore);
export const storage: FirebaseStorage = app
  ? getStorage(app)
  : (null as unknown as FirebaseStorage);

export const googleProvider = new GoogleAuthProvider();

export const recaptcha = () => {
  if (!auth) throw new Error("Firebase is not configured");
  return new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
  });
};

export async function getMessagingIfSupported(): Promise<Messaging | null> {
  if (!app) return null;
  if (!(await isSupported())) return null;
  return getMessaging(app);
}

export async function getAnalyticsIfSupported(): Promise<Analytics | null> {
  if (!app) return null;
  try {
    if (!(await isAnalyticsSupported())) return null;
    return getAnalytics(app);
  } catch {
    return null;
  }
}

export default app;
