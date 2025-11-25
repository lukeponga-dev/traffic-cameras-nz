'use client';

import React, { useState } from 'react';
import type { Camera } from '@/lib/traffic-api';

interface TrafficCameraFeedProps {
  camera: Camera;
}

export function TrafficCameraFeed({ camera }: TrafficCameraFeedProps) {
  const [error, setError] = useState(false);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-4">
      <div className="p-4">
        <p className="font-semibold mb-2">{camera.name}</p>
        {!error ? (
          <img
            src={camera.imageUrl} // Use imageUrl instead of viewUrl
            alt={`${camera.name} feed`}
            onError={() => setError(true)}
            className="w-full rounded-md object-cover"
          />
        ) : (
          <div className="w-full rounded-md object-cover bg-muted flex items-center justify-center aspect-[4/3]">
            <p className="text-muted-foreground">Camera unavailable</p>
          </div>
        )}
      </div>
    </div>
  );
}
