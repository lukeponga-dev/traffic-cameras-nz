import { BottomNavigation } from '@/components/bottom-navigation';
import { TrafficCameraFeed } from '@/components/traffic-camera-feed';
import { fetchAndProcessCameras } from '@/lib/traffic-api';

export default async function FeedPage() {
  const cameras = await fetchAndProcessCameras();

  return (
    <div className="bg-background min-h-screen">
        <header className="p-4 border-b sticky top-0 bg-background z-10">
            <h1 className="text-xl font-bold text-center">Live Feed</h1>
        </header>
        <main className="p-4">
            {cameras.map(camera => (
                <TrafficCameraFeed key={camera.id} camera={camera} />
            ))}
        </main>
        <BottomNavigation />
    </div>
  );
}
