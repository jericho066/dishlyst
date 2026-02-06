import { RecipeGrid } from '../recipe/RecipeGrid';

/**
 * Favorites Page Component
 */
export function FavoritesPage({
  favorites,
  onRecipeClick,
  onClearAll,
  onToggleFavorite,
  isFavorite,
  setCurrentPage,
  collections,
  getRecipeCollections,
  onAddToCollection,
  onCreateNewCollection
}) {
  // Empty state
  if (favorites.length === 0) {
    return (
      <div className="empty-favorites">
        <div className="empty-favorites-icon">
          <i className="bi bi-heartbreak"></i>
        </div>

        <h2 className="empty-favorites-title">No Favorites Yet</h2>

        <p className="empty-favorites-text">
          Start exploring recipes and tap the <i className="bi bi-heart"></i> button to save your favorites!
        </p>

        <button className="browse-button" onClick={() => setCurrentPage('search')}>
          Browse Recipes
        </button>
      </div>
    );
  }

  // Has favorites
  return (
    <div>
      <div className="favorites-header">
        <div>
          <h2 className="page-title" style={{ marginBottom: '0.25rem' }}>
            Your Favorite Recipes
          </h2>
          <p className="favorites-count">
            {favorites.length} {favorites.length === 1 ? 'recipe' : 'recipes'} saved
          </p>
        </div>

        <button className="clear-favorites-button" onClick={onClearAll}>
          Clear All
        </button>
      </div>

      <RecipeGrid
        recipes={favorites}
        onRecipeClick={onRecipeClick}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        collections={collections}
        getRecipeCollections={getRecipeCollections}
        onAddToCollection={onAddToCollection}
        onCreateNewCollection={onCreateNewCollection}
      />
    </div>
  );
}
