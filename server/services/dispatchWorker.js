// Background driver dispatch worker service for Pathao Rides
import { MOCK_CAPTAINS } from '../data/initialData.js';

// In-memory active rides store
export const ridesStore = new Map();
const activeTimers = new Map();

/**
 * Creates and registers a new ride request
 */
export function createRideRecord({ pickup, destination, vehicle, fare, paymentMethod }) {
  const rideId = `ride_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const ride = {
    id: rideId,
    status: 'searching', // 'searching' | 'accepted' | 'en_route' | 'completed' | 'cancelled'
    pickup,
    destination,
    vehicle,
    fare: Number(fare) || 120,
    paymentMethod: paymentMethod || 'Pathao Pay',
    captain: null,
    progress: 0,
    eta: '3 mins',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  ridesStore.set(rideId, ride);
  startDispatchWorker(rideId, vehicle?.id);
  return ride;
}

/**
 * Asynchronous Driver Dispatch Worker
 * Simulates real-time captain discovery and GPS tracking updates
 */
export function startDispatchWorker(rideId, vehicleId = 'bike') {
  // Clear any existing timer for this ride
  if (activeTimers.has(rideId)) {
    clearInterval(activeTimers.get(rideId));
    activeTimers.delete(rideId);
  }

  // Phase 1: Search & Match Captain after ~2 seconds
  const matchTimer = setTimeout(() => {
    const ride = ridesStore.get(rideId);
    if (!ride || ride.status === 'cancelled') return;

    // Pick appropriate captain for the vehicle type
    let matchedCaptain;
    if (vehicleId === 'car_lite' || vehicleId === 'car_plus') {
      matchedCaptain = MOCK_CAPTAINS.find(c => c.captainType === 'car_lite') || MOCK_CAPTAINS[1];
    } else {
      matchedCaptain = MOCK_CAPTAINS.find(c => c.captainType === 'bike') || MOCK_CAPTAINS[0];
    }

    ride.status = 'accepted'; // or 'captain_found'
    ride.captain = matchedCaptain;
    ride.updatedAt = new Date().toISOString();
    ridesStore.set(rideId, ride);

    // Phase 2: Captain en route to pickup after 2.5 seconds
    const enRouteTimer = setTimeout(() => {
      const activeRide = ridesStore.get(rideId);
      if (!activeRide || activeRide.status === 'cancelled') return;

      activeRide.status = 'en_route';
      activeRide.progress = 0.1;
      activeRide.updatedAt = new Date().toISOString();
      ridesStore.set(rideId, activeRide);

      // Phase 3: Driver movement simulation (progress updates)
      const progressInterval = setInterval(() => {
        const liveRide = ridesStore.get(rideId);
        if (!liveRide || liveRide.status !== 'en_route') {
          clearInterval(progressInterval);
          activeTimers.delete(rideId);
          return;
        }

        liveRide.progress = Math.min(1.0, +(liveRide.progress + 0.1).toFixed(2));
        liveRide.updatedAt = new Date().toISOString();

        if (liveRide.progress >= 1.0) {
          liveRide.status = 'completed';
          clearInterval(progressInterval);
          activeTimers.delete(rideId);
        }

        ridesStore.set(rideId, liveRide);
      }, 3000);

      activeTimers.set(rideId, progressInterval);
      progressInterval.unref();
    }, 2500);

    activeTimers.set(`${rideId}_enRoute`, enRouteTimer);
    enRouteTimer.unref();
  }, 2200);

  activeTimers.set(`${rideId}_match`, matchTimer);
  matchTimer.unref();
}

/**
 * Get ride status by ID
 */
export function getRideById(rideId) {
  return ridesStore.get(rideId) || null;
}

/**
 * Cancel ride
 */
export function cancelRide(rideId) {
  const ride = ridesStore.get(rideId);
  if (!ride) return null;

  ride.status = 'cancelled';
  ride.updatedAt = new Date().toISOString();
  ridesStore.set(rideId, ride);

  // Clear timers
  if (activeTimers.has(rideId)) {
    clearInterval(activeTimers.get(rideId));
    activeTimers.delete(rideId);
  }

  return ride;
}

/**
 * Manually complete ride
 */
export function completeRide(rideId) {
  const ride = ridesStore.get(rideId);
  if (!ride) return null;

  ride.status = 'completed';
  ride.progress = 1.0;
  ride.updatedAt = new Date().toISOString();
  ridesStore.set(rideId, ride);

  if (activeTimers.has(rideId)) {
    clearInterval(activeTimers.get(rideId));
    activeTimers.delete(rideId);
  }

  return ride;
}
