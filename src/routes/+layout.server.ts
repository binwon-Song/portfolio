import { adminDb } from '$lib/server/firebase';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
    try {
        const navFilesSnapshot = await adminDb.collection('navFiles').orderBy('createdAt', 'desc').get();
        const navFiles = navFilesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return {
            navFiles
        };
    } catch (e) {
        console.error('Error loading nav files:', e);
        return {
            navFiles: []
        };
    }
};
