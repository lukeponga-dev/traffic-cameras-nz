"use client";

import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  isAvailable: boolean;
}

export function useGeolocation(options: PositionOptions = {}) {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    isAvailable: false,
  });

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        setLocation(l => ({ ...l, isAvailable: true }));
    } else {
        setLocation(l => ({ ...l, error: 'Geolocation is not supported by your browser.', isAvailable: false }));
        return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        isAvailable: true,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      setLocation(l => ({ ...l, error: error.message }));
    };
    
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return location;
}
