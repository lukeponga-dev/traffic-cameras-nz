
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import type { Camera } from "@/lib/traffic-api";
import { Separator } from "@/components/ui/separator";
import { MapPin, Compass } from "lucide-react";
import Image from 'next/image';

interface CameraDetailsSheetProps {
  camera: Camera | null;
  onOpenChange: (open: boolean) => void;
}

export function CameraDetailsSheet({
  camera,
  onOpenChange,
}: CameraDetailsSheetProps) {
  return (
    <Sheet open={!!camera} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0">
        {camera && (
          <div className="flex flex-col h-full">
            <div className="relative h-48 w-full">
                {camera.viewUrl ? (
                    <Image
                        src={camera.viewUrl}
                        alt={`Street view of ${camera.name}`}
                        data-ai-hint="road street"
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Camera className="w-12 h-12 text-muted-foreground"/>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </div>

            <SheetHeader className="p-6 text-left -mt-12 z-10">
              <SheetTitle className="text-2xl font-bold">{camera.name}</SheetTitle>
            </SheetHeader>
            <SheetDescription asChild>
              <div className="flex-1 overflow-y-auto p-6 pt-0">
                  <p className="text-sm text-muted-foreground mb-6">{camera.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-5 h-5 text-primary"/>
                      <span>Coordinates</span>
                  </div>
                  <div className="font-mono text-xs text-right">
                      {camera.latitude.toFixed(4)}, <br/> {camera.longitude.toFixed(4)}
                  </div>

                  <div className="col-span-2"><Separator/></div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                      <Compass className="w-5 h-5 text-primary"/>
                      <span>Direction</span>
                  </div>
                  <div className="font-semibold text-right">{camera.direction}</div>
                  
                </div>
              </div>
            </SheetDescription>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
