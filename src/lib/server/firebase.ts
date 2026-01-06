import admin from 'firebase-admin';
import { env } from '$env/dynamic/private';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: env.VITE_FIREBASE_PROJECT_ID,
            clientEmail: env.VITE_FIREBASE_CLIENT_EMAIL,
            privateKey: env.VITE_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        storageBucket: `${env.FIREBASE_PROJECT_ID}.firebasestorage.app`
    });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminStorage = admin.storage();