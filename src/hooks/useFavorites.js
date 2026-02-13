import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, TOAST_TYPES } from '../utils/constants';

/**
 * Custom hook for managing favorites
 */
export function useFavorites(showToast) {
  const [favorites, setFavorites] = useLocalStorage(STORAGE_KEYS.FAVORITES, []);

  /**
   * Check if a recipe is favorited
   */
  const isFavorite = useCallback((recipeId) => {
    return favorites.some(fav => fav.idMeal === recipeId);
  }, [favorites]);

  /**
   * Toggle favorite status of a recipe
   */
  const toggleFavorite = useCallback((recipe) => {
    const isAlreadyFavorite = isFavorite(recipe.idMeal);

    if (isAlreadyFavorite) {
      // Remove from favorites
      const newFavorites = favorites.filter(fav => fav.idMeal !== recipe.idMeal);
      setFavorites(newFavorites);
      showToast(`Removed "${recipe.strMeal}" from favorites`, TOAST_TYPES.INFO);
    } else {
      // Add to favorites
      const newFavorites = [...favorites, recipe];
      setFavorites(newFavorites);
      showToast(`Added "${recipe.strMeal}" to favorites!`, TOAST_TYPES.SUCCESS);
    }
  }, [favorites, setFavorites, isFavorite, showToast]);

  /**
   * Clear all favorites
   */
  const clearAllFavorites = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all favorites?')) {
      const count = favorites.length;
      setFavorites([]);
      showToast(
        `Removed ${count} favorite${count > 1 ? 's' : ''}`,
        TOAST_TYPES.SUCCESS
      );
    }
  }, [favorites, setFavorites, showToast]);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    clearAllFavorites
  };
}

