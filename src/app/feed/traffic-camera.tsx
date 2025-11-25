
'use client';

import React, { useState } from 'react';
import type { SpeedCamera } from '@/lib/types';

interface TrafficCameraProps {
  camera: SpeedCamera;
}

export function TrafficCamera({ camera }: TrafficCameraProps) {
  const [error, setError] = useState(false);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-4">
        <div className="p-4">
            <p className="font-semibold mb-2">{camera.name}</p>
            {!error ? (
                <img
                src={camera.viewUrl}
                alt={`${camera.name} feed`}
                onError={() => setError(true)}
                className="w-full rounded-md object-cover"
                />
            ) : (
                <div className="w-full bg-muted rounded-md p-4 text-center text-muted-foreground">
                    <p>Camera unavailable</p>
                </div>
            )}
        </div>
    </div>
  );
}
