import { typeColors } from "../../../../utils/typeColors";

export default function PokemonDisplay({ pokemon, side, setSelectedSide, setShowModal }) {

    const getStatBarWidth = (stat, maxStat = 255) => {
        const percentage = (stat / maxStat) * 100;
        return `${Math.min(percentage, 100)}%`;
    };

    const getTypeColor = (type) => {

        return typeColors[type] || 'bg-gray-400';
    };

    const openSelectionModal = (side) => {
        setSelectedSide(side);
        setShowModal(true);
    };

    if (!pokemon) {
        return (
            <div className="flex-1 bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center min-h-80">
                <button
                    onClick={() => openSelectionModal(side)}
                    className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                >
                    Select Pokémon
                </button>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-white rounded-lg shadow-md p-6 flex flex-col">
            <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold capitalize mb-2">{pokemon.name}</h2>
                <span className="text-gray-500">#{pokemon.id.toString().padStart(3, '0')}</span>
            </div>

            <div className="flex justify-center my-4">
                <img
                    src={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}
                    alt={pokemon.name}
                    className="h-40 w-40 object-contain"
                />
            </div>

            <div className="mb-4">
                <p className="text-sm text-gray-600 italic mb-3">{pokemon.description}</p>

                <div className="flex gap-2 mb-3">
                    {pokemon.types.map(type => (
                        <span
                            key={type.type.name}
                            className={`${getTypeColor(type.type.name)} text-white px-3 py-1 rounded-full text-sm capitalize`}
                        >
                            {type.type.name}
                        </span>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div>
                        <span className="font-medium">Height:</span> {pokemon.height / 10}m
                    </div>
                    <div>
                        <span className="font-medium">Weight:</span> {pokemon.weight / 10}kg
                    </div>
                    <div className="col-span-2">
                        <span className="font-medium">Abilities:</span> {pokemon.abilities.map(a => a.ability.name).join(', ')}
                    </div>
                </div>

                <div className="space-y-2">
                    {pokemon.stats.map(stat => (
                        <div key={stat.stat.name} className="text-sm">
                            <div className="flex justify-between">
                                <span className="capitalize">{stat.stat.name.replace('-', ' ')}</span>
                                <span className="font-medium">{stat.base_stat}</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                                <div
                                    className={`h-full ${stat.stat.name === 'hp' ? 'bg-green-500' :
                                        stat.stat.name === 'attack' ? 'bg-red-500' :
                                            stat.stat.name === 'defense' ? 'bg-blue-500' :
                                                stat.stat.name === 'special-attack' ? 'bg-purple-500' :
                                                    stat.stat.name === 'special-defense' ? 'bg-indigo-500' :
                                                        'bg-yellow-500'}`}
                                    style={{ width: getStatBarWidth(stat.base_stat) }}
                                ></div>
                            </div>
                        </div>
                    ))}
                    <div className="text-sm pt-1 border-t border-gray-200">
                        <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>{pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={() => openSelectionModal(side)}
                className="mt-auto bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg self-center font-medium transition-colors"
            >
                Change Pokémon
            </button>
        </div>
    );
};