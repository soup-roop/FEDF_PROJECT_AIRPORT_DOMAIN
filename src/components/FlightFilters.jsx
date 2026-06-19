import React, { useContext } from 'react';
import { FlightContext } from '../context/FlightContext';

export default function FlightFilters() {
  const { selectedAirline, setSelectedAirline, flights } = useContext(FlightContext);
  
  // [CO4: Derived State Calculations] Dynamically calculate available options directly from the raw data payload
  const airlines = [...new Set(flights.map(f => f.airline))];

  return (
    <select
      className="p-3 rounded-lg border border-gray-300 shadow-sm text-black"
      value={selectedAirline}
      onChange={(e) => setSelectedAirline(e.target.value)}
    >
      <option value="">All Airlines</option>
      {airlines.map((airline, idx) => (
        <option key={idx} value={airline}>{airline}</option>
      ))}
    </select>
  );
}