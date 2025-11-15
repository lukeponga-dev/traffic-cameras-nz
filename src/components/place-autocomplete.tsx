
"use client";

import { useEffect, useRef } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import { Search } from "lucide-react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "gmp-place-autocomplete": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

export function PlaceAutocomplete({ onPlaceSelect }: PlaceAutocompleteProps) {
  const map = useMap();
  const autocompleteRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!autocompleteRef.current || !inputRef.current || !map) return;

    const autocomplete = autocompleteRef.current;
    const input = inputRef.current;

    autocomplete.append(input);
    
    // Bind the map to the autocomplete element
    // @ts-ignore
    autocomplete.map = map;

    const handlePlaceChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const place = customEvent.detail.place;
      onPlaceSelect(place);

      if (place && place.formatted_address) {
        input.value = place.formatted_address;
      }
    };

    autocomplete.addEventListener("gmp-placechange", handlePlaceChange);

    return () => {
      autocomplete.removeEventListener("gmp-placechange", handlePlaceChange);
    };
  }, [map, onPlaceSelect]);

  return (
    <div className="relative flex items-center">
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <gmp-place-autocomplete
        ref={autocompleteRef}
        country-codes="nz"
        place-fields="geometry,name,formatted_address"
      >
        <input
            ref={inputRef}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9"
            placeholder="Search for a place"
        />
      </gmp-place-autocomplete>
    </div>
  );
}
