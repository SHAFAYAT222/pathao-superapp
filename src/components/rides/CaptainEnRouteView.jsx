import React, { useEffect } from 'react';
import { Phone, MessageSquare, ShieldAlert, Star, Navigation, CheckCircle, ShieldCheck, FastForward } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function CaptainEnRouteView({
  rideBooking,
  driverProgress,
  onOpenChat,
  onOpenCall,
  onOpenSos,
  onAdvanceTrip,
  onCompleteTrip,
}) {
  const captain = rideBooking?.captain;
  const isEnRoute = rideBooking?.status === 'en_route';

  // Format progress percentage
  const progressPercent = Math.min(100, Math.round(driverProgress * 100));
  const remainingMins = Math.max(1, Math.round((1 - driverProgress) * 8));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-t-[32px] shadow-sheet border-t border-slate-100 dark:border-slate-800 p-5 space-y-4 select-none animate-slide-up">
      {/* Top Banner Status */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              {isEnRoute ? `En Route to ${rideBooking?.destination?.name || 'Destination'}` : 'Captain Assigned & Heading to Pickup'}
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {isEnRoute ? `Speed: 34 km/h • Est. ${remainingMins} mins remaining` : 'Arriving at pickup in 2-3 mins'}
          </p>
        </div>

        {/* SOS Button */}
        <button
          type="button"
          onClick={() => {
            sounds.playTap();
            onOpenSos && onOpenSos();
          }}
          className="px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 text-[10px] font-black border border-red-200 dark:border-red-900/50 flex items-center gap-1 active:scale-95"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>SOS</span>
        </button>
      </div>

      {/* Live Route Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
          <span>{rideBooking?.pickup?.name || 'Banani 11'}</span>
          <span>{rideBooking?.destination?.name || 'Drop-off'}</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-pathao-red rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Captain Profile Card */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Driver Avatar */}
          <div className="relative">
            <img
              src={captain?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={captain?.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-pathao-red"
            />
            <div className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-emerald-500 text-white text-[8px] font-bold rounded-full">
              4.9★
            </div>
          </div>

          {/* Captain Info */}
          <div className="text-left">
            <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
              <span>{captain?.name || 'Md. Rafiqul Islam'}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            </h4>
            <div className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 font-mono tracking-wider mt-0.5">
              {captain?.vehiclePlate || 'DHAKA METRO HA-45-8912'}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {captain?.vehicleModel || 'Bajaj Pulsar 150'} • {captain?.totalTrips || 3420}+ trips
            </p>
          </div>
        </div>

        {/* Action Buttons: Chat & Call */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              onOpenChat && onOpenChat();
            }}
            className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:bg-slate-100 active:scale-95 transition-all shadow-xs"
            title="Chat with Captain"
          >
            <MessageSquare className="w-4 h-4 text-pathao-red" />
          </button>
          <a
            href={`tel:${captain?.phone || '+8801819876543'}`}
            onClick={() => sounds.playTap()}
            className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 active:scale-95 transition-all shadow-xs"
            title="Call Captain"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Interactive Testing Accelerators */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={() => {
            sounds.playTap();
            onAdvanceTrip && onAdvanceTrip();
          }}
          className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
        >
          <FastForward className="w-3.5 h-3.5 text-pathao-red" />
          <span>Simulate Movement (+25%)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playTap();
            onCompleteTrip && onCompleteTrip();
          }}
          className="py-2.5 px-3 rounded-xl bg-pathao-red hover:bg-pathao-redDark text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-glow-red active:scale-95 transition-all"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Arrive & Finish Trip</span>
        </button>
      </div>
    </div>
  );
}
