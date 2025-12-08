import { getProjects, getPublications, getNavFiles } from '$lib/server/database';
import type { PageServerLoad } from './$types';


export const load: PageServerLoad = async () => {
    const [publications, projects, navFiles] = await Promise.all([
        getPublications(),
        getProjects(),
        getNavFiles()
    ]);

    console.log(publications, projects, navFiles);

    return {
        publications,
        projects,
        navFiles
    };
};