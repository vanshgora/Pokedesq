import axios from "axios";

const getInitialPokemons = async () => {
  const query = `
    query getPokemons {
      pokemon_v2_pokemon(limit: 300) {
      id
        name
        pokemon_v2_pokemontypes {
          pokemon_v2_type {
            name
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      'https://beta.pokeapi.co/graphql/v1beta',
      {
        query,
        variables: null,
        operationName: 'getPokemons'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        }
      }
    );

    const pokemons = response.data.data.pokemon_v2_pokemon.map(pokemon => ({
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.pokemon_v2_pokemontypes.map(t => t.pokemon_v2_type.name)
    }));


    return pokemons;
  } catch (error) {
    console.error('Error fetching Pokémon:', error);
    return [];
  }
};


const fetchPokemonService = async (pokemonName) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
    if (!response) throw new Error('Failed to fetch Pokémon');
    const pokemonData = response.data;
    
    const speciesResponse = await axios.get(pokemonData.species.url);
    if (!speciesResponse.data) throw new Error('Failed to fetch species data');
    const speciesData = speciesResponse.data;
    
    const englishEntry = speciesData.flavor_text_entries.find(
      entry => entry.language.name === 'en'
    );
    
    const description = englishEntry ? englishEntry.flavor_text.replace(/\f/g, ' ') : 'No description available';
    pokemonData.description = description;
  
    return pokemonData;
  } catch(error) {
    console.log("Falling back to demo data due to error:", error.message);
  }
 
}

export {getInitialPokemons, fetchPokemonService}