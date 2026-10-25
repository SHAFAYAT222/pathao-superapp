// Wallet & Pathao Pay API Client Service
import { http } from './apiClient';

export const walletService = {
  /**
   * Fetch live wallet balance and user status
   */
  async getBalance() {
    try {
      const data = await http.get('/api/wallet/balance');
      return data;
    } catch (err) {
      console.warn('[WalletService] API error, using local fallback:', err.message);
      return {
        balance: 1450,
        currency: 'BDT',
        symbol: '৳',
        points: 850,
        user: {
          name: 'Tanvir Hasan',
          phone: '+880 1712-345678',
          badge: 'Platinum Club',
          rating: 4.95,
        },
      };
    }
  },

  /**
   * Top up wallet balance via bKash or Cards
   */
  async topUp({ amount, method = 'bKash MFS' }) {
    try {
      const data = await http.post('/api/wallet/topup', { amount, method });
      return data;
    } catch (err) {
      console.warn('[WalletService] Topup API error, fallback:', err.message);
      return {
        success: true,
        balance: 1450 + Number(amount),
        transaction: {
          id: `tx-${Date.now()}`,
          title: `${method} Wallet Recharge`,
          type: 'credit',
          amount: Number(amount),
          date: 'Just now',
          method,
        },
      };
    }
  },

  /**
   * Deduct balance for rides, orders, or parcels
   */
  async deduct({ amount, purpose }) {
    try {
      const data = await http.post('/api/wallet/deduct', { amount, purpose });
      return data;
    } catch (err) {
      console.warn('[WalletService] Deduct API error:', err.message);
      return {
        success: true,
        transaction: {
          id: `tx-${Date.now()}`,
          title: purpose,
          type: 'debit',
          amount: Number(amount),
          date: 'Just now',
          method: 'Pathao Pay',
        },
      };
    }
  },

  /**
   * Fetch transaction history
   */
  async getTransactions() {
    try {
      const data = await http.get('/api/wallet/transactions');
      return data.transactions;
    } catch (_err) {
      return [
        { id: 'tx-1', title: "Sultan's Dine Food Feast", type: 'debit', amount: 560, date: 'Today, 1:15 PM', method: 'Pathao Pay' },
        { id: 'tx-2', title: 'bKash Wallet Recharge', type: 'credit', amount: 1000, date: 'Yesterday, 8:30 PM', method: 'bKash MFS' },
        { id: 'tx-3', title: 'Pathao Bike (Banani to Gulshan 2)', type: 'debit', amount: 135, date: '24 Oct, 6:40 PM', method: 'Pathao Pay' },
        { id: 'tx-4', title: 'Cashback Bonus (Kacchi Promo)', type: 'credit', amount: 50, date: '22 Oct, 2:10 PM', method: 'Promo Credit' },
      ];
    }
  },
};

export default walletService;
