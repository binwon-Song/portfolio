import { adminDb, adminStorage } from '$lib/server/firebase';
import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    const navFilesSnapshot = await adminDb.collection('navFiles').orderBy('createdAt', 'desc').get();
    const navFiles = navFilesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return {
        navFiles
    };
};

export const actions: Actions = {
    deleteNavFile: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        const storagePath = data.get('storagePath') as string;

        try {
            if (storagePath) {
                await adminStorage.bucket().file(storagePath).delete().catch(err => {
                    console.warn('Failed to delete storage object', err);
                });
            }
            await adminDb.collection('navFiles').doc(id).delete();
            return { success: true };
        } catch (error) {
            console.error('Error deleting nav file:', error);
            return fail(500, { error: 'Failed to delete nav file' });
        }
    }
};
