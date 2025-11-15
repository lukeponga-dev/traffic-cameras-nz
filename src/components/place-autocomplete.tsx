
'use client';

import { useRef, useEffect, useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from './ui/button';

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

export function PlaceAutocomplete({ onPlaceSelect }: PlaceAutocompleteProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const map = useMap();

  useEffect(() => {
    if (!map || !inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        fields: ['geometry', 'name', 'formatted_address'],
        types: ['address'],
        componentRestrictions: { country: 'nz' },
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      setInputValue(place.formatted_address || place.name || '');
      onPlaceSelect(place);
    });

    return () => {
      // Clean up the autocomplete instance
      const pacContainers = document.querySelectorAll('.pac-container');
      pacContainers.forEach(container => container.remove());
    };
  }, [map, onPlaceSelect]);
  
  const handleClear = () => {
    setInputValue('');
    onPlaceSelect(null);
    if(inputRef.current) {
        inputRef.current.focus();
    }
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search destination..."
        className="pl-9"
      />
      {inputValue && (
          <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={handleClear}
          >
          <X className="h-4 w-4" />
          </Button>
      )}
    </div>
  );
}
