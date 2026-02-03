/**
 * Recipe Card Component
 */
export function RecipeCard({ recipe, onClick, isFavorite, onToggleFavorite }) {
  const handleClick = () => {
    onClick(recipe.idMeal);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent card click when clicking favorite button
    onToggleFavorite(recipe);
  };

  return (
    <div className="recipe-card" onClick={handleClick}>
      {/* Recipe Image */}
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="recipe-card-image"
        loading="lazy"
      />

      {/* Favorite Button */}
      <button
        className={`favorite-button ${isFavorite(recipe.idMeal) ? 'active' : ''}`}
        onClick={handleFavoriteClick}
        aria-label={isFavorite(recipe.idMeal) ? 'Remove from favorites' : 'Add to favorites'}
      >
        <i className={`bi ${isFavorite(recipe.idMeal) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
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
