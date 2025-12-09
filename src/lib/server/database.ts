import { adminDb, adminStorage } from '$lib/server/firebase';
import type { NavFile, Project, Publication } from '$lib/types';

// Helper to convert Firestore doc to typed object
// Firestore Timestamp는 SvelteKit에서 직렬화할 수 없으므로 Date 객체로 변환합니다.
const docToData = <T>(doc: FirebaseFirestore.QueryDocumentSnapshot): T => {
    const data = doc.data();

    // 데이터 필드를 순회하며 Timestamp 객체가 있으면 Date로 변환
    for (const key in data) {
        const value = data[key];
        // value가 객체이고 toDate 함수를 가지고 있다면 Firestore Timestamp로 간주
        if (value && typeof value === 'object' && typeof (value as any).toDate === 'function') {
            data[key] = (value as any).toDate();
        }
    }

    return { id: doc.id, ...data } as T;
};

// --- NavFiles (Storage Based) ---
export const getNavFiles = async (): Promise<NavFile[]> => {
    try {
        // Firestore가 아닌 Storage Bucket에서 'uploads/' 경로의 파일들을 직접 가져옵니다.
        const [files] = await adminStorage.bucket().getFiles({ prefix: 'uploads/' });

        // 폴더 자체는 제외하고, 생성 시간 역순(최신순)으로 정렬
        const sortedFiles = files
            .filter(file => !file.name.endsWith('/'))
            .sort((a, b) => {
                const timeA = new Date(a.metadata.timeCreated || 0).getTime();
                const timeB = new Date(b.metadata.timeCreated || 0).getTime();
                return timeB - timeA;
            });

        return sortedFiles.map(file => ({
            id: file.name, // Storage 경로를 ID로 사용
            name: file.name.split('/').pop() || file.name, // 파일명만 추출하여 표시 이름으로 사용
            url: file.publicUrl(), // 공개 URL (업로드 시 public 설정 필요)
            storagePath: file.name,
            size: parseInt(String(file.metadata.size || '0')),
            createdAt: file.metadata.timeCreated ? new Date(file.metadata.timeCreated) : undefined
        }));
    } catch (e) {
        console.error('Error loading nav files from storage:', e);
        return [];
    }
};

export const deleteNavFile = async (id: string, storagePath?: string) => {
    try {
        // Storage에서 파일 직접 삭제 (id가 곧 파일 경로)
        // storagePath 인자가 넘어오더라도 id를 우선적으로 사용하거나 동일하게 취급합니다.
        const targetPath = id || storagePath;
        if (targetPath) {
            await adminStorage.bucket().file(targetPath).delete();
        }
    } catch (err) {
        console.warn('Failed to delete storage object', err);
    }
    // Firestore 삭제 로직 제거 (Storage 기반이므로 DB 불필요)
};

// --- Projects ---
export const getProjects = async (): Promise<Project[]> => {
    const snapshot = await adminDb.collection('projects').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => docToData<Project>(doc));
};

export const createProject = async (project: Omit<Project, 'id'>) => {
    await adminDb.collection('projects').add({
        ...project,
        createdAt: new Date()
    });
};

export const updateProject = async (id: string, project: Partial<Project>) => {
    await adminDb.collection('projects').doc(id).update(project);
};

export const deleteProject = async (id: string) => {
    await adminDb.collection('projects').doc(id).delete();
};

// --- Publications ---
export const getPublications = async (): Promise<Publication[]> => {
    const snapshot = await adminDb.collection('publications').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => docToData<Publication>(doc));
};

export const createPublication = async (publication: Omit<Publication, 'id'>) => {
    await adminDb.collection('publications').add({
        ...publication,
        createdAt: new Date()
    });
};

export const updatePublication = async (id: string, publication: Partial<Publication>) => {
    await adminDb.collection('publications').doc(id).update(publication);
};

export const deletePublication = async (id: string) => {
    await adminDb.collection('publications').doc(id).delete();
};