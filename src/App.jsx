import './App.css'
import Header from './Components/Header/Header'
import { getInitialPokemons } from './Services/PokeApi'
import PokemonCardGallery from './Components/PokemonCardGallery/PokemonCardGallery'


function App() {
 

  return (
    <>
      <Header/>
      <PokemonCardGallery/>
    </>
  )
}

export default App
