
"use client";

import * as React from "react";
import {
  Map,
  MapControl,
  ControlPosition,
  useMap,
} from "@vis.gl/react-google-maps";
import { LocateFixed, X } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";

import type { Camera as CameraType } from "@/lib/traffic-api";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useIsMobile } from "@/hooks/use-mobile";

import { Button } from "@/components/ui/button";
import { SpeedwatchAppSkeleton } from "./speedwatch-app-skeleton";
import { UserLocationMarker } from "./user-location-marker";
import { Directions } from "./directions";
import { BottomNavigation } from "./bottom-navigation";
import { PlaceAutocomplete } from "./place-autocomplete";
import { CameraMarker } from "./camera-marker";
import { CameraDetailsSheet } from "./camera-details-sheet";

function SpeedwatchAppInternal({ cameras }: SpeedwatchAppProps) {
  const [selectedCamera, setSelectedCamera] = useState<CameraType | null>(null);
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [destination, setDestination] = useState<google.maps.LatLng | null>(null);
  const [cameraData, setCameraData] = useState<CameraType[]>(cameras);

  const map = useMap();
  const isMobile = useIsMobile();
  const location = useGeolocation({ enableHighAccuracy: true });

  useEffect(() => {
    async function fetchCameras() {
      try {
        const res = await fetch("/api/cameras");
        if (!res.ok) throw new Error("Failed to fetch cameras");
        const data = await res.json();
        setCameraData(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCameras();
  }, []);

  const handleMarkerClick = (camera: CameraType) => {
    setSelectedCamera(camera);
    setIsFollowingUser(false);
  };

  const handlePlaceSelect = useCallback((place: google.maps.places.PlaceResult | null) => {
    if (place?.geometry?.location && map && window.google) {
      map.panTo(place.geometry.location);
      map.setZoom(14);
      setIsFollowingUser(false);
      
      const newDestination = new window.google.maps.LatLng(
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );
      setDestination(newDestination);

    } else {
        setDestination(null);
    }
  }, [map]);


  const handleGetDirections = (camera: CameraType) => {
    if (window.google && window.google.maps && window.google.maps.LatLng) {
      setDestination(new window.google.maps.LatLng(camera.latitude, camera.longitude));
    }
    setSelectedCamera(null);
  };

  useEffect(() => {
    if (isFollowingUser && map && location.latitude && location.longitude) {
      map.panTo({ lat: location.latitude, lng: location.longitude });
    }
  }, [isFollowingUser, location.latitude, location.longitude, map]);

  useEffect(() => {
    if (selectedCamera && map) {
      map.panTo({ lat: selectedCamera.latitude, lng: selectedCamera.longitude });
      map.setZoom(14);
    }
  }, [selectedCamera, map]);

  const onMapInteraction = useCallback(() => {
    if (isFollowingUser) {
      setIsFollowingUser(false);
    }
  }, [isFollowingUser]);

  const handleRecenter = () => {
    if (location.latitude && location.longitude && map) {
      map.panTo({ lat: location.latitude, lng: location.longitude });
      map.setZoom(14);
      setIsFollowingUser(true);
    }
  };

  const clearDirections = () => {
    setDestination(null);
  };

  const origin = useMemo(() => {
    if (!location.latitude || !location.longitude || !window.google || !window.google.maps || !window.google.maps.LatLng)
      return null;
    return new window.google.maps.LatLng(location.latitude, location.longitude);
  }, [location.latitude, location.longitude]);

  if (isMobile === undefined) {
    return <SpeedwatchAppSkeleton />;
  }

  return (
    <div className="h-dvh w-screen relative overflow-hidden bg-background">
        <main className="h-dvh w-full relative">
            <Map
            defaultCenter={{ lat: -41.2865, lng: 174.7762 }}
            defaultZoom={6}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
            mapId={"a3d7f7635c0cf699"}
            className="w-full h-full"
            onDrag={onMapInteraction}
            onZoomChanged={onMapInteraction}
            onBoundsChanged={onMapInteraction}
            >
            {cameraData.map((camera) => (
                <CameraMarker
                key={camera.id}
                camera={camera}
                onClick={() => handleMarkerClick(camera)}
                />
            ))}
            <UserLocationMarker />
            {origin && destination && (
                <Directions origin={origin} destination={destination} />
            )}
            </Map>
            
            <MapControl position={ControlPosition.TOP_CENTER}>
              <div className="mt-2 md:mt-4 w-full px-2 md:px-4">
                <div className="bg-card/80 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2 shadow-md border w-full max-w-md mx-auto">
                    <PlaceAutocomplete onPlaceSelect={handlePlaceSelect} />
                </div>
              </div>
            </MapControl>

            <MapControl position={ControlPosition.RIGHT_BOTTOM}>
            <div className="m-2 md:m-4 flex flex-col items-center gap-2">
                {destination && (
                <Button variant="secondary" size="icon" className="shadow-lg" onClick={clearDirections} aria-label="Clear directions">
                    <X className="h-5 w-5" />
                </Button>
                )}
                <Button variant="secondary" size="icon" className="shadow-lg" onClick={handleRecenter} disabled={!location.latitude} aria-label="Recenter map">
                <LocateFixed className="h-5 w-5" />
                </Button>
            </div>
            </MapControl>

            <MapControl position={ControlPosition.LEFT_BOTTOM}>
              <div className="m-2 md:m-4 bg-card/80 backdrop-blur-sm rounded-lg p-2 shadow-md border max-w-md">
                <p className='text-xs font-mono'>Lat: {location.latitude?.toFixed(4)}</p>
                <p className='text-xs font-mono'>Lng: {location.longitude?.toFixed(4)}</p>
              </div>
            </MapControl>

            <BottomNavigation />
        </main>

      <CameraDetailsSheet
        camera={selectedCamera}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedCamera(null);
        }}
        onGetDirections={handleGetDirections}
        userLocation={{ latitude: location.latitude, longitude: location.longitude }}
      />
    </div>
  );
}

interface SpeedwatchAppProps {
  cameras: CameraType[];
}

export function SpeedwatchApp(props: SpeedwatchAppProps) {
  const isMobile = useIsMobile();
  return (
      <SpeedwatchAppInternal {...props} />
  );
}
