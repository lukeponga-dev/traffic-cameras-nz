
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
        <div className="w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white shadow-md" />
      </div>
    </Marker>
  );
}
