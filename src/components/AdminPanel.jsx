import React, { useContext, useState } from 'react';
import { FlightContext } from '../context/FlightContext';

export default function AdminPanel() {
  // [CO4: Smart Component Architecture] Uses functional modifiers exposed by context to change data values
  const { flights, updateFlightFromAdmin } = useContext(FlightContext);
  const [selectedId, setSelectedId] = useState(flights[0]?.id || '');
  const [status, setStatus] = useState('On Time');
  const [gate, setGate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const flight = flights.find(f => f.id === selectedId);
    if (flight) {
      updateFlightFromAdmin({ ...flight, status, gate: gate || flight.gate });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-5 rounded-xl border space-y-3 text-black">
      <h3 className="font-bold text-gray-700">🛠️ ATC Admin Simulation Panel</h3>
      <div>
        <label className="block text-xs font-semibold text-gray-500">Select Flight</label>
        <select className="w-full p-2 border rounded" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
          {flights.map(f => <option key={f.id} value={f.id}>{f.flightNumber}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-semibold text-gray-500">Status</label>
          <select className="w-full p-2 border rounded" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="On Time">On Time</option>
            <option value="Delayed">Delayed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500">Gate</label>
          <input type="text" className="w-full p-2 border rounded" placeholder="e.g. A1" value={gate} onChange={e => setGate(e.target.value)} />
        </div>
      </div>
      <button type="submit" className="w-full bg-slate-800 text-white py-2 rounded font-medium hover:bg-slate-700 transition">Push Live Simulation Update</button>
    </form>
  );
}