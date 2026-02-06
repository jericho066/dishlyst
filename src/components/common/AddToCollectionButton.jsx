import { useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Add to Collection Modal Component
 */
function AddToCollectionModal({ 
  isOpen, 
  onClose, 
  recipe,
  collections, 
  recipeCollections,
  onAddToCollection,
  onCreateNew
}) {
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen || !recipe) return null;

  // Filter collections by search
  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if recipe is already in a collection
  const isInCollection = (collectionId) => {
    return recipeCollections.some(c => c.id === collectionId);
  };

  // Toggle collection selection
  const toggleCollection = (collectionId) => {
    setSelectedCollections(prev => {
      if (prev.includes(collectionId)) {
        return prev.filter(id => id !== collectionId);
      } else {
        return [...prev, collectionId];
      }
    });
  };

  // Handle save
  const handleSave = () => {
    if (selectedCollections.length === 0) {
      onClose();
      return;
    }

    onAddToCollection(recipe.idMeal, selectedCollections);
    setSelectedCollections([]);
    setSearchQuery('');
    onClose();
  };

  // Handle close
  const handleClose = () => {
    setSelectedCollections([]);
    setSearchQuery('');
    onClose();
  };

  const modalContent = (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content add-to-collection-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add to Collections</h2>
          <button className="modal-close" onClick={handleClose}>
            <i className="bi bi-x"></i>
          </button>
        </div>

        <div className="modal-body">
          {/* Recipe Info */}
          <div className="modal-recipe-info">
            <img 
              src={recipe.strMealThumb} 
              alt={recipe.strMeal}
              className="modal-recipe-thumb"
            />
            <div>
              <div className="modal-recipe-title">{recipe.strMeal}</div>
              <div className="modal-recipe-meta">
                {recipe.strCategory} • {recipe.strArea}
              </div>
            </div>
          </div>

          {/* Search Collections */}
          {collections.length > 5 && (
            <div className="modal-search">
              <input
                type="search"
                className="search-input"
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          {/* Collections List */}
          {collections.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-8) var(--space-4)' }}>
              <div className="empty-state-icon">
                <i className="bi bi-collection"></i>
              </div>
              <p className="page-description">No collections yet</p>
              <button 
                className="browse-button"
                onClick={() => {
                  handleClose();
                  onCreateNew();
                }}
              >
                Create Your First Collection
              </button>
            </div>
          ) : filteredCollections.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-8) var(--space-4)' }}>
              <div className="empty-state-icon">
                <i className="bi bi-search"></i>
              </div>
              <p className="page-description">No collections found</p>
            </div>
          ) : (
            <div className="collections-list">
              {filteredCollections.map(collection => {
                const alreadyInCollection = isInCollection(collection.id);
                const isSelected = selectedCollections.includes(collection.id);

                return (
                  <label
                    key={collection.id}
                    className={`collection-checkbox-item ${alreadyInCollection ? 'disabled' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={alreadyInCollection || isSelected}
                      onChange={() => !alreadyInCollection && toggleCollection(collection.id)}
                      disabled={alreadyInCollection}
                      className="collection-checkbox-input"
                    />
                    
                    <div 
                      className="collection-checkbox-icon"
                      style={{ backgroundColor: collection.color }}
                    >
                      <i className={`bi ${collection.icon}`}></i>
                    </div>

                    <div className="collection-checkbox-info">
                      <div className="collection-checkbox-name">
                        {collection.name}
                        {alreadyInCollection && (
                          <span className="collection-badge">Added</span>
                        )}
                      </div>
                      {collection.description && (
                        <div className="collection-checkbox-description">
                          {collection.description}
                        </div>
                      )}
                    </div>

                    {(alreadyInCollection || isSelected) && (
                      <i className="bi bi-check-circle-fill collection-checkbox-check"></i>
                    )}
                  </label>
                );
              })}
            </div>
          )}

          {/* Create New Collection Button */}
          {collections.length > 0 && (
            <button 
              className="create-collection-button"
              onClick={() => {
                handleClose();
                onCreateNew();
              }}
            >
              <i className="bi bi-plus-circle"></i>
              Create New Collection
            </button>
          )}
        </div>

        {/* Modal Footer */}
        {collections.length > 0 && (
          <div className="modal-footer">
            <button 
              className="action-button"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button 
              className="action-button primary"
              onClick={handleSave}
              disabled={selectedCollections.length === 0}
            >
              Add to {selectedCollections.length} {selectedCollections.length === 1 ? 'Collection' : 'Collections'}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  //Render modal outside the recipe card DOM tree
  return createPortal(modalContent, document.body);
}

/**
 * Add to Collection Button Component
 */
export function AddToCollectionButton({ 
  recipe,
  collections,
  recipeCollections,
  onAddToCollection,
  onCreateNewCollection,
  variant = 'icon' // 'icon' or 'button'
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setIsModalOpen(true);
  };

  const isInAnyCollection = recipeCollections.length > 0;

  if (variant === 'button') {
    return (
      <>
        <button 
          className={`action-button ${isInAnyCollection ? 'added' : ''}`}
          onClick={handleOpenModal}
        >
          <i className={`bi ${isInAnyCollection ? 'bi-collection-fill' : 'bi-collection'}`}></i>
          {isInAnyCollection ? `In ${recipeCollections.length} ${recipeCollections.length === 1 ? 'Collection' : 'Collections'}` : 'Add to Collection'}
        </button>

        <AddToCollectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          recipe={recipe}
          collections={collections}
          recipeCollections={recipeCollections}
          onAddToCollection={onAddToCollection}
          onCreateNew={onCreateNewCollection}
        />
      </>
    );
  }

  // Icon variant (for recipe cards)
  return (
    <>
      <button
        className={`collection-button ${isInAnyCollection ? 'active' : ''}`}
        onClick={handleOpenModal}
        aria-label="Add to collection"
        title={isInAnyCollection ? `In ${recipeCollections.length} collection(s)` : 'Add to collection'}
      >
        <i className={`bi ${isInAnyCollection ? 'bi-collection-fill' : 'bi-collection'}`}></i>
        {isInAnyCollection && recipeCollections.length > 0 && (
          <span className="collection-count-badge">{recipeCollections.length}</span>
        )}
      </button>

      <AddToCollectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recipe={recipe}
        collections={collections}
        recipeCollections={recipeCollections}
        onAddToCollection={onAddToCollection}
        onCreateNew={onCreateNewCollection}
      />
    </>
  );
}