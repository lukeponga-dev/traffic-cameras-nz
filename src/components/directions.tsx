
"use client";

import { useEffect, useState, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";

interface DirectionsProps {
  origin: google.maps.LatLng;
  destination: google.maps.LatLng;
}

export function Directions({ origin, destination }: DirectionsProps) {
  const map = useMap();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer | null>(null);
  const isInitialRoute = useRef(true);

  useEffect(() => {
    if (!map) return;
    
    // Initialize DirectionsRenderer
    if (!directionsRenderer) {
      const renderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true, // We use our own markers
        polylineOptions: {
            strokeColor: 'hsl(var(--primary))',
            strokeOpacity: 0.8,
            strokeWeight: 6
        }
      });
      renderer.setMap(map);
      setDirectionsRenderer(renderer);
    }
    
    return () => {
        // Clean up renderer on unmount
        if (directionsRenderer) {
            directionsRenderer.setMap(null);
        }
    }
  }, [map, directionsRenderer]);

  useEffect(() => {
    if (!directionsRenderer || !origin || !destination) return;

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          directionsRenderer.setDirections(result);
          
          if (isInitialRoute.current) {
            // Adjust map bounds to fit the route on the initial load
            const bounds = new google.maps.LatLngBounds();
            result.routes[0].legs.forEach(leg => {
                leg.steps.forEach(step => {
                    step.path.forEach(path => {
                        bounds.extend(path);
                    })
                })
            })
            map?.fitBounds(bounds);
            isInitialRoute.current = false;
          }

        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }, [directionsRenderer, origin, destination, map]);

  useEffect(() => {
    // Reset the initial route flag when the destination changes
    isInitialRoute.current = true;
  }, [destination]);

  return null;
}
