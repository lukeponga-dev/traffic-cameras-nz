
"use client";

import "leaflet/dist/leaflet.css";
import type { Camera } from "@/lib/traffic-api";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

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


interface CameraMapProps {
    cameras: Camera[];
}

export default function CameraMap({ cameras }: CameraMapProps) {
  return (
    <MapContainer center={[-41.2865, 174.7762]} zoom={6} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {cameras.map(camera => (
        <Marker key={camera.id} position={[camera.latitude, camera.longitude]}>
          <Popup>
            <div style={{ width: "280px" }}>
              <h4 style={{ marginBottom: "8px" }}>{camera.name}</h4>
              <img src={`https://trafficnz.info${camera.imageUrl}`} alt={camera.name} style={{ width:"100%", height:"auto" }} />
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
