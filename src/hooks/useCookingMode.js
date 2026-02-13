import { useState, useCallback, useEffect } from 'react';

/**
 * Parse recipe instructions into structured steps
 */
function parseInstructions(instructionsText) {
  if (!instructionsText) return [];
  
  // Split by newlines and clean up
  const steps = instructionsText
    .split('\n')
    .map(step => step.trim())
    .filter(step => step.length > 0)
    .map((text, index) => ({
      index,
      text: text.replace(/^(\d+\.?\s*|\w+\.\s*)/, ''), // Remove numbers/labels
      duration: null, // Will be extracted if mentioned
      timerActive: false,
      timerRemaining: null
    }));

  return steps;
}

/**
 * Extract ingredients from recipe
 */
function extractIngredients(recipe) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure?.trim() || '',
        checked: false
      });
    }
  }
  return ingredients;
}

/**
 * Custom hook for cooking mode functionality
 */
export function useCookingMode(recipe) {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [showIngredients, setShowIngredients] = useState(true);
  const [activeTimer, setActiveTimer] = useState(null);

  // Initialize when recipe changes
  useEffect(() => {
    if (recipe) {
      const parsedSteps = parseInstructions(recipe.strInstructions);
      const parsedIngredients = extractIngredients(recipe);
      setSteps(parsedSteps);
      setIngredients(parsedIngredients);
      setCurrentStep(0);
    }
  }, [recipe]);

  /**
   * Start cooking mode
   */
  const startCookingMode = useCallback(() => {
    setIsActive(true);
    setCurrentStep(0);
    // Request fullscreen if supported
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {
        // Fullscreen request failed, continue anyway
      });
    }
  }, []);

  /**
   * Exit cooking mode
   */
  const exitCookingMode = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    setActiveTimer(null);
    // Exit fullscreen if active
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, []);

  /**
   * Go to next step
   */
  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setActiveTimer(null);
    }
  }, [currentStep, steps.length]);

  /**
   * Go to previous step
   */
  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setActiveTimer(null);
    }
  }, [currentStep]);

  /**
   * Jump to specific step
   */
  const goToStep = useCallback((stepIndex) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
      setActiveTimer(null);
    }
  }, [steps.length]);

  /**
   * Toggle ingredient checked
   */
  const toggleIngredient = useCallback((index) => {
    setIngredients(prev => prev.map((ingredient, i) => 
      i === index ? { ...ingredient, checked: !ingredient.checked } : ingredient
    ));
  }, []);

  /**
   * Toggle ingredients sidebar
   */
  const toggleIngredientsSidebar = useCallback(() => {
    setShowIngredients(prev => !prev);
  }, []);

  /**
   * Start timer for current step
   */
  const startTimer = useCallback((seconds) => {
    setActiveTimer({
      duration: seconds,
      remaining: seconds,
      stepIndex: currentStep
    });
  }, [currentStep]);

  /**
   * Cancel active timer
   */
  const cancelTimer = useCallback(() => {
    setActiveTimer(null);
  }, []);

  /**
   * Timer countdown effect
   */
  useEffect(() => {
    if (!activeTimer || activeTimer.remaining <= 0) return;

    const interval = setInterval(() => {
      setActiveTimer(prev => {
        if (!prev || prev.remaining <= 1) {
          // Timer finished
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Timer Complete!', {
              body: 'Your cooking timer has finished.',
              icon: '/logo.png'
            });
          }
          return null;
        }
        return {
          ...prev,
          remaining: prev.remaining - 1
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  return {
    // State
    isActive,
    currentStep,
    totalSteps: steps.length,
    steps,
    ingredients,
    showIngredients,
    activeTimer,
    
    // Actions
    startCookingMode,
    exitCookingMode,
    nextStep,
    previousStep,
    goToStep,
    toggleIngredient,
    toggleIngredientsSidebar,
    startTimer,
    cancelTimer,
    
    // Computed
    progress: steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
    currentStepData: steps[currentStep] || null
  };
}

