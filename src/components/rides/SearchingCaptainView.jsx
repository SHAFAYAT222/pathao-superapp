import React, { useEffect } from 'react';
import { Bike, Car, Shield, X, Compass } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function SearchingCaptainView({
  rideBooking,
  onCancel,
  onFoundCaptain,
}) {
  useEffect(() => {
    // Sound radar ping
    sounds.playRadarPing();
    const soundInterval = setInterval(() => {
      sounds.playRadarPing();
    }, 2400);

    // Auto find captain after simulated search time (3.5 seconds)
    const timeout = setTimeout(() => {
      onFoundCaptain();
    }, 3800);

    return () => {
      clearInterval(soundInterval);
      clearTimeout(timeout);
    };
  }, [onFoundCaptain]);

  const isBike = rideBooking?.vehicle?.id === 'bike';
  const Icon = isBike ? Bike : Car;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-t-[32px] shadow-sheet border-t border-slate-100 dark:border-slate-800 p-6 flex flex-col items-center text-center space-y-4 select-none animate-slide-up">
      {/* Radar Scanner Animation Container */}
      <div className="relative w-28 h-28 flex items-center justify-center my-2">
        {/* Pulsing Radar Rings */}
        <div className="absolute inset-0 rounded-full border-2 border-pathao-red opacity-80 animate-radar-1" />
        <div className="absolute inset-0 rounded-full border-2 border-pathao-red opacity-60 animate-radar-2" />
        <div className="absolute inset-0 rounded-full border-2 border-pathao-red opacity-40 animate-radar-3" />

        {/* Central Vehicle Badge */}
        <div className="relative z-10 w-16 h-16 rounded-full bg-pathao-red text-white flex items-center justify-center shadow-glow-red animate-pulse-subtle">
          <Icon className="w-8 h-8" />
        </div>
      </div>

      {/* Status Headlines */}
      <div className="space-y-1">
        <h3 className="text-base font-black text-slate-900 dark:text-white">
          Searching nearby captains...
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
          Scanning verified captains around {rideBooking?.pickup?.name || 'Banani 11'}. Matching highest rated rider.
        </p>
      </div>

      {/* Booking Details Pill */}
      <div className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
        <div className="text-left">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">
            {rideBooking?.vehicle?.name || 'Pathao Bike'}
          </span>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {rideBooking?.destination?.name || 'Destination'}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Fare</span>
          <span className="text-sm font-black text-slate-900 dark:text-white">
            ৳{rideBooking?.fare || '140'}
          </span>
        </div>
      </div>

      {/* Safety Note */}
      <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold">
        <Shield className="w-3.5 h-3.5" />
        <span>100% Insured & Helmet Guaranteed by Pathao</span>
      </div>

      {/* Cancel Search Button */}
      <button
        type="button"
        onClick={() => {
          sounds.playTap();
          onCancel();
        }}
        className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-extrabold flex items-center justify-center gap-2 active:scale-98 transition-all"
      >
        <X className="w-4 h-4" />
        <span>Cancel Search</span>
      </button>
    </div>
  );
}
