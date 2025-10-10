// src/api.js

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Search recipes by name
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

// Get random recipes (for homepage)
export async function getRandomRecipes(count = 8) {
  try {
    const promises = Array(count).fill(null).map(() => 
      fetch(`${BASE_URL}/random.php`).then(res => res.json())
    );
    const results = await Promise.all(promises);
    return results.map(data => data.meals[0]);
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    return [];
  }
}

// Get recipe by ID
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

