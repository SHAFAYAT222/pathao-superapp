import React from 'react';
import { RECENT_TRIPS } from '../../data/mockData';
import { Bike, Car, UtensilsCrossed, ArrowRight, RotateCcw } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function RecentTrips({ onRebook }) {
  const getIcon = (type) => {
    switch (type) {
      case 'bike': return Bike;
      case 'car': return Car;
      default: return UtensilsCrossed;
    }
  };

  return (
    <div className="px-5 py-2 select-none">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Recent Activity
        </h3>
        <span className="text-[11px] font-semibold text-pathao-red cursor-pointer hover:underline">
          View All Receipts
        </span>
      </div>

      <div className="space-y-2">
        {RECENT_TRIPS.map((trip) => {
          const Icon = getIcon(trip.type);
          return (
            <div
              key={trip.id}
              onClick={() => {
                sounds.playTap();
                onRebook && onRebook(trip);
              }}
              className="p-3 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer group shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 group-hover:bg-red-50 group-hover:text-pathao-red transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {trip.restaurant ? trip.restaurant : `${trip.from} → ${trip.to}`}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium truncate">
                    {trip.date} • {trip.items || (trip.captain ? `Captain ${trip.captain}` : '')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  ৳{trip.fare}
                </span>
                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-pathao-red group-hover:text-white transition-colors">
                  <RotateCcw className="w-3 h-3" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
