import { useState, useEffect } from 'react';
import { getRecipeById } from './utils/api';
import { PAGES } from './utils/constants';
import {
  useDebounce,
  useToast,
  useFavorites,
  useShoppingList,
  useRecipes,
  useMealPlanner  // ← ADD THIS
} from './hooks';
import {
  Header,
  Navigation,
  Footer,
  ToastContainer
} from './components/common';
import {
  SearchPage,
  FavoritesPage,
  ShoppingListPage,
  MealPlannerPage  // ← ADD THIS
} from './components/pages';
import { RecipeDetail } from './components/recipe';

function App() {
  // State
  const [currentPage, setCurrentPage] = useState(PAGES.SEARCH);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeDetailLoading, setRecipeDetailLoading] = useState(false);

  // Custom Hooks
  const { toasts, showToast, removeToast } = useToast();
  const { favorites, isFavorite, toggleFavorite, clearAllFavorites } = useFavorites(showToast);
  const {
    shoppingList,
    setShoppingList,
    addToShoppingList,
    toggleItem,
    removeItem,
    clearAll,
    clearChecked
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
    refreshRecipes
  } = useRecipes();

  // ← ADD MEAL PLANNER HOOK
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
    currentWeekStart
  } = useMealPlanner(showToast);

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
        }
        loadRandomRecipes();
      }
      return;
    }

    searchRecipes(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  // Apply filters when they change
  useEffect(() => {
    if (filters.category || filters.area) {
      applyFilters(filters);
    }
  }, [filters.category, filters.area]);

  // Check if filters are active
  const hasActiveFilters = filters.category !== '' || filters.area !== '';

  // Open recipe detail
  const openRecipeDetail = async (recipeId) => {
    setRecipeDetailLoading(true);
    setSelectedRecipe(null);

    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    const recipe = await getRecipeById(recipeId);
    setSelectedRecipe(recipe);
    setRecipeDetailLoading(false);
  };

  // Close recipe detail
  const closeRecipeDetail = () => {
    setSelectedRecipe(null);
  };


  const handleGenerateShoppingListFromMealPlan = () => {
    const { ingredients, recipeCount } = generateShoppingList();
    
    if (recipeCount === 0) {
      showToast('No meals planned this week', 'info');
      return;
    }

    // Filter out duplicates with existing shopping list
    const newItems = ingredients.filter(newItem =>
      !shoppingList.some(item =>
        item.ingredient.toLowerCase() === newItem.ingredient.toLowerCase() &&
        item.measure === newItem.measure
      )
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
      'success'
    );
    
    // Switch to shopping list page
    setCurrentPage(PAGES.SHOPPING_LIST);
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
        onPageChange={setCurrentPage}
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

          {/* ← ADD MEAL PLANNER PAGE */}
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