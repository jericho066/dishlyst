// src/hooks/useToast.js

import { useState, useCallback } from 'react';
import { TOAST_TYPES } from '../utils/constants';

/**
 * Custom hook for managing toast notifications
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  /**
   * Show a new toast notification
   */
  const showToast = useCallback((message, type = TOAST_TYPES.SUCCESS) => {
    const id = Date.now();
    const newToast = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);
  }, []);

  /**
   * Remove a toast by ID
   */
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  /**
   * Clear all toasts
   */
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
    clearToasts
  };
}

