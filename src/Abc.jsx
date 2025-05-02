import { PokemonProvider } from "./Contexts/PokemonContext.jsx";
import App from './App.jsx'

export default function Abc() {
    return (
        <PokemonProvider>
            <App/>
        </PokemonProvider>
    )
}