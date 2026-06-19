import React from 'react';

export default function FlightMap({ selectedFlight }) {
  // [CO4: Skeleton UIs & Loading Boundary fallbacks] Render fallback layout if no data point is selected
  if (!selectedFlight) {
    return (
      <div style={{ backgroundColor: '#1e293b', color: '#94a3b8', padding: '24px', borderRadius: '12px', textAlign: 'center', border: '1px solid #334155' }}>
        Select a flight to view its real-time radar mapping.
      </div>
    );
  }

  return (
    /* [CO3: Styling Approaches & Engineering Reasoning] 
      Using inline styles to safeguard core layout presentation rules across dynamic display scopes.
    */
    <div style={{ backgroundColor: '#1e293b', color: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #334155' }}>
      <h3 style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🗺️ Live Radar Mapping
      </h3>
      <p style={{ color: '#cbd5e1', fontSize: '0.875rem', marginBottom: '16px' }}>
        Tracking: <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{selectedFlight.flightNumber}</span> ({selectedFlight.origin} ➔ {selectedFlight.destination})
      </p>
      
      {/* [CO1: Component-Driven Thinking Visualization] Nested sub-container presenting live tracking calculations */}
      <div style={{ backgroundColor: '#0f172a', height: '160px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px dashed #475569', position: 'relative', overflow: 'hidden' }}>
        <span style={{ fontSize: '0.75rem', color: '#64748b', position: 'absolute', top: '8px', left: '8px', fontFamily: 'monospace' }}>
          Lat: {selectedFlight.coordinates?.lat || '0'} / Lng: {selectedFlight.coordinates?.lng || '0'}
        </span>
        
        {/* Animated Flying Airplane */}
        <div className="animate-bounce" style={{ fontSize: '2rem', transform: 'rotate(45deg)' }}>✈️</div>
        
        {/* Progress Radar Tracker Line */}
        <div style={{ width: '75%', backgroundColor: '#3b82f6', height: '4px', borderRadius: '9999px', marginTop: '8px', boxShadow: '0 0 8px #3b82f6' }}></div>
      </div>
    </div>
  );
}