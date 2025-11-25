'use client';
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import { useGeolocation } from "@/hooks/use-geolocation";
import { Camera } from "@/lib/types";

interface DirectionsProps {
  selectedCamera: Camera | null;
}

export default function Directions({ selectedCamera }: DirectionsProps) {
  const map = useMap();
  const { location } = useGeolocation();
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!location || !selectedCamera) {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
      return;
    }

    const waypoints = [
      L.latLng(location[0], location[1]),
      L.latLng(selectedCamera.latitude, selectedCamera.longitude),
    ];

    if (!routingControlRef.current) {
      routingControlRef.current = L.Routing.control({
        waypoints,
        routeWhileDragging: true,
      }).addTo(map);
    } else {
      routingControlRef.current.setWaypoints(waypoints);
    }
  }, [map, location, selectedCamera]);

  useEffect(() => {
    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
    };
  }, [map]);

  return null;
}
