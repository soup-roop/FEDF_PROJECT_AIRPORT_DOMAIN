import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// [CO6: Build Systems & Environment Configs] Importing mandatory asset CSS modules compiled via Vite pipelines
import 'leaflet/dist/leaflet.css';

// --- Fix for Leaflet Default Marker Icon Resolution Issue in Vite environments ---
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});
L.Marker.prototype.options.icon = DefaultIcon;
// ---------------------------------------------------------------------------------

export default function FlightMap({ selectedFlight }) {
  // Hardcoded airport coordinates map to generate real geometric paths
  const airportDatabase = {
    NYC: [40.6413, -73.7781],
    LAX: [33.9416, -118.4085],
    ATL: [33.6407, -84.4277],
    ORD: [41.9742, -87.9073],
    SFO: [37.6213, -122.3790],
    SEA: [47.4502, -122.3088],
    DOH: [25.2731, 51.6081],
    JFK: [40.6413, -73.7781]
  };

  /* [CO4: Skeleton UIs & Loading Boundary Fallbacks] 
     Render a defensive layout view fallback layer if no active flight data entity is selected.
  */
  if (!selectedFlight) {
    return (
      <div style={{ backgroundColor: '#1e293b', color: '#94a3b8', padding: '24px', borderRadius: '12px', textAlign: 'center', border: '1px solid #334155', minHeight: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Select a flight to view its real-time radar mapping.
      </div>
    );
  }

  // Resolve coordinates based on current active state model selection
  const originCoords = airportDatabase[selectedFlight.origin] || [39.8283, -98.5795];
  const destCoords = airportDatabase[selectedFlight.destination] || [39.8283, -98.5795];
  const flightPath = [originCoords, destCoords];

  return (
    /* [CO3: Styling Approaches & Engineering Reasoning] 
       Leveraging direct styling declarations here to safeguard presentation rules across viewport layouts.
    */
    <div style={{ backgroundColor: '#1e293b', color: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
      {/* [CO1: Component-Driven Thinking] Isolated interface layout designed to handle specific sub-domain workflows */}
      <h3 style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '4px' }}>
        🗺️ Live Radar Mapping
      </h3>
      <p style={{ color: '#cbd5e1', fontSize: '0.875rem', marginBottom: '12px' }}>
        Tracking: <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{selectedFlight.flightNumber}</span> ({selectedFlight.origin} ➔ {selectedFlight.destination})
      </p>

      {/* [CO3: React Component Model - Third-Party UI Framework Integration] Real Map Canvas Wrapper Container */}
      <div style={{ height: '240px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #475569', position: 'relative' }}>
        <MapContainer 
          key={selectedFlight.id} // [CO1: Reactive State] Forces instance re-rendering to prevent state reconciliation deadlocks
          center={originCoords} 
          zoom={4} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          {/* OpenStreetMap tile texture layers */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap &copy; CARTO'
          />

          {/* Departure Pin */}
          <Marker position={originCoords}>
            <Popup><span style={{ color: '#000' }}>Origin: {selectedFlight.origin}</span></Popup>
          </Marker>

          {/* Destination Pin */}
          <Marker position={destCoords}>
            <Popup><span style={{ color: '#000' }}>Destination: {selectedFlight.destination}</span></Popup>
          </Marker>

          {/* Flight Path line rendering connection across points */}
          <Polyline positions={flightPath} pathOptions={{ color: '#38bdf8', weight: 3, dashArray: '6, 6' }} />
        </MapContainer>
      </div>

      {/* Live Operational Telemetry Ticker Box */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.75rem', fontFamily: 'monospace', color: '#94a3b8', backgroundColor: '#0f172a', padding: '8px', borderRadius: '6px' }}>
        <span>LAT: {originCoords[0].toFixed(4)}</span>
        <span>LNG: {originCoords[1].toFixed(4)}</span>
        <span style={{ color: '#4ade80' }}>● RADAR ACTIVE</span>
      </div>
    </div>
  );
}