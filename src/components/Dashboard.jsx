import React, { useContext } from 'react';
import { FlightContext } from '../context/FlightContext';

export default function Dashboard({ onSelectFlight }) {
  // [CO4: Lifting State & Derived State Architecture] Pull values from central source and derive calculations downstream
  const { flights, searchQuery, selectedAirline, subscriptions, toggleSubscription } = useContext(FlightContext);

  // [CO2: Functional Programming in UI] Using pure array filter operations to parse matches dynamically
  const filteredFlights = flights.filter(f => 
    f.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedAirline === "" || f.airline === selectedAirline)
  );

  // [CO2: Pure Functions] Map flight statuses cleanly without affecting underlying state
  const getStatusColor = (status) => {
    if (status === "On Time") return "bg-green-100 text-green-800";
    if (status === "Delayed") return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* [CO5: Performance Tuning & Virtualization Principles - Keying Unique Items] */}
      {filteredFlights.map(flight => (
        <div 
          key={flight.id} 
          onClick={() => onSelectFlight(flight)} 
          className="p-5 bg-white shadow rounded-xl border border-gray-100 cursor-pointer hover:shadow-md transition text-black"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-lg text-blue-600">{flight.flightNumber}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(flight.status)}`}>
              {flight.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium">{flight.airline}</p>
          <div className="flex justify-between my-3 text-sm">
            <div><strong>From:</strong> {flight.origin} ({flight.departure})</div>
            <div><strong>To:</strong> {flight.destination} ({flight.arrival})</div>
          </div>
          <div className="flex justify-between items-center mt-4 pt-3 border-t text-sm">
            <span><strong>Gate:</strong> {flight.gate}</span>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Stops parent container click events from firing accidentally
                toggleSubscription(flight.id);
              }}
              className={`px-3 py-1 rounded text-xs ${subscriptions.includes(flight.id) ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {subscriptions.includes(flight.id) ? '🔔 Subscribed' : '🔕 Alert Me'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}