
"use client";

import * as React from "react";
import {
  Map,
  MapControl,
  ControlPosition,
  Marker,
} from "@vis.gl/react-google-maps";
import { Camera, Gauge, Menu, Power, User, Route } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

import type { SpeedCamera, CameraType } from "@/lib/types";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useIsMobile } from "@/hooks/use-mobile";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { ReportDialog } from "./report-dialog";
import { CameraMarker } from "./camera-marker";
import { CameraDetailsSheet } from "./camera-details-sheet";
import { Badge } from "./ui/badge";
import { Loader2 } from "lucide-react";


type CameraTypeFilter = "all" | CameraType;

interface SpeedwatchAppProps {
  cameras: SpeedCamera[];
}

const SidebarContent = ({ 
    typeFilter, 
    setTypeFilter, 
    showInactive, 
    setShowInactive, 
    filteredCamerasCount, 
    totalCamerasCount,
    isMobile,
    setMobileSheetOpen,
    selectedCamera,
    location
  } : {
    typeFilter: CameraTypeFilter;
    setTypeFilter: (filter: CameraTypeFilter) => void;
    showInactive: boolean;
    setShowInactive: (show: boolean) => void;
    filteredCamerasCount: number;
    totalCamerasCount: number;
    isMobile: boolean;
    setMobileSheetOpen: (open: boolean) => void;
    selectedCamera: SpeedCamera | null;
    location: { latitude: number | null; longitude: number | null; }
  }) => (
    <div className="flex flex-col h-full bg-card">
       <SheetHeader className="p-0">
        <Logo />
        <SheetTitle className="sr-only">App Menu</SheetTitle>
      </SheetHeader>
      <Separator />
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-4">
          <Label className="font-semibold">Camera Type</Label>
          <RadioGroup
            value={typeFilter}
            onValueChange={(value: string) =>
              setTypeFilter(value as CameraTypeFilter)
            }
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="font-normal flex items-center gap-2">
                <Camera className="w-4 h-4 text-muted-foreground" /> All Types
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Fixed" id="fixed" />
              <Label htmlFor="fixed" className="font-normal flex items-center gap-2">
                <Camera className="w-4 h-4 text-destructive" /> Fixed
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Mobile" id="mobile" />
              <Label htmlFor="mobile" className="font-normal flex items-center gap-2">
                <Gauge className="w-4 h-4 text-primary" /> Mobile
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Red light" id="red-light" />
              <Label htmlFor="red-light" className="font-normal flex items-center gap-2">
                <Route className="w-4 h-4 text-yellow-500" /> Red Light
              </Label>
            </div>
          </RadioGroup>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <Label htmlFor="show-inactive" className="font-semibold flex items-center gap-2">
            <Power className="w-4 h-4 text-muted-foreground" />
            Show Inactive
          </Label>
          <Switch
            id="show-inactive"
            checked={showInactive}
            onCheckedChange={setShowInactive}
          />
        </div>
        <Separator />
         <div className="text-center">
            <Badge variant="secondary">{filteredCamerasCount} of {totalCamerasCount} cameras shown</Badge>
        </div>
      </div>
      <Separator />
      <div className="p-4 flex items-center justify-between">
        <ReportDialog
          onOpenChange={isMobile ? setMobileSheetOpen : undefined}
          selectedCamera={selectedCamera}
          userLocation={location}
        />
        <ThemeToggle />
      </div>
    </div>
  );

export function SpeedwatchApp({ cameras }: SpeedwatchAppProps) {
  const [selectedCamera, setSelectedCamera] = useState<SpeedCamera | null>(
    null
  );
  const [typeFilter, setTypeFilter] = useState<CameraTypeFilter>("all");
  const [showInactive, setShowInactive] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  
  const isMobile = useIsMobile();
  
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const locationOptions = useMemo(() => ({
    enableHighAccuracy: true,
  }), []);

  const location = useGeolocation(locationOptions);

  const filteredCameras = useMemo(() => {
    return cameras.filter((camera) => {
      const typeMatch = typeFilter === "all" || camera.cameraType === typeFilter;
      const statusMatch = showInactive || camera.status === "Active";
      return typeMatch && statusMatch;
    });
  }, [cameras, typeFilter, showInactive]);

  const handleMarkerClick = (camera: SpeedCamera) => {
    setSelectedCamera(camera);
  };

  const center = useMemo(() => {
    if (location.latitude && location.longitude) {
      return { lat: location.latitude, lng: location.longitude };
    }
    return { lat: -41.2865, lng: 174.7762 }; // Default to Wellington, NZ
  }, [location.latitude, location.longitude]);


  if (!isClient) {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-background text-foreground">
            <div className="flex items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin"/>
                <p>Loading Map...</p>
            </div>
        </div>
    );
  }
  
  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-background">
      {isMobile ? (
        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
          <MapControl position={ControlPosition.TOP_LEFT}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="m-4">
                  <Menu className="h-4 w-4" />
                </Button>
            </SheetTrigger>
          </MapControl>
          <SheetContent side="left" className="p-0 w-[300px]">
            <SidebarContent 
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              showInactive={showInactive}
              setShowInactive={setShowInactive}
              filteredCamerasCount={filteredCameras.length}
              totalCamerasCount={cameras.length}
              isMobile={isMobile}
              setMobileSheetOpen={setMobileSheetOpen}
              selectedCamera={selectedCamera}
              location={location}
            />
          </SheetContent>
        </Sheet>
      ) : (
        <div className="w-[300px] border-r h-full shadow-md z-10">
          <SidebarContent 
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            showInactive={showInactive}
            setShowInactive={setShowInactive}
            filteredCamerasCount={filteredCameras.length}
            totalCamerasCount={cameras.length}
            isMobile={isMobile}
            setMobileSheetOpen={setMobileSheetOpen}
            selectedCamera={selectedCamera}
            location={location}
          />
        </div>
      )}

      <main className="flex-1 h-full relative">
        <Map
          key={JSON.stringify(center)} // Force re-render on center change
          defaultCenter={center}
          defaultZoom={6}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          mapId={"a3d7f7635c0cf699"}
          className="w-full h-full"
        >
          {filteredCameras.map((camera) => (
            <CameraMarker
              key={camera.id}
              camera={camera}
              onClick={() => handleMarkerClick(camera)}
            />
          ))}
          {location.latitude && location.longitude && (
            <Marker position={{ lat: location.latitude, lng: location.longitude }}>
              <div className="relative">
                <User className="h-6 w-6 text-white bg-blue-500 rounded-full p-1" />
                <div className="absolute inset-0 rounded-full bg-blue-500 opacity-25 animate-ping"></div>
              </div>
            </Marker>
          )}

        </Map>
      </main>

      <CameraDetailsSheet
        camera={selectedCamera}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedCamera(null);
        }}
      />
    </div>
  );
}

    