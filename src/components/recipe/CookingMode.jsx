import { useCookingMode } from '../../hooks/useCookingMode';
import { useState, useEffect } from 'react';

/**
 * Format seconds to MM:SS
 */
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Timer Component
 */
function Timer({ timer, onCancel }) {
  if (!timer) return null;

  const percentage = (timer.remaining / timer.duration) * 100;
  const isWarning = timer.remaining <= 10;

  return (
    <div className={`cooking-timer ${isWarning ? 'warning' : ''}`}>
      <div className="cooking-timer-circle">
        <svg className="cooking-timer-svg" viewBox="0 0 100 100">
          <circle
            className="cooking-timer-bg"
            cx="50"
            cy="50"
            r="45"
          />
          <circle
            className="cooking-timer-progress"
            cx="50"
            cy="50"
            r="45"
            style={{
              strokeDasharray: `${2 * Math.PI * 45}`,
              strokeDashoffset: `${2 * Math.PI * 45 * (1 - percentage / 100)}`
            }}
          />
        </svg>
        <div className="cooking-timer-time">
          {formatTime(timer.remaining)}
        </div>
      </div>
      <button className="cooking-timer-cancel" onClick={onCancel}>
        Cancel Timer
      </button>
    </div>
  );
}

/**
 * Quick Timer Buttons Component
 */
function QuickTimers({ onStartTimer }) {
  const presets = [
    { label: '1 min', seconds: 60 },
    { label: '5 min', seconds: 300 },
    { label: '10 min', seconds: 600 },
    { label: '15 min', seconds: 900 },
    { label: '20 min', seconds: 1200 }
  ];

  return (
    <div className="quick-timers">
      <span className="quick-timers-label">Quick timers:</span>
      {presets.map(preset => (
        <button
          key={preset.seconds}
          className="quick-timer-button"
          onClick={() => onStartTimer(preset.seconds)}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Custom Timer Input Component
 */
function CustomTimer({ onStartTimer }) {
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  const handleStart = () => {
    const totalSeconds = (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
    if (totalSeconds > 0) {
      onStartTimer(totalSeconds);
      setMinutes('');
      setSeconds('');
    }
  };

  return (
    <div className="custom-timer">
      <span className="custom-timer-label">Custom:</span>
      <input
        type="number"
        className="custom-timer-input"
        placeholder="MM"
        min="0"
        max="99"
        value={minutes}
        onChange={(e) => setMinutes(e.target.value)}
      />
      <span className="custom-timer-colon">:</span>
      <input
        type="number"
        className="custom-timer-input"
        placeholder="SS"
        min="0"
        max="59"
        value={seconds}
        onChange={(e) => setSeconds(e.target.value)}
      />
      <button className="custom-timer-start" onClick={handleStart}>
        Start
      </button>
    </div>
  );
}

/**
 * Ingredients Sidebar Component
 */
function IngredientsSidebar({ ingredients, onToggle, isVisible, onClose }) {
  const checkedCount = ingredients.filter(i => i.checked).length;
  const totalCount = ingredients.length;

  return (
    <div className={`cooking-ingredients-sidebar ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="cooking-ingredients-header">
        <h3 className="cooking-ingredients-title">
          Ingredients
          <span className="cooking-ingredients-count">
            {checkedCount}/{totalCount}
          </span>
        </h3>
        <button className="cooking-ingredients-close" onClick={onClose}>
          <i className="bi bi-x"></i>
        </button>
      </div>

      <div className="cooking-ingredients-list">
        {ingredients.map((item, index) => (
          <label key={index} className="cooking-ingredient-item">
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => onToggle(index)}
              className="cooking-ingredient-checkbox"
            />
            <span className="cooking-ingredient-text">
              {item.measure && <strong>{item.measure}</strong>} {item.ingredient}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

/**
 * Progress Bar Component
 */
function ProgressBar({ current, total, progress }) {
  return (
    <div className="cooking-progress-bar">
      <div className="cooking-progress-info">
        <span className="cooking-progress-text">
          Step {current + 1} of {total}
        </span>
        <span className="cooking-progress-percent">{Math.round(progress)}%</span>
      </div>
      <div className="cooking-progress-track">
        <div 
          className="cooking-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Main Cooking Mode Component
 */
export function CookingMode({ recipe, onExit }) {
  const {
    isActive,
    currentStep,
    totalSteps,
    steps,
    ingredients,
    showIngredients,
    activeTimer,
    startCookingMode,
    exitCookingMode,
    nextStep,
    previousStep,
    toggleIngredient,
    toggleIngredientsSidebar,
    startTimer,
    cancelTimer,
    progress,
    isFirstStep,
    isLastStep,
    currentStepData
  } = useCookingMode(recipe);

  // Auto-start cooking mode when component mounts
  useEffect(() => {
    startCookingMode();
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      // Cleanup on unmount
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, [startCookingMode]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        if (!isLastStep) nextStep();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (!isFirstStep) previousStep();
      } else if (e.key === 'Escape') {
        handleExit();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextStep, previousStep, isFirstStep, isLastStep]);

  const handleExit = () => {
    if (window.confirm('Exit cooking mode?')) {
      exitCookingMode();
      onExit();
    }
  };

  if (!isActive || !currentStepData) {
    return null;
  }

  return (
    <div className="cooking-mode">
      {/* Progress Bar */}
      <ProgressBar
        current={currentStep}
        total={totalSteps}
        progress={progress}
      />

      {/* Top Bar */}
      <div className="cooking-mode-header">
        <button className="cooking-mode-exit" onClick={handleExit}>
          <i className="bi bi-x-lg"></i> Exit
        </button>

        <h2 className="cooking-mode-recipe-name">{recipe.strMeal}</h2>

        <button 
          className="cooking-mode-ingredients-toggle"
          onClick={toggleIngredientsSidebar}
        >
          <i className="bi bi-list-ul"></i> Ingredients
        </button>
      </div>

      {/* Ingredients Sidebar */}
      <IngredientsSidebar
        ingredients={ingredients}
        onToggle={toggleIngredient}
        isVisible={showIngredients}
        onClose={toggleIngredientsSidebar}
      />

      {/* Main Content */}
      <div className="cooking-mode-content">
        {/* Current Step */}
        <div className="cooking-step-container">
          <div className="cooking-step-number">
            Step {currentStep + 1}
          </div>
          <div className="cooking-step-text">
            {currentStepData.text}
          </div>
        </div>

        {/* Timer Section */}
        <div className="cooking-timer-section">
          {activeTimer ? (
            <Timer timer={activeTimer} onCancel={cancelTimer} />
          ) : (
            <>
              <QuickTimers onStartTimer={startTimer} />
              <CustomTimer onStartTimer={startTimer} />
            </>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="cooking-mode-navigation">
        <button
          className="cooking-nav-button previous"
          onClick={previousStep}
          disabled={isFirstStep}
        >
          <i className="bi bi-chevron-left"></i>
          <span>Previous</span>
        </button>

        {isLastStep ? (
          <button className="cooking-nav-button finish" onClick={handleExit}>
            <i className="bi bi-check-circle"></i>
            <span>Finish Cooking</span>
          </button>
        ) : (
          <button className="cooking-nav-button next" onClick={nextStep}>
            <span>Next Step</span>
            <i className="bi bi-chevron-right"></i>
          </button>
        )}
      </div>

      {/* Keyboard Hints */}
      <div className="cooking-keyboard-hints">
        <span><kbd>←</kbd> Previous</span>
        <span><kbd>→</kbd> or <kbd>Space</kbd> Next</span>
        <span><kbd>Esc</kbd> Exit</span>
      </div>
    </div>
  );
}
