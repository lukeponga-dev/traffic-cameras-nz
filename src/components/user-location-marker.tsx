import { useGeolocation } from "@/hooks/use-geolocation";
import { Marker, Popup } from "react-leaflet";

export default function UserLocationMarker() {
  const { location, error } = useGeolocation();

  if (error) {
    console.error(error);
    return null;
  }

  return location ? (
    <Marker position={location}>
      <Popup>You are here</Popup>
    </Marker>
  ) : null;
}
