import './App.css'
import { getInitialPokemons } from './Services/PokeApi'
import usePokmonContext from './Hooks/usePokemonContext'
import { useEffect } from 'react'
import AppRouter from "./AppRouter.jsx";


function App() {
 
  const { dispatch } = usePokmonContext();

  useEffect(() => {
      async function fetchPokemons() {
        const pokemonsData = await getInitialPokemons();
        dispatch({
          type: "SET_INITIAL_DATA",
          payload: pokemonsData
        });
      }
      
      fetchPokemons();
  }, []);

  return (
    <AppRouter/>
  )
}

export default App
