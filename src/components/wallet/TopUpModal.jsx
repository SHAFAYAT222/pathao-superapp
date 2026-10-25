import React, { useState } from 'react';
import BottomSheet from '../common/BottomSheet';
import { Wallet, CreditCard, Check, ArrowRight } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function TopUpModal({
  isOpen,
  onClose,
  currentBalance,
  onInitiatePayment,
}) {
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [method, setMethod] = useState('bkash');

  const presets = [200, 500, 1000, 2000];

  const effectiveAmount = customAmount ? parseInt(customAmount, 10) || 0 : selectedAmount;

  const handleProceed = () => {
    sounds.playTap();
    onInitiatePayment({
      amount: effectiveAmount,
      method,
    });
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Add Money to Pathao Pay"
      subtitle={`Current Balance: ৳${currentBalance.toLocaleString()}`}
    >
      <div className="space-y-4">
        {/* Preset Amounts */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
            Select Amount (BDT)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {presets.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setSelectedAmount(amt);
                  setCustomAmount('');
                }}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedAmount === amt && !customAmount
                    ? 'bg-pathao-red text-white shadow-glow-red scale-102'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                ৳{amt}
              </button>
            ))}
          </div>

          <div className="mt-3 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
              ৳
            </span>
            <input
              type="number"
              placeholder="Or enter custom amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pathao-red"
            />
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
            Select Payment Method
          </label>
          <div className="space-y-2">
            {/* bKash */}
            <div
              onClick={() => {
                sounds.playTap();
                setMethod('bkash');
              }}
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                method === 'bkash'
                  ? 'border-bkash-pink bg-pink-50/50 dark:bg-pink-950/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-bkash-pink text-white flex items-center justify-center font-black text-sm">
                  ৳
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>bKash Instant Pay</span>
                    <span className="text-[9px] bg-pink-100 text-bkash-pink font-bold px-1.5 py-0.2 rounded">
                      RECOMMENDED
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Fast 1-tap PIN authorization</p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  method === 'bkash' ? 'bg-bkash-pink border-bkash-pink text-white' : 'border-slate-300'
                }`}
              >
                {method === 'bkash' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>

            {/* Credit / Debit Card */}
            <div
              onClick={() => {
                sounds.playTap();
                setMethod('card');
              }}
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                method === 'card'
                  ? 'border-pathao-red bg-red-50/50 dark:bg-red-950/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Visa / Mastercard / Amex
                  </div>
                  <p className="text-[11px] text-slate-500">City Bank / Brac Bank / Standard Chartered</p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  method === 'card' ? 'bg-pathao-red border-pathao-red text-white' : 'border-slate-300'
                }`}
              >
                {method === 'card' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          </div>
        </div>

        {/* Add Money Button */}
        <button
          type="button"
          onClick={handleProceed}
          disabled={effectiveAmount <= 0}
          className="w-full py-3.5 rounded-2xl bg-pathao-red hover:bg-pathao-redDark disabled:opacity-50 text-white font-extrabold text-sm shadow-glow-red flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <span>PROCEED TO RECHARGE ৳{effectiveAmount}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </BottomSheet>
  );
}
