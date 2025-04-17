import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { MapProvider } from './context/MapContext'
import { AuthProvider } from './context/AuthContext'
import './index.css'

// Add Google Fonts
const link = document.createElement('link')
link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
link.rel = 'stylesheet'
document.head.appendChild(link)

// Add Font Awesome
const fontAwesome = document.createElement('link')
fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
fontAwesome.rel = 'stylesheet'
document.head.appendChild(fontAwesome)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <MapProvider>
        <App />
      </MapProvider>
    </AuthProvider>
  </React.StrictMode>
)
