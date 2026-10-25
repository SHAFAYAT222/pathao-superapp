// Food & Restaurants API Client Service
import { http } from './apiClient';
import { RESTAURANTS, FOOD_CATEGORIES } from '../data/mockData';

export const foodService = {
  /**
   * Fetch list of restaurants with optional category and search query
   */
  async getRestaurants({ category = 'all', search = '' } = {}) {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (search) params.append('search', search);

      const queryStr = params.toString() ? `?${params.toString()}` : '';
      const data = await http.get(`/api/restaurants${queryStr}`);
      return data.restaurants;
    } catch (err) {
      console.warn('[FoodService] API unavailable, using fallback dataset:', err.message);
      // Fallback to local data
      return RESTAURANTS.filter((r) => {
        const matchesCat = category === 'all' || r.category === category;
        const matchesSearch =
          !search ||
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(search.toLowerCase());
        return matchesCat && matchesSearch;
      });
    }
  },

  /**
   * Fetch food categories
   */
  async getCategories() {
    try {
      const data = await http.get('/api/restaurants/categories');
      return data.categories;
    } catch (_err) {
      return FOOD_CATEGORIES;
    }
  },

  /**
   * Fetch menu for a specific restaurant
   */
  async getRestaurantMenu(restaurantId) {
    try {
      const data = await http.get(`/api/restaurants/${restaurantId}/menu`);
      return {
        restaurant: data.restaurant,
        menu: data.menu,
      };
    } catch (err) {
      console.warn('[FoodService] Menu API error, using fallback:', err.message);
      const rest = RESTAURANTS.find((r) => r.id === restaurantId);
      return {
        restaurant: rest || null,
        menu: rest?.menu || [],
      };
    }
  },

  /**
   * Place a new food order
   */
  async placeOrder(orderData) {
    try {
      const data = await http.post('/api/orders/food', orderData);
      return data.order;
    } catch (err) {
      console.warn('[FoodService] Order placement API fallback:', err.message);
      // Calculate local fallback
      const subtotal = orderData.items.reduce((s, i) => s + (i.totalPrice || 0), 0);
      const vat = Math.round(subtotal * 0.05);
      const deliveryFee = orderData.restaurant?.deliveryFee || 40;
      const discount = orderData.discount || 0;
      const grandTotal = Math.max(0, subtotal + vat + deliveryFee - discount);

      return {
        id: `order_fallback_${Date.now()}`,
        status: 'preparing',
        restaurant: orderData.restaurant,
        items: orderData.items,
        subtotal,
        vat,
        deliveryFee,
        discount,
        grandTotal,
        paymentMethod: orderData.paymentMethod || 'Pathao Pay',
        createdAt: new Date().toISOString(),
      };
    }
  },

  /**
   * Track status of an ongoing food order
   */
  async getOrderStatus(orderId) {
    try {
      const data = await http.get(`/api/orders/${orderId}/status`);
      return data.order;
    } catch (_err) {
      return null;
    }
  },
};

export default foodService;
