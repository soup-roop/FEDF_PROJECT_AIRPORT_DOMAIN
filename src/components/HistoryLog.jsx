import React, { useContext } from 'react';
import { FlightContext } from '../context/FlightContext';

export default function HistoryLog() {
  const { history } = useContext(FlightContext);

  return (
    <div className="bg-white p-4 rounded-xl shadow border text-black">
      <h3 className="font-bold mb-3 text-gray-700">🕒 Recently Viewed</h3>
      {/* [CO1: Unidirectional Data Flow] View rendering relies purely on state arrays passed down from context */}
      {history.length === 0 ? <p className="text-sm text-gray-400">No recent history.</p> : (
        <ul className="space-y-2 text-sm">
          {history.map((f, i) => (
            <li key={i} className="flex justify-between border-b pb-1">
              <span>{f.flightNumber}</span>
              <span className="text-gray-500">{f.origin} ➔ {f.destination}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}