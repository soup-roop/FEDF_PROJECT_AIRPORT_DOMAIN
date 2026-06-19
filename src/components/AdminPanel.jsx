import React, { useContext, useState, useEffect } from 'react';
import { FlightContext } from '../context/FlightContext';

export default function AdminPanel() {
  // [CO4: Smart Component Architecture] Uses functional modifiers exposed by context to change data values
  const { flights, updateFlightFromAdmin } = useContext(FlightContext);
  const [selectedId, setSelectedId] = useState('');
  const [status, setStatus] = useState('On Time');
  const [gate, setGate] = useState('');

  // [CO3: Component Model Lifecycle Handling] 
  // Automatically syncs selectedId when async database flight arrays populate on boot
  useEffect(() => {
    if (flights.length > 0 && !selectedId) {
      setSelectedId(flights[0].id);
    }
  }, [flights, selectedId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Explicit guard matching verification parameters
    if (!selectedId) {
      alert("❌ Operational Error: No flight selected or database stream inactive.");
      return;
    }

    const flight = flights.find(f => f.id === selectedId);
    if (flight) {
      try {
        await updateFlightFromAdmin({ ...flight, status, gate: gate || flight.gate });
        // Native modal feedback alert loop confirmation
        alert(`🚀 ATC Broadcast Success!\nFlight: ${flight.flightNumber}\nStatus: ${status}\nGate: ${gate || flight.gate}`);
        setGate(''); // Reset input text field state clearing interface canvas
      } catch (err) {
        alert("❌ Network Error: Failed to commit operational status changes to the server.");
      }
    } else {
      alert("❌ Execution Error: Selected flight entry missing from active memory records.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-5 rounded-xl border space-y-3 text-black">
      <h3 className="font-bold text-gray-700">🛠️ ATC Admin Simulation Panel</h3>
      <div>
        <label className="block text-xs font-semibold text-gray-500">Select Flight</label>
        <select 
          className="w-full p-2 border rounded bg-white text-black" 
          value={selectedId} 
          onChange={e => setSelectedId(e.target.value)}
        >
          {flights.length === 0 ? (
            <option value="">Connecting to server...</option>
          ) : (
            flights.map(f => <option key={f.id} value={f.id}>{f.flightNumber}</option>)
          )}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-semibold text-gray-500">Status</label>
          <select className="w-full p-2 border rounded bg-white text-black" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="On Time">On Time</option>
            <option value="Delayed">Delayed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500">Gate</label>
          {/* [CO3: Controlled Forms UI Element] */}
          <input 
            type="text" 
            className="w-full p-2 border rounded bg-white text-black" 
            placeholder="e.g. A1" 
            value={gate} 
            onChange={e => setGate(e.target.value)} 
          />
        </div>
      </div>
      
      {/* Explicit submission trigger button */}
      <button 
        type="submit" 
        className="w-full bg-slate-800 text-white py-2 rounded font-bold hover:bg-slate-700 transition active:scale-[0.98]"
      >
        Push Live Simulation Update ⚡
      </button>
    </form>
  );
}