import React from 'react';
import { Bike, Car, UtensilsCrossed, Package, Wallet, Pill, Zap } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function ServiceGrid({ onSelectService }) {
  const services = [
    {
      id: 'bike',
      title: 'Bike Ride',
      subtitle: 'Fastest in Jam',
      badge: 'POPULAR',
      badgeColor: 'bg-red-500 text-white',
      icon: Bike,
      iconColor: 'text-pathao-red',
      bgColor: 'bg-red-50/80 dark:bg-red-950/30',
      borderColor: 'border-red-100 dark:border-red-900/30',
      action: () => onSelectService('rides', 'bike'),
    },
    {
      id: 'car',
      title: 'Pathao Car',
      subtitle: 'Chilled AC Travel',
      badge: 'COMFORT',
      badgeColor: 'bg-blue-600 text-white',
      icon: Car,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50/80 dark:bg-blue-950/30',
      borderColor: 'border-blue-100 dark:border-blue-900/30',
      action: () => onSelectService('rides', 'car_lite'),
    },
    {
      id: 'food',
      title: 'Food Delivery',
      subtitle: 'Kacchi, Burgers',
      badge: '50% OFF',
      badgeColor: 'bg-amber-500 text-white',
      icon: UtensilsCrossed,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50/80 dark:bg-amber-950/30',
      borderColor: 'border-amber-100 dark:border-amber-900/30',
      action: () => onSelectService('food'),
    },
    {
      id: 'parcel',
      title: 'Parcel Courier',
      subtitle: 'Instant Delivery',
      badge: 'SAME-DAY',
      badgeColor: 'bg-emerald-600 text-white',
      icon: Package,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50/80 dark:bg-emerald-950/30',
      borderColor: 'border-emerald-100 dark:border-emerald-900/30',
      action: () => onSelectService('parcel'),
    },
    {
      id: 'wallet',
      title: 'Pathao Pay',
      subtitle: 'Send & Cashback',
      badge: '৳ CASHBACK',
      badgeColor: 'bg-purple-600 text-white',
      icon: Wallet,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50/80 dark:bg-purple-950/30',
      borderColor: 'border-purple-100 dark:border-purple-900/30',
      action: () => onSelectService('wallet'),
    },
    {
      id: 'pharma',
      title: 'Pathao Pharma',
      subtitle: '20 Min Medicine',
      badge: '24/7',
      badgeColor: 'bg-teal-600 text-white',
      icon: Pill,
      iconColor: 'text-teal-600',
      bgColor: 'bg-teal-50/80 dark:bg-teal-950/30',
      borderColor: 'border-teal-100 dark:border-teal-900/30',
      action: () => alert('Pathao Pharma: Connected with Lazz Pharma & Apollo pharmacies in Dhaka!'),
    },
  ];

  return (
    <div className="px-5 py-2">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <span>Pathao Services</span>
          <span className="w-1.5 h-1.5 rounded-full bg-pathao-red" />
        </h2>
        <span className="text-[11px] font-semibold text-slate-400">Moving Bangladesh</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {services.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                sounds.playTap();
                item.action();
              }}
              className={`relative p-3 rounded-2xl border ${item.bgColor} ${item.borderColor} flex flex-col items-center justify-center text-center transition-all duration-200 hover:shadow-card-hover active:scale-95 group overflow-hidden`}
            >
              {/* Badge */}
              {item.badge && (
                <span
                  className={`absolute top-1.5 right-1.5 px-1 py-0.2 rounded text-[8px] font-black tracking-tight ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}

              {/* Icon */}
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 shadow-xs flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Icon className={`w-5 h-5 ${item.iconColor}`} />
              </div>

              {/* Labels */}
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {item.title}
              </span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 leading-none">
                {item.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
