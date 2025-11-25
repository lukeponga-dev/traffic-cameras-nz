import { z } from 'zod';
import convert from 'xml-js';

const getText = (node: any): string => (node && node._text ? node._text.toString() : '');

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

// To be used by client components, fetches from the API route
export async function getCameras(): Promise<Camera[]> {
  try {
    const res = await fetch('/api/cameras');
    if (!res.ok) {
      throw new Error('Failed to fetch cameras');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching cameras:', error);
    return [];
  }
}

// To be used by server components, fetches directly from the source
export async function fetchAndProcessCameras(): Promise<Camera[]> {
  try {
    const res = await fetch(
      'https://trafficnz.info/service/traffic/rest/4/cameras/all',
      {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch cameras from external API');
    }

    const xmlText = await res.text();
    if (!xmlText) {
      throw new Error('External API returned empty response');
    }

    const result = convert.xml2js(xmlText, { compact: true, spaces: 2 });
    const cameraList = (result as any)?.response?.camera;

    if (!cameraList) {
      throw new Error('Unexpected data structure from API');
    }

    const cameras: any[] = Array.isArray(cameraList) ? cameraList : [cameraList];

    const cameraData = cameras.map(cam => {
        if (!cam || !cam.latitude || !cam.longitude) {
            return null;
        }

        const lat = parseFloat(getText(cam.latitude));
        const lon = parseFloat(getText(cam.longitude));

        if (isNaN(lat) || isNaN(lon)) {
            return null;
        }

        return {
            id: getText(cam.id),
            name: getText(cam.name),
            region: getText(cam.region?.name) || 'N/A',
            latitude: lat,
            longitude: lon,
            imageUrl: getText(cam.imageUrl),
            viewUrl: `https://trafficnz.info${getText(cam.viewUrl)}`,
            description: getText(cam.description),
            direction: getText(cam.direction),
            status: getText(cam.offline) === 'true' ? 'Inactive' : 'Active',
        }
    }).filter(Boolean) as Camera[];

    return cameraData;
  } catch (error) {
    console.error('Error fetching and processing cameras:', error);
    return [];
  }
}
