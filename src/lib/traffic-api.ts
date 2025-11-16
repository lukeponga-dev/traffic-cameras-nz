import { z } from 'zod';
import convert from 'xml-js';

const CameraSchema = z.object({
  id: z.string(),
  name: z.string(),
  region: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  imageUrl: z.string(),
  viewUrl: z.string(),
  description: z.string(),
  direction: z.string(),
  status: z.enum(['Active', 'Inactive']),
});

export type Camera = z.infer<typeof CameraSchema>;

const getText = (node: any): string => (node && node._text ? node._text.toString() : '');

export async function getCameras(): Promise<Camera[]> {
  try {
    // This function fetches camera data from the NZTA traffic API.
    // It has a revalidation period of 5 minutes to ensure data is fresh.
    const res = await fetch(
      'https://trafficnz.info/service/traffic/rest/4/cameras/all',
      {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch camera data: ${res.statusText}`);
    }
    const xmlText = await res.text();
    if (!xmlText) {
        console.error('API returned empty response');
        return [];
    }

    const result = convert.xml2js(xmlText, { compact: true, spaces: 2 });
    
    const cameraList = (result as any)?.response?.camera;

    if (!cameraList) {
        console.error('Unexpected data structure from API. Full result:', JSON.stringify(result, null, 2));
        return [];
    }

    const cameras: any[] = Array.isArray(cameraList) ? cameraList : [cameraList];

    return cameras.map(cam => {
        const lat = parseFloat(getText(cam.latitude));
        const lon = parseFloat(getText(cam.longitude));

        if (isNaN(lat) || isNaN(lon)) {
            return null;
        }

        return {
            id: getText(cam.id),
            name: getText(cam.name),
            region: cam.region?.name?._text || 'N/A',
            latitude: lat,
            longitude: lon,
            imageUrl: getText(cam.imageUrl),
            viewUrl: `https://trafficnz.info${getText(cam.imageUrl)}`,
            description: getText(cam.description),
            direction: getText(cam.direction),
            // The API doesn't provide a status, so we'll mock it for now.
            // In a real application, this would come from the API.
            status: Math.random() > 0.1 ? 'Active' : 'Inactive',
        }
    }).filter((c): c is Camera => c !== null);
  } catch (error) {
    console.error('Error fetching cameras:', error);
    return []; // Return empty array on error to prevent app crashes.
  }
}
