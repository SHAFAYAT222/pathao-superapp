// Rides API Client Service
import { http } from './apiClient';
import { MOCK_CAPTAINS } from '../data/mockData';

export const ridesService = {
  /**
   * Request a new ride (Bike, Car Lite, Car Plus)
   */
  async requestRide({ pickup, destination, vehicle, fare, paymentMethod = 'Pathao Pay' }) {
    try {
      const data = await http.post('/api/rides/request', {
        pickup,
        destination,
        vehicle,
        fare,
        paymentMethod,
      });
      return data.ride;
    } catch (err) {
      console.warn('[RidesService] API unavailable, using local simulation fallback:', err.message);
      // Fallback local simulation
      return {
        id: `ride_fallback_${Date.now()}`,
        status: 'searching',
        pickup,
        destination,
        vehicle,
        fare: Number(fare) || 120,
        paymentMethod,
        captain: null,
        progress: 0,
        eta: '3 mins',
      };
    }
  },

  /**
   * Poll live status of an ongoing ride
   */
  async getRideStatus(rideId) {
    try {
      const data = await http.get(`/api/rides/${rideId}/status`);
      return data.ride;
    } catch (err) {
      console.warn('[RidesService] Could not fetch status, returning fallback:', err.message);
      return null;
    }
  },

  /**
   * Cancel in-progress ride
   */
  async cancelRide(rideId) {
    try {
      const data = await http.post(`/api/rides/${rideId}/cancel`);
      return data.ride;
    } catch (err) {
      return { id: rideId, status: 'cancelled' };
    }
  },

  /**
   * Complete ride
   */
  async completeRide(rideId) {
    try {
      const data = await http.post(`/api/rides/${rideId}/complete`);
      return data.ride;
    } catch (err) {
      return { id: rideId, status: 'completed', progress: 1 };
    }
  },

  /**
   * Get active ride from backend
   */
  async getActiveRide() {
    try {
      const data = await http.get('/api/rides/active');
      return data.ride;
    } catch (err) {
      return null;
    }
  },
};

export default ridesService;
