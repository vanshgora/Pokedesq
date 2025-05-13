import { useEffect, useState } from "react";
import { typeColors } from "../../../utils/typeColors";
import { fetchPokemonService } from "../../../Services/PokeApi";
import { isFavorite, toggleFavorite } from "../../../Services/FavoritesService";
import { useNavigate } from "react-router-dom";

const PokemonCard = ({ pokemonName }) => {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const navigate = useNavigate();

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
       
        setIsFavorited(isFavorite(pokemonData.id));
      } catch(error) {
        setLoading(false);
        setError(error);
      }
    };
    
    if (pokemonName) {
      fetchPokemon();
    }
  }, [pokemonName]);

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    if (!pokemon) return;
    
    const result = toggleFavorite(pokemon.id);
    if (result) {
      setIsFavorited(!isFavorited);
    }
  };

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
    <div className="max-w-sm bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl cursor-pointer transition-shadow duration-300"
    onClick={() => {
      navigate('/pokemon/'+ pokemon.id);
    }}>
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
            onClick={(e) => {
              setExpanded(!expanded);
              e.stopPropagation();
            }}
            className="text-blue-500 hover:text-blue-700 font-medium text-sm cursor-pointer"
          >
            {expanded ? 'Read less' : 'Read more'}
          </button>
          
          <button
            onClick={handleFavoriteToggle}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${
              isFavorited 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill={isFavorited ? "currentColor" : "none"}
              stroke="currentColor" 
              className="w-4 h-4"
              strokeWidth={isFavorited ? "0" : "2"}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            {isFavorited ? 'Favorited' : 'Favorite'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;