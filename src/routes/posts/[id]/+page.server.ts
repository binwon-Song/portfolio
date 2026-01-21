import { getPostById } from '$lib/server/database';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
    const post = await getPostById(params.id);
    if (!post) throw error(404, 'Post not found');
    return { post };
};
