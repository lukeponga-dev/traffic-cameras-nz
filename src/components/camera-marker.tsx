'use client';

import { Marker, Popup } from 'react-leaflet';
import { Camera } from '@/lib/types';
import L from 'leaflet';

// Fix for default marker icon issue with webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

interface CameraMarkerProps {
  camera: Camera;
}

export default function CameraMarker({ camera }: CameraMarkerProps) {
  return (
<<<<<<< HEAD
    <AdvancedMarker
      position={{ lat: camera.lat, lng: camera.lon }}
      onClick={onClick}
      title={camera.name}
    >
      <Pin
        background={isOnline ? "hsl(var(--primary))" : "hsl(var(--destructive))"}
        borderColor={"hsl(var(--primary-foreground))"}
        glyphColor={"hsl(var(--primary-foreground))"}
      />
    </AdvancedMarker>
=======
    <Marker position={[camera.latitude, camera.longitude]}>
      <Popup>
        <div style={{ width: '280px' }}>
          <h4 style={{ marginBottom: '8px' }}>{camera.name}</h4>
          <img
            src={`https://trafficnz.info${camera.imageUrl}`}
            alt={camera.name}
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </Popup>
    </Marker>
>>>>>>> 4e4a3d35123888229159e6a723949a781b8ada1f
  );
}
