import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, TOAST_TYPES } from '../utils/constants';

/**
 * Generate unique ID
 */
function generateId() {
  return `coll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Pre-made collection suggestions
 */
export const SUGGESTED_COLLECTIONS = [
  {
    name: 'Quick Meals',
    description: 'Fast and easy recipes',
    icon: 'bi-lightning-charge-fill',
    color: '#f59e0b',
  },
  {
    name: 'Date Night',
    description: 'Romantic dinner ideas',
    icon: 'bi-heart-fill',
    color: '#ec4899',
  },
  {
    name: 'Meal Prep',
    description: 'Make ahead recipes',
    icon: 'bi-box-seam-fill',
    color: '#8b5cf6',
  },
  {
    name: 'Comfort Food',
    description: 'Feel-good favorites',
    icon: 'bi-fire',
    color: '#ea580c',
  },
  {
    name: 'Healthy',
    description: 'Nutritious and delicious',
    icon: 'bi-heart-pulse-fill',
    color: '#10b981',
  },
  {
    name: 'Party Food',
    description: 'Crowd pleasers',
    icon: 'bi-gift-fill',
    color: '#3b82f6',
  },
  {
    name: 'Italian',
    description: 'Italian cuisine',
    icon: 'bi-egg-fried',
    color: '#16a34a',
  },
  {
    name: 'Desserts',
    description: 'Sweet treats',
    icon: 'bi-cake2-fill',
    color: '#d946ef',
  },
];

/**
 * Available icon options for collections
 */
export const COLLECTION_ICONS = [
  'bi-heart-fill',
  'bi-star-fill',
  'bi-fire',
  'bi-lightning-charge-fill',
  'bi-bookmark-fill',
  'bi-cup-hot-fill',
  'bi-egg-fried',
  'bi-cake2-fill',
  'bi-basket-fill',
  'bi-box-seam-fill',
  'bi-gift-fill',
  'bi-heart-pulse-fill',
  'bi-mortarboard-fill',
  'bi-trophy-fill',
  'bi-sun-fill',
  'bi-moon-stars-fill',
  'bi-tree-fill',
  'bi-flower1',
  'bi-globe-americas',
  'bi-house-heart-fill',
];

/**
 * Default color options for collections
 */
export const COLLECTION_COLORS = [
  '#ea580c', // Orange
  '#ef4444', // Red
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Amber
  '#6366f1', // Indigo
  '#14b8a6', // Teal
  '#f97316', // Orange-red
];

/**
 * Custom hook for managing recipe collections
 */
export function useCollections(showToast, favorites = []) {
  const [collections, setCollections] = useLocalStorage(
    STORAGE_KEYS.COLLECTIONS,
    [],
  );

  /**
   * Create a new collection
   */
  const createCollection = useCallback(
    (collectionData) => {
      const newCollection = {
        id: generateId(),
        name: collectionData.name,
        description: collectionData.description || '',
        icon: collectionData.icon || 'bi-folder-fill',
        color: collectionData.color || COLLECTION_COLORS[0],
        recipeIds: collectionData.recipeIds || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCollections((prev) => [...prev, newCollection]);
      showToast(
        `Created collection "${newCollection.name}"`,
        TOAST_TYPES.SUCCESS,
      );

      return newCollection;
    },
    [setCollections, showToast],
  );

  /**
   * Update an existing collection
   */
  const updateCollection = useCallback(
    (collectionId, updates) => {
      setCollections((prev) =>
        prev.map((collection) => {
          if (collection.id === collectionId) {
            return {
              ...collection,
              ...updates,
              updatedAt: new Date().toISOString(),
            };
          }
          return collection;
        }),
      );

      showToast('Collection updated', TOAST_TYPES.SUCCESS);
    },
    [setCollections, showToast],
  );

  /**
   * Delete a collection
   */
  const deleteCollection = useCallback(
    (collectionId) => {
      const collection = collections.find((c) => c.id === collectionId);

      if (
        window.confirm(`Delete "${collection?.name}"? This cannot be undone.`)
      ) {
        setCollections((prev) => prev.filter((c) => c.id !== collectionId));
        showToast(`Deleted collection "${collection?.name}"`, TOAST_TYPES.INFO);
      }
    },
    [collections, setCollections, showToast],
  );

  /**
   * Add recipe to collection(s)
   */
  const addRecipeToCollection = useCallback(
    (recipe, collectionIds) => {
      // Handle both recipe ID (string) and recipe object
      const recipeId = typeof recipe === 'string' ? recipe : recipe.idMeal;
      const recipeObj = typeof recipe === 'string' ? null : recipe;

      if (!Array.isArray(collectionIds)) {
        collectionIds = [collectionIds];
      }

      setCollections((prev) =>
        prev.map((collection) => {
          if (collectionIds.includes(collection.id)) {
            // Don't add if already exists
            if (collection.recipeIds.includes(recipeId)) {
              return collection;
            }

            return {
              ...collection,
              recipeIds: [...collection.recipeIds, recipeId],
              recipes: recipeObj
                ? [...(collection.recipes || []), recipeObj]
                : collection.recipes || [],
              updatedAt: new Date().toISOString(),
            };
          }
          return collection;
        }),
      );

      const count = collectionIds.length;
      showToast(
        `Added to ${count} collection${count > 1 ? 's' : ''}`,
        TOAST_TYPES.SUCCESS,
      );
    },
    [setCollections, showToast],
  );

  /**
   * Remove recipe from collection
   */
  const removeRecipeFromCollection = useCallback(
    (recipeId, collectionId) => {
      setCollections((prev) =>
        prev.map((collection) => {
          if (collection.id === collectionId) {
            return {
              ...collection,
              recipeIds: collection.recipeIds.filter((id) => id !== recipeId),
              updatedAt: new Date().toISOString(),
            };
          }
          return collection;
        }),
      );

      showToast('Removed from collection', TOAST_TYPES.INFO);
    },
    [setCollections, showToast],
  );

  /**
   * Get collection by ID
   */
  const getCollection = useCallback(
    (collectionId) => {
      return collections.find((c) => c.id === collectionId);
    },
    [collections],
  );

  /**
   * Get recipes in a collection
   */
  const getCollectionRecipes = useCallback(
    (collectionId) => {
      const collection = getCollection(collectionId);
      if (!collection) return [];

      // Get actual recipe objects from collection storage or favorites
      // First try to get from collection's stored recipes, then fall back to favorites
      return (
        collection.recipes ||
        favorites.filter((recipe) =>
          collection.recipeIds.includes(recipe.idMeal),
        )
      );
    },
    [getCollection, favorites],
  );

  /**
   * Get collections that contain a specific recipe
   */
  const getRecipeCollections = useCallback(
    (recipeId) => {
      return collections.filter((collection) =>
        collection.recipeIds.includes(recipeId),
      );
    },
    [collections],
  );

  /**
   * Check if recipe is in any collection
   */
  const isRecipeInCollections = useCallback(
    (recipeId) => {
      return collections.some((collection) =>
        collection.recipeIds.includes(recipeId),
      );
    },
    [collections],
  );

  /**
   * Duplicate a collection
   */
  const duplicateCollection = useCallback(
    (collectionId) => {
      const original = getCollection(collectionId);
      if (!original) return;

      const duplicate = {
        ...original,
        id: generateId(),
        name: `${original.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCollections((prev) => [...prev, duplicate]);
      showToast(`Duplicated "${original.name}"`, TOAST_TYPES.SUCCESS);
    },
    [getCollection, setCollections, showToast],
  );

  /**
   * Get collection statistics
   */
  const getCollectionStats = useCallback(
    (collectionId) => {
      const collection = getCollection(collectionId);
      if (!collection) return null;

      const recipes = getCollectionRecipes(collectionId);

      // Get unique categories and areas
      const categories = [
        ...new Set(recipes.map((r) => r.strCategory).filter(Boolean)),
      ];
      const areas = [...new Set(recipes.map((r) => r.strArea).filter(Boolean))];

      return {
        recipeCount: recipes.length,
        categories,
        areas,
        lastUpdated: collection.updatedAt,
      };
    },
    [getCollection, getCollectionRecipes],
  );

  return {
    collections,
    createCollection,
    updateCollection,
    deleteCollection,
    addRecipeToCollection,
    removeRecipeFromCollection,
    getCollection,
    getCollectionRecipes,
    getRecipeCollections,
    isRecipeInCollections,
    duplicateCollection,
    getCollectionStats,
  };
}
