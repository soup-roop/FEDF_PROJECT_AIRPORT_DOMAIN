import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { FlightProvider } from './context/FlightContext'
import './App.css'

/* [CO6: Vite Build Flow, Bundling, & Mounting Engine] 
  Injecting our single-page application into the primary DOM root tree element.
*/
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* [CO4: React Context Engineering Rationale] Wrapping the entire application tree so nested items share access to the status engine */}
    <FlightProvider>
      <App />
    </FlightProvider>
  </React.StrictMode>,
)