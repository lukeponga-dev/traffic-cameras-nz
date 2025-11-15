"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function MapProvider({ children }: { children: React.ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-foreground p-4">
        <Card className="max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="text-destructive"/>
                    Configuration Error
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Google Maps API Key is missing.</p>
              <p className="text-sm text-muted-foreground">
                To use the map feature, please add your Google Maps API key to your environment variables.
              </p>
              <div className="bg-muted p-3 rounded-md text-sm">
                <p>1. Create a file named <code className="font-mono bg-secondary px-1 py-0.5 rounded">.env.local</code> in the root of your project.</p>
                <p className="mt-2">2. Add the following line to it:</p>
                <code className="block mt-2 font-mono bg-secondary p-2 rounded">
                  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_API_KEY"
                </code>
              </div>
            </CardContent>
        </Card>
      </div>
    );
  }
  return <APIProvider apiKey={apiKey}>{children}</APIProvider>;
}
