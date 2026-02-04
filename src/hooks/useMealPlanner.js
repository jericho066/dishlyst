import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, TOAST_TYPES } from '../utils/constants';

/**
 * Get the start of the current week (Monday)
 */
function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

/**
 * Get array of dates for current week
 */
function getWeekDates(weekStart) {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    dates.push(date.toISOString().split('T')[0]); // YYYY-MM-DD format
  }
  return dates;
}

/**
 * Custom hook for managing meal planner
 */
export function useMealPlanner(showToast) {
  const [mealPlan, setMealPlan] = useLocalStorage(STORAGE_KEYS.MEAL_PLAN, {});
  const [currentWeekStart, setCurrentWeekStart] = useLocalStorage(
    STORAGE_KEYS.CURRENT_WEEK,
    getWeekStart().toISOString().split('T')[0]
  );

  /**
   * Get current week dates
   */
  const getCurrentWeekDates = useCallback(() => {
    return getWeekDates(new Date(currentWeekStart));
  }, [currentWeekStart]);

  /**
   * Add recipe to a meal slot
   */
  const addMeal = useCallback((date, mealType, recipe) => {
    setMealPlan(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        [mealType]: recipe
      }
    }));
    showToast(`Added "${recipe.strMeal}" to ${mealType}`, TOAST_TYPES.SUCCESS);
  }, [setMealPlan, showToast]);

  /**
   * Remove recipe from a meal slot
   */
  const removeMeal = useCallback((date, mealType) => {
    setMealPlan(prev => {
      const updated = { ...prev };
      if (updated[date]) {
        const recipeName = updated[date][mealType]?.strMeal || 'Recipe';
        updated[date] = { ...updated[date] };
        delete updated[date][mealType];
        
        // Remove date if no meals left
        if (Object.keys(updated[date]).length === 0) {
          delete updated[date];
        }
        
        showToast(`Removed "${recipeName}" from ${mealType}`, TOAST_TYPES.INFO);
      }
      return updated;
    });
  }, [setMealPlan, showToast]);

  /**
   * Get meal for a specific date and type
   */
  const getMeal = useCallback((date, mealType) => {
    return mealPlan[date]?.[mealType] || null;
  }, [mealPlan]);

  /**
   * Clear entire week
   */
  const clearWeek = useCallback(() => {
    if (window.confirm('Are you sure you want to clear this week\'s meal plan?')) {
      const weekDates = getCurrentWeekDates();
      setMealPlan(prev => {
        const updated = { ...prev };
        weekDates.forEach(date => {
          delete updated[date];
        });
        return updated;
      });
      showToast('Meal plan cleared', TOAST_TYPES.SUCCESS);
    }
  }, [getCurrentWeekDates, setMealPlan, showToast]);

  /**
   * Plan random week from favorites
   */
  const planRandomWeek = useCallback((favorites) => {
    if (favorites.length === 0) {
      showToast('Add some favorites first to plan a random week', TOAST_TYPES.INFO);
      return;
    }

    const weekDates = getCurrentWeekDates();
    const mealTypes = ['lunch', 'dinner'];
    const newPlan = {};

    weekDates.forEach(date => {
      newPlan[date] = {};
      mealTypes.forEach(mealType => {
        // 70% chance to add a meal
        if (Math.random() > 0.3) {
          const randomRecipe = favorites[Math.floor(Math.random() * favorites.length)];
          newPlan[date][mealType] = randomRecipe;
        }
      });
    });

    setMealPlan(prev => ({
      ...prev,
      ...newPlan
    }));

    showToast('Random week planned!', TOAST_TYPES.SUCCESS);
  }, [getCurrentWeekDates, setMealPlan, showToast]);

  /**
   * Generate shopping list from current week
   */
  const generateShoppingList = useCallback(() => {
    const weekDates = getCurrentWeekDates();
    const ingredients = [];
    const recipeNames = new Set();

    weekDates.forEach(date => {
      const dayMeals = mealPlan[date];
      if (dayMeals) {
        Object.values(dayMeals).forEach(recipe => {
          if (recipe) {
            recipeNames.add(recipe.strMeal);
            
            // Extract ingredients
            for (let i = 1; i <= 20; i++) {
              const ingredient = recipe[`strIngredient${i}`];
              const measure = recipe[`strMeasure${i}`];
              
              if (ingredient && ingredient.trim()) {
                ingredients.push({
                  id: `${recipe.idMeal}-${i}-${Date.now()}`,
                  recipeId: recipe.idMeal,
                  recipeName: recipe.strMeal,
                  ingredient: ingredient.trim(),
                  measure: measure?.trim() || '',
                  checked: false
                });
              }
            }
          }
        });
      }
    });

    return {
      ingredients,
      recipeCount: recipeNames.size
    };
  }, [getCurrentWeekDates, mealPlan]);

  /**
   * Navigate to previous week
   */
  const previousWeek = useCallback(() => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev.toISOString().split('T')[0]);
  }, [currentWeekStart, setCurrentWeekStart]);

  /**
   * Navigate to next week
   */
  const nextWeek = useCallback(() => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next.toISOString().split('T')[0]);
  }, [currentWeekStart, setCurrentWeekStart]);

  /**
   * Go to current week
   */
  const goToCurrentWeek = useCallback(() => {
    setCurrentWeekStart(getWeekStart().toISOString().split('T')[0]);
  }, [setCurrentWeekStart]);

  /**
   * Check if viewing current week
   */
  const isCurrentWeek = useCallback(() => {
    const today = getWeekStart();
    return currentWeekStart === today.toISOString().split('T')[0];
  }, [currentWeekStart]);

  return {
    mealPlan,
    currentWeekStart,
    getCurrentWeekDates,
    addMeal,
    removeMeal,
    getMeal,
    clearWeek,
    planRandomWeek,
    generateShoppingList,
    previousWeek,
    nextWeek,
    goToCurrentWeek,
    isCurrentWeek
  };
}
