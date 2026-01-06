import { getProjects, getPublications, getNavFiles } from '$lib/server/database';
import type { PageServerLoad } from './$types';


export const load: PageServerLoad = async () => {
    const [publications, projects, navFiles] = await Promise.all([
        getPublications(),
        getProjects(),
        getNavFiles()
    ]);

    return {
        publications,
        projects,
        navFiles
    };
};