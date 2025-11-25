
"use client";

import { BottomNavigation } from "@/components/bottom-navigation";
import type { Camera } from "@/lib/traffic-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import TrafficCamera from "@/components/traffic-camera";

interface FeedPageProps {
  cameras: Camera[] | undefined;
  onRefresh: () => void;
}

export default function FeedPage({ cameras, onRefresh }: FeedPageProps) {
  return (
    <div className="bg-background min-h-screen">
      <header className="p-4 border-b sticky top-0 bg-background z-10 flex items-center justify-between">
        <h1 className="text-xl font-bold">Live Feed</h1>
        <Button variant="ghost" size="icon" onClick={onRefresh} aria-label="Refresh feed">
          <RefreshCw className="h-5 w-5" />
        </Button>
      </header>
      <main className="p-4 pb-20">
        {!cameras && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-3/4 animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-md animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cameras?.map((camera) => (
            <Card key={camera.id}>
              <CardHeader>
                <CardTitle>{camera.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <TrafficCamera camera={camera} />
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
