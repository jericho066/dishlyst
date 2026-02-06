// src/components/pages/CollectionDetailView.jsx

import { RecipeGrid } from '../recipe/RecipeGrid';

/**
 * Format date to readable format
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Collection Header Component
 */
function CollectionHeader({ collection, recipeCount, onEdit, onDelete, onBack }) {
  return (
    <div className="collection-detail-header">
      {/* Back Button */}
      <button className="back-button" onClick={onBack}>
        <i className="bi bi-arrow-left"></i> Back to Collections
      </button>

      {/* Collection Info */}
      <div className="collection-detail-info">
        <div className="collection-detail-main">
          {/* Icon */}
          <div 
            className="collection-detail-icon"
            style={{ backgroundColor: collection.color }}
          >
            <i className={`bi ${collection.icon}`}></i>
          </div>

          {/* Title & Description */}
          <div className="collection-detail-text">
            <h1 className="collection-detail-title">{collection.name}</h1>
            {collection.description && (
              <p className="collection-detail-description">
                {collection.description}
              </p>
            )}
            <div className="collection-detail-meta">
              <span className="collection-meta-item">
                <i className="bi bi-journal-bookmark"></i>
                {recipeCount} {recipeCount === 1 ? 'recipe' : 'recipes'}
              </span>
              <span className="collection-meta-item">
                <i className="bi bi-calendar3"></i>
                Updated {formatDate(collection.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="collection-detail-actions">
          <button 
            className="action-button"
            onClick={onEdit}
          >
            <i className="bi bi-pencil"></i>
            Edit
          </button>
          <button 
            className="action-button"
            onClick={onDelete}
          >
            <i className="bi bi-trash"></i>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Collection Stats Component
 */
function CollectionStats({ recipes }) {
  if (recipes.length === 0) return null;

  // Get unique categories
  const categories = [...new Set(recipes.map(r => r.strCategory).filter(Boolean))];
  
  // Get unique cuisines
  const cuisines = [...new Set(recipes.map(r => r.strArea).filter(Boolean))];

  return (
    <div className="collection-stats">
      {categories.length > 0 && (
        <div className="collection-stat-item">
          <span className="collection-stat-label">Categories:</span>
          <div className="collection-stat-tags">
            {categories.map(category => (
              <span key={category} className="collection-stat-tag">
                {category}
              </span>
            ))}
          </div>
        </div>
      )}

      {cuisines.length > 0 && (
        <div className="collection-stat-item">
          <span className="collection-stat-label">Cuisines:</span>
          <div className="collection-stat-tags">
            {cuisines.map(cuisine => (
              <span key={cuisine} className="collection-stat-tag">
                {cuisine}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Empty Collection State
 */
function EmptyCollectionState({ collection, onAddRecipes }) {
  return (
    <div className="empty-collection">
      <div className="empty-collection-icon">
        <i className={`bi ${collection.icon}`} style={{ color: collection.color }}></i>
      </div>
      <h2 className="empty-collection-title">
        No recipes in this collection yet
      </h2>
      <p className="empty-collection-text">
        Start adding your favorite recipes to "{collection.name}"
      </p>
      <button className="browse-button" onClick={onAddRecipes}>
        Browse Recipes
      </button>
    </div>
  );
}

/**
 * Main Collection Detail View Component
 */
export function CollectionDetailView({
  collection,
  recipes,
  onBack,
  onEdit,
  onDelete,
  onRecipeClick,
  onRemoveRecipe,
  isFavorite,
  onToggleFavorite,
  setCurrentPage
}) {
  if (!collection) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <i className="bi bi-exclamation-circle"></i>
        </div>
        <h2 className="page-title">Collection not found</h2>
        <button className="browse-button" onClick={onBack}>
          Back to Collections
        </button>
      </div>
    );
  }

  const handleAddRecipes = () => {
    setCurrentPage('search');
  };

  return (
    <div className="collection-detail-view">
      {/* Header */}
      <CollectionHeader
        collection={collection}
        recipeCount={recipes.length}
        onEdit={onEdit}
        onDelete={onDelete}
        onBack={onBack}
      />

      {/* Stats */}
      {recipes.length > 0 && (
        <CollectionStats recipes={recipes} />
      )}

      {/* Empty State */}
      {recipes.length === 0 && (
        <EmptyCollectionState
          collection={collection}
          onAddRecipes={handleAddRecipes}
        />
      )}

      {/* Recipe Grid */}
      {recipes.length > 0 && (
        <>
          <div className="collection-recipes-header">
            <h2 className="page-title" style={{ marginBottom: 0 }}>
              Recipes
            </h2>
            
            <button 
              className="action-button primary"
              onClick={handleAddRecipes}
            >
              <i className="bi bi-plus-circle"></i>
              Add More
            </button>
          </div>

          <div className="collection-recipes-grid">
            {recipes.map(recipe => (
              <div key={recipe.idMeal} className="collection-recipe-item">
                {/* Recipe Card (reusing existing component) */}
                <div 
                  className="recipe-card"
                  onClick={() => onRecipeClick(recipe.idMeal)}
                >
                  <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="recipe-card-image"
                    loading="lazy"
                  />

                  {/* Remove from Collection Button */}
                  <button
                    className="collection-remove-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveRecipe(recipe.idMeal, collection.id);
                    }}
                    aria-label="Remove from collection"
                    title="Remove from this collection"
                  >
                    <i className="bi bi-x"></i>
                  </button>

                  {/* Favorite Button */}
                  <button
                    className={`favorite-button ${isFavorite(recipe.idMeal) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(recipe);
                    }}
                    aria-label={isFavorite(recipe.idMeal) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <i className={`bi ${isFavorite(recipe.idMeal) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                  </button>

                  <div className="recipe-card-content">
                    <h3 className="recipe-card-title">{recipe.strMeal}</h3>
                    <div className="recipe-card-meta">
                      {recipe.strCategory && (
                        <span>
                          <i className="bi bi-tag"></i> {recipe.strCategory}
                        </span>
                      )}
                      {recipe.strArea && (
                        <span>
                          <i className="bi bi-globe"></i> {recipe.strArea}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

