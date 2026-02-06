// src/App.jsx

import { useState, useEffect } from 'react';
import { getRecipeById } from './utils/api';
import { PAGES } from './utils/constants';
import {
  useDebounce,
  useToast,
  useFavorites,
  useShoppingList,
  useRecipes,
  useMealPlanner,
  useCollections, // ← ADD THIS
} from './hooks';
import {
  Header,
  Navigation,
  Footer,
  ToastContainer,
} from './components/common';
import {
  SearchPage,
  FavoritesPage,
  ShoppingListPage,
  MealPlannerPage,
  CollectionsPage, // ← ADD THIS
  CollectionDetailView, // ← ADD THIS
} from './components/pages';
import { RecipeDetail } from './components/recipe';

function App() {
  // State
  const [currentPage, setCurrentPage] = useState(PAGES.SEARCH);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeDetailLoading, setRecipeDetailLoading] = useState(false);

  // ← ADD COLLECTION VIEW STATE
  const [viewingCollectionId, setViewingCollectionId] = useState(null);

  // Custom Hooks
  const { toasts, showToast, removeToast } = useToast();
  const { favorites, isFavorite, toggleFavorite, clearAllFavorites } =
    useFavorites(showToast);
  const {
    shoppingList,
    setShoppingList,
    addToShoppingList,
    toggleItem,
    removeItem,
    clearAll,
    clearChecked,
  } = useShoppingList(showToast);
  const {
    recipes,
    loading,
    filters,
    setFilters,
    loadRandomRecipes,
    searchRecipes,
    applyFilters,
    clearFilters,
    refreshRecipes,
  } = useRecipes();
  const {
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
    isCurrentWeek,
    currentWeekStart,
  } = useMealPlanner(showToast);

  // ← ADD COLLECTIONS HOOK
  const {
    collections,
    createCollection,
    updateCollection,
    deleteCollection,
    addRecipeToCollection,
    removeRecipeFromCollection,
    getCollection,
    getCollectionRecipes,
    getRecipeCollections,
  } = useCollections(showToast, favorites);

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery);

  // Load initial recipes on mount
  useEffect(() => {
    loadRandomRecipes();
  }, [loadRandomRecipes]);

  // Handle search when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery === '' || !debouncedSearchQuery.trim()) {
      if (recipes.length > 0) {
        if (filters.category || filters.area) {
          setFilters({ category: '', area: '' });
        } else {
          loadRandomRecipes();
        }
      }
      return;
    }

    searchRecipes(debouncedSearchQuery);
  }, [
    debouncedSearchQuery,
    filters.category,
    filters.area,
    recipes.length,
    setFilters,
    loadRandomRecipes,
    searchRecipes,
  ]);

  // Apply filters when they change
  useEffect(() => {
    if (filters.category || filters.area) {
      applyFilters(filters);
    }
  }, [filters, applyFilters]);

  // Check if filters are active
  const hasActiveFilters = filters.category !== '' || filters.area !== '';

  // Open recipe detail
  const openRecipeDetail = async (recipeId) => {
    setRecipeDetailLoading(true);
    setSelectedRecipe(null);

    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    const recipe = await getRecipeById(recipeId);
    setSelectedRecipe(recipe);
    setRecipeDetailLoading(false);
  };

  // Close recipe detail
  const closeRecipeDetail = () => {
    setSelectedRecipe(null);
  };

  // Shopping list generation from meal plan
  const handleGenerateShoppingListFromMealPlan = () => {
    const { ingredients, recipeCount } = generateShoppingList();

    if (recipeCount === 0) {
      showToast('No meals planned this week', 'info');
      return;
    }

    // Filter out duplicates with existing shopping list
    const newItems = ingredients.filter(
      (newItem) =>
        !shoppingList.some(
          (item) =>
            item.ingredient.toLowerCase() ===
              newItem.ingredient.toLowerCase() &&
            item.measure === newItem.measure,
        ),
    );

    if (newItems.length === 0) {
      showToast('All ingredients already in shopping list', 'info');
      return;
    }

    // Add new items to shopping list
    const updatedList = [...shoppingList, ...newItems];
    setShoppingList(updatedList);

    showToast(
      `Added ${newItems.length} ingredient${newItems.length > 1 ? 's' : ''} from ${recipeCount} recipe${recipeCount > 1 ? 's' : ''}`,
      'success',
    );

    // Switch to shopping list page
    setCurrentPage(PAGES.SHOPPING_LIST);
  };

  // ← ADD COLLECTION HANDLERS

  // Open collection detail view
  const handleOpenCollection = (collectionId) => {
    setViewingCollectionId(collectionId);
  };

  // Close collection detail view
  const handleCloseCollection = () => {
    setViewingCollectionId(null);
  };

  // Handle create new collection from various places
  const handleCreateNewCollection = () => {
    setCurrentPage(PAGES.COLLECTIONS);
    setViewingCollectionId(null);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setViewingCollectionId(null);
  };

  // Render recipe detail if selected
  if (selectedRecipe) {
    return (
      <>
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={closeRecipeDetail}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onAddToShoppingList={addToShoppingList}
          collections={collections}
          getRecipeCollections={getRecipeCollections}
          onAddToCollection={addRecipeToCollection}
          onCreateNewCollection={handleCreateNewCollection}
        />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </>
    );
  }

  // Render loading state for recipe detail
  if (recipeDetailLoading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading recipe...</p>
      </div>
    );
  }

  // Main app render
  return (
    <>
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header */}
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Navigation */}
      <Navigation
        currentPage={currentPage}
        onPageChange={handlePageChange}
        favoritesCount={favorites.length}
        shoppingListCount={shoppingList.length}
      />

      {/* Main Content */}
      <main className="main" id="main-content">
        <div className="container">
          {/* Search Page */}
          {currentPage === PAGES.SEARCH && (
            <SearchPage
              recipes={recipes}
              loading={loading}
              searchQuery={searchQuery}
              filters={filters}
              setFilters={setFilters}
              clearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
              onRecipeClick={openRecipeDetail}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              onRefresh={refreshRecipes}
              collections={collections}
              getRecipeCollections={getRecipeCollections}
              onAddToCollection={addRecipeToCollection}
              onCreateNewCollection={handleCreateNewCollection}
            />
          )}

          {/* Favorites Page */}
          {currentPage === PAGES.FAVORITES && (
            <FavoritesPage
              favorites={favorites}
              onRecipeClick={openRecipeDetail}
              onClearAll={clearAllFavorites}
              onToggleFavorite={toggleFavorite}
              isFavorite={isFavorite}
              setCurrentPage={setCurrentPage}
              collections={collections}
              getRecipeCollections={getRecipeCollections}
              onAddToCollection={addRecipeToCollection}
              onCreateNewCollection={handleCreateNewCollection}
            />
          )}

          {/* Shopping List Page */}
          {currentPage === PAGES.SHOPPING_LIST && (
            <ShoppingListPage
              items={shoppingList}
              onToggleItem={toggleItem}
              onRemoveItem={removeItem}
              onClearAll={clearAll}
              onClearChecked={clearChecked}
              setCurrentPage={setCurrentPage}
            />
          )}

          {/* Meal Planner Page */}
          {currentPage === PAGES.MEAL_PLANNER && (
            <MealPlannerPage
              weekDates={getCurrentWeekDates()}
              getMeal={getMeal}
              onAddMeal={addMeal}
              onRemoveMeal={removeMeal}
              onClearWeek={clearWeek}
              onPlanRandom={planRandomWeek}
              onGenerateShoppingList={handleGenerateShoppingListFromMealPlan}
              onRecipeClick={openRecipeDetail}
              favorites={favorites}
              previousWeek={previousWeek}
              nextWeek={nextWeek}
              goToCurrentWeek={goToCurrentWeek}
              isCurrentWeek={isCurrentWeek}
              currentWeekStart={currentWeekStart}
            />
          )}

          {/* ← ADD COLLECTIONS PAGE */}
          {currentPage === PAGES.COLLECTIONS && !viewingCollectionId && (
            <CollectionsPage
              collections={collections}
              getCollectionRecipes={getCollectionRecipes}
              onCreateCollection={createCollection}
              onUpdateCollection={updateCollection}
              onDeleteCollection={deleteCollection}
              onOpenCollection={handleOpenCollection}
              setCurrentPage={setCurrentPage}
            />
          )}

          {/* ← ADD COLLECTION DETAIL VIEW */}
          {currentPage === PAGES.COLLECTIONS && viewingCollectionId && (
            <CollectionDetailView
              collection={getCollection(viewingCollectionId)}
              recipes={getCollectionRecipes(viewingCollectionId)}
              onBack={handleCloseCollection}
              onEdit={() => {
                // Close detail view
                handleCloseCollection();
              }}
              onDelete={(collectionId) => {
                deleteCollection(collectionId);
                handleCloseCollection();
              }}
              onRecipeClick={openRecipeDetail}
              onRemoveRecipe={removeRecipeFromCollection}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

export default App;
