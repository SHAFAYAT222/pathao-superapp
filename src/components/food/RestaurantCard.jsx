import React from 'react';
import { Star, Clock, MapPin, Tag } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function RestaurantCard({ restaurant, onClick }) {
  return (
    <div
      onClick={() => {
        sounds.playTap();
        onClick && onClick(restaurant);
      }}
      className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/60 overflow-hidden shadow-xs hover:shadow-card-hover transition-all cursor-pointer group active:scale-99 select-none"
    >
      {/* Cover Banner */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={restaurant.banner}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Promo Discount Tag */}
        {restaurant.discount && (
          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-pathao-red text-white text-[10px] font-black tracking-tight shadow-md flex items-center gap-1">
            <Tag className="w-2.5 h-2.5" />
            <span>{restaurant.discount}</span>
          </div>
        )}

        {/* Delivery Time Badge */}
        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>{restaurant.deliveryTime}</span>
        </div>
      </div>

      {/* Details Body */}
      <div className="p-3.5 space-y-1.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate group-hover:text-pathao-red transition-colors">
            {restaurant.name}
          </h3>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-xs font-black">
            <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
            <span>{restaurant.rating}</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
          {restaurant.cuisine}
        </p>

        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-100 dark:border-slate-700/60">
          <span>{restaurant.branch}</span>
          <span>•</span>
          <span>Delivery ৳{restaurant.deliveryFee}</span>
          <span>•</span>
          <span>{restaurant.distance}</span>
        </div>
      </div>
    </div>
  );
}
