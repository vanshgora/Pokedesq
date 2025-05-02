import { createContext, useReducer } from "react";

const initialValue = {
  allPokemons: [],
  allTypes: [],
  selectedTypes: [],
  searchQuery: '',
  pokemonsToDisplay: [],
  sortBy: 'id',           
  sortDirection: 'asc',
  // Pagination related state
  currentPage: 1,
  itemsPerPage: 20,
  totalPages: 1
};

function sortPokemons(pokemons, sortBy, sortDirection) {
  if (!pokemons || pokemons.length === 0) return [];
  
  return [...pokemons].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'id') {
      const idA = a.id || parseInt(a.url?.split('/').filter(Boolean).pop());
      const idB = b.id || parseInt(b.url?.split('/').filter(Boolean).pop());
      comparison = idA - idB;
    } else if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
}

function filterPokemons(allPokemons, selectedTypes, searchQuery) {
  if (!allPokemons || allPokemons.length === 0) return [];
  
  return allPokemons.filter(pokemon => {
    const typeMatch = selectedTypes.length === 0 || 
      pokemon.details?.types.some(t => selectedTypes.includes(t.type.name));

    const queryMatch = searchQuery === '' || 
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatch && queryMatch;
  });
}

function pokemonReducer(state, action) {
  switch(action.type) {
    case "SET_INITIAL_DATA":
      const allPokemons = action.payload;
      const typesSet = new Set();
      
      for(const pokemon of allPokemons) {
        pokemon.details.types.forEach(type => typesSet.add(type.type.name));
      }
      
      const sortedInitialPokemons = sortPokemons(allPokemons, state.sortBy, state.sortDirection);
      
      return { 
        ...state, 
        allPokemons: allPokemons, 
        allTypes: Array.from(typesSet).sort(), 
        pokemonsToDisplay: sortedInitialPokemons,
        totalPages: Math.ceil(sortedInitialPokemons.length / state.itemsPerPage)
      };
      
    case "FILTER_BY_TYPES":
      const prevSelectedTypes = state.selectedTypes;
      const pokemonType = action.payload.pokemonType;
      
      const newSelectedTypes = prevSelectedTypes.includes(pokemonType)
        ? prevSelectedTypes.filter(t => t !== pokemonType)
        : [...prevSelectedTypes, pokemonType];
      
      const filteredByTypes = filterPokemons(state.allPokemons, newSelectedTypes, state.searchQuery);
      
      const sortedFilteredByTypes = sortPokemons(filteredByTypes, state.sortBy, state.sortDirection);
      
      return { 
        ...state, 
        selectedTypes: newSelectedTypes, 
        pokemonsToDisplay: sortedFilteredByTypes,
        // Reset to page 1 when filters change
        currentPage: 1
      };
      
    case "SEARCH_FILTER":
      const newSearchQuery = action.payload;
      
      const filteredBySearch = filterPokemons(state.allPokemons, state.selectedTypes, newSearchQuery);
      
      const sortedFilteredBySearch = sortPokemons(filteredBySearch, state.sortBy, state.sortDirection);
      
      return { 
        ...state, 
        searchQuery: newSearchQuery, 
        pokemonsToDisplay: sortedFilteredBySearch,
        // Reset to page 1 when search changes
        currentPage: 1
      };
      
    case "CLEAR_ALL_FILTERS":
      const sortedAllPokemons = sortPokemons(state.allPokemons, state.sortBy, state.sortDirection);
      
      return {
        ...state, 
        searchQuery: '', 
        selectedTypes: [], 
        pokemonsToDisplay: sortedAllPokemons,
        currentPage: 1
      };
      
    case "SET_SORT_BY":
      const newSortBy = action.payload;
      
      const currentFilteredPokemons = filterPokemons(state.allPokemons, state.selectedTypes, state.searchQuery);
      
      const newSortedPokemons = sortPokemons(currentFilteredPokemons, newSortBy, state.sortDirection);
      
      return {
        ...state,
        sortBy: newSortBy,
        pokemonsToDisplay: newSortedPokemons
      };
      
    case "SET_SORT_DIRECTION":
      const newSortDirection = action.payload;
      
      const filteredForDirectionChange = filterPokemons(state.allPokemons, state.selectedTypes, state.searchQuery);
      
      const directionSortedPokemons = sortPokemons(filteredForDirectionChange, state.sortBy, newSortDirection);
      
      return {
        ...state,
        sortDirection: newSortDirection,
        pokemonsToDisplay: directionSortedPokemons
      };
    
    // Pagination reducer cases
    case "SET_CURRENT_PAGE":
      return {
        ...state,
        currentPage: action.payload
      };
      
    case "SET_ITEMS_PER_PAGE":
      return {
        ...state,
        itemsPerPage: action.payload,
        currentPage: 1 // Reset to first page when changing items per page
      };
      
    case "SET_TOTAL_PAGES":
      return {
        ...state,
        totalPages: action.payload
      };
      
    default:
      return state;
  }
}

export const PokemonContext = createContext(initialValue);

export function PokemonProvider({children}) {
  const [state, dispatch] = useReducer(pokemonReducer, initialValue);
  
  return (
    <PokemonContext.Provider value={{ state, dispatch }}>
      {children}
    </PokemonContext.Provider>
  );
}