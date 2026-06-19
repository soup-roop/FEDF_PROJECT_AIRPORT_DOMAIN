import React, { createContext, useState, useEffect } from 'react';
import { initialFlights } from '../data/mockFlights';

export const FlightContext = createContext();

export const FlightProvider = ({ children }) => {
  /* [CO1: Virtual DOM & Declarative UI] We declare the core state layout here. 
    React tracks changes to this array to figure out minimal DOM updates via reconciliation.
  */
  const [flights, setFlights] = useState(initialFlights);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAirline, setSelectedAirline] = useState('');
  
  /* [CO4: Data Caching Strategies & State Co-location] 
    Synchronizing app state directly with LocalStorage to cache configurations across page resets.
  */
  const [subscriptions, setSubscriptions] = useState(() => JSON.parse(localStorage.getItem('subs')) || []);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('history')) || []);
  const [notifications, setNotifications] = useState([]);
  
  // [CO5: Protected Routes & Form Engineering] Session state tracking verified users
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('currentUser')) || null);

  /* [CO3: Side-effects as Controlled Event Loops] 
    Using useEffect to handle asynchronous polling loops separate from the pure render cycles.
  */
  useEffect(() => {
    const interval = setInterval(() => {
      /* [CO1: Immutability & Reactive State] 
        We use the functional state updater form to prevent mutations, treating state as immutable runtime data.
      */
      setFlights(prevFlights => 
        prevFlights.map(flight => {
          // [CO4: Async Flow Control] Simulating sporadic live telemetry streams from network APIs
          if (Math.random() > 0.6) {
            const statuses = ["On Time", "Delayed", "Cancelled"];
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            // [CO4: Complex UI Events & Sequencing] Detect real status adjustments to trigger alerts
            if (subscriptions.includes(flight.id) && flight.status !== newStatus) {
              triggerAlert(`Flight ${flight.flightNumber} status changed to ${newStatus}!`);
            }

            return { ...flight, status: newStatus, gate: `G${Math.floor(Math.random() * 20) + 1}` };
          }
          return flight;
        })
      );
    }, 7000);

    return () => clearInterval(interval);
  }, [subscriptions]);

  const triggerAlert = (message) => {
    setNotifications(prev => [message, ...prev]);
    // [CO4: Handling Complex UI Events] Interface interaction using browser-level notification permissions
    if (Notification.permission === "granted") {
      new Notification("Flight Update", { body: message });
    }
  };

  /* [CO2: Closures as Memory/State Constructs] 
    The following functions form closures around the state setter paths to enforce atomic state modification.
  */
  const registerUser = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(u => u.email === email)) {
      alert("User already exists!");
      return false;
    }
    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert("Registration successful! You can now log in.");
    return true;
  };

  const loginUser = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser({ email });
      localStorage.setItem('currentUser', JSON.stringify({ email }));
      return true;
    }
    alert("Invalid credentials!");
    return false;
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const toggleSubscription = (id) => {
    const updated = subscriptions.includes(id) 
      ? subscriptions.filter(subId => subId !== id)
      : [...subscriptions, id];
    setSubscriptions(updated);
    localStorage.setItem('subs', JSON.stringify(updated));
  };

  const addToHistory = (flight) => {
    if (!history.some(h => h.id === flight.id)) {
      const updatedHistory = [flight, ...history].slice(0, 5);
      setHistory(updatedHistory);
      localStorage.setItem('history', JSON.stringify(updatedHistory));
    }
  };

  // [CO4: API Service Layers / Smart Components] Simulate updating remote operational database values
  const updateFlightFromAdmin = (updatedFlight) => {
    setFlights(prev => prev.map(f => f.id === updatedFlight.id ? updatedFlight : f));
    triggerAlert(`Admin updated details for ${updatedFlight.flightNumber}`);
  };

  return (
    <FlightContext.Provider value={{
      flights, searchQuery, setSearchQuery,
      selectedAirline, setSelectedAirline,
      subscriptions, toggleSubscription,
      history, addToHistory,
      notifications, updateFlightFromAdmin,
      user, registerUser, loginUser, logoutUser
    }}>
      {children}
    </FlightContext.Provider>
  );
};