import React, { useState } from 'react';
import { Bike, UtensilsCrossed, Package, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

export default function DynamicIsland({
  activeRide,
  activeFoodOrder,
  activeParcel,
  onExpandRide,
  onExpandFood,
  onExpandParcel,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine if there is any active live activity
  const hasRideActivity = activeRide && activeRide.status !== 'idle' && activeRide.status !== 'completed';
  const hasFoodActivity = activeFoodOrder && activeFoodOrder.status !== 'idle' && activeFoodOrder.status !== 'delivered';
  const hasParcelActivity = activeParcel && activeParcel.status !== 'idle' && activeParcel.status !== 'delivered';

  const hasActivity = hasRideActivity || hasFoodActivity || hasParcelActivity;

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out select-none">
      {!hasActivity ? (
        // Standard Idle Dynamic Island Pill
        <div className="w-28 h-6 bg-black rounded-full flex items-center justify-between px-2.5 shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
        </div>
      ) : (
        // Live Activity Dynamic Island
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className={`cursor-pointer bg-black text-white rounded-[24px] shadow-2xl transition-all duration-300 ease-out flex flex-col overflow-hidden border border-white/10 ${
            isExpanded ? 'w-72 p-3.5' : 'w-48 h-8 px-3 py-1 flex-row items-center justify-between'
          }`}
        >
          {/* Collapsed Pill View */}
          {!isExpanded ? (
            <div className="flex items-center justify-between w-full text-xs">
              <div className="flex items-center gap-1.5 font-medium">
                {hasRideActivity && (
                  <>
                    <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center">
                      <Bike className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-[11px] font-semibold text-red-400">
                      {activeRide.status === 'searching' ? 'Searching...' : `${activeRide.captain ? activeRide.captain.name.split(' ')[0] : 'Captain'} 3m`}
                    </span>
                  </>
                )}
                {hasFoodActivity && !hasRideActivity && (
                  <>
                    <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                      <UtensilsCrossed className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-[11px] font-semibold text-amber-300">Food En Route</span>
                  </>
                )}
                {hasParcelActivity && !hasRideActivity && !hasFoodActivity && (
                  <>
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Package className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-300">Parcel Moving</span>
                  </>
                )}
              </div>

              {/* Pulsing visualizer / soundwave */}
              <div className="flex items-center gap-0.5">
                <span className="w-1 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="w-1 h-2 bg-red-400 rounded-full animate-pulse delay-75" />
                <span className="w-1 h-3.5 bg-red-500 rounded-full animate-pulse delay-150" />
              </div>
            </div>
          ) : (
            // Expanded Dynamic Island Card
            <div className="space-y-2.5 animate-slide-up">
              {hasRideActivity && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                    onExpandRide && onExpandRide();
                  }}
                  className="group hover:bg-white/10 p-2 rounded-xl transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shadow-glow-red">
                        <Bike className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          <span>Pathao Ride</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 uppercase font-mono">
                            {activeRide.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300">
                          {activeRide.status === 'searching'
                            ? 'Scanning Dhaka roads...'
                            : `${activeRide.captain?.vehiclePlate || 'En route'}`}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              )}

              {hasFoodActivity && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                    onExpandFood && onExpandFood();
                  }}
                  className="group hover:bg-white/10 p-2 rounded-xl transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                        <UtensilsCrossed className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          {activeFoodOrder.restaurant?.name || 'Dhaka Food'}
                        </div>
                        <p className="text-[11px] text-amber-300 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Status: {activeFoodOrder.status}</span>
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              )}

              <div className="text-[10px] text-center text-slate-400 pt-1 border-t border-white/10">
                Tap card to view on live map
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
