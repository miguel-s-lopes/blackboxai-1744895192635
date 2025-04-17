import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { MapProvider } from './context/MapContext'
import { AuthProvider } from './context/AuthContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MapProvider>
          <App />
        </MapProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
