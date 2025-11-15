"use client";

import * as React from "react";
import {
  Map,
  MapControl,
  ControlPosition,
  Marker,
} from "@vis.gl/react-google-maps";
import { Camera, Gauge, Menu, Power, User } from "lucide-react";
import { useMemo, useState } from "react";

import type { SpeedCamera } from "@/lib/types";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useIsMobile } from "@/hooks/use-mobile";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
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

type CameraTypeFilter = "all" | "fixed" | "average";

interface SpeedwatchAppProps {
  cameras: SpeedCamera[];
}

export function SpeedwatchApp({ cameras }: SpeedwatchAppProps) {
  const [selectedCamera, setSelectedCamera] = useState<SpeedCamera | null>(
    null
  );
  const [typeFilter, setTypeFilter] = useState<CameraTypeFilter>("all");
  const [showInactive, setShowInactive] = useState(true);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const location = useGeolocation();
  const isMobile = useIsMobile();

  const filteredCameras = useMemo(() => {
    return cameras.filter((camera) => {
      const typeMatch = typeFilter === "all" || camera.type === typeFilter;
      const statusMatch = showInactive || camera.status === "active";
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
    return { lat: 51.5074, lng: -0.1278 }; // Default to London
  }, [location]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card">
      <SheetHeader className="p-0">
        <Logo />
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
              <RadioGroupItem value="fixed" id="fixed" />
              <Label htmlFor="fixed" className="font-normal flex items-center gap-2">
                <Camera className="w-4 h-4 text-destructive" /> Fixed
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="average" id="average" />
              <Label htmlFor="average" className="font-normal flex items-center gap-2">
                <Gauge className="w-4 h-4 text-primary" /> Average
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
            <Badge variant="secondary">{filteredCameras.length} cameras shown</Badge>
        </div>
      </div>
      <Separator />
      <div className="p-4 flex items-center justify-between">
        <ReportDialog
          onOpenChange={isMobile ? setMobileSheetOpen : undefined}
          selectedCamera={selectedCamera}
        />
        <ThemeToggle />
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-background">
      {isMobile ? (
        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
          <SheetContent side="left" className="p-0 w-[300px]">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      ) : (
        <div className="w-[300px] border-r h-full shadow-md z-10">
          <SidebarContent />
        </div>
      )}

      <main className="flex-1 h-full relative">
        <Map
          key={JSON.stringify(center)} // Force re-render on center change
          defaultCenter={center}
          defaultZoom={12}
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

          {isMobile && (
            <MapControl position={ControlPosition.TOP_LEFT}>
               <Button variant="outline" size="icon" className="m-4" onClick={() => setMobileSheetOpen(true)}>
                  <Menu className="h-4 w-4" />
                </Button>
            </MapControl>
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
