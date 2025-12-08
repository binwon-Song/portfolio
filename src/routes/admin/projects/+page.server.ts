import { getProjects, createProject, updateProject, deleteProject } from '$lib/server/database';
import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    const projects = await getProjects();
    return { projects };
};

export const actions: Actions = {
    createProject: async ({ request }) => {
        const data = await request.formData();
        const title = data.get('title') as string;
        const image = data.get('image') as string;
        const summary = data.get('summary') as string;
        const description = data.get('description') as string;
        const link = data.get('link') as string;

        try {
            await createProject({ title, image, summary, description, link });
            return { success: true };
        } catch (error) {
            console.error('Error creating project:', error);
            return fail(500, { error: 'Failed to create project' });
        }
    },

    updateProject: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        const title = data.get('title') as string;
        const image = data.get('image') as string;
        const summary = data.get('summary') as string;
        const description = data.get('description') as string;
        const link = data.get('link') as string;

        try {
            await updateProject(id, { title, image, summary, description, link });
            return { success: true };
        } catch (error) {
            console.error('Error updating project:', error);
            return fail(500, { error: 'Failed to update project' });
        }
    },

    deleteProject: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id') as string;

        try {
            await deleteProject(id);
            return { success: true };
        } catch (error) {
            console.error('Error deleting project:', error);
            return fail(500, { error: 'Failed to delete project' });
        }
    }
};