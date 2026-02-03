import { CATEGORIES, AREAS } from '../../utils/constants';

/**
 * Filters Panel Component
 */
export function FiltersPanel({ filters, setFilters, clearFilters, hasActiveFilters }) {
  const handleCategoryChange = (e) => {
    setFilters({ ...filters, category: e.target.value });
  };

  const handleAreaChange = (e) => {
    setFilters({ ...filters, area: e.target.value });
  };

  return (
    <div className="filter-section">
      <div className="filter-header">
        <h3 className="filter-title">
          <i className="bi bi-funnel"></i> Filter Recipes
        </h3>
        {hasActiveFilters && (
          <button className="clear-filters" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      <div className="filters-grid">
        {/* Category Filter */}
        <div className="filter-group">
          <label htmlFor="category-filter" className="filter-label">
            Category
          </label>
          <select
            id="category-filter"
            className="filter-select"
            value={filters.category}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Area/Cuisine Filter */}
        <div className="filter-group">
          <label htmlFor="area-filter" className="filter-label">
            Cuisine
          </label>
          <select
            id="area-filter"
            className="filter-select"
            value={filters.area}
            onChange={handleAreaChange}
          >
            <option value="">All Cuisines</option>
            {AREAS.map(area => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

