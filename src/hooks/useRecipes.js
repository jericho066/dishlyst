import { useState, useCallback } from 'react';
import * as api from '../utils/api';

/**
 * Custom hook for managing recipe data and operations
 */
export function useRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ category: '', area: '' });

  /**
   * Load random recipes
   */
  const loadRandomRecipes = useCallback(async () => {
    setLoading(true);
    const data = await api.getRandomRecipes();
    setRecipes(data);
    setLoading(false);
  }, []);

  /**
   * Search recipes by query
   */
  const searchRecipes = useCallback(async (query) => {
    setLoading(true);
    const data = await api.searchRecipes(query);
    setRecipes(data);
    setLoading(false);
  }, []);

  /**
   * Apply filters to recipes
   */
  const applyFilters = useCallback(async (newFilters) => {
    setLoading(true);
    setFilters(newFilters);
    const data = await api.applyFilters(newFilters);
    setRecipes(data);
    setLoading(false);
  }, []);

  /**
   * Clear filters and load random recipes
   */
  const clearFilters = useCallback(() => {
    setFilters({ category: '', area: '' });
    loadRandomRecipes();
  }, [loadRandomRecipes]);

  /**
   * Refresh recipes (clear search/filters and load new random recipes)
   */
  const refreshRecipes = useCallback(async () => {
    setFilters({ category: '', area: '' });
    await loadRandomRecipes();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [loadRandomRecipes]);

  return {
    recipes,
    loading,
    filters,
    setFilters,
    loadRandomRecipes,
    searchRecipes,
    applyFilters,
    clearFilters,
    refreshRecipes
  };
}
