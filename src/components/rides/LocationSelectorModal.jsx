import React, { useState } from 'react';
import BottomSheet from '../common/BottomSheet';
import { DHAKA_LOCATIONS } from '../../data/mockData';
import { MapPin, Navigation, ArrowUpDown, Clock, Search, Check } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function LocationSelectorModal({
  isOpen,
  onClose,
  pickup,
  destination,
  onSelectPickup,
  onSelectDestination,
  onSwap,
}) {
  const [activeField, setActiveField] = useState('destination'); // 'pickup' | 'destination'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLocations = DHAKA_LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePick = (loc) => {
    sounds.playTap();
    if (activeField === 'pickup') {
      onSelectPickup(loc);
      setActiveField('destination');
    } else {
      onSelectDestination(loc);
      onClose();
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Select Ride Route"
      subtitle="Dhaka Metropolitan City Area"
    >
      <div className="space-y-3">
        {/* Pickup & Destination Interactive Input Box */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 relative">
          {/* Pickup Field */}
          <div
            onClick={() => setActiveField('pickup')}
            className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-all ${
              activeField === 'pickup'
                ? 'bg-white dark:bg-slate-700 ring-2 ring-emerald-500 shadow-xs'
                : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Pickup Location</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                {pickup?.name || 'Set pickup point'}
              </span>
            </div>
            {activeField === 'pickup' && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
          </div>

          {/* Swap Button */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                sounds.playTap();
                onSwap && onSwap();
              }}
              title="Swap Locations"
              className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-pathao-red active:scale-95 transition-all"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          {/* Destination Field */}
          <div
            onClick={() => setActiveField('destination')}
            className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-all ${
              activeField === 'destination'
                ? 'bg-white dark:bg-slate-700 ring-2 ring-pathao-red shadow-xs'
                : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-600 flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5 text-pathao-red" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Drop-Off Destination</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                {destination?.name || 'Where do you want to go?'}
              </span>
            </div>
            {activeField === 'destination' && <Check className="w-4 h-4 text-pathao-red shrink-0" />}
          </div>
        </div>

        {/* Search Input Filter */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeField === 'pickup' ? 'pickup point' : 'destination'} in Dhaka...`}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pathao-red"
          />
        </div>

        {/* Location Suggestions List */}
        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Suggested Dhaka Landmarks
          </div>
          {filteredLocations.map((loc) => (
            <div
              key={loc.id}
              onClick={() => handlePick(loc)}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 group-hover:text-pathao-red flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {loc.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {loc.area}, {loc.city}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                {loc.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
}
