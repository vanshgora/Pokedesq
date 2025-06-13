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
  const [hover, setHover] = useState(false);

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
          description: pokemonData.description,
          stats: pokemonData.stats
        });
        setLoading(false);
        setIsFavorited(isFavorite(pokemonData.id));
      } catch (error) {
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
    <div className="p-6 max-w-sm mx-auto bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm backdrop-blur-sm">
      <div className="animate-pulse flex flex-col">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-1"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
    </div>
  );

  if (error && !pokemon) return (
    <div className="p-6 max-w-sm mx-auto bg-white/80 dark:bg-gray-800/80 rounded-xl border border-red-200 dark:border-red-900/50 shadow-sm backdrop-blur-sm">
      <div className="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-red-600 dark:text-red-400">Error loading Pokémon</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{error.message}</p>
      </div>
    </div>
  );

  if (!pokemon) return null;

  const formatName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const formatId = (id) => {
    return `#${id.toString().padStart(3, '0')}`;
  };

  const primaryType = pokemon.types[0].type.name;
  const cardBgColor = typeColors[primaryType] ? `${typeColors[primaryType]}10` : 'bg-gray-100';
  const darkCardBgColor = typeColors[primaryType] ? `${typeColors[primaryType]}20` : 'bg-gray-700';

  return (
    <div
      className={`relative max-w-sm mx-auto rounded-2xl overflow-hidden shadow-lg border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 ${hover ? 'scale-[1.02] shadow-xl' : ''}`}
      onClick={() => navigate('/pokemon/' + pokemon.id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 ${typeColors[primaryType] || 'bg-gray-400'} opacity-10 dark:opacity-20`}></div>
      
 
      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      
        <div className="flex justify-between items-center p-4">
          <span className="text-gray-500 dark:text-gray-300 font-bold text-sm">
            {formatId(pokemon.id)}
          </span>
          <button
            onClick={handleFavoriteToggle}
            className="z-10 p-2 rounded-full hover:bg-white/20 transition-colors duration-200 cursor-pointer"
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isFavorited ? "currentColor" : "none"}
              stroke="currentColor"
              className={`w-6 h-6 ${isFavorited ? 'text-red-500' : 'text-gray-400 dark:text-gray-300'}`}
              strokeWidth={isFavorited ? "0" : "2"}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
        </div>
        
        {/* Pokemon image */}
        <div className="flex justify-center p-4">
          <img
            src={pokemon.image || "/api/placeholder/200/200"}
            alt={pokemon.name}
            className="h-48 w-48 object-contain transition-transform duration-300 hover:scale-110 shadow-image floating-img"
          />
        </div>
        
        {/* Pokemon details */}
        <div className="p-5 pt-0">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 text-center">
            {formatName(pokemon.name)}
          </h2>
          
          {/* Types */}
          <div className="flex justify-center gap-2 mb-4">
            {pokemon.types.map((type) => (
              <span
                key={type.type.name}
                className={`${typeColors[type.type.name] || 'bg-gray-400'} text-white px-4 py-1 rounded-full text-xs font-semibold shadow-sm`}
              >
                {formatName(type.type.name)}
              </span>
            ))}
          </div>
          
          {/* Description */}
          <div className="bg-white/50 dark:bg-gray-700/50 rounded-xl p-4 mb-4">
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              {expanded ? pokemon.description : `${pokemon.description.slice(0, 100)}...`}
            </p>
            <button
              onClick={(e) => {
                setExpanded(!expanded);
                e.stopPropagation();
              }}
              className="mt-2 text-sm font-medium text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          </div>
          
          {/* Stats (simplified) */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
            {pokemon.stats.slice(0, 3).map(stat => (
              <div key={stat.stat.name} className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
                <div className="font-bold text-gray-500 dark:text-gray-300 uppercase">
                  {stat.stat.name.replace('-', ' ')}
                </div>
                <div className="font-bold text-gray-800 dark:text-white">
                  {stat.base_stat}
                </div>
              </div>
            ))}
          </div>
          
          {/* View button */}
          <button 
            onClick={() => navigate('/pokemon/' + pokemon.id)}
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-sm transition-all duration-300 transform hover:scale-[1.02]"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;