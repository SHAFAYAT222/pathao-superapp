import React from 'react';
import { Home, Bike, UtensilsCrossed, Package, Wallet, User } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function BottomNav({
  activeTab,
  setActiveTab,
  cartCount = 0,
  hasActiveRide = false,
  isDark = false,
}) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'rides', label: 'Rides', icon: Bike, badge: hasActiveRide ? 'LIVE' : null },
    { id: 'food', label: 'Food', icon: UtensilsCrossed, count: cartCount },
    { id: 'parcel', label: 'Parcel', icon: Package },
    { id: 'wallet', label: 'Pay', icon: Wallet },
  ];

  return (
    <nav className="relative z-30 select-none bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-3 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                sounds.playTap();
                setActiveTab(tab.id);
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-pathao-red font-bold scale-105'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {/* Active Ride Badge */}
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-3 px-1 py-0.2 bg-red-600 text-white text-[8px] font-extrabold rounded-full animate-pulse shadow-sm">
                    {tab.badge}
                  </span>
                )}
                {/* Cart Items Count Badge */}
                {tab.count > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-pathao-red text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {tab.count}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-pathao-red mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
