import React, { useState } from 'react';
import { VEHICLE_OPTIONS, PROMO_CODES } from '../../data/mockData';
import { Bike, Car, Shield, Sparkles, Tag, ChevronRight, Zap, Check } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function VehicleSelectorCard({
  selectedVehicleId,
  onSelectVehicle,
  pickup,
  destination,
  surgeMultiplier = 1.0,
  onToggleSurge,
  onBookRide,
  paymentMethod,
  onChangePaymentMethod,
  walletBalance,
}) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  // Calculate distance based on coordinate Euclidean delta
  const dx = (destination?.coords?.x || 440) - (pickup?.coords?.x || 380);
  const dy = (destination?.coords?.y || 240) - (pickup?.coords?.y || 220);
  const estimatedKm = Math.max(1.8, Math.round(Math.sqrt(dx * dx + dy * dy) * 0.04 * 10) / 10);

  const calculateFare = (vehicle) => {
    const raw = vehicle.baseRate + estimatedKm * vehicle.perKm;
    const withSurge = Math.round(raw * surgeMultiplier);
    const discount = appliedPromo ? appliedPromo.discount : 0;
    return Math.max(25, withSurge - discount);
  };

  const handleApplyPromo = () => {
    sounds.playTap();
    const found = PROMO_CODES[promoCode.trim().toUpperCase()];
    if (found) {
      setAppliedPromo(found);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try "BIKERIDE"');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-t-[28px] shadow-sheet border-t border-slate-100 dark:border-slate-800 p-5 space-y-4 select-none animate-slide-up">
      {/* Route & Surge Multiplier HUD */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-900 dark:text-white">
            {estimatedKm} km Route
          </span>
          <span className="text-[11px] text-slate-400">| Est. 14 mins</span>
        </div>

        {/* Surge Pricing Toggle for Demonstration */}
        <button
          type="button"
          onClick={() => {
            sounds.playTap();
            onToggleSurge && onToggleSurge();
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black transition-all ${
            surgeMultiplier > 1.0
              ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 border border-amber-300'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
          }`}
          title="Click to toggle Dhaka Peak Hour Surge Multiplier"
        >
          <Zap className="w-3 h-3 fill-current" />
          <span>{surgeMultiplier > 1.0 ? `${surgeMultiplier}x Dhaka Surge` : 'Standard Fare'}</span>
        </button>
      </div>

      {/* Vehicle Options List */}
      <div className="space-y-2.5">
        {VEHICLE_OPTIONS.map((v) => {
          const isSelected = selectedVehicleId === v.id;
          const fare = calculateFare(v);
          const Icon = v.icon === 'Bike' ? Bike : Car;

          return (
            <div
              key={v.id}
              onClick={() => {
                sounds.playTap();
                onSelectVehicle(v.id);
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'border-pathao-red bg-red-50/60 dark:bg-red-950/20 shadow-xs ring-1 ring-pathao-red scale-101'
                  : 'border-slate-200/80 dark:border-slate-700/60 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${v.bgColor}`}>
                  <Icon className={`w-6 h-6 ${v.color}`} />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {v.name}
                    </span>
                    {v.popular && (
                      <span className="text-[8px] font-black px-1.5 py-0.2 rounded-full bg-red-600 text-white">
                        FASTEST
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {v.minTime} away • {v.capacity}
                  </div>
                  <div className="text-[9px] text-emerald-600 font-semibold mt-0.5">
                    {v.helmetBadge}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <div className="text-base font-black text-slate-900 dark:text-white">
                  ৳{fare}
                </div>
                {surgeMultiplier > 1.0 && (
                  <span className="text-[9px] text-amber-600 font-bold block">
                    Includes {surgeMultiplier}x
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Promo Code Input */}
      <div className="flex items-center gap-2 pt-1">
        <div className="relative flex-1">
          <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Promo Code (e.g. BIKERIDE)"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs uppercase font-bold focus:outline-none focus:ring-1 focus:ring-pathao-red"
          />
        </div>
        <button
          type="button"
          onClick={handleApplyPromo}
          className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold hover:bg-slate-800 active:scale-95"
        >
          Apply
        </button>
      </div>

      {appliedPromo && (
        <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          <span>Promo Applied! Saved ৳{appliedPromo.discount}</span>
        </div>
      )}
      {promoError && (
        <div className="text-[11px] font-semibold text-red-500">
          {promoError}
        </div>
      )}

      {/* Payment Method Switcher */}
      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-pathao-red text-white flex items-center justify-center font-bold text-xs">
            ৳
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {paymentMethod === 'wallet' ? 'Pathao Pay Wallet' : paymentMethod === 'bkash' ? 'bKash Instant' : 'Cash on Delivery'}
            </span>
            <span className="text-[10px] text-slate-400 block">
              Balance: ৳{walletBalance?.toLocaleString()}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            sounds.playTap();
            onChangePaymentMethod && onChangePaymentMethod();
          }}
          className="text-xs font-bold text-pathao-red hover:underline"
        >
          Change
        </button>
      </div>

      {/* Confirm Booking CTA */}
      <button
        type="button"
        onClick={() => {
          sounds.playTap();
          const selectedVehicle = VEHICLE_OPTIONS.find(v => v.id === selectedVehicleId) || VEHICLE_OPTIONS[0];
          onBookRide({
            vehicle: selectedVehicle,
            fare: calculateFare(selectedVehicle),
            pickup,
            destination,
          });
        }}
        className="w-full py-3.5 rounded-2xl bg-pathao-red hover:bg-pathao-redDark text-white font-black text-sm tracking-wide shadow-glow-red flex items-center justify-center gap-2 active:scale-98 transition-all"
      >
        <span>CONFIRM & BOOK {selectedVehicleId === 'bike' ? 'PATHAO BIKE' : 'PATHAO CAR'}</span>
      </button>
    </div>
  );
}
