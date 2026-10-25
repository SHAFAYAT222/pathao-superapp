import { Router } from 'express';
import { INITIAL_WALLET, INITIAL_TRANSACTIONS } from '../data/initialData.js';

const router = Router();

// In-memory wallet state
let walletData = { ...INITIAL_WALLET };
let transactionsList = [...INITIAL_TRANSACTIONS];

/**
 * GET /api/wallet/balance
 * Returns current Pathao Pay wallet balance and account status
 */
router.get('/balance', (_req, res) => {
  return res.json({
    success: true,
    balance: walletData.balance,
    currency: walletData.currency,
    symbol: walletData.symbol,
    points: walletData.points,
    user: walletData.user,
    lastUpdated: new Date().toISOString(),
  });
});

/**
 * POST /api/wallet/topup
 * Recharges wallet via bKash, Nagad, or credit card
 */
router.post('/topup', (req, res) => {
  try {
    const { amount, method = 'bKash MFS' } = req.body;
    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Top-up amount must be a valid positive number',
      });
    }

    // Update balance
    walletData.balance += numericAmount;

    // Record transaction
    const newTransaction = {
      id: `tx-${Date.now()}`,
      title: `${method.includes('bKash') ? 'bKash' : method} Wallet Recharge`,
      type: 'credit',
      amount: numericAmount,
      date: 'Just now',
      method,
      status: 'success',
      createdAt: new Date().toISOString(),
    };

    transactionsList.unshift(newTransaction);

    return res.json({
      success: true,
      message: `Successfully added ৳${numericAmount} to your Pathao Pay wallet`,
      balance: walletData.balance,
      transaction: newTransaction,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Error processing wallet top-up',
    });
  }
});

/**
 * POST /api/wallet/deduct
 * Deducts amount from wallet for rides, food, or parcel payments
 */
router.post('/deduct', (req, res) => {
  try {
    const { amount, purpose = 'Pathao Service Payment' } = req.body;
    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Deduction amount must be a positive number',
      });
    }

    if (walletData.balance < numericAmount) {
      return res.status(402).json({
        success: false,
        error: 'Insufficient Pathao Pay wallet balance. Please top up.',
        currentBalance: walletData.balance,
        requiredAmount: numericAmount,
      });
    }

    walletData.balance -= numericAmount;

    const newTransaction = {
      id: `tx-${Date.now()}`,
      title: purpose,
      type: 'debit',
      amount: numericAmount,
      date: 'Just now',
      method: 'Pathao Pay',
      status: 'success',
      createdAt: new Date().toISOString(),
    };

    transactionsList.unshift(newTransaction);

    return res.json({
      success: true,
      message: `৳${numericAmount} deducted for ${purpose}`,
      balance: walletData.balance,
      transaction: newTransaction,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Error executing wallet deduction',
    });
  }
});

/**
 * GET /api/wallet/transactions
 * Returns list of wallet transactions
 */
router.get('/transactions', (_req, res) => {
  return res.json({
    success: true,
    count: transactionsList.length,
    transactions: transactionsList,
  });
});

export default router;
