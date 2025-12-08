import { getNavFiles, deleteNavFile } from '$lib/server/database';
import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    const navFiles = await getNavFiles();
    return { navFiles };
};

export const actions: Actions = {
    deleteNavFile: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        const storagePath = data.get('storagePath') as string;

        try {
            await deleteNavFile(id, storagePath);
            return { success: true };
        } catch (error) {
            console.error('Error deleting nav file:', error);
            return fail(500, { error: 'Failed to delete nav file' });
        }
    }
};