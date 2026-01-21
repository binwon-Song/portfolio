import { json } from '@sveltejs/kit';
import { adminStorage } from '$lib/server/firebase';

export const config = {
    body: {
        limit: '100mb'
    }
};

export async function POST({ request }) {
    try {
        const data = await request.formData();
        const file = data.get('file') as File;

        if (!file) {
            return json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const bucket = adminStorage.bucket();
        // Store post images in a dedicated folder to separate them from nav files
        const fileRef = bucket.file(`posts/images/${Date.now()}_${file.name}`);

        await fileRef.save(buffer, {
            contentType: file.type,
            public: true
        });

        const url = fileRef.publicUrl();

        return json({
            success: true,
            url: url
        });

    } catch (error) {
        console.error('Post image upload error:', error);
        return json({ success: false, error: 'Upload failed', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
