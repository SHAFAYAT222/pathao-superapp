import { Router } from 'express';
import { RESTAURANTS } from '../data/initialData.js';

const router = Router();

// In-memory food orders store
export const ordersStore = new Map();

/**
 * POST /api/orders/food
 * Persists order items, computes 5% VAT, delivery fees, discounts, and stores order record
 */
router.post('/food', (req, res) => {
  try {
    const {
      items = [],
      restaurantId,
      restaurant,
      paymentMethod = 'Pathao Pay',
      deliveryAddress,
      discount = 0,
      promoCode = null,
      notes = '',
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Order must contain at least one food item',
      });
    }

    // Resolve restaurant details
    const targetRestaurant =
      restaurant || RESTAURANTS.find((r) => r.id === restaurantId) || items[0]?.restaurant;

    const baseDeliveryFee = targetRestaurant?.deliveryFee || 40;

    // Secure backend calculation of subtotal, VAT, and grand total
    const computedSubtotal = items.reduce((sum, item) => {
      const price = Number(item.totalPrice) || Number(item.price) * (Number(item.quantity) || 1);
      return sum + price;
    }, 0);

    const computedVat = Math.round(computedSubtotal * 0.05); // 5% VAT for Dhaka restaurants
    const numericDiscount = Number(discount) || 0;
    const computedGrandTotal = Math.max(
      0,
      computedSubtotal + computedVat + baseDeliveryFee - numericDiscount
    );

    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newOrder = {
      id: orderId,
      status: 'preparing', // 'preparing' | 'picked_up' | 'arriving' | 'delivered'
      restaurant: targetRestaurant
        ? {
            id: targetRestaurant.id,
            name: targetRestaurant.name,
            branch: targetRestaurant.branch,
            cuisine: targetRestaurant.cuisine,
          }
        : { name: 'Pathao Food Partner' },
      items,
      subtotal: computedSubtotal,
      vat: computedVat,
      deliveryFee: baseDeliveryFee,
      discount: numericDiscount,
      promoCode,
      grandTotal: computedGrandTotal,
      paymentMethod,
      deliveryAddress: deliveryAddress || 'House 42, Road 11, Banani, Dhaka',
      notes,
      estimatedDeliveryMins: 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    ordersStore.set(orderId, newOrder);

    // Simulate food preparation and delivery progression
    setTimeout(() => {
      const ord = ordersStore.get(orderId);
      if (ord && ord.status === 'preparing') {
        ord.status = 'picked_up';
        ord.updatedAt = new Date().toISOString();
        ordersStore.set(orderId, ord);
      }
    }, 8000).unref();

    setTimeout(() => {
      const ord = ordersStore.get(orderId);
      if (ord && ord.status === 'picked_up') {
        ord.status = 'arriving';
        ord.updatedAt = new Date().toISOString();
        ordersStore.set(orderId, ord);
      }
    }, 16000).unref();

    return res.status(201).json({
      success: true,
      message: 'Food order successfully placed and confirmed with restaurant',
      order: newOrder,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Error processing food order',
    });
  }
});

/**
 * GET /api/orders/:id/status
 * Get live status of an order
 */
router.get('/:id/status', (req, res) => {
  const { id } = req.params;
  const order = ordersStore.get(id);

  if (!order) {
    return res.status(404).json({
      success: false,
      error: `Order with ID ${id} not found`,
    });
  }

  return res.json({
    success: true,
    order,
  });
});

/**
 * GET /api/orders
 * Get list of all orders
 */
router.get('/', (_req, res) => {
  const orders = Array.from(ordersStore.values()).reverse();
  return res.json({
    success: true,
    orders,
  });
});

export default router;
