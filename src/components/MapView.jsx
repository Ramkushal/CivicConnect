import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapView = ({ issues = [] }) => {
  // Default center (e.g., a generic city location or user's location)
  const defaultCenter = [12.9716, 77.5946]; // Bangalore coordinates as example

  return (
    <div className="h-[600px] rounded-lg overflow-hidden shadow-md z-0 relative">
      <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {issues.map(issue => {
            // Mock parsing of location string "Lat: 12.97, Long: 77.59" or similar if needed
            // For now assuming issue.location is not yet a real coordinate object in mock data
            // We will use a random offset from center for demo if no real coords
            
            // In real backend, issue.location would be GeoJSON or similar.
            // Let's assume for now we skip markers if no valid coords, or mock them.
            return null; 
        })}
        <Marker position={defaultCenter}>
          <Popup>
            A sample marker. <br /> Central City.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapView;
