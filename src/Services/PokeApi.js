import axios from "axios";

const getInitialPokemons = async () => {
  try {
    const res = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=150");
    const results = res.data.results;
    
    if(results && results.length) {
      for(let i = 0; i < results.length; i++) {
        const details = await axios.get(`https://pokeapi.co/api/v2/pokemon/${results[i].name.toLowerCase()}`);
        if (!details) throw new Error('Failed to fetch Pokémon');
        results[i].details = details.data;
      }
    }

    return results;
  } catch (error) {
    console.error("Error fetching initial Pokémon:", error);
  }
    
}

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