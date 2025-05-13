import usePokemonContext from "../../../../Hooks/usePokemonContext";
import { useState, useEffect } from "react";

export default function PokemonSelector({ setShowModal, fetchPokemon, selectedSide, setLeftPokemon, setRightPokemon }) {
  const { state } = usePokemonContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer); 
  }, [searchTerm]);

  const handleSelectPokemon = (pokemonName) => {
    setShowModal(false);
    if (selectedSide === 'left') {
      fetchPokemon(pokemonName, setLeftPokemon);
    } else {
      fetchPokemon(pokemonName, setRightPokemon);
    }
  };

  const filteredPokemon = state.allPokemons.filter(pokemon => 
    pokemon.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-md w-full max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Select a Pokémon</h2>
          <button 
            onClick={() => setShowModal(false)} 
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search Pokémon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {filteredPokemon.map((pokemon) => (
            <button
              key={pokemon.name}
              onClick={() => handleSelectPokemon(pokemon.name)}
              className="p-2 bg-gray-100 rounded hover:bg-red-100 text-center capitalize transition-colors"
            >
              {pokemon.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
