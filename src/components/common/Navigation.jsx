import { PAGES } from '../../utils/constants';

/**
 * Navigation Component
 */
export function Navigation({ currentPage, onPageChange, favoritesCount, shoppingListCount }) {
  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-content">

          {/* DISCOVER BUTTON */}
          <button
            className={`nav-button ${currentPage === PAGES.SEARCH ? 'active' : ''}`}
            onClick={() => onPageChange(PAGES.SEARCH)}
          >
            <i className="bi bi-search"></i> Discover
          </button>

          {/* FAVORITES BUTTON */}
          <button
            className={`nav-button ${currentPage === PAGES.FAVORITES ? 'active' : ''}`}
            onClick={() => onPageChange(PAGES.FAVORITES)}
          >
            <i className="bi bi-heart-fill"></i> Favorites
            {favoritesCount > 0 && ` (${favoritesCount})`}
          </button>

          {/* COLLECTIONS BUTTON */}
          <button
            className={`nav-button ${currentPage === PAGES.COLLECTIONS ? 'active' : ''}`}
            onClick={() => onPageChange(PAGES.COLLECTIONS)}
          >
            <i className="bi bi-collection"></i> Collections
          </button>

          {/* MEAL PLANNER BUTTON */}
          <button
            className={`nav-button ${currentPage === PAGES.MEAL_PLANNER ? 'active' : ''}`}
            onClick={() => onPageChange(PAGES.MEAL_PLANNER)}
          >
            <i className="bi bi-calendar-week"></i> Meal Planner
          </button>

          {/* SHOPPING LIST BUTTON */}
          <button
            className={`nav-button ${currentPage === PAGES.SHOPPING_LIST ? 'active' : ''}`}
            onClick={() => onPageChange(PAGES.SHOPPING_LIST)}
          >
            <i className="bi bi-cart3"></i> Shopping List
            {shoppingListCount > 0 && ` (${shoppingListCount})`}
          </button>
        </div>
      </div>
    </nav>
  );
}

