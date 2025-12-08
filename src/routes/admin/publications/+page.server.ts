import { adminDb } from '$lib/server/firebase';
import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    const publicationsSnapshot = await adminDb.collection('publications').get();
    const publications = publicationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return {
        publications
    };
};

export const actions: Actions = {
    createPublication: async ({ request }) => {
        const data = await request.formData();
        const title = data.get('title') as string;
        const conference = data.get('conference') as string;
        const description = data.get('description') as string;

        try {
            await adminDb.collection('publications').add({
                title,
                conference,
                description,
                createdAt: new Date()
            });
            return { success: true };
        } catch (error) {
            console.error('Error creating publication:', error);
            return fail(500, { error: 'Failed to create publication' });
        }
    },

    updatePublication: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        const title = data.get('title') as string;
        const conference = data.get('conference') as string;
        const description = data.get('description') as string;

        try {
            await adminDb.collection('publications').doc(id).update({
                title,
                conference,
                description
            });
            return { success: true };
        } catch (error) {
            console.error('Error updating publication:', error);
            return fail(500, { error: 'Failed to update publication' });
        }
    },

    deletePublication: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;

        try {
            await adminDb.collection('publications').doc(id).delete();
            return { success: true };
        } catch (error) {
            console.error('Error deleting publication:', error);
            return fail(500, { error: 'Failed to delete publication' });
        }
    }
};
