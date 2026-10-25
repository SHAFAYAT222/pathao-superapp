import React, { useState, useEffect } from 'react';
import InteractiveDhakaMap from '../map/InteractiveDhakaMap';
import { ChefHat, Bike, CheckCircle2, Phone, MessageSquare, ArrowLeft, Clock, ShieldCheck, FastForward } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

export default function FoodDeliveryTracker({
  activeFoodOrder,
  onBack,
  onCompleteDelivery,
  isDark = false,
}) {
  const [stepIndex, setStepIndex] = useState(1); // 0: Confirmed, 1: Kitchen Preparing, 2: Picked Up, 3: Arriving
  const [driverProgress, setDriverProgress] = useState(0.2);

  const steps = [
    { title: 'Order Confirmed', time: '12:40 PM', desc: 'Restaurant accepted order' },
    { title: 'Kitchen Preparing', time: '12:45 PM', desc: 'Chef cooking fresh dum biryani' },
    { title: 'Rider Picked Up', time: '12:55 PM', desc: 'Packed in thermal insulated bag' },
    { title: 'Arriving at Doorstep', time: '1:05 PM', desc: 'Rider near Banani Rd 11 gate' },
  ];

  // Auto advance delivery simulation every 5s if active
  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < 3) {
          sounds.playTap();
          setDriverProgress(p => p + 0.25);
          return prev + 1;
        }
        return prev;
      });
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleManualAdvance = () => {
    sounds.playTap();
    if (stepIndex < 3) {
      setStepIndex(s => s + 1);
      setDriverProgress(p => Math.min(1, p + 0.3));
    } else {
      sounds.playSuccess();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });
      onCompleteDelivery();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 select-none overflow-hidden relative">
      {/* Top Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between z-20">
        <button
          type="button"
          onClick={() => {
            sounds.playTap();
            onBack && onBack();
          }}
          className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h3 className="text-xs font-black text-slate-900 dark:text-white">
            {activeFoodOrder?.restaurant?.name || "Sultan's Dine"}
          </h3>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Estimated Delivery: 18-22 mins</span>
          </span>
        </div>
        <div className="w-9" />
      </div>

      {/* Map Segment with Live Courier Movement */}
      <div className="h-48 relative border-b border-slate-200 dark:border-slate-800 shrink-0">
        <InteractiveDhakaMap
          mode="en_route"
          vehicleType="bike"
          driverProgress={driverProgress}
          theme={isDark ? 'dark' : 'light'}
        />
      </div>

      {/* Stepper Progress Section */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Stepper Indicator */}
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-xs space-y-4">
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            Live Order Status
          </h4>

          <div className="space-y-3">
            {steps.map((st, idx) => {
              const isPast = idx < stepIndex;
              const isCurrent = idx === stepIndex;

              return (
                <div key={idx} className="flex items-start gap-3 relative">
                  {/* Connecting Line */}
                  {idx < steps.length - 1 && (
                    <div
                      className={`absolute left-3.5 top-7 w-0.5 h-7 -translate-x-1/2 ${
                        isPast ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    />
                  )}

                  {/* Icon Node */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 transition-colors ${
                      isPast
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-pathao-red text-white ring-4 ring-red-100 dark:ring-red-950/50'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-black ${
                          isCurrent
                            ? 'text-pathao-red'
                            : isPast
                            ? 'text-slate-900 dark:text-white'
                            : 'text-slate-400'
                        }`}
                      >
                        {st.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{st.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Rider Card */}
        <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center text-amber-500 font-bold">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
                <span>Rony Mia</span>
                <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-1 rounded">
                  FOOD HERO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Pathao Insulated Bag • 4.9★ (1,840 deliveries)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:+8801700123456"
              onClick={() => sounds.playTap()}
              className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center active:scale-95 shadow-xs"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Demo Fast Forward Stepper */}
        <button
          type="button"
          onClick={handleManualAdvance}
          className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <FastForward className="w-4 h-4 text-pathao-red" />
          <span>
            {stepIndex < 3 ? `Simulate Next Step (${steps[stepIndex + 1]?.title})` : 'Order Handed Over (Complete)'}
          </span>
        </button>
      </div>
    </div>
  );
}
