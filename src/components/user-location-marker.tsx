
"use client";

import { Marker } from "@vis.gl/react-google-maps";
import { useGeolocation } from "@/hooks/use-geolocation";

export function UserLocationMarker() {
  const { latitude, longitude, loading } = useGeolocation({ enableHighAccuracy: true });

  if (loading) {
    return (
        latitude && longitude ? (
            <Marker position={{ lat: latitude, lng: longitude }}>
                <div className="relative flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-blue-600/50 animate-pulse border-4 border-white" />
                </div>
            </Marker>
        ) : null
    );
  }

  if (!latitude || !longitude) {
    return null;
  }

  return (
    <Marker position={{ lat: latitude, lng: longitude }}>
      <div className="relative flex items-center justify-center">
        <div className="w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white shadow-md" />
      </div>
    </Marker>
  );
}
