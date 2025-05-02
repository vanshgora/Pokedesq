import { useMemo, useCallback, memo } from 'react';
import PokemonCard from '../../Common/PokemonCard/PokemonCard';
import usePokmonContext from '../../../Hooks/usePokemonContext';
import PokemonTypeFilter from './PokemonTypeFilter/PokemonTypeFilter';
import PokemonSearchFilter from './PokemonSearchFilter/PokemonSearchFilter';
import PokemonSortOptions from './PokemonSortOptions/PokemonSortOptions';
import PokemonPagination from './PokemonPagination/PokemonPagination';

// Memoized filter summary component to prevent unnecessary re-renders
const FilterSummary = memo(({ totalShown, totalAvailable, selectedTypes, searchQuery, onClearFilters }) => (
  <div className="text-gray-600 mb-4 flex flex-wrap items-center gap-2">
    <span>Showing {totalShown} of {totalAvailable} Pokémon</span>
    {(selectedTypes.length > 0 || searchQuery) && (
      <>
        {selectedTypes.length > 0 && (
          <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
            Types: {selectedTypes.join(', ')}
          </span>
        )}
        {searchQuery && (
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
            Search: "{searchQuery}"
          </span>
        )}
        <button 
          onClick={onClearFilters}
          className="text-red-600 hover:text-red-800 text-sm font-medium ml-2"
        >
          Clear filters
        </button>
      </>
    )}
  </div>
));

// Memoized grid to avoid re-renders when pagination changes but not content
const PokemonGrid = memo(({ pokemons }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {pokemons.map(pokemon => (
      <PokemonCard key={pokemon.name} pokemonName={pokemon.name} />
    ))}
  </div>
));

// Empty state component extracted for cleaner code
const EmptyState = memo(({ onClearFilters }) => (
  <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md p-8">
    <div className="text-center">
      <p className="text-xl text-gray-700 mb-4">No Pokémon match your search criteria</p>
      <button 
        onClick={onClearFilters}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Clear all filters
      </button>
    </div>
  </div>
));

// Loading state component extracted
const LoadingState = memo(() => (
  <div className="flex justify-center items-center h-64">
    <p className="text-xl text-gray-500">Loading Pokémon...</p>
  </div>
));

function PokemonCardGallery() {
  const { state, dispatch } = usePokmonContext();
  
  // Memoize the clear filters function to prevent recreating on every render
  const clearAllFilters = useCallback(() => {
    dispatch({
      type: "CLEAR_ALL_FILTERS"
    });
  }, [dispatch]);
  
  // Memoize pagination calculation to avoid recalculating on every render
  const paginatedPokemons = useMemo(() => {
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    return state.pokemonsToDisplay.slice(startIndex, endIndex);
  }, [state.currentPage, state.itemsPerPage, state.pokemonsToDisplay]);
  
  // Determine which component to render based on state
  const renderContent = () => {
    if (state.allPokemons.length === 0) {
      return <LoadingState />;
    }
    
    if (state.pokemonsToDisplay.length === 0) {
      return <EmptyState onClearFilters={clearAllFilters} />;
    }
    
    return (
      <>
        <PokemonGrid pokemons={paginatedPokemons} />
        <PokemonPagination />
      </>
    );
  };

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
      
      <FilterSummary 
        totalShown={state.pokemonsToDisplay.length}
        totalAvailable={state.allPokemons.length}
        selectedTypes={state.selectedTypes}
        searchQuery={state.searchQuery}
        onClearFilters={clearAllFilters}
      />
      
      {renderContent()}
    </div>
  );
}

export default memo(PokemonCardGallery);
