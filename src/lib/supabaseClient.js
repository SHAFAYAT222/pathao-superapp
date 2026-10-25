// Supabase Client & Operations for Pathao Super-App
import { createClient } from '@supabase/supabase-js';

// Read variables from Vite environment with fallbacks
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://fkfvzxlabviobjjulefa.supabase.co';

const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_4Dz-Dxp0tei8Yop_1WJEaw_AjAWsFFV';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

// Initialize Supabase Client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Inserts ride booking request into the 'rides' table in Supabase
 * @param {Object} rideData - { pickup, destination, vehicle, fare, paymentMethod, status }
 */
export async function insertRideToSupabase(rideData) {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: new Error('Supabase URL or Key is not configured in .env'),
    };
  }

  const pickupName =
    typeof rideData.pickup === 'object' ? rideData.pickup?.name || rideData.pickup?.area || 'Banani 11' : String(rideData.pickup);

  const dropoffName =
    typeof rideData.destination === 'object'
      ? rideData.destination?.name || rideData.destination?.area || 'Gulshan 2'
      : String(rideData.destination);

  const vehicleType = rideData.vehicle?.id || rideData.vehicle?.name || 'bike';
  const fare = Number(rideData.fare) || 0;
  const status = rideData.status || 'searching';
  const paymentMethod = rideData.paymentMethod || 'Pathao Pay';

  // Comprehensive record accommodating both snake_case and JSON structure
  const primaryRecord = {
    pickup_address: pickupName,
    dropoff_address: dropoffName,
    pickup_coords: rideData.pickup?.coords || null,
    dropoff_coords: rideData.destination?.coords || null,
    vehicle_type: vehicleType,
    fare,
    status,
    payment_method: paymentMethod,
    created_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase.from('rides').insert([primaryRecord]).select();

    if (error) {
      console.warn('[Supabase Rides] Primary insert failed, trying flexible schema:', error.message);
      // Attempt simplified record if user schema has different column names
      const fallbackRecord = {
        pickup: pickupName,
        destination: dropoffName,
        vehicle: vehicleType,
        fare,
        status,
      };

      const fallbackResult = await supabase.from('rides').insert([fallbackRecord]).select();
      if (fallbackResult.error) {
        return {
          success: false,
          error: fallbackResult.error,
          message: fallbackResult.error.message,
        };
      }
      return { success: true, data: fallbackResult.data, record: fallbackRecord };
    }

    return { success: true, data, record: primaryRecord };
  } catch (err) {
    console.error('[Supabase Rides Error]:', err);
    return {
      success: false,
      error: err,
      message: err.message || 'Network error communicating with Supabase',
    };
  }
}

/**
 * Inserts food delivery order into the 'food_orders' table in Supabase
 * @param {Object} orderData - { items, restaurant, subtotal, vat, deliveryFee, discount, grandTotal, paymentMethod }
 */
export async function insertFoodOrderToSupabase(orderData) {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: new Error('Supabase URL or Key is not configured in .env'),
    };
  }

  const restaurantName = orderData.restaurant?.name || 'Pathao Food Partner';
  const restaurantId = orderData.restaurant?.id || orderData.restaurantId || 'rest-1';
  const items = Array.isArray(orderData.items) ? orderData.items : [];
  const subtotal = Number(orderData.subtotal) || 0;
  const vat = Number(orderData.vat) || 0;
  const deliveryFee = Number(orderData.deliveryFee) || 0;
  const discount = Number(orderData.discount) || 0;
  const grandTotal = Number(orderData.grandTotal) || subtotal + vat + deliveryFee - discount;
  const paymentMethod = orderData.paymentMethod || 'Pathao Pay';
  const status = orderData.status || 'preparing';

  const primaryRecord = {
    restaurant_name: restaurantName,
    restaurant_id: restaurantId,
    items,
    subtotal,
    vat,
    delivery_fee: deliveryFee,
    discount,
    grand_total: grandTotal,
    total: grandTotal,
    payment_method: paymentMethod,
    status,
    created_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase.from('food_orders').insert([primaryRecord]).select();

    if (error) {
      console.warn('[Supabase Food] Primary insert failed, trying flexible schema:', error.message);
      // Attempt fallback schema with minimal columns
      const fallbackRecord = {
        restaurant: restaurantName,
        items,
        total: grandTotal,
        status,
      };

      const fallbackResult = await supabase.from('food_orders').insert([fallbackRecord]).select();
      if (fallbackResult.error) {
        return {
          success: false,
          error: fallbackResult.error,
          message: fallbackResult.error.message,
        };
      }
      return { success: true, data: fallbackResult.data, record: fallbackRecord };
    }

    return { success: true, data, record: primaryRecord };
  } catch (err) {
    console.error('[Supabase Food Orders Error]:', err);
    return {
      success: false,
      error: err,
      message: err.message || 'Network error communicating with Supabase',
    };
  }
}

export default supabase;
