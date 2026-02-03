// src/hooks/useShoppingList.js

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, TOAST_TYPES } from '../utils/constants';

/**
 * Extract ingredients from a recipe
 */
function extractIngredients(recipe) {
  const ingredients = [];
  
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        id: `${recipe.idMeal}-${i}`,
        recipeId: recipe.idMeal,
        recipeName: recipe.strMeal,
        ingredient: ingredient.trim(),
        measure: measure?.trim() || '',
        checked: false
      });
    }
  }
  
  return ingredients;
}

/**
 * Custom hook for managing shopping list
 */
export function useShoppingList(showToast) {
  const [shoppingList, setShoppingList] = useLocalStorage(
    STORAGE_KEYS.SHOPPING_LIST,
    []
  );

  /**
   * Add recipe ingredients to shopping list
   */
  const addToShoppingList = useCallback((recipe) => {
    const ingredients = extractIngredients(recipe);
    
    // Filter out duplicates
    const newItems = ingredients.filter(newItem =>
      !shoppingList.some(item =>
        item.ingredient.toLowerCase() === newItem.ingredient.toLowerCase() &&
        item.measure === newItem.measure
      )
    );
    
    if (newItems.length > 0) {
      const updatedList = [...shoppingList, ...newItems];
      setShoppingList(updatedList);
      showToast(
        `Added ${newItems.length} ingredient${newItems.length > 1 ? 's' : ''} from "${recipe.strMeal}"`,
        TOAST_TYPES.SUCCESS
      );
    } else {
      showToast(
        'All ingredients already in shopping list',
        TOAST_TYPES.INFO
      );
    }
  }, [shoppingList, setShoppingList, showToast]);

  /**
   * Toggle checked status of a shopping list item
   */
  const toggleItem = useCallback((itemId) => {
    const updatedList = shoppingList.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    setShoppingList(updatedList);
  }, [shoppingList, setShoppingList]);

  /**
   * Remove an item from shopping list
   */
  const removeItem = useCallback((itemId) => {
    const updatedList = shoppingList.filter(item => item.id !== itemId);
    setShoppingList(updatedList);
  }, [shoppingList, setShoppingList]);

  /**
   * Clear all items from shopping list
   */
  const clearAll = useCallback(() => {
    if (window.confirm('Are you sure you want to clear the entire shopping list?')) {
      const count = shoppingList.length;
      setShoppingList([]);
      showToast(
        `Removed ${count} item${count > 1 ? 's' : ''}`,
        TOAST_TYPES.SUCCESS
      );
    }
  }, [shoppingList, setShoppingList, showToast]);

  /**
   * Clear only checked items from shopping list
   */
  const clearChecked = useCallback(() => {
    const checkedCount = shoppingList.filter(item => item.checked).length;
    
    if (checkedCount === 0) {
      showToast('No checked items to clear', TOAST_TYPES.INFO);
      return;
    }

    if (window.confirm(`Remove ${checkedCount} checked item${checkedCount > 1 ? 's' : ''}?`)) {
      const updatedList = shoppingList.filter(item => !item.checked);
      setShoppingList(updatedList);
      showToast(
        `Removed ${checkedCount} checked item${checkedCount > 1 ? 's' : ''}`,
        TOAST_TYPES.SUCCESS
      );
    }
  }, [shoppingList, setShoppingList, showToast]);

  return {
    shoppingList,
    addToShoppingList,
    toggleItem,
    removeItem,
    clearAll,
    clearChecked
  };
}
