import { RecipeCard } from './RecipeCard';

/**
 * Recipe Grid Component - displays recipes in a grid layout
 */
export function RecipeGrid({ recipes, onRecipeClick, isFavorite, onToggleFavorite }) {
  if (recipes.length === 0) {
    return null;
  }

  return (
    <div className="recipe-grid">
      {recipes.map(recipe => (
        <RecipeCard
          key={recipe.idMeal}
          recipe={recipe}
          onClick={onRecipeClick}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}

