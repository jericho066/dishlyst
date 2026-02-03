/**
 * Skeleton Card Component for loading states
 */
export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text"></div>
      </div>
    </div>
  );
}

/**
 * Skeleton Grid Component
 */
export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="recipe-grid">
      {Array(count)
        .fill(null)
        .map((_, i) => (
          <SkeletonCard key={i} />
        ))}
    </div>
  );
}

