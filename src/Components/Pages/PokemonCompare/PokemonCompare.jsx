import { useState, useCallback } from 'react';
import usePokmonContext from '../../../Hooks/usePokemonContext';
import { fetchPokemonService } from '../../../Services/PokeApi';
import PokemonDisplay from './PokemenDisplay/PokemonDisplay';
import PokemonSelector from './PokemonSelector/PokemonSelector';

const PokemonComparison = () => {
  const { state } = usePokmonContext();
  const [leftPokemon, setLeftPokemon] = useState(null);
  const [rightPokemon, setRightPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedSide, setSelectedSide] = useState(null);

  const fetchPokemon = async (pokemonName, setSide) => {
    if (!pokemonName) return;

    setLoading(true);
    setError('');

    try {
      const data = await fetchPokemonService(pokemonName);
      setSide(data);
    } catch (error) {
      setError(`Failed to load ${pokemonName}. Please try another Pokémon.`);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomComparison = async () => {
    setLoading(true);
    setError('');

    if (state.allPokemons.length === 0) {
      setError('Pokémon list not loaded yet. Please try again.');
      setLoading(false);
      return;
    }

    try {

      const randomIndex1 = Math.floor(Math.random() * state.allPokemons.length);
      let randomIndex2 = Math.floor(Math.random() * state.allPokemons.length);

      while (randomIndex1 === randomIndex2) {
        randomIndex2 = Math.floor(Math.random() * state.allPokemons.length);
      }

      const pokemon1 = state.allPokemons[randomIndex1];
      const pokemon2 = state.allPokemons[randomIndex2];

      const [leftData, rightData] = await Promise.all([
        fetchPokemonService(pokemon1.name),
        fetchPokemonService(pokemon2.name)
      ]);

      setLeftPokemon(leftData);
      setRightPokemon(rightData);
    } catch (error) {
      setError('Failed to load random Pokémon. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getComparisonMessage = useCallback(() => {
    if (!leftPokemon || !rightPokemon) return '';

    const leftTotal = leftPokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
    const rightTotal = rightPokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);

    const difference = Math.abs(leftTotal - rightTotal);
    const stronger = leftTotal > rightTotal ? leftPokemon.name : rightPokemon.name;

    if (difference < 30) {
      return `${leftPokemon.name} and ${rightPokemon.name} are fairly evenly matched!`;
    } else {
      return `${stronger} has stronger overall stats by ${difference} points!`;
    }
  }, [leftPokemon, rightPokemon]);


  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Pokémon Comparison</h1>
        <p className="text-gray-600 dark:text-gray-300">Compare stats and details between two Pokémon</p>
      </div>

      <div className="mb-6 flex justify-center">
        <button
          onClick={handleRandomComparison}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 px-6 rounded-lg font-medium transition-colors"
        >
          {loading ? 'Loading...' : 'Random Comparison'}
        </button>
      </div>

      {error && (
        <div className="mb-6 text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {leftPokemon && rightPokemon && (
        <div className="text-center mb-6">
          <p className="text-lg font-medium text-blue-700 dark:text-blue-400">{getComparisonMessage()}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <PokemonDisplay
          pokemon={leftPokemon}
          side="left"
          setSelectedSide={setSelectedSide}
          setShowModal={setShowModal}
          opponent={rightPokemon}
        />
        <div className="flex items-center justify-center">
          <div className="hidden md:flex h-12 w-12 bg-red-500 rounded-full text-white font-bold items-center justify-center text-2xl">
            VS
          </div>
          <div className="md:hidden h-12 w-full flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">VS</span>
          </div>
        </div>
        <PokemonDisplay
          pokemon={rightPokemon}
          side="right"
          setSelectedSide={setSelectedSide}
          setShowModal={setShowModal}
          opponent={leftPokemon}
        />
      </div>

      {showModal && (
        <PokemonSelector
          fetchPokemon={fetchPokemon}
          setShowModal={setShowModal}
          selectedSide={selectedSide}
          setLeftPokemon={setLeftPokemon}
          setRightPokemon={setRightPokemon}
        />
      )}
    </div>
  );
};

export default PokemonComparison;