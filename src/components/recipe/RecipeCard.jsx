import { AddToCollectionButton } from '../common/AddToCollectionButton';

/**
 * Recipe Card Component
 */
export function RecipeCard({
  recipe,
  onClick,
  isFavorite,
  onToggleFavorite,
  collections,
  getRecipeCollections,
  onAddToCollection,
  onCreateNewCollection,
}) {
  const handleClick = () => {
    onClick(recipe.idMeal);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(recipe);
  };

  // Get collections for this recipe
  const recipeCollections =
    collections && getRecipeCollections
      ? getRecipeCollections(recipe.idMeal)
      : [];

  return (
    <div className="recipe-card" onClick={handleClick}>
      {/* Recipe Image */}
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="recipe-card-image"
        loading="lazy"
      />

      {/* ← ADD COLLECTION BUTTON (bottom-left) */}
      {collections &&
        getRecipeCollections &&
        onAddToCollection &&
        onCreateNewCollection && (
          <div onClick={(e) => e.stopPropagation()}>
            <AddToCollectionButton
              recipe={recipe}
              collections={collections}
              recipeCollections={recipeCollections}
              onAddToCollection={onAddToCollection}
              onCreateNewCollection={onCreateNewCollection}
              variant="icon"
            />
          </div>
        )}

      {/* Favorite Button (top-right) */}
      <button
        className={`favorite-button ${isFavorite(recipe.idMeal) ? 'active' : ''}`}
        onClick={handleFavoriteClick}
        aria-label={
          isFavorite(recipe.idMeal)
            ? 'Remove from favorites'
            : 'Add to favorites'
        }
      >
        <i
          className={`bi ${isFavorite(recipe.idMeal) ? 'bi-heart-fill' : 'bi-heart'}`}
        ></i>
      </button>

      {/* Recipe Info */}
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
  );
}
