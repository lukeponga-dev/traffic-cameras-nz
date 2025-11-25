import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import { useGeolocation } from "@/hooks/use-geolocation";
import { Camera } from "@/lib/types";

interface DirectionsProps {
  selectedCamera: Camera;
}

export default function Directions({ selectedCamera }: DirectionsProps) {
  const map = useMap();
  const { location } = useGeolocation();

  useEffect(() => {
    if (!location || !selectedCamera) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(location[0], location[1]),
        L.latLng(selectedCamera.latitude, selectedCamera.longitude),
      ],
      routeWhileDragging: true,
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, location, selectedCamera]);

  return null;
}
