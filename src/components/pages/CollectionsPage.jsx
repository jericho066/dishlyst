import { useState } from 'react';
import { SUGGESTED_COLLECTIONS } from '../../hooks/useCollections';

/**
 * Collection Card Component
 */
function CollectionCard({ collection, recipeCount, onOpen, onEdit, onDelete }) {
  // Get first 4 recipes for preview (we'll show recipe images later)
  const recipePreviews = recipeCount > 0 ? recipeCount : 0;

  return (
    <div className="collection-card" onClick={() => onOpen(collection.id)}>
      {/* Collection Icon/Cover */}
      <div
        className="collection-card-cover"
        style={{ backgroundColor: collection.color }}
      >
        <i className={`bi ${collection.icon} collection-card-icon`}></i>

        {/* Action Buttons */}
        <div className="collection-card-actions">
          <button
            className="collection-action-button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(collection);
            }}
            aria-label="Edit collection"
          >
            <i className="bi bi-pencil"></i>
          </button>
          <button
            className="collection-action-button delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(collection.id);
            }}
            aria-label="Delete collection"
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>

      {/* Collection Info */}
      <div className="collection-card-content">
        <h3 className="collection-card-name">{collection.name}</h3>
        {collection.description && (
          <p className="collection-card-description">
            {collection.description}
          </p>
        )}
        <div className="collection-card-meta">
          <span className="collection-recipe-count">
            <i className="bi bi-journal-bookmark"></i>
            {recipePreviews} {recipePreviews === 1 ? 'recipe' : 'recipes'}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Create Collection Modal Component
 */
function CreateCollectionModal({
  isOpen,
  onClose,
  onCreate,
  editCollection,
  onUpdate,
}) {
  const isEditing = !!editCollection;

  const [formData, setFormData] = useState({
    name: editCollection?.name || '',
    description: editCollection?.description || '',
    icon: editCollection?.icon || 'bi-folder-fill',
    color: editCollection?.color || '#ea580c',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return;
    }

    if (isEditing) {
      onUpdate(editCollection.id, formData);
    } else {
      onCreate(formData);
    }

    onClose();
  };

  const handleUseSuggestion = (suggestion) => {
    setFormData({
      name: suggestion.name,
      description: suggestion.description,
      icon: suggestion.icon,
      color: suggestion.color,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content collection-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? 'Edit Collection' : 'Create New Collection'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="bi bi-x"></i>
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {/* Collection Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="collection-name">
                Collection Name *
              </label>
              <input
                type="text"
                id="collection-name"
                className="form-input"
                placeholder="e.g., Italian Night, Quick Meals"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                autoFocus
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="collection-description">
                Description (Optional)
              </label>
              <textarea
                id="collection-description"
                className="form-textarea"
                placeholder="What's special about this collection?"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows="3"
              />
            </div>

            {/* Icon Picker */}
            <div className="form-group">
              <label className="form-label">Icon</label>
              <div className="icon-picker">
                {[
                  'bi-folder-fill',
                  'bi-heart-fill',
                  'bi-star-fill',
                  'bi-fire',
                  'bi-lightning-charge-fill',
                  'bi-bookmark-fill',
                  'bi-cup-hot-fill',
                  'bi-egg-fried',
                  'bi-cake2-fill',
                  'bi-basket-fill',
                  'bi-box-seam-fill',
                  'bi-gift-fill',
                  'bi-heart-pulse-fill',
                  'bi-trophy-fill',
                  'bi-sun-fill',
                  'bi-moon-stars-fill',
                  'bi-tree-fill',
                  'bi-flower1',
                  'bi-globe-americas',
                  'bi-house-heart-fill',
                ].map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    className={`icon-option ${formData.icon === icon ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, icon })}
                  >
                    <i className={`bi ${icon}`}></i>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Picker */}
            <div className="form-group">
              <label className="form-label">Color</label>
              <div className="color-picker">
                {[
                  '#ea580c',
                  '#ef4444',
                  '#ec4899',
                  '#8b5cf6',
                  '#3b82f6',
                  '#10b981',
                  '#f59e0b',
                  '#6366f1',
                  '#14b8a6',
                  '#f97316',
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`color-option ${formData.color === color ? 'active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({ ...formData, color })}
                    aria-label={`Select ${color}`}
                  >
                    {formData.color === color && (
                      <i className="bi bi-check2"></i>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="form-group">
              <label className="form-label">Preview</label>
              <div className="collection-preview">
                <div
                  className="collection-preview-icon"
                  style={{ backgroundColor: formData.color }}
                >
                  <i className={`bi ${formData.icon}`}></i>
                </div>
                <div className="collection-preview-info">
                  <div className="collection-preview-name">
                    {formData.name || 'Collection Name'}
                  </div>
                  <div className="collection-preview-description">
                    {formData.description || 'No description'}
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested Collections (only when creating) */}
            {!isEditing && (
              <div className="form-group">
                <label className="form-label">Quick Start (Optional)</label>
                <div className="suggested-collections">
                  {SUGGESTED_COLLECTIONS.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="suggested-collection-button"
                      onClick={() => handleUseSuggestion(suggestion)}
                    >
                      <i
                        className={`bi ${suggestion.icon}`}
                        style={{ color: suggestion.color }}
                      ></i>
                      <span>{suggestion.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="form-actions">
              <button type="button" className="action-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="action-button primary">
                {isEditing ? 'Update Collection' : 'Create Collection'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/**
 * Main Collections Page Component
 */
export function CollectionsPage({
  collections,
  getCollectionRecipes,
  onCreateCollection,
  onUpdateCollection,
  onDeleteCollection,
  onOpenCollection,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);

  const handleCreate = (collectionData) => {
    onCreateCollection(collectionData);
    setIsModalOpen(false);
  };

  const handleEdit = (collection) => {
    setEditingCollection(collection);
    setIsModalOpen(true);
  };

  const handleUpdate = (collectionId, updates) => {
    onUpdateCollection(collectionId, updates);
    setEditingCollection(null);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCollection(null);
  };

  // Empty state
  if (collections.length === 0) {
    return (
      <>
        <div className="collections-page">
          <div className="collections-header">
            <div>
              <h1 className="page-title">Collections</h1>
              <p className="page-description">
                Organize your favorite recipes into custom collections
              </p>
            </div>
            <button
              className="action-button primary"
              onClick={() => setIsModalOpen(true)}
            >
              <i className="bi bi-plus-circle"></i>
              New Collection
            </button>
          </div>

          <div className="empty-favorites">
            <div className="empty-favorites-icon">
              <i className="bi bi-collection"></i>
            </div>
            <h2 className="empty-favorites-title">No Collections Yet</h2>
            <p className="empty-favorites-text">
              Create collections to organize your recipes by theme, cuisine, or
              occasion
            </p>
            <button
              className="browse-button"
              onClick={() => setIsModalOpen(true)}
            >
              Create Your First Collection
            </button>
          </div>
        </div>

        <CreateCollectionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onCreate={handleCreate}
        />
      </>
    );
  }

  return (
    <>
      <div className="collections-page">
        {/* Header */}
        <div className="collections-header">
          <div>
            <h1 className="page-title">Collections</h1>
            <p className="page-description">
              {collections.length}{' '}
              {collections.length === 1 ? 'collection' : 'collections'}
            </p>
          </div>
          <button
            className="action-button primary"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="bi bi-plus-circle"></i>
            New Collection
          </button>
        </div>

        {/* Collections Grid */}
        <div className="collections-grid">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              recipeCount={getCollectionRecipes(collection.id).length}
              onOpen={onOpenCollection}
              onEdit={handleEdit}
              onDelete={onDeleteCollection}
            />
          ))}
        </div>
      </div>

      {/* Create/Edit Collection Modal */}
      <CreateCollectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreate={handleCreate}
        editCollection={editingCollection}
        onUpdate={handleUpdate}
      />
    </>
  );
}
