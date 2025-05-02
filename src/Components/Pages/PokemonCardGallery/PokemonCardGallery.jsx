import PokemonCard from '../../Common/PokemonCard/PokemonCard';
import usePokmonContext from '../../../Hooks/usePokemonContext';
import PokemonTypeFilter from './PokemonTypeFilter/PokemonTypeFilter';
import PokemonSearchFilter from './PokemonSearchFilter/PokemonSearchFilter';
import PokemonSortOptions from './PokemonSortOptions/PokemonSortOptions';
import PokemonPagination from './PokemonPagination/PokemonPagination';

export default function PokemonCardGallery() {
  const { state, dispatch } = usePokmonContext();
  
  const clearAllFilters = () => {
    dispatch({
      type: "CLEAR_ALL_FILTERS"
    });
  };
  
  // Calculate which Pokemon to show on the current page
  const getPaginatedPokemons = () => {
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    return state.pokemonsToDisplay.slice(startIndex, endIndex);
  };
  
  const paginatedPokemons = getPaginatedPokemons();
  
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Pokémon Gallery</h1>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 mb-6">
        <PokemonSearchFilter />
        <PokemonSortOptions />
      </div>
      
      <PokemonTypeFilter />
      
      <div className="text-gray-600 mb-4">
        Showing {state.pokemonsToDisplay.length} of {state.allPokemons.length} Pokémon
        {(state.selectedTypes.length > 0 || state.searchQuery) && (
          <span>
            {state.selectedTypes.length > 0 && (
              <span className='capitalize'> filtered by type: {state.selectedTypes.join(', ')}</span>
            )}
            {state.searchQuery && (
              <span> matching "{state.searchQuery}"</span>
            )}
          </span>
        )}
      </div>
      
      {state.allPokemons.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray-500">Loading Pokémon...</p>
        </div>
      ) : state.pokemonsToDisplay.length === 0 ? (
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedPokemons.map(pokemon => (
              <PokemonCard key={pokemon.name} pokemonName={pokemon.name} />
            ))}
          </div>
          
          <PokemonPagination />
        </>
      )}
    </div>
  );
}