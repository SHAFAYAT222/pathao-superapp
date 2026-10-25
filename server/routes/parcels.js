import { Router } from 'express';
import crypto from 'node:crypto';
import { PARCEL_CATEGORIES, MOCK_CAPTAINS } from '../data/initialData.js';

const router = Router();

// In-memory parcels store
export const parcelsStore = new Map();

/**
 * Generate cryptographically secure 4-digit verification OTP
 */
function generateSecureOtp() {
  const num = crypto.randomInt(1000, 10000);
  return num.toString();
}

/**
 * POST /api/parcels/create
 * Generates 4-digit pickup and delivery verification OTPs, assigns courier, and persists parcel
 */
router.post('/create', (req, res) => {
  try {
    const {
      sender,
      recipient,
      category,
      weightKg = 1,
      deliveryInstructions = '',
      paymentMethod = 'Pathao Pay',
    } = req.body;

    if (!sender?.name || !sender?.phone || !recipient?.name || !recipient?.phone) {
      return res.status(400).json({
        success: false,
        error: 'Complete sender and recipient information (name and phone) is required',
      });
    }

    const matchedCategory =
      PARCEL_CATEGORIES.find((c) => c.id === category?.id) ||
      category ||
      PARCEL_CATEGORIES[0];

    const weight = Number(weightKg) || 1;
    const baseRate = matchedCategory.price || 70;
    const weightCharge = Math.max(0, (weight - 1) * 25);
    const totalFare = baseRate + weightCharge;

    // Cryptographically secure 4-digit OTPs
    const pickupOtp = generateSecureOtp();
    const deliveryOtp = generateSecureOtp();

    // Assign verified courier
    const courier = MOCK_CAPTAINS.find((c) => c.captainType === 'parcel') || {
      name: 'Belal Hossain',
      phone: '+880 1912-887766',
      vehicle: 'Hero Splendor (DHAKA METRO HA-33-1290)',
      rating: 4.92,
    };

    const parcelId = `parcel_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newParcel = {
      id: parcelId,
      status: 'courier_assigned', // 'courier_assigned' | 'in_transit' | 'delivered'
      sender,
      recipient,
      category: matchedCategory,
      weightKg: weight,
      totalFare,
      pickupOtp,
      deliveryOtp,
      courier,
      deliveryInstructions,
      paymentMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    parcelsStore.set(parcelId, newParcel);

    return res.status(201).json({
      success: true,
      message: 'Pathao Parcel booked. Secure pickup and delivery OTPs generated.',
      parcel: newParcel,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Error creating parcel dispatch request',
    });
  }
});

/**
 * GET /api/parcels/:id/status
 * Get status and verification verification codes for a parcel
 */
router.get('/:id/status', (req, res) => {
  const { id } = req.params;
  const parcel = parcelsStore.get(id);

  if (!parcel) {
    return res.status(404).json({
      success: false,
      error: `Parcel with ID ${id} not found`,
    });
  }

  return res.json({
    success: true,
    parcel,
  });
});

/**
 * POST /api/parcels/:id/advance
 * Simulates progression through verification states
 */
router.post('/:id/advance', (req, res) => {
  const { id } = req.params;
  const parcel = parcelsStore.get(id);

  if (!parcel) {
    return res.status(404).json({
      success: false,
      error: `Parcel with ID ${id} not found`,
    });
  }

  if (parcel.status === 'courier_assigned') {
    parcel.status = 'in_transit';
  } else if (parcel.status === 'in_transit') {
    parcel.status = 'delivered';
  } else {
    parcel.status = 'delivered';
  }

  parcel.updatedAt = new Date().toISOString();
  parcelsStore.set(id, parcel);

  return res.json({
    success: true,
    message: `Parcel status updated to ${parcel.status}`,
    parcel,
  });
});

export default router;
