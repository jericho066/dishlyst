import { useState } from 'react';
import { AddToCollectionButton } from '../common/AddToCollectionButton';

/**
 * Recipe Detail Component - Full recipe view
 */
export function RecipeDetail({ 
  recipe, 
  onClose, 
  isFavorite, 
  onToggleFavorite, 
  onAddToShoppingList,
  collections,
  getRecipeCollections,
  onAddToCollection,
  onCreateNewCollection
}) {
  const [checkedIngredients, setCheckedIngredients] = useState({});

  if (!recipe) return null;

  // Extract ingredients
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure?.trim() || ''
      });
    }
  }

  // Split instructions into steps
  const instructions = recipe.strInstructions
    ? recipe.strInstructions
        .split('\n')
        .filter(step => step.trim().length > 0)
        .map(step => step.trim())
    : [];

  const toggleIngredient = (index) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="recipe-detail">
      {/* Header with background image */}
      <div
        className="recipe-detail-header"
        style={{ backgroundImage: `url(${recipe.strMealThumb})` }}
      >
        {/* Back Button */}
        <button className="back-button" onClick={onClose}>
          <i className="bi bi-arrow-left"></i> Back
        </button>

        {/* Favorite Button */}
        <button
          className={`favorite-button ${isFavorite(recipe.idMeal) ? 'active' : ''}`}
          onClick={() => onToggleFavorite(recipe)}
          style={{ top: '1rem', right: '1rem' }}
        >
          <i className={`bi ${isFavorite(recipe.idMeal) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
        </button>

        {/* Title Section */}
        <div className="recipe-detail-title-section">
          <h1 className="recipe-detail-title">{recipe.strMeal}</h1>
          <div className="recipe-detail-tags">
            {recipe.strCategory && (
              <span className="recipe-detail-tag">
                <i className="bi bi-tag"></i> {recipe.strCategory}
              </span>
            )}
            {recipe.strArea && (
              <span className="recipe-detail-tag">
                <i className="bi bi-globe"></i> {recipe.strArea}
              </span>
            )}
            {recipe.strTags && (
              <span className="recipe-detail-tag">
                <i className="bi bi-bookmark"></i> {recipe.strTags}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="recipe-detail-content">
        {/* Meta Information */}
        <div className="recipe-detail-meta">
          <div className="meta-item">
            <div className="meta-icon">
              <i className="bi bi-clock"></i>
            </div>
            <div className="meta-label">Prep Time</div>
            <div className="meta-value">~30 min</div>
          </div>

          <div className="meta-item">
            <div className="meta-icon">
              <i className="bi bi-people"></i>
            </div>
            <div className="meta-label">Servings</div>
            <div className="meta-value">4 people</div>
          </div>

          <div className="meta-item">
            <div className="meta-icon">
              <i className="bi bi-bar-chart"></i>
            </div>
            <div className="meta-label">Difficulty</div>
            <div className="meta-value">Medium</div>
          </div>
        </div>

        {/* Ingredients & Instructions */}
        <div className="recipe-sections">
          {/* Ingredients Section */}
          <div className="recipe-section">
            <h2 className="recipe-section-title">
              <i className="bi bi-basket"></i> Ingredients
            </h2>
            <ul className="ingredients-list">
              {ingredients.map((item, index) => (
                <li key={index} className="ingredient-item">
                  <input
                    type="checkbox"
                    className="ingredient-checkbox"
                    checked={checkedIngredients[index] || false}
                    onChange={() => toggleIngredient(index)}
                    id={`ingredient-${index}`}
                  />
                  <label htmlFor={`ingredient-${index}`} className="ingredient-text">
                    {item.measure && <strong>{item.measure}</strong>} {item.ingredient}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions Section */}
          <div className="recipe-section">
            <h2 className="recipe-section-title">
              <i className="bi bi-list-ol"></i> Instructions
            </h2>
            <ol className="instructions-list">
              {instructions.map((step, index) => (
                <li key={index} className="instruction-item">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="action-button primary"
            onClick={() => onAddToShoppingList(recipe)}
          >
            <i className="bi bi-cart-plus"></i>
            Add to Shopping List
          </button>

          {collections && getRecipeCollections && onAddToCollection && onCreateNewCollection && (
            <AddToCollectionButton
              recipe={recipe}
              collections={collections}
              recipeCollections={getRecipeCollections(recipe.idMeal)}
              onAddToCollection={onAddToCollection}
              onCreateNewCollection={onCreateNewCollection}
              variant="button"
            />
          )}

          {recipe.strYoutube && (
            <button
              className="action-button"
              onClick={() => window.open(recipe.strYoutube, '_blank')}
            >
              <i className="bi bi-youtube"></i>
              Watch Tutorial
            </button>
          )}

          {recipe.strSource && (
            <button
              className="action-button"
              onClick={() => window.open(recipe.strSource, '_blank')}
            >
              <i className="bi bi-link-45deg"></i>
              View Source
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
