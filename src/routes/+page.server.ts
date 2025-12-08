import { adminDb } from '$lib/server/firebase';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
    const publicationsSnapshot = await adminDb.collection('publications').get();
    const publications = publicationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const projectsSnapshot = await adminDb.collection('projects').get();
    const projects = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return {
        publications,
        projects
    };
};
