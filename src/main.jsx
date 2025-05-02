import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Abc from './Abc.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Abc />
  </StrictMode>,
)
