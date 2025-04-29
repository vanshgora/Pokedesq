import { useEffect, useState } from 'react';
import PokemonCard from '../PokemonCard/PokemonCard';
import { getInitialPokemons } from '../../Services/PokeApi';
import { typeColors } from '../../utils/typeColors';

export default function PokemonCardGallery() {
  const [pokemonNames, setPokemonNames] = useState([]);
  const [filteredPokemonNames, setFilteredPokemonNames] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [typesLoading, setTypesLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    async function fetchPokemon() {
      setLoading(true);
      const pokemonsData = await getInitialPokemons();
      const names = pokemonsData.results.map(p => p.name);
      setPokemonNames(names);
      setFilteredPokemonNames(names); 
      setLoading(false);
    }
    
    fetchPokemon();
  }, []);
  
  useEffect(() => {
    async function fetchPokemonTypes() {
      if (pokemonNames.length === 0) return;
      
      setTypesLoading(true);
      const typesSet = new Set();
      const details = {};
      
      for (const name of pokemonNames) {
        try {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
          if (!response.ok) throw new Error(`Failed to fetch ${name}`);
          
          const data = await response.json();
          const types = data.types.map(type => type.type.name);
          details[name] = { types };
          
          types.forEach(type => typesSet.add(type));
        } catch (error) {
          console.error(`Error fetching types for ${name}:`, error);
          details[name] = { types: [] }; // Set empty types if fetch fails
        }
      }
      
      setPokemonDetails(details);
      setAvailableTypes(Array.from(typesSet).sort());
      setTypesLoading(false);
    }
    
    fetchPokemonTypes();
  }, [pokemonNames]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      const filtered = pokemonNames.filter(name => {
        const matchesSearch = searchQuery === '' || 
          name.toLowerCase().includes(searchQuery.toLowerCase());
  
        const types = pokemonDetails[name]?.types || [];
        const matchesType = selectedTypes.length === 0 || 
          selectedTypes.some(type => types.includes(type));
  
        return matchesSearch && matchesType;
      });
  
      setFilteredPokemonNames(filtered);
    }, 500);
  
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, selectedTypes, pokemonNames, pokemonDetails]);
  
  
  const toggleTypeSelection = (type) => {
    setSelectedTypes(prevTypes => {
      if (prevTypes.includes(type)) {
        return prevTypes.filter(t => t !== type);
      } else {
        return [...prevTypes, type];
      }
    });
  };
  
  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSearchQuery('');
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Pokémon Gallery</h1>
      </div>
      
      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Pokémon by name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-3 pl-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Filter by Type</h2>
          {(selectedTypes.length > 0 || searchQuery) && (
            <button 
              onClick={clearAllFilters}
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
        
        {typesLoading ? (
          <p className="text-gray-500">Loading types...</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableTypes.map(type => (
              <button
                key={type}
                onClick={() => toggleTypeSelection(type)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 capitalize
                  ${selectedTypes.includes(type) 
                    ? `${typeColors[type] || 'bg-gray-400'} text-white` 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>
    
      <div className="text-gray-600 mb-4">
        Showing {filteredPokemonNames.length} of {pokemonNames.length} Pokémon
        {(selectedTypes.length > 0 || searchQuery) && (
          <span>
            {selectedTypes.length > 0 && (
              <span className='capitalize'> filtered by type: {selectedTypes.join(', ')}</span>
            )}
            {searchQuery && (
              <span> matching "{searchQuery}"</span>
            )}
          </span>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray-500">Loading Pokémon...</p>
        </div>
      ) : filteredPokemonNames.length === 0 ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <p className="text-xl text-gray-700 mb-4">No Pokémon match your search criteria</p>
            <button 
              onClick={clearAllFilters}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPokemonNames.map(pokemon => (
            <PokemonCard key={pokemon} pokemonName={pokemon} />
          ))}
        </div>
      )}
    </div>
  );
}