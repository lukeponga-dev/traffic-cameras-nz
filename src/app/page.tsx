import { SpeedwatchApp } from '@/components/speedwatch-app';
import type { SpeedCamera } from '@/lib/types';
import { TrafficCamera, Camera as TrafficAPICamera } from '@/lib/traffic-camera-types';
import convert from 'xml-js';

// Helper function to extract text from XML-JS nodes
const getText = (node: any): string => (node && node._text ? node._text.toString() : '');

async function getCameras(): Promise<SpeedCamera[]> {
  try {
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
    
    const cameraList = (result as any)?.traffic?.cameraList?.camera;
    if (!cameraList) {
        console.error('Unexpected data structure from API. Full result:', JSON.stringify(result, null, 2));
        return [];
    }

    const cameras: TrafficAPICamera[] = Array.isArray(cameraList) ? cameraList : [cameraList];

    const activeCameras = cameras.filter(cam => getText(cam.status) === 'Active');

    return activeCameras.map(cam => {
        const speedLimitText = getText(cam.speedLimit);
        const lat = parseFloat(getText(cam.lat));
        const lon = parseFloat(getText(cam.lon));

        if (isNaN(lat) || isNaN(lon)) {
            return null;
        }

        return {
            id: getText(cam.id),
            name: getText(cam.name),
            region: getText(cam.region),
            latitude: lat,
            longitude: lon,
            cameraType: getText(cam.type) as 'Fixed' | 'Mobile' | 'Red light',
            speedLimit: speedLimitText ? parseInt(speedLimitText, 10) : null,
            status: getText(cam.status) as 'Active' | 'Inactive',
            viewUrl: getText(cam.view),
            description: getText(cam.description),
            direction: getText(cam.direction),
        }
    }).filter((c): c is SpeedCamera => c !== null);
  } catch (error) {
    console.error('Error fetching cameras:', error);
    return []; // Return empty array on error
  }
}

export default async function Home() {
  const cameraData: SpeedCamera[] = await getCameras();

  return <SpeedwatchApp cameras={cameraData} />;
}
