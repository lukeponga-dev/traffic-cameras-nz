import { SpeedwatchApp } from '@/components/speedwatch-app';
import type { SpeedCamera } from '@/lib/types';
import { TrafficCamera } from '@/lib/traffic-camera-types';

async function getCameras(): Promise<SpeedCamera[]> {
  try {
    const res = await fetch(
      'https://trafficnz.info/service/traffic/rest/4/cameras/all',
      {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      }
    );
    if (!res.ok) {
      throw new Error('Failed to fetch camera data');
    }
    const data: TrafficCamera = await res.json();

    const activeCameras =
      data.cameraList?.cameras.filter(cam => cam.status === 'Active') || [];

    return activeCameras.map(cam => ({
      id: cam.id,
      name: cam.name,
      region: cam.region,
      latitude: cam.lat,
      longitude: cam.lon,
      cameraType: cam.type,
      speedLimit: cam.speedLimit || null,
      status: cam.status,
      viewUrl: cam.view,
      description: cam.description,
      direction: cam.direction,
    }));
  } catch (error) {
    console.error('Error fetching cameras:', error);
    return []; // Return empty array on error
  }
}

export default async function Home() {
  const cameraData: SpeedCamera[] = await getCameras();

  return <SpeedwatchApp cameras={cameraData} />;
}
