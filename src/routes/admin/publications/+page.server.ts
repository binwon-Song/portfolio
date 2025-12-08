import { getPublications, createPublication, updatePublication, deletePublication } from '$lib/server/database';
import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    const publications = await getPublications();
    return { publications };
};

export const actions: Actions = {
    createPublication: async ({ request }) => {
        const data = await request.formData();
        const title = data.get('title') as string;
        const conference = data.get('conference') as string;
        const description = data.get('description') as string;

        try {
            await createPublication({ title, conference, description });
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
            await updatePublication(id, { title, conference, description });
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
            await deletePublication(id);
            return { success: true };
        } catch (error) {
            console.error('Error deleting publication:', error);
            return fail(500, { error: 'Failed to delete publication' });
        }
    }
};