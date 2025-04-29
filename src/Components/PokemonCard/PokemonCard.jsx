import { useEffect, useState } from "react";
import { typeColors } from "../../utils/typeColors";
import { fetchPokemonService } from "../../Services/PokeApi";

const PokemonCard = ({ pokemonName }) => {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const pokemonData = await fetchPokemonService(pokemonName);
        
        setPokemon({
          id: pokemonData.id,
          name: pokemonData.name,
          image: pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default,
          types: pokemonData.types,
          description: pokemonData.description
        });
        
        setLoading(false);
      } catch(error) {
        setLoading(false);
        setError(error);
      }
        
    };

    if (pokemonName) {
      fetchPokemon();
    }
  }, [pokemonName]);

  if (loading) return (
    <div className="p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md">
      <p className="text-center text-gray-500">Loading Pokémon data...</p>
    </div>
  );

  if (error && !pokemon) return (
    <div className="p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md">
      <p className="text-center text-red-500">Error: {error}</p>
      <p className="text-center text-gray-500 mt-2">No demo data available for this Pokémon</p>
    </div>
  );

  if (!pokemon) return null;

  const formatName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const formatId = (id) => {
    return `#${id.toString().padStart(3, '0')}`;
  };

  return (
    <div className="max-w-sm bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="bg-gray-100 p-4 flex justify-center">
        <img 
          src={pokemon.image || "/api/placeholder/200/200"} 
          alt={pokemon.name}
          className="h-48 w-48 object-contain"
        />
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-800">{formatName(pokemon.name)}</h2>
          <span className="text-gray-500 font-medium">{formatId(pokemon.id)}</span>
        </div>
        
        <div className="mb-4 flex flex-wrap gap-2">
          {pokemon.types.map(type => (
            <span 
              key={type.type.name}
              className={`${typeColors[type.type.name] || 'bg-gray-400'} text-white px-3 py-1 rounded-full text-xs font-semibold`}
            >
              {formatName(type.type.name)}
            </span>
          ))}
        </div>
        
        <p className="text-gray-700 mb-3">
          {expanded ? pokemon.description : `${pokemon.description.slice(0, 100)}...`}
        </p>
        
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-blue-500 hover:text-blue-700 font-medium text-sm"
          >
            {expanded ? 'Read less' : 'Read more'}
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;