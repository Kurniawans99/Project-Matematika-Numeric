import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LagrangeInterpolation from './pages/LagrangeInterpolation.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LagrangeInterpolation />
  </StrictMode>,
)
