import { getProjects, getPublications, getNavFiles, getPosts, enrichProjects } from '$lib/server/database';
import type { PageServerLoad } from './$types';


export const load: PageServerLoad = async () => {
    const [publications, projects, navFiles, posts] = await Promise.all([
        getPublications(),
        getProjects(),
        getNavFiles(),
        getPosts()
    ]);

    return {
        publications,
        projects: enrichProjects(projects, posts),
        navFiles
    };
};