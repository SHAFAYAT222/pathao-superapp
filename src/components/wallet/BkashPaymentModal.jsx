import React, { useState } from 'react';
import { X, ShieldCheck, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

export default function BkashPaymentModal({
  isOpen,
  onClose,
  amount,
  purpose = 'Pathao Ride / Food Checkout',
  onSuccess,
}) {
  const [step, setStep] = useState('pin'); // 'pin' | 'processing' | 'success'
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleKeyPress = (num) => {
    sounds.playTap();
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError('');
    }
  };

  const handleDelete = () => {
    sounds.playTap();
    setPin(prev => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    if (pin.length !== 4) {
      setError('Please enter your 4-digit bKash PIN');
      return;
    }
    sounds.playTap();
    setStep('processing');

    setTimeout(() => {
      setStep('success');
      sounds.playCash();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#E2136E', '#EE2A24', '#10B981', '#F59E0B'],
      });

      setTimeout(() => {
        onSuccess && onSuccess(amount);
        onClose();
        setStep('pin');
        setPin('');
      }, 1400);
    }, 1500);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end overflow-hidden select-none">
      {/* Dimmed backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-xs" />

      {/* bKash branded modal card */}
      <div className="relative z-10 w-full bg-white dark:bg-slate-900 rounded-t-[32px] overflow-hidden shadow-2xl border-t-4 border-bkash-pink animate-slide-up flex flex-col">
        {/* bKash Header */}
        <div className="bg-bkash-pink text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-lg">
              ৳
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-wide uppercase flex items-center gap-1.5">
                <span>bKash Payment</span>
                <span className="text-[10px] bg-white text-bkash-pink font-black px-1.5 py-0.2 rounded">
                  OFFICIAL
                </span>
              </div>
              <p className="text-[11px] text-pink-100">Merchant: Pathao Limited (Dhaka)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-4">
          {step === 'pin' && (
            <>
              {/* Payment Amount Display */}
              <div className="text-center py-2 bg-pink-50 dark:bg-pink-950/30 rounded-2xl border border-pink-100 dark:border-pink-900/40">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{purpose}</span>
                <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                  ৳{amount?.toLocaleString() || '0'}
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>256-Bit SSL Encrypted & Verified</span>
                </div>
              </div>

              {/* PIN Dots */}
              <div className="text-center space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-bkash-pink" />
                  <span>Enter 4-Digit bKash PIN (Demo: Any 4 digits)</span>
                </label>
                <div className="flex justify-center gap-3 py-1">
                  {[0, 1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className={`w-4 h-4 rounded-full border-2 transition-all ${
                        pin.length > idx
                          ? 'bg-bkash-pink border-bkash-pink scale-110'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    />
                  ))}
                </div>
                {error && (
                  <p className="text-xs text-red-500 font-semibold flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{error}</span>
                  </p>
                )}
              </div>

              {/* Custom Numeric Keypad */}
              <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto pt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleKeyPress(num.toString())}
                    className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-lg hover:bg-pink-50 dark:hover:bg-pink-900/20 active:scale-95 transition-all shadow-xs"
                  >
                    {num}
                  </button>
                ))}
                <div className="h-12 flex items-center justify-center text-xs text-slate-400 font-mono">
                  bKash
                </div>
                <button
                  type="button"
                  onClick={() => handleKeyPress('0')}
                  className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-lg hover:bg-pink-50 active:scale-95 transition-all"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold hover:bg-red-50 active:scale-95 transition-all flex items-center justify-center text-xs"
                >
                  DEL
                </button>
              </div>

              {/* Confirm Button */}
              <button
                type="button"
                onClick={handleConfirm}
                disabled={pin.length !== 4}
                className="w-full py-3.5 rounded-2xl bg-bkash-pink hover:bg-pink-700 disabled:opacity-50 text-white font-extrabold text-sm tracking-wide shadow-glow-bkash active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span>CONFIRM ৳{amount} PAYMENT</span>
              </button>
            </>
          )}

          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-full border-4 border-bkash-pink border-t-transparent animate-spin" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Contacting bKash Payment Gateway...
              </p>
              <p className="text-xs text-slate-400">Verifying session with Bangladesh Bank MFS</p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-10 flex flex-col items-center justify-center space-y-3 animate-slide-up">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                Payment Successful!
              </h4>
              <p className="text-xs text-slate-500">
                Transaction ID: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">BKSH99824X</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
