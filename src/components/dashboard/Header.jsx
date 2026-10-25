import React from 'react';
import { MapPin, Bell, ChevronDown, Plus, Search, Sparkles, User } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function Header({
  userProfile,
  currentAddress,
  walletBalance,
  onOpenLocationPicker,
  onOpenNotifications,
  onOpenTopUp,
  onOpenSearch,
  onOpenProfile,
}) {
  return (
    <header className="px-5 pt-3 pb-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 space-y-3 select-none">
      {/* Top Row: User Greeting, Wallet Chip, Notifications */}
      <div className="flex items-center justify-between">
        {/* User Info */}
        <div
          onClick={() => {
            sounds.playTap();
            onOpenProfile && onOpenProfile();
          }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 p-0.5 border-2 border-pathao-red">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
              alt="User"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Hello,
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-pathao-red transition-colors">
                {userProfile?.name?.split(' ')[0] || 'Tanvir'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
              <Sparkles className="w-2.5 h-2.5 fill-current" />
              <span>{userProfile?.badge || 'Platinum Club'}</span>
            </div>
          </div>
        </div>

        {/* Right side: Wallet Chip & Notification Bell */}
        <div className="flex items-center gap-2">
          {/* Pathao Pay Wallet Chip */}
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              onOpenTopUp && onOpenTopUp();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-red-50 dark:bg-red-950/40 text-pathao-red border border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all active:scale-95 shadow-xs"
          >
            <span className="text-xs font-black">৳{walletBalance?.toLocaleString() || '0'}</span>
            <div className="w-4 h-4 rounded-full bg-pathao-red text-white flex items-center justify-center">
              <Plus className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          </button>

          {/* Notifications */}
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              onOpenNotifications && onOpenNotifications();
            }}
            className="relative w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pathao-red ring-2 ring-white dark:ring-slate-900" />
          </button>
        </div>
      </div>

      {/* Address Detected Bar */}
      <div
        onClick={() => {
          sounds.playTap();
          onOpenLocationPicker && onOpenLocationPicker();
        }}
        className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 cursor-pointer hover:border-pathao-red/50 transition-colors"
      >
        <div className="flex items-center gap-2 truncate">
          <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div className="truncate text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block leading-none">
              CURRENT LOCATION
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {currentAddress?.name || 'Banani Road 11, Dhaka'}
            </span>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
      </div>

      {/* Quick Search Trigger */}
      <div
        onClick={() => {
          sounds.playTap();
          onOpenSearch && onOpenSearch();
        }}
        className="flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 text-xs cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700/50 transition-colors"
      >
        <Search className="w-4 h-4 text-slate-400" />
        <span className="truncate">Where to? Or search Biryani, Burgers, Courier...</span>
      </div>
    </header>
  );
}
