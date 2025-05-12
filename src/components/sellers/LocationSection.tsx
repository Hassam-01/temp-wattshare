
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LocationMapPicker from "@/components/LocationMapPicker";

interface LocationSectionProps {
  onLocationSelect: (coordinates: { lat: number; lng: number }) => void;
  initialLocation?: { lat: number; lng: number };
}

const LocationSection = ({ onLocationSelect, initialLocation }: LocationSectionProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Location</CardTitle>
        <CardDescription>
          Mark the location where your solar units are available. Click on the map or drag the marker to set your location.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LocationMapPicker 
          onLocationSelect={onLocationSelect} 
          initialLocation={initialLocation} 
        />
      </CardContent>
    </Card>
  );
};

export default LocationSection;
