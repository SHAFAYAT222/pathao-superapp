import React, { useState, useEffect } from 'react';
import BottomSheet from '../common/BottomSheet';
import { Star, CheckCircle2, Heart, Award, Shield, ArrowRight } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

export default function TripCompletedSheet({
  isOpen,
  onClose,
  rideBooking,
  onFinishRating,
}) {
  const [rating, setRating] = useState(5);
  const [selectedTip, setSelectedTip] = useState(0);
  const [selectedBadges, setSelectedBadges] = useState(['Safe Driver']);

  useEffect(() => {
    if (isOpen) {
      sounds.playSuccess();
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#EE2A24', '#10B981', '#F59E0B', '#2563EB'],
      });
    }
  }, [isOpen]);

  const badges = [
    'Safe Driver 🛡️',
    'Polite Captain 🌟',
    'Clean Helmet 🪖',
    'Traffic Maestro ⚡',
  ];

  const tips = [0, 20, 50, 100];

  const toggleBadge = (b) => {
    sounds.playTap();
    if (selectedBadges.includes(b)) {
      setSelectedBadges(prev => prev.filter(item => item !== b));
    } else {
      setSelectedBadges(prev => [...prev, b]);
    }
  };

  const handleDone = () => {
    sounds.playSuccess();
    onFinishRating && onFinishRating({
      rating,
      tip: selectedTip,
      badges: selectedBadges,
    });
    onClose();
  };

  if (!isOpen) return null;

  const fare = rideBooking?.fare || 140;
  const total = fare + selectedTip;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Trip Completed!"
      subtitle="You have safely reached your destination"
      showClose={false}
    >
      <div className="space-y-4 select-none">
        {/* Success Header Icon */}
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 mx-auto flex items-center justify-center mb-2 shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            ৳{total}
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Paid automatically via Pathao Pay Wallet
          </p>
        </div>

        {/* Fare Breakdown Card */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 text-xs space-y-1.5">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Base Fare & Distance</span>
            <span className="font-semibold text-slate-900 dark:text-white">৳{fare}</span>
          </div>
          {selectedTip > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Captain Tip (100% to Driver)</span>
              <span>+৳{selectedTip}</span>
            </div>
          )}
          <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 flex justify-between font-black text-slate-900 dark:text-white">
            <span>Total Deducted</span>
            <span>৳{total}</span>
          </div>
        </div>

        {/* 5-Star Rating Selector */}
        <div className="text-center space-y-1.5">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Rate your captain ({rideBooking?.captain?.name || 'Md. Rafiqul'})
          </span>
          <div className="flex justify-center gap-2 py-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setRating(star);
                }}
                className="p-1 hover:scale-115 active:scale-95 transition-transform"
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    star <= rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Compliment Badges */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-500 block text-center">
            Leave a Compliment for Captain
          </span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {badges.map((b) => {
              const active = selectedBadges.includes(b);
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleBadge(b)}
                  className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all ${
                    active
                      ? 'bg-pathao-red text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {b}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tip Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-400">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Add a Tip for Captain</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {tips.map((tip) => (
              <button
                key={tip}
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setSelectedTip(tip);
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedTip === tip
                    ? 'bg-emerald-600 text-white shadow-xs scale-102'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {tip === 0 ? 'No Tip' : `৳${tip}`}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleDone}
          className="w-full py-3.5 rounded-2xl bg-pathao-red hover:bg-pathao-redDark text-white font-extrabold text-sm shadow-glow-red flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <span>SUBMIT & RETURN HOME</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </BottomSheet>
  );
}
