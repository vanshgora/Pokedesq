import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Abc from './Abc.jsx'
import { PokemonProvider } from './Contexts/PokemonContext.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PokemonProvider>
      <App />
    </PokemonProvider>
  </StrictMode>,
)
