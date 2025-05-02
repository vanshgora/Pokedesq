const FAVORITES_KEY = 'favorite_pokemon';

export const getFavoritePokemon = () => {
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorite Pokémon:', error);
    return [];
  }
};

export const addToFavorites = (pokemonId) => {
  try {
    const favorites = getFavoritePokemon();
    if (!favorites.includes(pokemonId)) {
      const updatedFavorites = [...favorites, pokemonId];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      return true;
    }
    return false; // Already in favorites
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
};

export const removeFromFavorites = (pokemonId) => {
  try {
    const favorites = getFavoritePokemon();
    const updatedFavorites = favorites.filter(id => id !== pokemonId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
};

export const isFavorite = (pokemonId) => {
  try {
    const favorites = getFavoritePokemon();
    return favorites.includes(pokemonId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

export const toggleFavorite = (pokemonId) => {
  if (isFavorite(pokemonId)) {
    return removeFromFavorites(pokemonId);
  } else {
    return addToFavorites(pokemonId);
  }
};