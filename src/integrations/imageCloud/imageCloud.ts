import axios from 'axios';
import { imgBBAPI } from '@/config/env';
const IMGBB_API_KEY = imgBBAPI;

async function uploadImagesToCloud(urls: string[]): Promise<string[]> {
    const uploadedUrls: string[] = [];

    for (const url of urls) {
        try {
            const formData = new FormData();
            const base64 = url.split(',')[1]; // This removes the "data:image/png;base64," part
            formData.append('image', base64);
            const response = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data && response.data.data && response.data.data.url) {
                uploadedUrls.push(response.data.data.url);
            } else {
                console.error('Failed to upload image:', url);
            }
        } catch (error) {
            console.error('Error uploading image:', url, error);
        }
    }

    return uploadedUrls;
}

export default uploadImagesToCloud;

