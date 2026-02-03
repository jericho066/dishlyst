import logoImage from '../../assets/logo.png';

/**
 * Header Component with Logo and Search
 */
export function Header({ searchQuery, onSearchChange }) {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo">
            <img src={logoImage} alt="Dishlyst Logo" />
          </div>

          {/* Search Bar */}
          <div className="search-wrapper">
            <input
              type="search"
              className="search-input"
              placeholder="Search recipes... (e.g., 'chicken', 'pasta', 'dessert')"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search recipes"
            />
          </div>
        </div>
      </div>
    </header>
  );
}