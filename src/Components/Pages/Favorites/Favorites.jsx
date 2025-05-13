import { useEffect, useState } from "react";
import PokemonCard from "../../Common/PokemonCard/PokemonCard";
import { getFavoritePokemon } from "../../../Services/FavoritesService";
import usePokemonContext from "../../../Hooks/usePokemonContext";

const Favorites = () => {
  const { state } = usePokemonContext();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const loadFavorites = () => {
    try {
      setLoading(true);
     
      const favoriteIds = getFavoritePokemon();
      
      if (favoriteIds.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }


      if (state.allPokemons.length > 0) {
      
        const favoritePokemonNames = favoriteIds.map(id => {
  
          const pokemon = state.allPokemons.find(p => {

            const pokemonId = p?.id || parseInt(p.url?.split('/').filter(Boolean).pop());
            return pokemonId === parseInt(id);
          });
          
          return pokemon ? pokemon.name : `unknown-${id}`;
        });
        
        setFavorites(favoritePokemonNames);
        setLoading(false);
      } else {
        
        fetchPokemonNames(favoriteIds)
          .then(pokemonNames => {
            setFavorites(pokemonNames);
            setLoading(false);
          })
          .catch(err => {
            setError(err.message);
            setLoading(false);
          });
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  

  const fetchPokemonNames = async (ids) => {
    try {
      const promises = ids.map(id => 
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
          .then(response => {
            if (!response.ok) throw new Error(`Error fetching Pokémon #${id}`);
            return response.json();
          })
          .then(data => data.name)
          .catch(err => {
            console.error(`Failed to fetch name for Pokémon #${id}:`, err);
            return `unknown-${id}`
          })
      );
      
      return await Promise.all(promises);
    } catch (error) {
      console.error("Error fetching Pokémon names:", error);
      throw error;
    }
  };
  
  useEffect(() => {
    loadFavorites();
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', loadFavorites);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', loadFavorites);
    };
  }, [state.allPokemons]);
  
  const handleStorageChange = (event) => {
    if (event.key === 'favorite_pokemon') {
      loadFavorites();
    }
  };
  
  const refreshFavorites = () => {
    loadFavorites();
  };
  
  if (loading && state.allPokemons.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">My Favorite Pokémon</h1>
        <div className="flex justify-center">
          <p className="text-gray-500">Loading favorites...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">My Favorite Pokémon</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error loading favorites: {error}</p>
          <button 
            onClick={refreshFavorites}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (favorites.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">My Favorite Pokémon</h1>
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-yellow-700 mb-2">No favorites yet!</h2>
          <p className="text-gray-600 mb-4">
            You haven't added any Pokémon to your favorites list.
            Browse Pokémon and click the heart icon to add them here.
          </p>
          <a 
            href="/" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Browse Pokémon
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Favorite Pokémon</h1>
        <button 
          onClick={refreshFavorites}
          className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((pokemonName) => (
          <PokemonCard key={pokemonName} pokemonName={pokemonName} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
