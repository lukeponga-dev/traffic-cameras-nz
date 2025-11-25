"use client";

import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import type { Camera } from "@/lib/traffic-api";
import { MapContainer, TileLayer } from "react-leaflet";
import CameraMarker from "@/components/camera-marker";
import UserLocationMarker from "@/components/user-location-marker";
import Directions from "@/components/directions";

interface CameraMapProps {
  cameras: Camera[];
  selectedCamera: Camera | null;
}

export default function CameraMap({ cameras, selectedCamera }: CameraMapProps) {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[-41.2865, 174.7762]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <UserLocationMarker />
        {cameras.map((camera) => (
          <CameraMarker key={camera.id} camera={camera} />
        ))}
        {selectedCamera && <Directions selectedCamera={selectedCamera} />}
      </MapContainer>
    </div>
  );
}
