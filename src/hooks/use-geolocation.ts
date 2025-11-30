import { useState, useEffect } from 'react';

export function useGeolocation() {
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    const watcher = geo.watchPosition(
      (position) => {
        setLocation([position.coords.latitude, position.coords.longitude]);
      },
      (err) => {
        setError(err.message);
      }
    );

    return () => geo.clearWatch(watcher);
  }, []);

  return { location, error };
}
