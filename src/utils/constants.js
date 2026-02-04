// src/utils/constants.js

// Filter Categories
export const CATEGORIES = [
  'Beef',
  'Chicken',
  'Dessert',
  'Lamb',
  'Miscellaneous',
  'Pasta',
  'Pork',
  'Seafood',
  'Side',
  'Starter',
  'Vegan',
  'Vegetarian',
  'Breakfast',
  'Goat'
];

// Filter Areas (Cuisines)
export const AREAS = [
  'American',
  'British',
  'Canadian',
  'Chinese',
  'Croatian',
  'Dutch',
  'Egyptian',
  'Filipino',
  'French',
  'Greek',
  'Indian',
  'Irish',
  'Italian',
  'Jamaican',
  'Japanese',
  'Kenyan',
  'Malaysian',
  'Mexican',
  'Moroccan',
  'Polish',
  'Portuguese',
  'Russian',
  'Spanish',
  'Thai',
  'Tunisian',
  'Turkish',
  'Ukrainian',
  'Vietnamese'
];

// LocalStorage Keys
export const STORAGE_KEYS = {
  FAVORITES: 'dishlyst-favorites',
  SHOPPING_LIST: 'dishlyst-shopping-list',
  MEAL_PLAN: 'dishlyst-meal-plan',
  CURRENT_WEEK: 'dishlyst-current-week'
};

// Toast Types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error'
};

// Page Routes
export const PAGES = {
  SEARCH: 'search',
  FAVORITES: 'favorites',
  SHOPPING_LIST: 'shopping-list',
  MEAL_PLANNER: 'meal-planner'
};

// Meal Types
export const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner'
}

// Day names
export const DAY_NAMES = [
  'Monday',
  'Tuesday', 
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://www.themealdb.com/api/json/v1/1',
  RANDOM_RECIPE_COUNT: 8,
  MAX_FILTER_RESULTS: 20
};

// Debounce Delay
export const DEBOUNCE_DELAY = 500; // ms

// Toast Duration
export const TOAST_DURATION = 3000; // ms