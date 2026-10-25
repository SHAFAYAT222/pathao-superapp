import React, { useState } from 'react';
import { ArrowLeft, Star, Clock, MapPin, Plus, Heart, Share2, ShoppingBag } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function RestaurantDetailModal({
  isOpen,
  onClose,
  restaurant,
  onSelectItem,
  cartCount,
  cartTotal,
  onOpenCheckout,
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLiked, setIsLiked] = useState(false);

  if (!isOpen || !restaurant) return null;

  const categories = ['All', ...new Set(restaurant.menu?.map(m => m.category || 'Specials'))];

  const filteredMenu = activeCategory === 'All'
    ? restaurant.menu
    : restaurant.menu?.filter(m => m.category === activeCategory);

  return (
    <div className="absolute inset-0 z-40 bg-white dark:bg-slate-900 flex flex-col overflow-hidden select-none animate-slide-up">
      {/* Top Banner & Header Bar */}
      <div className="relative h-48 shrink-0">
        <img
          src={restaurant.banner}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />

        {/* Floating Top Nav Buttons */}
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-10">
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setIsLiked(!isLiked);
              }}
              className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 active:scale-95 transition-transform"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                alert('Restaurant share link copied!');
              }}
              className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 active:scale-95 transition-transform"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Restaurant Header Info Overlay */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <h2 className="text-xl font-black drop-shadow-md">{restaurant.name}</h2>
          <p className="text-xs text-white/90 font-medium truncate mt-0.5">
            {restaurant.cuisine}
          </p>
          <div className="flex items-center gap-2 text-[11px] font-semibold mt-1.5">
            <span className="flex items-center gap-1 bg-emerald-500 px-2 py-0.5 rounded-full text-white font-bold">
              <Star className="w-3 h-3 fill-current" />
              <span>{restaurant.rating}</span>
            </span>
            <span className="bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-300" />
              <span>{restaurant.deliveryTime}</span>
            </span>
            <span className="bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full">
              ৳{restaurant.deliveryFee} delivery
            </span>
          </div>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              sounds.playTap();
              setActiveCategory(cat);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-pathao-red text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Items Scrollable Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {filteredMenu?.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              sounds.playTap();
              onSelectItem(item, restaurant);
            }}
            className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3 shadow-xs hover:border-pathao-red/50 cursor-pointer transition-all group active:scale-99"
          >
            {/* Left text */}
            <div className="flex-1 min-w-0 pr-1 text-left">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-pathao-red transition-colors">
                  {item.name}
                </h4>
                {item.popular && (
                  <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-amber-500 text-white">
                    MUST TRY
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-snug">
                {item.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  ৳{item.price}
                </span>
                {item.originalPrice && (
                  <span className="text-xs line-through text-slate-400">
                    ৳{item.originalPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Right thumbnail & add button */}
            <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playTap();
                  onSelectItem(item, restaurant);
                }}
                className="absolute bottom-1.5 right-1.5 px-2.5 py-1 rounded-lg bg-pathao-red text-white text-[10px] font-black shadow-md flex items-center gap-1 active:scale-95"
              >
                <Plus className="w-3 h-3 stroke-[3]" />
                <span>ADD</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating View Cart Footer (if items present) */}
      {cartCount > 0 && (
        <div className="absolute bottom-4 left-4 right-4 z-20 animate-slide-up">
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              onOpenCheckout && onOpenCheckout();
            }}
            className="w-full p-4 rounded-2xl bg-pathao-red hover:bg-pathao-redDark text-white font-black text-xs shadow-glow-red flex items-center justify-between active:scale-98 transition-all"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">
                {cartCount}
              </div>
              <span>VIEW BASKET</span>
            </div>
            <span>৳{cartTotal} • CHECKOUT</span>
          </button>
        </div>
      )}
    </div>
  );
}
