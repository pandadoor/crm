import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { SalonProvider } from './context/SalonContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SalonProvider>
      <App />
    </SalonProvider>
  </StrictMode>,
)
