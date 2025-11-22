import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Filter } from 'lucide-react';

// Fix for default Leaflet icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for different statuses
// Custom icons for different statuses
const getIcon = (status) => {
    let colorClass = 'bg-red-500';
    if (status === 'In Progress') colorClass = 'bg-blue-500';
    if (status === 'Solved') colorClass = 'bg-green-500';

    return L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="${colorClass} w-6 h-6 rounded-full border-2 border-white shadow-lg"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
    });
};

// Component to update map center
const RecenterAutomatically = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};

const IssueMap = () => {
  const { issues } = useData();
  const { user } = useAuth();
  const [showMyWardOnly, setShowMyWardOnly] = useState(false);
  const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]); // Default to Bangalore
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [userArea, setUserArea] = useState('');

  useEffect(() => {
    if (user?.user_metadata?.area) {
        setUserArea(user.user_metadata.area);
    } else if (user) {
        // Try to fetch from public.users if not in metadata (though we usually sync)
        // For now assume metadata is source of truth or we'd need a fetch here
    }
  }, [user]);

  useEffect(() => {
    let result = issues;

    // Filter by Ward/Area if toggled
    if (showMyWardOnly && userArea) {
      result = result.filter(issue => 
        issue.address && issue.address.toLowerCase().includes(userArea.toLowerCase())
      );
    }

    // Parse locations
    // Parse locations
    const issuesWithLoc = result.map(issue => {
        let lat = null, lng = null;
        
        if (issue.location) {
            if (typeof issue.location === 'string') {
                if (issue.location.startsWith('POINT')) {
                    // WKT format
                    const matches = issue.location.match(/POINT\(([^ ]+) ([^ ]+)\)/);
                    if (matches) {
                        lng = parseFloat(matches[1]);
                        lat = parseFloat(matches[2]);
                    }
                } else if (issue.location.length > 20) {
                    // Assume Hex WKB (EWKB)
                    try {
                        // Simple parser for Little Endian (01) Point with SRID (01000020)
                        // Header: 1 byte (order) + 4 bytes (type) + 4 bytes (SRID) = 9 bytes = 18 hex chars
                        // We assume standard PostGIS output for 4326
                        const hex = issue.location;
                        
                        // Helper to parse double from hex (Little Endian)
                        const parseHexDouble = (start) => {
                            const part = hex.substr(start, 16);
                            const buffer = new ArrayBuffer(8);
                            const view = new DataView(buffer);
                            for (let i = 0; i < 8; i++) {
                                view.setUint8(i, parseInt(part.substr(i * 2, 2), 16));
                            }
                            return view.getFloat64(0, true);
                        };

                        // Check for Little Endian (01) and Point Type
                        // We'll just skip the header (18 chars) and read X then Y
                        // X starts at index 18, Y at index 34
                        lng = parseHexDouble(18);
                        lat = parseHexDouble(34);
                    } catch (e) {
                        console.error("Error parsing hex location:", e);
                    }
                }
            } else if (typeof issue.location === 'object' && issue.location.coordinates) {
                // GeoJSON format
                lng = issue.location.coordinates[0];
                lat = issue.location.coordinates[1];
            }
        } 
        // Fallback to address parsing
        else if (issue.address && issue.address.includes('Lat:')) {
             const matches = issue.address.match(/Lat: ([0-9.-]+), Long: ([0-9.-]+)/);
             if (matches) {
                 lat = parseFloat(matches[1]);
                 lng = parseFloat(matches[2]);
             }
        }

        return { ...issue, lat, lng };
    }).filter(i => i.lat && i.lng);

    setFilteredIssues(issuesWithLoc);

    // Recenter map if filtering changed and we have points
    if (showMyWardOnly && issuesWithLoc.length > 0) {
        setMapCenter([issuesWithLoc[0].lat, issuesWithLoc[0].lng]);
    }

  }, [issues, showMyWardOnly, userArea]);

  return (
    <div className="h-[calc(100vh-4rem)] relative">
      {/* Controls */}
      <div className="absolute bottom-8 right-4 z-[1000] bg-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-bold text-gray-800">Issue Map</h3>
        </div>
        
        {user ? (
            <div className="flex items-center">
                <label className="flex items-center cursor-pointer relative">
                    <input 
                        type="checkbox"
                        checked={showMyWardOnly}
                        onChange={() => setShowMyWardOnly(!showMyWardOnly)}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                        Show My Ward Only {userArea ? `(${userArea})` : '(No Area Set)'}
                    </span>
                </label>
            </div>
        ) : (
            <p className="text-xs text-gray-500">Login to filter by your ward</p>
        )}
        
        <div className="mt-4 text-xs text-gray-500 space-y-1">
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span> Pending</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span> In Progress</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span> Solved</div>
        </div>
      </div>

      <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true} className="h-full w-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <RecenterAutomatically lat={mapCenter[0]} lng={mapCenter[1]} />

        {filteredIssues.map(issue => (
          <Marker 
            key={issue.id} 
            position={[issue.lat, issue.lng]}
            icon={getIcon(issue.status)}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold text-sm mb-1">{issue.title}</h3>
                <p className="text-xs text-gray-600 mb-2">{issue.address}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2
                    ${issue.status === 'Solved' ? 'bg-green-100 text-green-800' : 
                      issue.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {issue.status}
                </span>
                <br/>
                <Link to={`/issue/${issue.id}`} className="text-blue-600 text-sm hover:underline">
                    View Details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default IssueMap;
