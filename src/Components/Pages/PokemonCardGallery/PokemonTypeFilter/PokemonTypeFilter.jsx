import usePokmonContext from "../../../../Hooks/usePokemonContext"
import { typeColors } from "../../../../utils/typeColors"

export default function PokemonTypeFilter() {

    const { state, dispatch } = usePokmonContext();

    const { selectedTypes, searchQuery, allTypes, allPokemons } = state;

    const clearAllFilters = () => {
      dispatch({
        type: "CLEAR_ALL_FILTERS"
      });
    };

    const toggleTypeSelection = (pokemonType) => {
        dispatch({
          type: "FILTER_BY_TYPES",
          payload: {
            pokemonType: pokemonType
          }
        });
      };
    return <>
    <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Filter by Type</h2>
          {((selectedTypes && selectedTypes.length > 0) || (searchQuery && state.searchQuery)) && (
            <button 
              onClick={clearAllFilters}
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
        
        {(allPokemons && !allPokemons.length) ? (
          <p className="text-gray-500">Loading types...</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {allTypes && allTypes.map(type => (
              <button
                key={type}
                onClick={() => toggleTypeSelection(type)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 capitalize
                  ${selectedTypes && selectedTypes.includes(type) 
                    ? `${typeColors[type] || 'bg-gray-400'} text-white` 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
}