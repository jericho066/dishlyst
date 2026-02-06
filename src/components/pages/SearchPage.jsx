import { FiltersPanel } from '../recipe/FiltersPanel';
import { RecipeGrid } from '../recipe/RecipeGrid';
import { SkeletonGrid } from '../common/SkeletonLoader';

/**
 * Search Page Component - Main recipe discovery page
 */
export function SearchPage({
  recipes,
  loading,
  searchQuery,
  filters,
  setFilters,
  clearFilters,
  hasActiveFilters,
  onRecipeClick,
  isFavorite,
  onToggleFavorite,
  onRefresh,
  // ← ADD THESE PROPS
  collections,
  getRecipeCollections,
  onAddToCollection,
  onCreateNewCollection
}) {
  return (
    <div>
      {/* Filters */}
      <FiltersPanel
        filters={filters}
        setFilters={setFilters}
        clearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Results Header */}
      <div className="results-header">
        <div>
          <h2 className="page-title" style={{ marginBottom: '0.25rem' }}>
            {searchQuery
              ? `Results for "${searchQuery}"`
              : filters.category && filters.area
                ? `${filters.category} - ${filters.area} Cuisine`
                : filters.category
                  ? `${filters.category} Recipes`
                  : filters.area
                    ? `${filters.area} Cuisine`
                    : 'Featured Recipes'}
          </h2>
          <p className="results-count">
            {loading ? 'Searching...' : `${recipes.length} recipes found`}
          </p>
        </div>

        {/* Refresh Button */}
        {!searchQuery && !filters.category && !filters.area && (
          <button
            className="refresh-button"
            onClick={onRefresh}
            disabled={loading}
            title="Load new random recipes"
          >
            <i className="bi bi-arrow-clockwise"></i> Refresh Recipes
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && <SkeletonGrid count={6} />}

      {/* Empty State */}
      {!loading && recipes.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <i className="bi bi-search"></i>
          </div>
          <h2 className="page-title">No recipes found</h2>
          <p className="page-description">
            Try adjusting your filters or search for something else
          </p>
        </div>
      )}

      {/* Recipe Grid */}
      {!loading && recipes.length > 0 && (
        <RecipeGrid
          recipes={recipes}
          onRecipeClick={onRecipeClick}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          // ← PASS COLLECTION PROPS
          collections={collections}
          getRecipeCollections={getRecipeCollections}
          onAddToCollection={onAddToCollection}
          onCreateNewCollection={onCreateNewCollection}
        />
      )}
    </div>
  );
}