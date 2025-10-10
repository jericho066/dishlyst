import { useState, useEffect } from 'react'

// Mock API functions
const searchRecipes = async (query) => {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
  const data = await response.json()
  return data.meals || []
}

const getRandomRecipes = async (count = 12) => {
  const promises = Array(count).fill(null).map(() => 
    fetch('https://www.themealdb.com/api/json/v1/1/random.php').then(res => res.json())
  )
  const results = await Promise.all(promises)
  const recipes = results.map(data => data.meals[0])

  //* To remove duplicate recipes
  const uniqueRecipes = recipes.filter((recipe, index, self) => 
    index === self.findIndex(r => r.idMeal === recipe.idMeal)
  )

  return uniqueRecipes
}


const filterByCategory = async (category) => {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
  const data = await response.json()
  return data.meals || []
}

const filterByArea = async (area) => {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
  const data = await response.json()
  return data.meals || []
}

const getRecipeById = async (id) => {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
  const data = await response.json()
  return data.meals ? data.meals[0] : null
}

//* LocalStorage helpers
const FAVORITES_KEY = 'dishlyst-favorites'

const getFavoritesFromStorage = () => {
  const stored = localStorage.getItem(FAVORITES_KEY)
  return stored ? JSON.parse(stored) : []
}

const saveFavoritesToStorage = (favorites) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}



const SHOPPING_LIST_KEY = 'dishlyst-shopping-list'

const getShoppingListFromStorage = () => {
  const stored = localStorage.getItem(SHOPPING_LIST_KEY)
  return stored ? JSON.parse(stored) : []
}

const saveShoppingListToStorage = (items) => {
  localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(items))
}




function App() {
  // This state tracks which page we're currently on
  const [currentPage, setCurrentPage] = useState('search')
  const [searchQuery, setSearchQuery] = useState('')
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({category: "", area: ""})
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [recipeDetailLoading, setRecipeDetailLoading] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [shoppingList, setShoppingList] = useState([])

  //* to load favorites, shopping list, and recipes from localStorage on mount
  useEffect(() => {
    const storedFavorites = getFavoritesFromStorage()
    setFavorites(storedFavorites)

    const storedShoppingList = getShoppingListFromStorage()
    setShoppingList(storedShoppingList)

    //* load initial recipes
    loadRandomRecipes()
  }, [])

  

  //* waits 500ms after user stops typing
  useEffect(() => {
    if (searchQuery === "" || !searchQuery.trim()) {
      if (recipes.length > 0) {

        if (filters.category || filters.area) {
          setFilters({ category: '', area: '' })
        }
        loadRandomRecipes()
      }
      return
    }

    const timeoutId = setTimeout(() => {
      handleSearch()
    }, 500)

    return () =>clearTimeout(timeoutId)

  }, [searchQuery])

  
  //* apply filters when changed
  useEffect(() => {
    if (filters.category || filters.area) {
      applyFilters()
    }
  }, [filters])



  const loadRandomRecipes = async () => {
    setLoading(true)
    const data = await getRandomRecipes(8)
    setRecipes(data)
    setLoading(false)
  }

  const handleSearch = async () => {
    setLoading(true)
    const data = await searchRecipes(searchQuery)
    setRecipes(data)
    setLoading(false)
    
  }


  const applyFilters = async () => {
    setLoading(true)
    let data = []

    if (filters.category && filters.area) {
      
      const categoryResults = await filterByCategory(filters.category)

      const fullRecipes = await Promise.all(
        categoryResults.slice(0, 20).map(recipe => getRecipeById(recipe.idMeal))
      )

      data = fullRecipes.filter(recipe => recipe && recipe.strArea === filters.area)

    } else if (filters.category) {
      data = await filterByCategory(filters.category)

    } else if (filters.area) {
      data = await filterByArea(filters.area)
    }

    
    setRecipes(data)
    setLoading(false)
  }

  const clearFilters = () => {
    setFilters({ category: '', area: '' })
    setSearchQuery('')
    loadRandomRecipes()
  }

  const openRecipeDetail = async (recipeId) => {
    setRecipeDetailLoading(true)
    setSelectedRecipe(null)
    const recipe = await getRecipeById(recipeId)
    setSelectedRecipe(recipe)
    setRecipeDetailLoading(false)
  }

  const closeRecipeDetails = () => {
    setSelectedRecipe(null)
  }

  //* Favorites functions
  const toggleFavorite = (recipe) => {
    const isFavorite = favorites.some(fav => fav.idMeal === recipe.idMeal)

    let newFavorites
    if(isFavorite) {
      //* remove from favorites
      newFavorites = favorites.filter(fav => fav.idMeal !== recipe.idMeal)
    } else {
      //* add to favorites
      newFavorites = [...favorites, recipe]
    }

    setFavorites(newFavorites)
    saveFavoritesToStorage(newFavorites)

  }

  const isFavorite = (recipeId) => {
    return favorites.some(fav => fav.idMeal === recipeId)
  }

  const clearAllFavorites = () => {
    if (window.confirm("Are you sure you want to clear all favorites?")) {
      setFavorites([])
      saveFavoritesToStorage([])
    }
  }


  //* Shopping list functions
  const addToShoppingList = (recipe) => {
    // Extract ingredients from recipe
    const ingredients = []
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`]
      const measure = recipe[`strMeasure${i}`]
      
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          id: `${recipe.idMeal}-${i}`,
          recipeId: recipe.idMeal,
          recipeName: recipe.strMeal,
          ingredient: ingredient.trim(),
          measure: measure?.trim() || '',
          checked: false
        })
      }
    }
    
    // Check for duplicates and add only new items
    const newItems = ingredients.filter(newItem => 
      !shoppingList.some(item => 
        item.ingredient.toLowerCase() === newItem.ingredient.toLowerCase() &&
        item.measure === newItem.measure
      )
    )
    
    const updatedList = [...shoppingList, ...newItems]
    setShoppingList(updatedList)
    saveShoppingListToStorage(updatedList)
    
    // Show success message
    alert(`Added ${newItems.length} ingredients to shopping list!`)
  }

  const toggleShoppingItem = (itemId) => {
    const updatedList = shoppingList.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    )
    setShoppingList(updatedList)
    saveShoppingListToStorage(updatedList)
  }

  const removeShoppingItem = (itemId) => {
    const updatedList = shoppingList.filter(item => item.id !== itemId)
    setShoppingList(updatedList)
    saveShoppingListToStorage(updatedList)
  }

  const clearShoppingList = () => {
    if (window.confirm('Clear all items from shopping list?')) {
      setShoppingList([])
      saveShoppingListToStorage([])
    }
  }

  const clearCheckedItems = () => {
    const updatedList = shoppingList.filter(item => !item.checked)
    setShoppingList(updatedList)
    saveShoppingListToStorage(updatedList)
  }


   const hasActiveFilters = filters.category || filters.area || searchQuery



  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header className="header">
        <a href="#main-content" className='skip-link'>Skip to main content</a>
        <div className="container">
          <div className="header-content">

            <div className='logo'>
              <img src="/logo.png" alt=""  />
            </div>
                        
            <form 
              onSubmit={(e) => {
                e.preventDefault() //* prevent form submission
                
              }}
              className='search-wrapper'
            >
              <input
                type="text"
                placeholder="Search recipes or ingredients (e.g., 'chicken', 'pasta')"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search recipes"
              />
            </form>

          </div>
        </div>
      </header>


      {/* Navigation Tabs */}
      <nav className="nav">
        <div className="container">
          <div className="nav-content">

            <button
              onClick={() => {
                setCurrentPage('search')
                setSelectedRecipe(null)
              }}
              className={`nav-button ${currentPage === 'search' ? 'active' : ''}`}
            >
              Search
            </button>

            <button
              onClick={() => {
                setCurrentPage('favorites')
                setSelectedRecipe(null)
              }}
              className={`nav-button ${currentPage === 'favorites' ? 'active' : ''}`}
            >
              Favorites <i className="bi bi-heart"></i> {favorites.length > 0 && `(${favorites.length})`}
            </button>

            <button
              onClick={() => {
                setCurrentPage('shopping')
                setSelectedRecipe(null)
              }}
              className={`nav-button ${currentPage === 'shopping' ? 'active' : ''}`}
            >
              Shopping List <i className="bi bi-cart3"></i> {shoppingList.length > 0 && `(${shoppingList.length})`}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main" id='main-content' role='main'>
        <div className="container">
          {selectedRecipe ? (
            <RecipeDetailPage 
              recipe={selectedRecipe} 
              loading={recipeDetailLoading}
              onClose={closeRecipeDetails}
              isFavorite={isFavorite(selectedRecipe.idMeal)}
              onToggleFavorite={() => toggleFavorite(selectedRecipe)}
              onAddShoppingList={() => addToShoppingList(selectedRecipe)}
            />
          ) : currentPage === 'search' ? (
            <SearchPage 
              recipes={recipes}
              loading={loading}
              searchQuery={searchQuery}
              filters={filters}
              setFilters={setFilters}
              clearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
              onRecipeClick={openRecipeDetail}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
          ) : currentPage === 'favorites' ? (
            <FavoritesPage 
              favorites={favorites}
              onRecipeClick={openRecipeDetail}
              onClearAll={clearAllFavorites}
              onToggleFavorite={toggleFavorite}
              isFavorite={isFavorite}
              setCurrentPage={setCurrentPage} 
            />
          ) : (
            <ShoppingListPage 
              items={shoppingList}
              onToggleItem={toggleShoppingItem}
              onRemoveItem={removeShoppingItem}
              onClearAll={clearShoppingList}
              onClearChecked={clearCheckedItems}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p>Dishlyst © 2025 | Built with React & TheMealDB API</p>
          </div>
        </div>
      </footer>

    </div>
  )
}


//* Recipe Deatail Page
function RecipeDetailPage({ recipe, loading, onClose, isFavorite, onToggleFavorite, onAddShoppingList }) {

  if (loading || !recipe) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '1rem' }}>Loading recipe...</p>
      </div>
    )
  }

  //* to extract ingredients
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`]
    const measure = recipe[`strMeasure${i}`]

    if (ingredient && ingredient.trim()) {
      ingredients.push({ ingredient, measure })
    }
  }

  //* split instructions into steps
  const instructions = recipe.strInstructions.split("\n").filter(step => step.trim().length > 0)

  return (
    <div className="recipe-detail">

      {/* Header with Image */}
      <div 
        className="recipe-detail-header"
        style={{ backgroundImage: `url(${recipe.strMealThumb})` }}
      >

        <button className="back-button" onClick={onClose}>
          <i className="bi bi-arrow-left"></i> Back
        </button>

        <button
          className={`favorite-button ${isFavorite ? 'active' : ''}`}
          onClick={onToggleFavorite}
          style={{ position: 'absolute', top: '1rem', right: '1rem' }}
        >
          {isFavorite ? <i className="bi bi-heart-fill"></i> : <i className="bi bi-heart"></i>}
        </button>

        
        <div className="recipe-detail-title-section">
          <h1 className="recipe-detail-title">{recipe.strMeal}</h1>

          <div className="recipe-detail-tags">
            <span className="recipe-detail-tag">

              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-fork-knife" viewBox="0 0 16 16">
                <path d="M13 .5c0-.276-.226-.506-.498-.465-1.703.257-2.94 2.012-3 8.462a.5.5 0 0 0 .498.5c.56.01 1 .13 1 1.003v5.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5zM4.25 0a.25.25 0 0 1 .25.25v5.122a.128.128 0 0 0 .256.006l.233-5.14A.25.25 0 0 1 5.24 0h.522a.25.25 0 0 1 .25.238l.233 5.14a.128.128 0 0 0 .256-.006V.25A.25.25 0 0 1 6.75 0h.29a.5.5 0 0 1 .498.458l.423 5.07a1.69 1.69 0 0 1-1.059 1.711l-.053.022a.92.92 0 0 0-.58.884L6.47 15a.971.971 0 1 1-1.942 0l.202-6.855a.92.92 0 0 0-.58-.884l-.053-.022a1.69 1.69 0 0 1-1.059-1.712L3.462.458A.5.5 0 0 1 3.96 0z"/>
              </svg>

               {recipe.strCategory}
            </span>

            <span className="recipe-detail-tag">
              <i className="bi bi-globe-americas"></i> {recipe.strArea}
            </span>
            {recipe.strTags && recipe.strTags.split(',').map(tag => (
              <span key={tag} className="recipe-detail-tag">{tag.trim()}</span>
            ))}
          </div>

        </div>
      </div>

      {/* Content */}
      <div className="recipe-detail-content">

        {/* Quick Info */}
        <div className="recipe-detail-meta">

          <div className="meta-item">

            {/* Prep Time */}
            <div className="meta-icon">
              <i className="bi bi-stopwatch"></i>
            </div>

            <div className="meta-label">Prep Time</div>
            <div className="meta-value">30 min</div>
          </div>

          <div className="meta-item">

            {/* Servings */}
            <div className="meta-icon">
              <i className="bi bi-people"></i>
            </div>

            <div className="meta-label">Servings</div>
            <div className="meta-value">4</div>
          </div>

          <div className="meta-item">

            {/* Difficulty */}
            <div className="meta-icon">
              <i className="bi bi-bar-chart"></i>
            </div>

            <div className="meta-label">Difficulty</div>
            <div className="meta-value">Medium</div>
          </div>

        </div>

        {/* Ingredients & Instructions */}
        <div className="recipe-sections">
          {/* Ingredients */}
          <div className="recipe-section">

            <h2 className="recipe-section-title">
              <i className="bi bi-cart3"></i> Ingredients
            </h2>

            <ul className="ingredients-list">
              {ingredients.map((item, index) => (
                <li key={index} className="ingredient-item">
                  <input type="checkbox" className="ingredient-checkbox" />
                  <span className="ingredient-text">
                    {item.measure} {item.ingredient}
                  </span>
                </li>
              ))}
            </ul>

          </div>

          {/* Instructions */}
          <div className="recipe-section">

            <h2 className="recipe-section-title">
              <i className="bi bi-pencil-square"></i> Instructions
            </h2>

            <ol className="instructions-list">
              {instructions.map((step, index) => (
                <li key={index} className="instruction-item">
                  {step}
                </li>
              ))}
            </ol>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">

          <button className="action-button" onClick={onToggleFavorite}>
            {isFavorite ? (
              <>
                <i className="bi bi-heart-fill"></i> Remove from Favorites
              </>
            ) : (
              <>
                <i className="bi bi-heart"></i> Save to Favorites
              </>
            )}
          </button>

          <button className="action-button primary" onClick={onAddShoppingList}>
            <i className="bi bi-cart3"></i> Add to Shopping List
          </button>

          <button className="action-button">
            <i className="bi bi-printer"></i> Print Recipe
          </button>

        </div>

        {/* Video Link */}
        {recipe.strYoutube && (
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <a 
              href={recipe.strYoutube} 
              target="_blank" 
              rel="noopener noreferrer"
              className="action-button"
              style={{ display: 'inline-flex', textDecoration: 'none' }}
            >
              <i className="bi bi-camera-reels"></i> Watch Video Tutorial
            </a>
          </div>
        )}
      </div>
    </div>
  )

}



//* Filters Component
function FiltersPanel({ filters, setFilters, clearFilters, hasActiveFilters }) {
  const categories = [
    'Beef', 'Chicken', 'Dessert', 'Lamb', 'Pasta', 
    'Pork', 'Seafood', 'Starter', 'Vegan', 'Vegetarian'
  ]

  const areas = [
    'American', 'British', 'Canadian', 'Chinese', 'French',
    'Greek', 'Indian', 'Italian', 'Japanese', 'Mexican', 'Thai'
  ]

  return (
    <div className="filters-section">
      <div className="filters-header">

        <h3 className="filters-title">
          <i className="bi bi-search"></i> Filters
        </h3>

        {hasActiveFilters && (
          <button onClick={clearFilters} className="clear-filters">
            Clear all
          </button>
        )}
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label className="filter-label">Category</label>

          <select 
            className="filter-select"
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Cuisine</label>
          <select 
            className="filter-select"
            value={filters.area}
            onChange={(e) => setFilters({...filters, area: e.target.value})}
          >
            <option value="">All Cuisines</option>
            {areas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="active-filters">
          {filters.category && (
            <span className="filter-badge">
              Category: {filters.category}
              <button onClick={() => setFilters({...filters, category: ''})}>×</button>
            </span>
          )}
          {filters.area && (
            <span className="filter-badge">
              Cuisine: {filters.area}
              <button onClick={() => setFilters({...filters, area: ''})}>×</button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

//* Skeleton Loader Component
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text"></div>
      </div>
    </div>
  )
}



function RecipeCard({recipe, onClick, isFavorite, onToggleFavorite}) {
  
  const handleFavoriteClick = (e) => {
    e.stopPropagation() //* to prevent opening recipe detail
    onToggleFavorite(recipe)
  }

  return (
    <div className='recipe-card' onClick={() => onClick(recipe.idMeal)}>

      <button
        className={`favorite-button ${isFavorite(recipe.idMeal) ? 'active' : ''}`}
        onClick={handleFavoriteClick}
        aria-label={isFavorite(recipe.idMeal) ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite(recipe.idMeal) ? <i className="bi bi-heart-fill"></i> : <i className="bi bi-heart"></i>}
      </button>

      <img src={recipe.strMealThumb} className='recipe-card-image' alt="" />

      <div className='recipe-card-content'>
        <h3 className="recipe-card-title">{recipe.strMeal}</h3>

        <div className="recipe-card-meta">
          {
            recipe.strCategory && 
            <span>

              {/*!! using svg on this icon (fork and knife), because for some reason the web font doesn't work for this icon in Bootstrap  */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-fork-knife" viewBox="0 0 16 16">
                <path d="M13 .5c0-.276-.226-.506-.498-.465-1.703.257-2.94 2.012-3 8.462a.5.5 0 0 0 .498.5c.56.01 1 .13 1 1.003v5.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5zM4.25 0a.25.25 0 0 1 .25.25v5.122a.128.128 0 0 0 .256.006l.233-5.14A.25.25 0 0 1 5.24 0h.522a.25.25 0 0 1 .25.238l.233 5.14a.128.128 0 0 0 .256-.006V.25A.25.25 0 0 1 6.75 0h.29a.5.5 0 0 1 .498.458l.423 5.07a1.69 1.69 0 0 1-1.059 1.711l-.053.022a.92.92 0 0 0-.58.884L6.47 15a.971.971 0 1 1-1.942 0l.202-6.855a.92.92 0 0 0-.58-.884l-.053-.022a1.69 1.69 0 0 1-1.059-1.712L3.462.458A.5.5 0 0 1 3.96 0z"/>
              </svg>

               {recipe.strCategory}
            </span>
          }
          {
            recipe.strArea && <span><i className="bi bi-globe-americas"></i> {recipe.strArea}</span>
          }
        </div>

        {recipe.strTags && (

          <div style={{ marginTop: '0.5rem' }}>
            {recipe.strTags.split(',').slice(0, 2).map(tag => (
              <span key={tag} className="recipe-card-tag">{tag.trim()}</span>
            ))}
          </div>

        )}

      </div>
    </div>
  )
}



// Page Components
function SearchPage({recipes, loading, searchQuery, filters, setFilters, clearFilters, hasActiveFilters, onRecipeClick, isFavorite, onToggleFavorite}) {
  return (
    <div>
      {/* Filters */}
      <FiltersPanel 
        filters={filters}
        setFilters={setFilters}
        clearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Results Header */}
      <div className="results-header">
        <div>
          <h2 className="page-title" style={{ marginBottom: '0.25rem' }}>
            {searchQuery 
              ? `Results for "${searchQuery}"` 
              : filters.category && filters.area
                ? `${filters.category} - ${filters.area} Cuisine`
                : filters.category
                  ? `${filters.category} Recipes`
                  : filters.area
                    ? `${filters.area} Cuisine`
                    : 'Featured Recipes'}
          </h2>
          <p className="results-count">
            {loading ? 'Searching...' : `${recipes.length} recipes found`}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="recipe-grid">
          {Array(6).fill(null).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && recipes.length === 0 && (
        <div className="empty-state">

          {/* empty state search icon */}
          <div className="empty-state-icon">
            <i className="bi bi-search"></i>
          </div>

          <h2 className="page-title">No recipes found</h2>
          <p className="page-description">
            Try adjusting your filters or search for something else
          </p>

        </div>
      )}

      {/* Recipe Grid */}
      {!loading && recipes.length > 0 && (
        <div className="recipe-grid">
          {recipes.map(recipe => (
            <RecipeCard 
              key={recipe.idMeal}
              recipe={recipe}
              onClick={onRecipeClick}
              isFavorite={isFavorite}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function FavoritesPage({ favorites, onRecipeClick, onClearAll, onToggleFavorite, isFavorite, setCurrentPage }) {
  if (favorites.length === 0) {
    return (
      <div className='empty-favorites'>

        <div className='empty-favorites-icon'>
          <i className="bi bi-heartbreak"></i>
        </div>

        <h2 className='empty-favorites-title'>No Favorites Yet</h2>

        <p className='empty-favorites-text'>
          Start exploring recipes and tap the <i className="bi bi-heart"></i> button to save your favorites!
        </p>

        <button className='browse-button' onClick={() => setCurrentPage("search")}>Browse Recipes</button>
        
      </div>

    )
  }

  return (
    <div>
      <div className="favorites-header">
        <div>

          <h2 className="page-title" style={{ marginBottom: '0.25rem' }}>
            Your Favorite Recipes
          </h2>

          <p className="favorites-count">
            {favorites.length} {favorites.length === 1 ? 'recipe' : 'recipes'} saved
          </p>

        </div>

        <button className="clear-favorites-button" onClick={onClearAll}>
          Clear All
        </button>
      </div>

      <div className="recipe-grid">
        {favorites.map(recipe => (
          <RecipeCard
            key={recipe.idMeal}
            recipe={recipe}
            onClick={onRecipeClick}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  )
}

function ShoppingListPage({ items, onToggleItem, onRemoveItem, onClearAll, onClearChecked, setCurrentPage }) {
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
    )
  }

  const checkedCount = items.filter(item => item.checked).length

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

  )
}

export default App
