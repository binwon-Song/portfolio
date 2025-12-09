import { json } from '@sveltejs/kit';
import { adminStorage } from '$lib/server/firebase';

// @Example
// curl -X POST -F "file=@/path/to/your/image.png" http://localhost:5173/api/upload
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
        const fileRef = bucket.file(`uploads/${file.name}`);

        await fileRef.save(buffer, {
            contentType: file.type,
            public: true // Make the file public
        });

        // Get the public URL
        const url = fileRef.publicUrl();

        return json({
            success: true,
            url: url
        });

    } catch (error) {
        console.error('Upload error:', error);
        return json({ success: false, error: 'Upload failed', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
