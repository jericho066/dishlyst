import { PAGES } from '../../utils/constants';

/**
 * Navigation Component
 */
export function Navigation({ currentPage, onPageChange, favoritesCount, shoppingListCount }) {
  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-content">
          <button
            className={`nav-button ${currentPage === PAGES.SEARCH ? 'active' : ''}`}
            onClick={() => onPageChange(PAGES.SEARCH)}
          >
            <i className="bi bi-search"></i> Discover
          </button>

          <button
            className={`nav-button ${currentPage === PAGES.FAVORITES ? 'active' : ''}`}
            onClick={() => onPageChange(PAGES.FAVORITES)}
          >
            <i className="bi bi-heart-fill"></i> Favorites
            {favoritesCount > 0 && ` (${favoritesCount})`}
          </button>

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