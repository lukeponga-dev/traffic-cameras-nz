
import React, { useState } from "react";
import type { Camera } from "@/lib/traffic-api";

interface TrafficCameraProps {
  camera: Camera;
}

function TrafficCamera({ camera }: TrafficCameraProps) {
  const [error, setError] = useState(false);

  return (
    <div className="camera-tile">
      {!error ? (
        <img
          src={camera.viewUrl}
          alt={`${camera.name} feed`}
          onError={() => setError(true)}
          style={{ width: "100%", borderRadius: "8px" }}
        />
      ) : (
        <div className="camera-fallback">
          <p>Camera unavailable</p>
        </div>
      )}
    </div>
  );
}

export default TrafficCamera;
