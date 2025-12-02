import { db } from '$lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { PageLoad } from './$types.js';

export const load: PageLoad = async () => {
    const publicationsSnapshot = await getDocs(collection(db, 'publications'));
    const publications = publicationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const projectsSnapshot = await getDocs(collection(db, 'projects'));
    const projects = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return {
        publications,
        projects
    };
};
