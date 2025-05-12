
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

// You'll need to replace with your own Mapbox token
// This should eventually be stored in environment variables or Supabase
const MAPBOX_TOKEN = 'REPLACE_WITH_YOUR_MAPBOX_TOKEN';

interface LocationMapPickerProps {
  onLocationSelect: (coordinates: { lat: number; lng: number }) => void;
  initialLocation?: { lat: number; lng: number };
  className?: string;
}

const LocationMapPicker = ({ 
  onLocationSelect, 
  initialLocation = { lat: 40.7128, lng: -74.0060 }, // Default to NYC
  className = ''
}: LocationMapPickerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(MAPBOX_TOKEN);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>(initialLocation);

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMapboxToken(e.target.value);
    localStorage.setItem('mapbox_token', e.target.value);
  };

  useEffect(() => {
    // Try to get token from localStorage
    const storedToken = localStorage.getItem('mapbox_token');
    if (storedToken) {
      setMapboxToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || mapboxToken === 'REPLACE_WITH_YOUR_MAPBOX_TOKEN') return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [coordinates.lng, coordinates.lat],
      zoom: 12
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Add marker at initial position
    marker.current = new mapboxgl.Marker({ draggable: true, color: '#6366f1' })
      .setLngLat([coordinates.lng, coordinates.lat])
      .addTo(map.current);

    // Listen for marker drag events
    marker.current.on('dragend', () => {
      const lngLat = marker.current?.getLngLat();
      if (lngLat) {
        const newCoordinates = { lat: lngLat.lat, lng: lngLat.lng };
        setCoordinates(newCoordinates);
        onLocationSelect(newCoordinates);
      }
    });

    // Listen for map click events
    map.current.on('click', (e) => {
      marker.current?.setLngLat(e.lngLat);
      const newCoordinates = { lat: e.lngLat.lat, lng: e.lngLat.lng };
      setCoordinates(newCoordinates);
      onLocationSelect(newCoordinates);
    });

    // Clean up on unmount
    return () => {
      map.current?.remove();
    };
  }, [mapContainer, mapboxToken, onLocationSelect]);

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {(mapboxToken === 'REPLACE_WITH_YOUR_MAPBOX_TOKEN' || !mapboxToken) && (
        <div className="mb-4 p-4 border border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700 rounded-md">
          <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Mapbox Token Required</h3>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-3">
            Please enter your Mapbox public token to use the map feature. You can get one for free at mapbox.com.
          </p>
          <input
            type="text"
            value={mapboxToken}
            onChange={handleTokenChange}
            placeholder="Enter your Mapbox token"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800"
          />
        </div>
      )}
      
      <div ref={mapContainer} className="h-[400px] w-full rounded-lg overflow-hidden border border-border" />
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4 text-primary" />
          <span>Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => {
          if (map.current && marker.current) {
            map.current.flyTo({ center: [coordinates.lng, coordinates.lat], zoom: 15 });
          }
        }}>
          Center Map
        </Button>
      </div>
    </div>
  );
};

export default LocationMapPicker;
