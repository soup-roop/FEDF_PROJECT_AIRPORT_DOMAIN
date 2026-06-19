import React, { useContext } from 'react';
import { FlightContext } from '../context/FlightContext';

export default function SearchBar() {
  // [CO3: React Hooks as Abstractions] Read direct filter properties from context
  const { searchQuery, setSearchQuery } = useContext(FlightContext);
  
  return (
    <input
      type="text"
      placeholder="🔍 Search by flight number (e.g. AA-101)..."
      className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      value={searchQuery}
      // [CO3: Controlled Forms] User keystrokes directly update global search values
      onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
    />
  );
}