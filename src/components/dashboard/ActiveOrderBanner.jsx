import React from 'react';
import { Bike, UtensilsCrossed, Package, ChevronUp, Clock, AlertCircle } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function ActiveOrderBanner({
  activeRide,
  activeFoodOrder,
  activeParcel,
  onExpand,
}) {
  const hasRide = activeRide && activeRide.status !== 'idle' && activeRide.status !== 'completed';
  const hasFood = activeFoodOrder && activeFoodOrder.status !== 'idle' && activeFoodOrder.status !== 'delivered';
  const hasParcel = activeParcel && activeParcel.status !== 'idle' && activeParcel.status !== 'delivered';

  if (!hasRide && !hasFood && !hasParcel) return null;

  let title = '';
  let subtitle = '';
  let icon = Bike;
  let bgGradient = 'from-red-600 to-rose-700';

  if (hasRide) {
    icon = Bike;
    bgGradient = 'from-red-600 to-rose-700';
    if (activeRide.status === 'searching') {
      title = 'Searching nearby captains...';
      subtitle = 'Finding best match on Banani 11';
    } else if (activeRide.status === 'captain_found') {
      title = `Captain ${activeRide.captain?.name?.split(' ')[0]} accepted!`;
      subtitle = `${activeRide.captain?.vehiclePlate} • Arriving in 3 mins`;
    } else if (activeRide.status === 'en_route') {
      title = `En Route to ${activeRide.destination?.name || 'Destination'}`;
      subtitle = `Speed 32 km/h • Captain ${activeRide.captain?.name?.split(' ')[0]}`;
    }
  } else if (hasFood) {
    icon = UtensilsCrossed;
    bgGradient = 'from-amber-600 to-orange-600';
    title = `${activeFoodOrder.restaurant?.name || 'Food Order'}: ${activeFoodOrder.status}`;
    subtitle = 'Rider delivering authentic feast to your doorstep';
  } else if (hasParcel) {
    icon = Package;
    bgGradient = 'from-emerald-600 to-teal-700';
    title = `Parcel Delivery: ${activeParcel.status}`;
    subtitle = `OTP: ${activeParcel.pickupOtp} • Courier assigned`;
  }

  const Icon = icon;

  return (
    <div className="px-4 pb-2 select-none animate-slide-up">
      <div
        onClick={() => {
          sounds.playTap();
          onExpand && onExpand();
        }}
        className={`w-full p-3 rounded-2xl bg-gradient-to-r ${bgGradient} text-white shadow-float flex items-center justify-between cursor-pointer active:scale-98 transition-all`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className="min-w-0 text-left">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h4 className="text-xs font-black tracking-tight truncate">{title}</h4>
            </div>
            <p className="text-[10px] text-white/90 truncate mt-0.5">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 text-[10px] font-bold shrink-0">
          <span>Track</span>
          <ChevronUp className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
