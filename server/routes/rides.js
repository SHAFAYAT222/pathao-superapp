import { Router } from 'express';
import {
  createRideRecord,
  getRideById,
  cancelRide,
  completeRide,
  ridesStore
} from '../services/dispatchWorker.js';

const router = Router();

/**
 * POST /api/rides/request
 * Stores ride request and starts asynchronous driver dispatch worker
 */
router.post('/request', (req, res) => {
  try {
    const { pickup, destination, vehicle, fare, paymentMethod } = req.body;

    if (!pickup || !destination) {
      return res.status(400).json({
        success: false,
        error: 'Pickup and destination locations are required',
      });
    }

    const newRide = createRideRecord({
      pickup,
      destination,
      vehicle: vehicle || { id: 'bike', name: 'Pathao Bike', fare: 120 },
      fare: fare || 120,
      paymentMethod: paymentMethod || 'Pathao Pay',
    });

    return res.status(201).json({
      success: true,
      message: 'Ride request accepted. Searching nearby captains in Dhaka...',
      ride: newRide,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error processing ride request',
    });
  }
});

/**
 * GET /api/rides/:id/status
 * Live status tracking: searching -> accepted -> en_route -> completed
 */
router.get('/:id/status', (req, res) => {
  const { id } = req.params;
  const ride = getRideById(id);

  if (!ride) {
    return res.status(404).json({
      success: false,
      error: `Ride with ID ${id} not found`,
    });
  }

  return res.json({
    success: true,
    ride,
  });
});

/**
 * POST /api/rides/:id/cancel
 * Cancels an in-progress ride
 */
router.post('/:id/cancel', (req, res) => {
  const { id } = req.params;
  const ride = cancelRide(id);

  if (!ride) {
    return res.status(404).json({
      success: false,
      error: `Ride with ID ${id} not found`,
    });
  }

  return res.json({
    success: true,
    message: 'Ride successfully cancelled',
    ride,
  });
});

/**
 * POST /api/rides/:id/complete
 * Mark ride as completed (for demo or captain arrival)
 */
router.post('/:id/complete', (req, res) => {
  const { id } = req.params;
  const ride = completeRide(id);

  if (!ride) {
    return res.status(404).json({
      success: false,
      error: `Ride with ID ${id} not found`,
    });
  }

  return res.json({
    success: true,
    message: 'Ride completed successfully',
    ride,
  });
});

/**
 * GET /api/rides/active
 * Returns the latest active ride (if any)
 */
router.get('/active', (req, res) => {
  const allRides = Array.from(ridesStore.values());
  const activeRide = allRides.reverse().find(
    (r) => r.status === 'searching' || r.status === 'accepted' || r.status === 'en_route'
  );

  return res.json({
    success: true,
    ride: activeRide || null,
  });
});

export default router;
