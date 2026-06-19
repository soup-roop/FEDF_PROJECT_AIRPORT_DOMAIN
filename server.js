import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Enable Cross-Origin Resource Sharing (CORS) so the React app can connect
app.use(cors());
app.use(express.json());

// In-memory operational database state
let flights = [
  { id: "1", flightNumber: "AA-101", airline: "American Airlines", origin: "NYC", destination: "LAX", departure: "10:00 AM", arrival: "01:00 PM", gate: "B4", status: "On Time", coordinates: { lat: 34.0522, lng: -118.2437 } },
  { id: "2", flightNumber: "DL-202", airline: "Delta Air Lines", origin: "ATL", destination: "ORD", departure: "11:30 AM", arrival: "01:45 PM", gate: "C12", status: "Delayed", coordinates: { lat: 41.8781, lng: -87.6298 } },
  { id: "3", flightNumber: "UA-303", airline: "United Airlines", origin: "SFO", destination: "SEA", departure: "01:15 PM", arrival: "03:30 PM", gate: "A2", status: "On Time", coordinates: { lat: 47.6062, lng: -122.3321 } },
  { id: "4", flightNumber: "QA-404", airline: "Qatar Airways", origin: "DOH", destination: "JFK", departure: "08:00 AM", arrival: "04:00 PM", gate: "E1", status: "Cancelled", coordinates: { lat: 40.7128, lng: -74.0060 } }
];

// --- [CO4: API Service Layers & REST Endpoints] ---

// GET Endpoint: Retrieve all current flight statuses
app.get('/api/flights', (req, res) => {
  res.json(flights);
});

// PUT Endpoint: Update operational states manually (Called by Admin Panel)
app.put('/api/flights/:id', (req, res) => {
  const { id } = req.params;
  const { status, gate } = req.body;
  
  flights = flights.map(f => f.id === id ? { ...f, status, gate } : f);
  const updatedFlight = flights.find(f => f.id === id);
  
  res.json({ message: "Flight updated on ATC server successfully", flight: updatedFlight });
});

// --- [Live Airport Operations Telemetry Simulator] ---
// Mimics actual ATC updates by updating statuses and gates in memory every 6 seconds
setInterval(() => {
  const statuses = ["On Time", "Delayed", "Cancelled"];
  
  // Randomly select one flight to update on this heartbeat tick
  const randomFlightIndex = Math.floor(Math.random() * flights.length);
  const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const newGate = `B${Math.floor(Math.random() * 20) + 1}`;

  flights[randomFlightIndex].status = newStatus;
  flights[randomFlightIndex].gate = newGate;

  console.log(`📡 [ATC Live Broadcast Update] Flight ${flights[randomFlightIndex].flightNumber} set to ${newStatus} at Gate ${newGate}`);
}, 6000);

app.listen(PORT, () => {
  console.log(`✈️ SkyTrack REST API Server running smoothly on http://localhost:${PORT}`);
});