import { useContext } from "react";
import { PokemonContext } from "../Contexts/PokemonContext";

function usePokmonContext() {
    const context = useContext(PokemonContext);

    return context;
}

export default usePokmonContext;