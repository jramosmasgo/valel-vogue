/**
 * Cloudinary Service
 * Handles image uploads directly from the frontend using the Upload API.
 * Requires an 'Unsigned Upload Preset' configured in Cloudinary.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export interface CloudinaryResponse {
    secure_url: string;
    public_id: string;
    format: string;
    width: number;
    height: number;
}

/**
 * Uploads a file to Cloudinary
 * @param file The file to upload (File object from input)
 * @returns Promise with the secure URL and other metadata
 */
export const uploadImage = async (file: File): Promise<CloudinaryResponse> => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
        throw new Error('Cloudinary configuration missing. Check your .env.local file.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Error uploading image to Cloudinary');
        }

        return await response.json();
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        throw error;
    }
};
