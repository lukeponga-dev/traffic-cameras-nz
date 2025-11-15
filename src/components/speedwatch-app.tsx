
"use client";

import * as React from "react";
import {
  Map,
  MapControl,
  ControlPosition,
} from "@vis.gl/react-google-maps";
import { Menu, LocateFixed, X } from "lucide-react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

import type { Camera as CameraType } from "@/lib/traffic-api";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useIsMobile } from "@/hooks/use-mobile";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";

import { SidebarContent } from "@/components/sidebar-content";
import { CameraMarker } from "./camera-marker";
import { CameraDetailsSheet } from "./camera-details-sheet";
import { SpeedwatchAppSkeleton } from "./speedwatch-app-skeleton";
import { UserLocationMarker } from "./user-location-marker";
import { Directions } from "./directions";
import { PlaceAutocomplete } from "./place-autocomplete";


interface SpeedwatchAppProps {
  cameras: CameraType[];
}

export function SpeedwatchApp({ cameras }: SpeedwatchAppProps) {
  const [selectedCamera, setSelectedCamera] = useState<CameraType | null>(
    null
  );
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [destination, setDestination] = useState<google.maps.LatLng | null>(null);
  
  const mapRef = useRef<google.maps.Map | null>(null);
  
  const isMobile = useIsMobile();
  
  const location = useGeolocation({ enableHighAccuracy: true });

  const handleMarkerClick = (camera: CameraType) => {
    setSelectedCamera(camera);
    setIsFollowingUser(false);
  };
  
  const handleCameraSelect = (camera: CameraType) => {
    setSelectedCamera(camera);
    setIsFollowingUser(false);
    if (isMobile) {
        setMobileSheetOpen(false);
    }
    setDestination(null); // Clear route when a new camera is selected from the list
  }

  const handlePlaceSelect = useCallback((place: google.maps.places.PlaceResult | null) => {
    if (place?.geometry?.location && mapRef.current) {
      mapRef.current.panTo(place.geometry.location);
      mapRef.current.setZoom(14);
      setIsFollowingUser(false);
      setDestination(place.geometry.location);
    } else {
        setDestination(null);
    }
    if (isMobile) {
      setMobileSheetOpen(false);
    }
  }, [isMobile]);

  const handleGetDirections = (camera: CameraType) => {
    setDestination(new google.maps.LatLng(camera.latitude, camera.longitude));
    setSelectedCamera(null); // Close the details sheet
  }

  useEffect(() => {
    if (isFollowingUser && mapRef.current && location.latitude && location.longitude) {
      mapRef.current.panTo({ lat: location.latitude, lng: location.longitude });
    }
  }, [isFollowingUser, location.latitude, location.longitude]);

  useEffect(() => {
    if (selectedCamera && mapRef.current) {
        mapRef.current.panTo({ lat: selectedCamera.latitude, lng: selectedCamera.longitude });
        mapRef.current.setZoom(14);
    }
  }, [selectedCamera]);


  const onMapInteraction = useCallback(() => {
    if (isFollowingUser) {
      setIsFollowingUser(false);
    }
  }, [isFollowingUser]);

  const handleRecenter = () => {
    if (location.latitude && location.longitude && mapRef.current) {
        mapRef.current.panTo({lat: location.latitude, lng: location.longitude});
        mapRef.current.setZoom(14);
        setIsFollowingUser(true);
    }
  }

  const clearDirections = () => {
    setDestination(null);
  }

  const origin = useMemo(() => {
    return location.latitude && location.longitude 
      ? new google.maps.LatLng(location.latitude, location.longitude) 
      : null;
  }, [location.latitude, location.longitude]);


  if (isMobile === undefined) {
    return <SpeedwatchAppSkeleton />;
  }

  return (
    <div className="h-screen grid grid-cols-12">
      <div className="col-span-9">
        <Map
          defaultCenter={{ lat: -41.2865, lng: 174.7762 }}
          defaultZoom={6}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          mapId={"a3d7f7635c0cf699"}
          className="w-full h-full"
          onDrag={onMapInteraction}
          onZoomChanged={onMapInteraction}
          ref={mapRef}
        >
          {cameras.map((camera) => (
            <CameraMarker
              key={camera.id}
              camera={camera}
              onClick={() => handleMarkerClick(camera)}
            />
          ))}
          <UserLocationMarker />
          {origin && destination && (
            <Directions
                origin={origin}
                destination={destination}
            />
          )}
        </Map>
        <MapControl position={ControlPosition.RIGHT_BOTTOM}>
            {destination && (
                 <Button variant="outline" size="icon" className="m-4 mb-2" onClick={clearDirections}>
                    <X className="h-4 w-4"/>
                </Button>
            )}
            <Button variant="outline" size="icon" className="m-4 mt-0" onClick={handleRecenter} disabled={!location.latitude}>
                <LocateFixed className="h-4 w-4"/>
            </Button>
        </MapControl>
      </div>

      <div className="col-span-3 border-l p-4 space-y-6 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-lg font-bold">Navigation</h2>
        <Button className="w-full" onClick={handleRecenter} disabled={!location.latitude}>
          Set my location
        </Button>
        <Button className="w-full" variant="destructive" onClick={clearDirections} disabled={!destination}>
          Clear route
        </Button>

        <label className="block mt-4 text-sm">Mode</label>
        <select className="w-full border rounded px-2 py-1">
          <option>Driving</option>
          <option>Cycling</option>
          <option>Walking</option>
        </select>

        <div className="mt-4 text-sm">
          <p>Estimated: 12.4 km • 15 min</p>
        </div>

        <h3 className="text-md font-semibold mt-6">Waypoints</h3>
        <ul className="space-y-2">
          <li className="flex justify-between items-center">
            <span>Camera #1</span>
            <Button variant="secondary" size="sm">Remove</Button>
          </li>
        </ul>

        <h3 className="text-md font-semibold mt-6">Events</h3>
        <div className="space-y-3">
          <div className="p-2 border rounded">
            <p className="font-semibold">Crash on SH1</p>
            <Button size="sm">Route to event</Button>
          </div>
        </div>
      </div>

      <CameraDetailsSheet
        camera={selectedCamera}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedCamera(null);
        }}
        onGetDirections={handleGetDirections}
      />
    </div>
  );
}
