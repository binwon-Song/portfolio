import { createPost, getProjects } from '$lib/server/database';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const load = async () => {
    const projects = await getProjects();
    return { projects };
};

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const title = data.get('title') as string;
        const content_md = data.get('content_md') as string;
        const projectId = data.get('projectId') as string;
        const linksStr = data.get('links') as string;
        let links = [];

        try {
            links = linksStr ? JSON.parse(linksStr) : [];
        } catch (e) {
            console.error('Failed to parse links:', e);
        }

        if (!title || !content_md) {
            return fail(400, { message: 'Title and content are required' });
        }

        try {
            await createPost({
                title,
                content_md,
                projectId: projectId || undefined,
                links
            });
        } catch (e) {
            console.error(e);
            return fail(500, { message: 'Failed to create post' });
        }

        throw redirect(303, '/admin/posts');
    }
};
