/**
 * Shopping List Page Component
 */
export function ShoppingListPage({
  items,
  onToggleItem,
  onRemoveItem,
  onClearAll,
  onClearChecked,
  setCurrentPage
}) {
  // Empty state
  if (items.length === 0) {
    return (
      <div className="empty-favorites">
        <div className="empty-favorites-icon">
          <i className="bi bi-cart3"></i>
        </div>
        <h2 className="empty-favorites-title">Shopping List is Empty</h2>

        <p className="empty-favorites-text">
          Add ingredients from your favorite recipes to build your shopping list!
        </p>

        <button className="browse-button" onClick={() => setCurrentPage('search')}>
          Browse Recipes
        </button>
      </div>
    );
  }

  const checkedCount = items.filter(item => item.checked).length;

  return (
    <div>
      <div className="favorites-header">
        <div>
          <h2 className="page-title" style={{ marginBottom: '0.25rem' }}>
            Shopping List
          </h2>

          <p className="favorites-count">
            {items.length} {items.length === 1 ? 'item' : 'items'}
            {checkedCount > 0 && ` • ${checkedCount} checked`}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {checkedCount > 0 && (
            <button className="clear-favorites-button" onClick={onClearChecked}>
              Clear Checked
            </button>
          )}

          <button className="clear-favorites-button" onClick={onClearAll}>
            Clear All
          </button>
        </div>
      </div>

      <div className="shopping-list-container">
        {items.map(item => (
          <div key={item.id} className="shopping-list-item">
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => onToggleItem(item.id)}
              className="ingredient-checkbox"
            />

            <div className="shopping-item-content">
              <span className={`shopping-item-text ${item.checked ? 'checked' : ''}`}>
                {item.measure && <strong>{item.measure}</strong>} {item.ingredient}
              </span>
              <span className="shopping-item-recipe">from {item.recipeName}</span>
            </div>

            <button
              className="remove-item-button"
              onClick={() => onRemoveItem(item.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
