import React, { useState } from 'react';
import BottomSheet from './BottomSheet';
import { User, ShieldCheck, MapPin, Award, Gift, Globe, ChevronRight, LogOut, Heart } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function ProfileModal({
  isOpen,
  onClose,
  userProfile,
  walletBalance,
}) {
  const [language, setLanguage] = useState('English');

  if (!isOpen) return null;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="User Account"
      subtitle={userProfile?.phone || '+880 1712-345678'}
    >
      <div className="space-y-4 select-none">
        {/* Profile Card Header */}
        <div className="p-4 bg-gradient-to-r from-red-600 to-rose-700 rounded-2xl text-white flex items-center gap-3.5 shadow-glow-red">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80"
            alt="User"
            className="w-14 h-14 rounded-2xl object-cover border-2 border-white/40 shadow-md"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-black">{userProfile?.name}</h3>
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            </div>
            <p className="text-xs text-red-100 font-medium">Pathao Platinum Club Member</p>
            <div className="flex items-center gap-2 text-[10px] mt-1">
              <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold">248 Total Trips</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold">850 Points</span>
            </div>
          </div>
        </div>

        {/* Saved Addresses */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
            Saved Dhaka Places
          </span>
          <div className="space-y-1.5">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-950/40 text-pathao-red flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Home</span>
                  <p className="text-[10px] text-slate-500">House 42, Road 11, Block D, Banani</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">Work</span>
                  <p className="text-[10px] text-slate-500">City Bank Center, Motijheel C/A</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
            Preferences & Language
          </span>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-slate-500" />
              <span className="font-bold text-slate-900 dark:text-white">App Language</span>
            </div>
            <div className="flex bg-slate-200 dark:bg-slate-700 p-0.5 rounded-lg text-[10px] font-bold">
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setLanguage('English');
                }}
                className={`px-2 py-0.5 rounded ${language === 'English' ? 'bg-white dark:bg-slate-900 shadow-xs text-pathao-red font-black' : 'text-slate-500'}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setLanguage('বাংলা');
                }}
                className={`px-2 py-0.5 rounded ${language === 'বাংলা' ? 'bg-white dark:bg-slate-900 shadow-xs text-pathao-red font-black' : 'text-slate-500'}`}
              >
                বাংলা
              </button>
            </div>
          </div>
        </div>

        {/* Pathao Care Support Line */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-center text-xs text-slate-500">
          <span>Pathao 24/7 Helpline: </span>
          <a href="tel:09678007788" className="text-pathao-red font-bold hover:underline">
            09678-007788
          </a>
        </div>
      </div>
    </BottomSheet>
  );
}
