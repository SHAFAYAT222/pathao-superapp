import { Router } from 'express';
import { RESTAURANTS, FOOD_CATEGORIES } from '../data/initialData.js';

const router = Router();

/**
 * GET /api/restaurants
 * Returns list of restaurants with optional category and search filtering
 */
router.get('/', (req, res) => {
  const { category, search } = req.query;
  let results = [...RESTAURANTS];

  if (category && category !== 'all') {
    results = results.filter(
      (r) => r.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search) {
    const term = search.toLowerCase();
    results = results.filter(
      (r) =>
        r.name.toLowerCase().includes(term) ||
        r.cuisine.toLowerCase().includes(term) ||
        r.branch.toLowerCase().includes(term)
    );
  }

  // Strip large menus from list overview for high performance
  const restaurantList = results.map(({ menu: _menu, ...summary }) => ({
    ...summary,
    itemCount: _menu?.length || 0,
  }));

  return res.json({
    success: true,
    count: restaurantList.length,
    restaurants: restaurantList,
  });
});

/**
 * GET /api/restaurants/categories
 * Returns all available food categories
 */
router.get('/categories', (_req, res) => {
  return res.json({
    success: true,
    categories: FOOD_CATEGORIES,
  });
});

/**
 * GET /api/restaurants/:id/menu
 * Returns full restaurant details including full menu and item customizers
 */
router.get('/:id/menu', (req, res) => {
  const { id } = req.params;
  const restaurant = RESTAURANTS.find((r) => r.id === id);

  if (!restaurant) {
    return res.status(404).json({
      success: false,
      error: `Restaurant with ID '${id}' not found`,
    });
  }

  return res.json({
    success: true,
    restaurant: {
      id: restaurant.id,
      name: restaurant.name,
      branch: restaurant.branch,
      category: restaurant.category,
      cuisine: restaurant.cuisine,
      rating: restaurant.rating,
      reviewsCount: restaurant.reviewsCount,
      deliveryTime: restaurant.deliveryTime,
      distance: restaurant.distance,
      deliveryFee: restaurant.deliveryFee,
      banner: restaurant.banner,
      discount: restaurant.discount,
    },
    menu: restaurant.menu || [],
  });
});

export default router;
