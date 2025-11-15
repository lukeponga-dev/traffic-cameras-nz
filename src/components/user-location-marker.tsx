
"use client";

import { Marker } from "@vis.gl/react-google-maps";
import { useGeolocation } from "@/hooks/use-geolocation";

export function UserLocationMarker() {
  const location = useGeolocation({ enableHighAccuracy: true });

  if (!location.latitude || !location.longitude) {
    return null;
  }

  return (
    <Marker position={{ lat: location.latitude, lng: location.longitude }}>
      <div className="relative flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
        <div className="absolute w-8 h-8 rounded-full bg-blue-500/20 animate-ping"></div>
      </div>
    </Marker>
  );
}
