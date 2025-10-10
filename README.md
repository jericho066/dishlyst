## Dishlyst – Recipe Finder & Meal Planner

Dishlyst is a modern web app that lets users discover, save, and organize recipes. You can search by ingredients, cuisine, or category, then save your favorite meals and automatically build a shopping list — all in one place.


## Live Demo

[View Live Project](link)

## Features
- Search recipes by name or ingredients
- Filter by category (e.g., Chicken, Dessert) or cuisine (e.g., Italian, Japanese)
- Save favorites locally with persistent storage
- Generate a shopping list directly from recipe ingredients
- Responsive design that works on desktop and mobile
- Offline-friendly (data saved with localStorage)
- Clean, accessible, modern UI with Bootstrap Icons

## Tech Stack
- Frontend: React (Vite)
- Styling: Custom CSS (with Bootstrap Icons)
- API: TheMealDB API
- Storage: Browser localStorage
- Deployment: GitHub Pages or Netlify

## Setup & Installation

### 1. Clone the  repository
```bash
git clone https://github.com/yourusername/dishlyst.git
cd dishlyst
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the app locally
```bash
npm run dev
```

### 4. Open in browser:
```bash
http://localhost:5173/
```


## API Reference
All recipe data is fetched from [TheMealDB API](https://www.themealdb.com/api.php).

**Endpoints used include:**
- search.php?s=
- filter.php?c=
- filter.php?a=
- lookup.php?i=
- random.php

## Future Improvements
- User accounts and cloud-based favorites
- Print-friendly recipe view
- Dark mode toggle
- Recipe difficulty/time estimates from user input

