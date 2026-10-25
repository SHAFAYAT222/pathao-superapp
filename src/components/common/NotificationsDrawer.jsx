import React from 'react';
import BottomSheet from './BottomSheet';
import { Bell, Bike, UtensilsCrossed, Gift, Tag, CheckCheck } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function NotificationsDrawer({ isOpen, onClose }) {
  const notifications = [
    {
      id: 1,
      type: 'promo',
      icon: Tag,
      iconBg: 'bg-red-50 text-pathao-red',
      title: 'Dhaka Biryani Fest Active! 🍛',
      desc: 'Use promo code KACCHILOVE for flat ৳80 off your next feast at Sultan’s Dine.',
      time: '12m ago',
      unread: true,
    },
    {
      id: 2,
      type: 'ride',
      icon: Bike,
      iconBg: 'bg-blue-50 text-blue-600',
      title: 'Trip Completed Successfully',
      desc: 'Banani 11 to Gulshan 2. ৳135 paid via Pathao Pay. +25 points earned.',
      time: '2h ago',
      unread: false,
    },
    {
      id: 3,
      type: 'points',
      icon: Gift,
      iconBg: 'bg-amber-50 text-amber-600',
      title: 'Platinum Club Tier Reached! 🏆',
      desc: 'You unlocked priority captain matching and zero surge surcharge.',
      time: '1d ago',
      unread: false,
    },
  ];

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Notifications"
      subtitle="Alerts, promotions & trip receipts"
    >
      <div className="space-y-3">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              onClick={() => sounds.playTap()}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                n.unread
                  ? 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/40'
                  : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/60'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${n.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                  {n.desc}
                </p>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => {
            sounds.playTap();
            onClose();
          }}
          className="w-full py-2.5 text-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center gap-1.5"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark all notifications as read</span>
        </button>
      </div>
    </BottomSheet>
  );
}
