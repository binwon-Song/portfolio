import { getPosts, deletePost, getProjects } from '$lib/server/database';
import { fail, type Actions } from '@sveltejs/kit';

export const load = async () => {
    const posts = await getPosts();
    const projects = await getProjects();
    return { posts, projects };
};

export const actions: Actions = {
    delete: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;

        if (!id) return fail(400, { message: 'Missing id' });

        try {
            await deletePost(id);
            return { success: true };
        } catch (e) {
            console.error(e);
            return fail(500, { message: 'Delete failed' });
        }
    }
};
