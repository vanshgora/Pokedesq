import { useState } from 'react';
import usePokmonContext from '../../../../Hooks/usePokemonContext';
import { ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export default function PokemonSortOptions() {
  const [isOpen, setIsOpen] = useState(false);
  const { state, dispatch } = usePokmonContext();
  const { sortBy, sortDirection } = state;

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSort = (sortOption, direction) => {
    dispatch({
      type: "SET_SORT_BY",
      payload: sortOption
    });
    dispatch({
      type: "SET_SORT_DIRECTION",
      payload: direction
    });
    setIsOpen(false);
  };

  const getSortLabel = () => {
    if (!sortBy) return "Sort By";
    
    const sortName = sortBy === 'id' ? 'ID' : 'Name';
    const directionText = sortDirection === 'asc' ? 'Ascending' : 'Descending';
    
    return `${sortName} (${directionText})`;
  };

  return (
    <div className="relative mb-4">
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-48 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="flex items-center">
          <ArrowUpDown className="w-4 h-4 mr-2 text-gray-500" />
          {getSortLabel()}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-48 mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <ul className="py-1">
            <li className="px-3 py-2 font-semibold text-gray-700 bg-gray-50 border-b border-gray-200">
              ID Number
            </li>
            <li
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                sortBy === 'id' && sortDirection === 'asc' ? 'bg-blue-50 font-medium' : ''
              }`}
              onClick={() => handleSort('id', 'asc')}
            >
              <span className="flex items-center">
                <ArrowUp className="w-4 h-4 mr-2 text-gray-500" />
                Lowest First
              </span>
            </li>
            <li
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                sortBy === 'id' && sortDirection === 'desc' ? 'bg-blue-50 font-medium' : ''
              }`}
              onClick={() => handleSort('id', 'desc')}
            >
              <span className="flex items-center">
                <ArrowDown className="w-4 h-4 mr-2 text-gray-500" />
                Highest First
              </span>
            </li>
            
            <li className="px-3 py-2 font-semibold text-gray-700 bg-gray-50 border-b border-t border-gray-200">
              Name
            </li>
            <li
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                sortBy === 'name' && sortDirection === 'asc' ? 'bg-blue-50 font-medium' : ''
              }`}
              onClick={() => handleSort('name', 'asc')}
            >
              <span className="flex items-center">
                <ArrowUp className="w-4 h-4 mr-2 text-gray-500" />
                A to Z
              </span>
            </li>
            <li
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                sortBy === 'name' && sortDirection === 'desc' ? 'bg-blue-50 font-medium' : ''
              }`}
              onClick={() => handleSort('name', 'desc')}
            >
              <span className="flex items-center">
                <ArrowDown className="w-4 h-4 mr-2 text-gray-500" />
                Z to A
              </span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}