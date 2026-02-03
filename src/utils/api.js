// src/utils/api.js

import { API_CONFIG } from './constants';

const { BASE_URL, RANDOM_RECIPE_COUNT, MAX_FILTER_RESULTS } = API_CONFIG;

/**
 * Search recipes by name
 */
export async function searchRecipes(query) {
  try {
    const response = await fetch(`${BASE_URL}/search.php?s=${query}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

/**
 * Get random recipes for homepage
 */
export async function getRandomRecipes(count = RANDOM_RECIPE_COUNT) {
  try {
    const promises = Array(count)
      .fill(null)
      .map(() => fetch(`${BASE_URL}/random.php`).then(res => res.json()));
    
    const results = await Promise.all(promises);
    const recipes = results.map(data => data.meals[0]);

    // Remove duplicate recipes
    const uniqueRecipes = recipes.filter(
      (recipe, index, self) =>
        index === self.findIndex(r => r.idMeal === recipe.idMeal)
    );

    return uniqueRecipes;
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    return [];
  }
}

/**
 * Filter recipes by category
 */
export async function filterByCategory(category) {
  try {
    const response = await fetch(`${BASE_URL}/filter.php?c=${category}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error filtering by category:', error);
    return [];
  }
}

/**
 * Filter recipes by area/cuisine
 */
export async function filterByArea(area) {
  try {
    const response = await fetch(`${BASE_URL}/filter.php?a=${area}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error filtering by area:', error);
    return [];
  }
}

/**
 * Get recipe by ID with full details
 */
export async function getRecipeById(id) {
  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
}

/**
 * Get detailed recipes from a list of basic recipe objects
 */
export async function getDetailedRecipes(recipes, limit = MAX_FILTER_RESULTS) {
  try {
    const detailedMeals = await Promise.all(
      recipes.slice(0, limit).map(meal => getRecipeById(meal.idMeal))
    );
    return detailedMeals.filter(recipe => recipe !== null);
  } catch (error) {
    console.error('Error fetching detailed recipes:', error);
    return [];
  }
}

/**
 * Apply filters - category and/or area
 */
export async function applyFilters(filters) {
  const { category, area } = filters;

  try {
    if (category && area) {
      // Both filters applied
      const categoryResults = await filterByCategory(category);
      const fullRecipes = await getDetailedRecipes(categoryResults);
      return fullRecipes.filter(recipe => recipe && recipe.strArea === area);
    } else if (category) {
      // Only category filter
      const categoryResults = await filterByCategory(category);
      return await getDetailedRecipes(categoryResults);
    } else if (area) {
      // Only area filter
      const areaResults = await filterByArea(area);
      return await getDetailedRecipes(areaResults);
    }
    
    return [];
  } catch (error) {
    console.error('Error applying filters:', error);
    return [];
  }
}