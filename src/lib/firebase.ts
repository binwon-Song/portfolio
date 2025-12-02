import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);

// Don't initialize auth on the server (avoid SSR/window issues).
// Provide a helper to get the client Auth instance when running in the browser.
export let auth: Auth | undefined = undefined;
export function getAuthClient(): Auth {
    if (auth) return auth;
    if (typeof window === 'undefined') {
        throw new Error('getAuthClient() called on the server — call only from browser code (eg. inside onMount)');
    }
    auth = getAuth(app);
    return auth;
}
