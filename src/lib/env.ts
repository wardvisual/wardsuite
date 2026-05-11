/**
 * Typed accessor for all VITE_* environment variables.
 * Vite exposes these via import.meta.env at build time — never use process.env in frontend code.
 */
function required(key: string): string {
  const value = import.meta.env[key] as string | undefined;
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

export const env = {
  firebase: {
    apiKey:            required('VITE_FIREBASE_API_KEY'),
    authDomain:        required('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId:         required('VITE_FIREBASE_PROJECT_ID'),
    storageBucket:     required('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: required('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId:             required('VITE_FIREBASE_APP_ID'),
    databaseId:        import.meta.env.VITE_FIREBASE_DATABASE_ID as string | undefined,
  },
} as const;
