import { useContext, useEffect } from 'react';
import { PokemonContext } from '../../../../Contexts/PokemonContext';

export default function PokemonPagination() {
  const { state, dispatch } = useContext(PokemonContext);
  const { 
    pokemonsToDisplay, 
    currentPage, 
    itemsPerPage,
    totalPages
  } = state;

  useEffect(() => {
    const calculatedTotalPages = Math.ceil(pokemonsToDisplay.length / itemsPerPage);
    
    if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
      dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
    }
    
    dispatch({ 
      type: "SET_TOTAL_PAGES", 
      payload: calculatedTotalPages 
    });
  }, [pokemonsToDisplay.length, itemsPerPage, currentPage, dispatch]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch({ type: "SET_CURRENT_PAGE", payload: newPage });
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    dispatch({ type: "SET_ITEMS_PER_PAGE", payload: parseInt(newItemsPerPage) });
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5; 
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
    
    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
      <div className="mb-4 md:mb-0">
        <label htmlFor="itemsPerPage" className="mr-2 text-gray-700">
          Show per page:
        </label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={(e) => handleItemsPerPageChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &laquo;
        </button>
        
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &lsaquo;
        </button>
        
        {getPageNumbers().map(number => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`px-3 py-1 rounded-md ${
              currentPage === number
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {number}
          </button>
        ))}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &rsaquo;
        </button>
        
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &raquo;
        </button>
      </div>
      
      <div className="mt-4 md:mt-0 text-gray-700">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}