import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

function initFirebase(): App {
  if (getApps().length) return getApps()[0];

  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error('FIREBASE_PROJECT_ID is required in environment variables');

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;
  const privateKey = rawKey?.replace(/\\n/g, '\n');

  if (clientEmail && privateKey) {
    // Service account credentials — works in any environment
    return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  }

  // Application Default Credentials — works in GCP / Firebase Hosting / emulator
  return initializeApp({ projectId });
}

const app = initFirebase();

// Support named Firestore database (FIREBASE_DATABASE_ID env var)
const databaseId = process.env.FIREBASE_DATABASE_ID;
export const db: Firestore = databaseId
  ? getFirestore(app, databaseId)
  : getFirestore(app);
