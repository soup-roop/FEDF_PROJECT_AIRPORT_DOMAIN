import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios'; // 🆕 Import Axios for HTTP requests

export const FlightContext = createContext();

const API_URL = 'http://localhost:5000/api/flights';

export const FlightProvider = ({ children }) => {
  const [flights, setFlights] = useState([]); // Initialized as empty; loaded via REST API
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAirline, setSelectedAirline] = useState('');
  const [subscriptions, setSubscriptions] = useState(() => JSON.parse(localStorage.getItem('subs')) || []);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('history')) || []);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('currentUser')) || null);

  // [CO4: REST API Integration & Polling] Fetch data from server periodically
  const fetchFlightData = async () => {
    try {
      const response = await axios.get(API_URL);
      
      // Calculate changes to trigger alert notifications
      if (flights.length > 0) {
        response.data.forEach(newFlight => {
          const oldFlight = flights.find(f => f.id === newFlight.id);
          if (oldFlight && oldFlight.status !== newFlight.status && subscriptions.includes(newFlight.id)) {
            triggerAlert(`Flight ${newFlight.flightNumber} status updated to ${newFlight.status}!`);
          }
        });
      }
      setFlights(response.data);
    } catch (error) {
      console.error("Error communicating with REST API endpoint:", error);
    }
  };

  // Run initial call and establish polling pipeline
  useEffect(() => {
    fetchFlightData();
    const interval = setInterval(fetchFlightData, 5000); // Polling backend every 5 seconds
    return () => clearInterval(interval);
  }, [flights, subscriptions]);

  const triggerAlert = (message) => {
    setNotifications(prev => [message, ...prev]);
    if (Notification.permission === "granted") {
      new Notification("Flight Update", { body: message });
    }
  };

  // [CO4: Asynchronous Request Submissions to PUT endpoints]
  const updateFlightFromAdmin = async (updatedFlight) => {
    try {
      const response = await axios.put(`${API_URL}/${updatedFlight.id}`, {
        status: updatedFlight.status,
        gate: updatedFlight.gate
      });
      
      // Instantly apply structural mutations back inside the state pipeline
      setFlights(prev => prev.map(f => f.id === updatedFlight.id ? response.data.flight : f));
      triggerAlert(`Admin updated details for ${updatedFlight.flightNumber}`);
    } catch (error) {
      console.error("Failed to commit updates to REST API server:", error);
    }
  };

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
    const updated = subscriptions.includes(id) ? subscriptions.filter(subId => subId !== id) : [...subscriptions, id];
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