import React, { useState, useContext, useEffect } from 'react';
import { FlightContext } from './context/FlightContext';
import SearchBar from './components/SearchBar';
import FlightFilters from './components/FlightFilters';
import Dashboard from './components/Dashboard';
import FlightMap from './components/FlightMap';
import HistoryLog from './components/HistoryLog';
import AdminPanel from './components/AdminPanel';
import Auth from './components/Auth';

function AppContent() {
  const [activeFlight, setActiveFlight] = useState(null);
  const { addToHistory, notifications, user, logoutUser } = useContext(FlightContext);

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // [CO5: Protected Routes Framework Model] Denies interface entry if user session is absent
  if (!user) {
    return <Auth />;
  }

  const handleSelectFlight = (flight) => {
    setActiveFlight(flight);
    addToHistory(flight);
  };

  return (
    /* [CO5: Mobile Responsive Styling & Grid Boundaries] Flex layouts that automatically snap cleanly between phone screens and wider displays */
    <div className="min-h-screen bg-slate-100 font-sans p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">SkyTrack Live</h1>
          <p className="text-slate-500 text-sm font-medium">Welcome back, <span className="text-blue-600 font-bold">{user.email}</span></p>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          {notifications.length > 0 && (
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md animate-pulse text-xs font-semibold max-w-xs">
              🚨 Alert: {notifications[0]}
            </div>
          )}
          <button 
            onClick={logoutUser} 
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-600 transition"
          >
            Log Out 🚪
          </button>
        </div>
      </header>

      {/* [CO1: Component Composition Patterns] Composing individual widgets to construct an integrated application */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="w-full sm:w-2/3"><SearchBar /></div>
            <div className="w-full sm:w-1/3"><FlightFilters /></div>
          </div>

          <Dashboard onSelectFlight={handleSelectFlight} />
        </div>

        <div className="space-y-6">
          <FlightMap selectedFlight={activeFlight} />
          <HistoryLog />
          <AdminPanel />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <div className="w-full">
      <AppContent />
    </div>
  );
}