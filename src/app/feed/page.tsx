
"use client";

import { BottomNavigation } from "@/components/bottom-navigation";
import type { Camera } from "@/lib/traffic-api";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function FeedPage() {
  const { data: cameras, error, mutate } = useSWR<Camera[]>("/api/cameras", fetcher);

  return (
    <div className="bg-background min-h-screen">
      <header className="p-4 border-b sticky top-0 bg-background z-10 flex items-center justify-between">
        <h1 className="text-xl font-bold text-center">Live Feed</h1>
        <Button variant="ghost" size="icon" onClick={() => mutate()}>
          <RefreshCw className="h-5 w-5" />
        </Button>
      </header>
      <main className="p-4">
        {error && <p className="text-center text-red-500">Failed to load cameras</p>}
        {!cameras && !error && <p className="text-center text-muted-foreground">Loading...</p>}
        <div className="grid gap-4">
          {cameras?.map((camera) => (
            <Card key={camera.id}>
              <CardHeader>
                <CardTitle>{camera.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Live feed coming soon</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
