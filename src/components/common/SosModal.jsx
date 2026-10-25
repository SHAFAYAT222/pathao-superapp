import React, { useState } from 'react';
import BottomSheet from './BottomSheet';
import { ShieldAlert, PhoneCall, Share2, AlertTriangle, Check } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function SosModal({ isOpen, onClose, activeTripInfo }) {
  const [alertSent, setAlertSent] = useState(false);

  const handleTriggerEmergency = () => {
    sounds.playTap();
    setAlertSent(true);
    setTimeout(() => {
      setAlertSent(false);
      onClose();
    }, 2500);
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Pathao Safety & Emergency Center"
      subtitle="Immediate 24/7 assistance across Bangladesh"
    >
      <div className="space-y-4">
        {/* Urgent Alert Banner */}
        <div className="p-3.5 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900/40 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs text-red-900 dark:text-red-200">
            <span className="font-bold">Are you feeling unsafe?</span>
            <p className="text-[11px] text-red-700 dark:text-red-300 mt-0.5">
              Your live GPS telemetry is shared with Pathao Incident Control. Help will be dispatched immediately.
            </p>
          </div>
        </div>

        {/* SOS Action List */}
        <div className="space-y-2.5">
          {/* Call 999 */}
          <a
            href="tel:999"
            onClick={() => sounds.playTap()}
            className="p-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl flex items-center justify-between font-bold text-xs shadow-glow-red transition-all active:scale-98"
          >
            <div className="flex items-center gap-3">
              <PhoneCall className="w-5 h-5" />
              <div className="text-left">
                <div>Call 999 National Emergency</div>
                <div className="text-[10px] font-normal text-red-100">Direct Bangladesh Police & Ambulance</div>
              </div>
            </div>
            <span className="bg-white/20 px-2 py-1 rounded-lg text-[10px]">DIAL 999</span>
          </a>

          {/* Pathao Safety Hotline */}
          <a
            href="tel:09678007788"
            onClick={() => sounds.playTap()}
            className="p-3.5 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl flex items-center justify-between font-bold text-xs transition-all active:scale-98"
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <div className="text-left">
                <div>Pathao 24/7 Safety Command</div>
                <div className="text-[10px] font-normal text-slate-300">09678-007788 (Toll Free)</div>
              </div>
            </div>
            <span className="bg-white/10 px-2 py-1 rounded-lg text-[10px]">CALL</span>
          </a>

          {/* Share Live Trip Link */}
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              navigator.clipboard?.writeText('https://pathao.com/track/dhaka-trip-live-88392');
              alert('Live Trip Tracking Link copied to clipboard!');
            }}
            className="w-full p-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-2xl flex items-center justify-between font-bold text-xs transition-all active:scale-98"
          >
            <div className="flex items-center gap-3">
              <Share2 className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div>Share Live Trip with Family</div>
                <div className="text-[10px] font-normal text-slate-500">Live GPS tracking link via WhatsApp / SMS</div>
              </div>
            </div>
            <span className="text-blue-600 dark:text-blue-400 text-[11px]">COPY LINK</span>
          </button>
        </div>

        {/* Silent Distress Trigger */}
        <button
          type="button"
          onClick={handleTriggerEmergency}
          disabled={alertSent}
          className={`w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            alertSent
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-100'
          }`}
        >
          {alertSent ? (
            <>
              <Check className="w-4 h-4" />
              <span>Silent Alert Dispatched to Pathao Safety HQ</span>
            </>
          ) : (
            <span>Send Silent In-App Distress Signal</span>
          )}
        </button>
      </div>
    </BottomSheet>
  );
}
