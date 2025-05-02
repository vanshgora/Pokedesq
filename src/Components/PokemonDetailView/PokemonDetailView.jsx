import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { typeColors } from "../../utils/typeColors";
import { fetchPokemonService } from "../../Services/PokeApi";
import { isFavorite, toggleFavorite } from "../../Services/FavoritesService";

const PokemonDetailView = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState("stats");

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        setLoading(true);
        const pokemonData = await fetchPokemonService(id);
        setPokemon(pokemonData);
        setLoading(false);
        setIsFavorited(isFavorite(pokemonData.id));
      } catch (error) {
        setLoading(false);
        setError(error.message || "Failed to load Pokémon details");
      }
    };

    fetchPokemonDetails();
  }, [id]);

  const handleFavoriteToggle = () => {
    if (!pokemon) return;
    
    const result = toggleFavorite(pokemon.id);
    if (result) {
      setIsFavorited(!isFavorited);
    }
  };

  const formatName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const formatId = (id) => {
    return `#${id.toString().padStart(3, '0')}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-center text-gray-500">Loading Pokémon details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-center text-red-500">Error: {error}</p>
          <Link to="/" className="block text-center mt-4 text-blue-500 hover:underline">
            Back to List
          </Link>
        </div>
      </div>
    );
  }

  if (!pokemon) return null;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="bg-gray-100 p-6">
          <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">
            &larr; Back to List
          </Link>
          
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/3">
              <img
                src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-64 h-64 object-contain mx-auto"
              />
            </div>
            
            <div className="md:w-2/3 p-4">
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-3xl font-bold text-gray-800">{formatName(pokemon.name)}</h1>
                <span className="text-gray-500 font-medium text-xl">{formatId(pokemon.id)}</span>
              </div>
              
              <div className="mb-4 flex flex-wrap gap-2">
                {pokemon.types.map(type => (
                  <span
                    key={type.type.name}
                    className={`${typeColors[type.type.name] || 'bg-gray-400'} text-white px-3 py-1 rounded-full text-sm font-semibold`}
                  >
                    {formatName(type.type.name)}
                  </span>
                ))}
              </div>
              
              <button
                onClick={handleFavoriteToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
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
                  className="w-5 h-5"
                  strokeWidth={isFavorited ? "0" : "2"}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                {isFavorited ? 'Favorited' : 'Add to Favorites'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "stats" 
                  ? "border-b-2 border-blue-500 text-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("stats")}
            >
              Stats
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "abilities" 
                  ? "border-b-2 border-blue-500 text-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("abilities")}
            >
              Abilities
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "moves" 
                  ? "border-b-2 border-blue-500 text-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("moves")}
            >
              Moves
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "evolution" 
                  ? "border-b-2 border-blue-500 text-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("evolution")}
            >
              Evolution
            </button>
          </nav>
        </div>
        
        {/* Content Based on Active Tab */}
        <div className="p-6">
          {activeTab === "stats" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Base Stats</h2>
              <div className="space-y-3">
                {pokemon.stats.map(stat => (
                  <div key={stat.stat.name} className="flex items-center">
                    <div className="w-32 font-medium text-gray-700">
                      {formatName(stat.stat.name.replace('-', ' '))}
                    </div>
                    <div className="w-12 text-right pr-4">{stat.base_stat}</div>
                    <div className="flex-1">
                      <div className="bg-gray-200 h-2 rounded-full">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === "abilities" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Abilities</h2>
              <ul className="space-y-2">
                {pokemon.abilities.map(ability => (
                  <li key={ability.ability.name} className="bg-gray-50 p-3 rounded">
                    <div className="font-medium">{formatName(ability.ability.name.replace('-', ' '))}</div>
                    {ability.is_hidden && (
                      <div className="text-sm text-gray-500 mt-1">Hidden Ability</div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {activeTab === "moves" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Moves</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {pokemon.moves.slice(0, 30).map(move => (
                  <div key={move.move.name} className="bg-gray-50 p-2 rounded">
                    {formatName(move.move.name.replace('-', ' '))}
                  </div>
                ))}
              </div>
              {pokemon.moves.length > 30 && (
                <div className="mt-4 text-center text-gray-500">
                  Showing 30 of {pokemon.moves.length} moves
                </div>
              )}
            </div>
          )}
          
          {activeTab === "evolution" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Evolution Chain</h2>
              {pokemon.evolution_chain ? (
                <div className="flex flex-wrap justify-center gap-4">
                  {pokemon.evolution_chain.map((evo, index) => (
                    <div key={evo.id} className="text-center">
                      {index > 0 && (
                        <div className="text-gray-400 my-2">→</div>
                      )}
                      <Link 
                        to={`/pokemon/${evo.id}`}
                        className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                      >
                        <img 
                          src={evo.image || "/api/placeholder/96/96"} 
                          alt={evo.name}
                          className="w-24 h-24 mx-auto" 
                        />
                        <div className="mt-2 font-medium">{formatName(evo.name)}</div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">Evolution data not available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailView;