// src/components/pages/MealPlannerPage.jsx

import { useState } from 'react';
import { MEAL_TYPES, DAY_NAMES } from '../../utils/constants';

/**
 * Format date to display format (e.g., "Feb 3")
 */
function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Check if date is today
 */
function isToday(dateString) {
  const today = new Date();
  const date = new Date(dateString + 'T00:00:00');
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Meal Slot Component - Individual breakfast/lunch/dinner slot
 */
function MealSlot({ date, mealType, meal, onAdd, onRemove, onView }) {
  if (meal) {
    return (
      <div className="meal-slot filled">
        <div className="meal-slot-image-wrapper">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="meal-slot-image"
            onClick={() => onView(meal.idMeal)}
          />
          <button
            className="meal-slot-remove"
            onClick={() => onRemove(date, mealType)}
            aria-label="Remove meal"
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
        <div className="meal-slot-info">
          <span className="meal-slot-name" onClick={() => onView(meal.idMeal)}>
            {meal.strMeal}
          </span>
        </div>
      </div>
    );
  }

  return (
    <button
      className="meal-slot empty"
      onClick={() => onAdd(date, mealType)}
    >
      <i className="bi bi-plus-circle"></i>
      <span>Add {mealType}</span>
    </button>
  );
}

/**
 * Day Column Component - One day with all meal slots
 */
function DayColumn({ date, dayName, meals, onAdd, onRemove, onView }) {
  const today = isToday(date);

  return (
    <div className={`day-column ${today ? 'today' : ''}`}>
      <div className="day-header">
        <div className="day-name">{dayName}</div>
        <div className="day-date">{formatDate(date)}</div>
        {today && <span className="today-badge">Today</span>}
      </div>

      <div className="day-meals">
        <div className="meal-type-label">Breakfast</div>
        <MealSlot
          date={date}
          mealType={MEAL_TYPES.BREAKFAST}
          meal={meals.breakfast}
          onAdd={onAdd}
          onRemove={onRemove}
          onView={onView}
        />

        <div className="meal-type-label">Lunch</div>
        <MealSlot
          date={date}
          mealType={MEAL_TYPES.LUNCH}
          meal={meals.lunch}
          onAdd={onAdd}
          onRemove={onRemove}
          onView={onView}
        />

        <div className="meal-type-label">Dinner</div>
        <MealSlot
          date={date}
          mealType={MEAL_TYPES.DINNER}
          meal={meals.dinner}
          onAdd={onAdd}
          onRemove={onRemove}
          onView={onView}
        />
      </div>
    </div>
  );
}

/**
 * Week Navigation Component
 */
function WeekNavigation({
  onPrevious,
  onNext,
  onToday,
  isCurrentWeek,
  weekStart
}) {
  const weekStartDate = new Date(weekStart + 'T00:00:00');
  const weekEndDate = new Date(weekStart + 'T00:00:00');
  weekEndDate.setDate(weekEndDate.getDate() + 6);

  const formatWeekRange = () => {
    const start = weekStartDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    const end = weekEndDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    return `${start} - ${end}`;
  };

  return (
    <div className="week-navigation">
      <button className="week-nav-button" onClick={onPrevious}>
        <i className="bi bi-chevron-left"></i>
      </button>

      <div className="week-range">
        <span className="week-range-text">{formatWeekRange()}</span>
        {!isCurrentWeek && (
          <button className="today-button" onClick={onToday}>
            Today
          </button>
        )}
      </div>

      <button className="week-nav-button" onClick={onNext}>
        <i className="bi bi-chevron-right"></i>
      </button>
    </div>
  );
}

/**
 * Quick Actions Bar Component
 */
function QuickActions({
  onGenerateShoppingList,
  onPlanRandom,
  onClearWeek,
  hasPlannedMeals
}) {
  return (
    <div className="quick-actions">
      <button
        className="action-button primary"
        onClick={onGenerateShoppingList}
        disabled={!hasPlannedMeals}
      >
        <i className="bi bi-cart-plus"></i>
        Generate Shopping List
      </button>

      <button className="action-button" onClick={onPlanRandom}>
        <i className="bi bi-shuffle"></i>
        Plan Random Week
      </button>

      <button
        className="action-button"
        onClick={onClearWeek}
        disabled={!hasPlannedMeals}
      >
        <i className="bi bi-trash"></i>
        Clear Week
      </button>
    </div>
  );
}

/**
 * Add Meal Modal Component
 */
function AddMealModal({ isOpen, onClose, date, mealType, favorites, onSelect }) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredFavorites = favorites.filter(recipe =>
    recipe.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mealTypeLabel = mealType.charAt(0).toUpperCase() + mealType.slice(1);
  const dateLabel = formatDate(date);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            Add {mealTypeLabel} for {dateLabel}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="bi bi-x"></i>
          </button>
        </div>

        <div className="modal-body">
          {/* Search */}
          <div className="modal-search">
            <input
              type="search"
              className="search-input"
              placeholder="Search your favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          {/* Recipe List */}
          {favorites.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
              <div className="empty-state-icon">
                <i className="bi bi-heart"></i>
              </div>
              <p className="page-description">
                Add some favorites first to plan your meals
              </p>
            </div>
          ) : filteredFavorites.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
              <div className="empty-state-icon">
                <i className="bi bi-search"></i>
              </div>
              <p className="page-description">No recipes found</p>
            </div>
          ) : (
            <div className="modal-recipe-grid">
              {filteredFavorites.map((recipe) => (
                <div
                  key={recipe.idMeal}
                  className="modal-recipe-card"
                  onClick={() => {
                    onSelect(date, mealType, recipe);
                    onClose();
                  }}
                >
                  <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="modal-recipe-image"
                  />
                  <div className="modal-recipe-info">
                    <span className="modal-recipe-name">{recipe.strMeal}</span>
                    <span className="modal-recipe-category">
                      {recipe.strCategory} • {recipe.strArea}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Main Meal Planner Page Component
 */
export function MealPlannerPage({
  weekDates,
  getMeal,
  onAddMeal,
  onRemoveMeal,
  onClearWeek,
  onPlanRandom,
  onGenerateShoppingList,
  onRecipeClick,
  favorites,
  previousWeek,
  nextWeek,
  goToCurrentWeek,
  isCurrentWeek,
  currentWeekStart
}) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    date: null,
    mealType: null
  });

  // Check if there are any meals planned this week
  const hasPlannedMeals = weekDates.some(date => {
    return getMeal(date, MEAL_TYPES.BREAKFAST) ||
           getMeal(date, MEAL_TYPES.LUNCH) ||
           getMeal(date, MEAL_TYPES.DINNER);
  });

  const openAddMealModal = (date, mealType) => {
    setModalState({ isOpen: true, date, mealType });
  };

  const closeAddMealModal = () => {
    setModalState({ isOpen: false, date: null, mealType: null });
  };

  const handleGenerateShoppingList = () => {
    const result = onGenerateShoppingList();
    if (result.recipeCount === 0) {
      return; // Toast already shown by hook
    }
  };

  return (
    <div className="meal-planner-page">
      {/* Header */}
      <div className="meal-planner-header">
        <div>
          <h1 className="page-title">Meal Planner</h1>
          <p className="page-description">
            Plan your weekly meals and generate shopping lists
          </p>
        </div>
      </div>

      {/* Week Navigation */}
      <WeekNavigation
        onPrevious={previousWeek}
        onNext={nextWeek}
        onToday={goToCurrentWeek}
        isCurrentWeek={isCurrentWeek()}
        weekStart={currentWeekStart}
      />

      {/* Quick Actions */}
      <QuickActions
        onGenerateShoppingList={handleGenerateShoppingList}
        onPlanRandom={() => onPlanRandom(favorites)}
        onClearWeek={onClearWeek}
        hasPlannedMeals={hasPlannedMeals}
      />

      {/* Week Grid */}
      <div className="week-grid">
        {weekDates.map((date, index) => (
          <DayColumn
            key={date}
            date={date}
            dayName={DAY_NAMES[index]}
            meals={{
              breakfast: getMeal(date, MEAL_TYPES.BREAKFAST),
              lunch: getMeal(date, MEAL_TYPES.LUNCH),
              dinner: getMeal(date, MEAL_TYPES.DINNER)
            }}
            onAdd={openAddMealModal}
            onRemove={onRemoveMeal}
            onView={onRecipeClick}
          />
        ))}
      </div>

      {/* Empty State */}
      {!hasPlannedMeals && (
        <div className="empty-state" style={{ marginTop: 'var(--space-8)' }}>
          <div className="empty-state-icon">
            <i className="bi bi-calendar-week"></i>
          </div>


          <h2 className="page-title" style={{ fontSize: 'var(--text-2xl)' }}>
            No meals planned yet
          </h2>

          
          <p className="page-description">
            Click the <i className="bi bi-plus-circle"></i> button to add meals to your week
          </p>
        </div>
      )}

      {/* Add Meal Modal */}
      <AddMealModal
        isOpen={modalState.isOpen}
        onClose={closeAddMealModal}
        date={modalState.date}
        mealType={modalState.mealType}
        favorites={favorites}
        onSelect={onAddMeal}
      />
    </div>
  );
}

