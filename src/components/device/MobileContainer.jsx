import React from 'react';
import StatusBar from './StatusBar';
import DynamicIsland from './DynamicIsland';
import { Smartphone, Monitor, Moon, Sun, Volume2, VolumeX, RotateCcw, Plus, Sparkles } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function MobileContainer({
  children,
  frameMode, // 'iphone' | 'android' | 'full'
  setFrameMode,
  isDark,
  setIsDark,
  soundEnabled,
  setSoundEnabled,
  activeRide,
  activeFoodOrder,
  activeParcel,
  onExpandRide,
  onExpandFood,
  onExpandParcel,
  onResetDemo,
  onQuickAddWallet,
}) {
  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-2 sm:p-6 transition-colors duration-300 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-900 text-slate-800'
    }`}>
      {/* Desktop Presentation Header & Toolbar */}
      <header className="w-full max-w-4xl mb-4 px-4 py-3 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/60 shadow-xl flex flex-wrap items-center justify-between gap-3 text-white select-none">
        {/* App Title & Dhaka Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-pathao-red flex items-center justify-center shadow-glow-red">
            <span className="font-black text-white text-base">P</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-extrabold tracking-tight">Pathao Super-App</h1>
              <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.2 rounded font-mono font-bold uppercase">
                Dhaka Engine
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Rides • Food • Parcel Logistics • Pathao Pay</p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Wallet Add */}
          <button
            type="button"
            onClick={() => {
              sounds.playCash();
              onQuickAddWallet && onQuickAddWallet(1000);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all active:scale-95"
            title="Add ৳1,000 to Pathao Pay Balance"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+৳1,000</span>
          </button>

          {/* Reset Demo State */}
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              onResetDemo && onResetDemo();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold transition-all active:scale-95"
            title="Reset All Live State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Sound Synthesizer Toggle */}
          <button
            type="button"
            onClick={() => {
              const newState = sounds.toggleSound();
              setSoundEnabled(newState);
            }}
            className="p-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition-all active:scale-95"
            title={soundEnabled ? 'Mute Haptic Audio Synthesizer' : 'Enable Audio Synthesizer'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Dark / Light Toggle */}
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setIsDark(!isDark);
            }}
            className="p-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition-all active:scale-95"
            title="Toggle App Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>

          {/* Device Frame Mode Selector */}
          <div className="flex bg-slate-900/80 p-0.5 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setFrameMode('iphone');
              }}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                frameMode === 'iphone' ? 'bg-pathao-red text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              iOS
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setFrameMode('android');
              }}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                frameMode === 'android' ? 'bg-pathao-red text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Android
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setFrameMode('full');
              }}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                frameMode === 'full' ? 'bg-pathao-red text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Full
            </button>
          </div>
        </div>
      </header>

      {/* Frame Container */}
      <div className={`relative transition-all duration-300 flex items-center justify-center ${
        frameMode === 'full'
          ? 'w-full max-w-md h-[844px]'
          : 'w-[390px] h-[844px]'
      }`}>
        {/* Physical Smartphone Outer Bezel & Hardware Buttons (if not full) */}
        {frameMode !== 'full' && (
          <>
            {/* Side hardware buttons (Silent switch, volume up, volume down) */}
            <div className="absolute -left-2.5 top-28 w-1.5 h-8 bg-slate-700 rounded-l-md pointer-events-none" />
            <div className="absolute -left-2.5 top-40 w-1.5 h-12 bg-slate-700 rounded-l-md pointer-events-none" />
            <div className="absolute -left-2.5 top-56 w-1.5 h-12 bg-slate-700 rounded-l-md pointer-events-none" />
            {/* Power / Siri button */}
            <div className="absolute -right-2.5 top-36 w-1.5 h-16 bg-slate-700 rounded-r-md pointer-events-none" />
          </>
        )}

        {/* Device Outer Frame Shell */}
        <div
          className={`w-full h-full relative overflow-hidden flex flex-col transition-all duration-300 ${
            frameMode === 'full'
              ? 'rounded-2xl border border-slate-700 shadow-2xl'
              : frameMode === 'iphone'
              ? 'rounded-[50px] border-[10px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] ring-1 ring-slate-700/60'
              : 'rounded-[38px] border-[8px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] ring-1 ring-slate-700/60'
          } ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}
        >
          {/* Top Notch / Dynamic Island / Punch Hole */}
          {frameMode === 'iphone' && (
            <DynamicIsland
              activeRide={activeRide}
              activeFoodOrder={activeFoodOrder}
              activeParcel={activeParcel}
              onExpandRide={onExpandRide}
              onExpandFood={onExpandFood}
              onExpandParcel={onExpandParcel}
            />
          )}

          {frameMode === 'android' && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-50 ring-1 ring-slate-800 shadow-sm" />
          )}

          {/* Top Status Bar */}
          <StatusBar isDark={isDark} />

          {/* Screen Main Viewport Content */}
          <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
            {children}
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="w-full pb-2 pt-1 flex justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm select-none shrink-0 z-30">
            <div className="w-32 h-1 bg-slate-400 dark:bg-slate-500 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
