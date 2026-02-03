import { useEffect } from 'react';
import { TOAST_DURATION } from '../../utils/constants';

/**
 * Toast Notification Component
 */
export function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, TOAST_DURATION);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: 'bi-check-circle-fill',
    info: 'bi-info-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    error: 'bi-x-circle-fill'
  };

  const colors = {
    success: '#10b981',
    info: '#3b82f6',
    warning: '#f59e0b',
    error: '#ef4444'
  };

  return (
    <div
      className="toast"
      style={{
        borderLeft: `4px solid ${colors[type]}`
      }}
    >
      <i className={`bi ${icons[type]}`} style={{ color: colors[type] }}></i>
      <span className="toast-message">{message}</span>

      <button className="toast-close" onClick={onClose}>
        <i className="bi bi-x"></i>
      </button>
    </div>
  );
}

/**
 * Toast Container Component
 */
export function ToastContainer({ toasts, removeToast }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

