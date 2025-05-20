import { useState, useEffect } from "react";
import usePokmonContext from "../../../../Hooks/usePokemonContext";

export default function PokemonSearchFilter() {
  const { state, dispatch } = usePokmonContext();
  const [searchQuery, setSearchQuery] = useState(state.searchQuery);

  useEffect(() => {
    setSearchQuery(state.searchQuery);
  }, [state.searchQuery]);
  
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchQuery !== state.searchQuery) {
        dispatch({
          type: "SEARCH_FILTER",
          payload: searchQuery
        });
      }
    }, 500);
    
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, dispatch, state.searchQuery]);
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  return (
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
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}