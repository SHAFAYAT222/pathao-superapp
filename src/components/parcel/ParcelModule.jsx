import React, { useState } from 'react';
import { PARCEL_CATEGORIES } from '../../data/mockData';
import { FileText, Laptop, ShoppingBag, AlertTriangle, ArrowLeft, ArrowRight, ShieldCheck, KeyRound, Copy, Check, CheckCircle2, FastForward } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { parcelService, walletService } from '../../services';

export default function ParcelModule({
  activeParcel,
  setActiveParcel,
  walletBalance,
  setWalletBalance,
  onBack,
}) {
  // Sender info
  const [senderName, setSenderName] = useState('Tanvir Hasan');
  const [senderPhone, setSenderPhone] = useState('+880 1712-345678');
  const [senderAddress, setSenderAddress] = useState('House 42, Road 11, Block D, Banani');

  // Recipient info
  const [recipientName, setRecipientName] = useState('Nazmul Karim');
  const [recipientPhone, setRecipientPhone] = useState('+880 1819-234567');
  const [recipientAddress, setRecipientAddress] = useState('Flat 5B, Road 27, Dhanmondi');
  const [deliveryInstructions, setDeliveryInstructions] = useState('Call recipient before arriving. Leave with security if unavailable.');

  // Package specs
  const [selectedCategory, setSelectedCategory] = useState(PARCEL_CATEGORIES[0]);
  const [weightKg, setWeightKg] = useState(1);
  const [copiedOtp, setCopiedOtp] = useState('');

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'FileText': return FileText;
      case 'Laptop': return Laptop;
      case 'ShoppingBag': return ShoppingBag;
      default: return AlertTriangle;
    }
  };

  // Base rate calculation
  const baseRate = selectedCategory.price;
  const weightCharge = Math.max(0, (weightKg - 1) * 25);
  const totalParcelRate = baseRate + weightCharge;

  const handleBookParcel = async () => {
    sounds.playTap();

    // Deduct from wallet via API
    const deductRes = await walletService.deduct({
      amount: totalParcelRate,
      purpose: `Pathao Parcel Dispatch (${selectedCategory.name})`,
    });

    if (deductRes?.balance != null) {
      setWalletBalance(deductRes.balance);
    } else {
      setWalletBalance((prev) => Math.max(0, prev - totalParcelRate));
    }

    sounds.playSuccess();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });

    // Create parcel via backend API to generate cryptographically secure 4-digit OTPs
    const createdParcel = await parcelService.createParcel({
      sender: { name: senderName, phone: senderPhone, address: senderAddress },
      recipient: { name: recipientName, phone: recipientPhone, address: recipientAddress },
      category: selectedCategory,
      weightKg,
      totalFare: totalParcelRate,
      deliveryInstructions,
    });

    if (createdParcel) {
      setActiveParcel(createdParcel);
    }
  };

  const handleCopy = (code, type) => {
    sounds.playTap();
    navigator.clipboard?.writeText(code);
    setCopiedOtp(type);
    setTimeout(() => setCopiedOtp(''), 2000);
  };

  const handleAdvanceParcel = async () => {
    sounds.playTap();
    if (activeParcel.id) {
      parcelService.advanceParcel(activeParcel.id);
    }

    if (activeParcel.status === 'courier_assigned') {
      setActiveParcel(p => ({ ...p, status: 'in_transit' }));
    } else if (activeParcel.status === 'in_transit') {
      sounds.playSuccess();
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 },
      });
      setActiveParcel(p => ({ ...p, status: 'delivered' }));
    } else {
      setActiveParcel({ status: 'idle' });
    }
  };

  // If parcel is active
  if (activeParcel && activeParcel.status !== 'idle') {
    return (
      <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 select-none overflow-hidden relative">
        {/* Top Header */}
        <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              onBack && onBack();
            }}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h3 className="text-xs font-black text-slate-900 dark:text-white">
              Pathao Parcel Courier
            </h3>
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
              {activeParcel.status.replace('_', ' ')}
            </span>
          </div>
          <div className="w-9" />
        </div>

        {/* Live Parcel Status Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* OTP Verification Security Box */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900 dark:text-emerald-200">
                <KeyRound className="w-4 h-4 text-emerald-600" />
                <span>Security Verification OTPs</span>
              </div>
              <span className="text-[9px] bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-black px-1.5 py-0.5 rounded">
                REQUIRED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Pickup OTP */}
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-emerald-100 dark:border-slate-700 text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Pickup OTP</span>
                <span className="text-lg font-black text-slate-900 dark:text-white font-mono tracking-widest">
                  {activeParcel.pickupOtp}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(activeParcel.pickupOtp, 'pickup')}
                  className="mt-1 text-[10px] font-bold text-emerald-600 flex items-center justify-center gap-1 mx-auto"
                >
                  {copiedOtp === 'pickup' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedOtp === 'pickup' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Delivery OTP */}
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-emerald-100 dark:border-slate-700 text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Delivery OTP</span>
                <span className="text-lg font-black text-slate-900 dark:text-white font-mono tracking-widest">
                  {activeParcel.deliveryOtp}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(activeParcel.deliveryOtp, 'delivery')}
                  className="mt-1 text-[10px] font-bold text-emerald-600 flex items-center justify-center gap-1 mx-auto"
                >
                  {copiedOtp === 'delivery' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedOtp === 'delivery' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Courier Card */}
          <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Assigned Courier</span>
              <h4 className="text-xs font-black text-slate-900 dark:text-white">
                {activeParcel.courier.name}
              </h4>
              <p className="text-[10px] text-slate-500 font-mono">
                {activeParcel.courier.vehicle}
              </p>
            </div>
            <a
              href={`tel:${activeParcel.courier.phone}`}
              onClick={() => sounds.playTap()}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95"
            >
              Call Courier
            </a>
          </div>

          {/* Route Summary */}
          <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-xs space-y-2 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">From (Sender)</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{activeParcel.sender.name} ({activeParcel.sender.phone})</span>
              <p className="text-[11px] text-slate-500">{activeParcel.sender.address}</p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">To (Recipient)</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{activeParcel.recipient.name} ({activeParcel.recipient.phone})</span>
              <p className="text-[11px] text-slate-500">{activeParcel.recipient.address}</p>
            </div>
          </div>

          {/* Stepper simulation control */}
          <button
            type="button"
            onClick={handleAdvanceParcel}
            className="w-full py-3.5 rounded-2xl bg-pathao-red hover:bg-pathao-redDark text-white font-black text-xs shadow-glow-red flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <FastForward className="w-4 h-4" />
            <span>
              {activeParcel.status === 'courier_assigned'
                ? 'Simulate Package Picked Up (In Transit)'
                : activeParcel.status === 'in_transit'
                ? 'Simulate Safe Handover (Delivered)'
                : 'Complete & Book Another Parcel'}
            </span>
          </button>
        </div>
      </div>
    );
  }

  // Parcel booking form view
  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 select-none overflow-hidden relative">
      {/* Top Header */}
      <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={() => {
            sounds.playTap();
            onBack && onBack();
          }}
          className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Pathao Parcel Logistics
          </h2>
          <span className="text-[10px] text-emerald-600 font-bold">
            Guaranteed Same-Day Dhaka Dispatch
          </span>
        </div>
        <div className="w-9" />
      </div>

      {/* Booking Form Scroll */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {/* Package Category Selector */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider block">
            Select Package Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PARCEL_CATEGORIES.map((cat) => {
              const Icon = getCategoryIcon(cat.icon);
              const isSelected = selectedCategory.id === cat.id;

              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    sounds.playTap();
                    setSelectedCategory(cat);
                  }}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-pathao-red bg-red-50/60 dark:bg-red-950/20 ring-1 ring-pathao-red'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
                      <Icon className="w-4 h-4 text-pathao-red" />
                    </div>
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      ৳{cat.price}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">
                      {cat.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                      {cat.note}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weight Slider */}
        <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
            <span>Estimated Weight</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 font-mono text-pathao-red">
              {weightKg} kg
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            value={weightKg}
            onChange={(e) => setWeightKg(parseFloat(e.target.value))}
            className="w-full accent-pathao-red cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0.5 kg (Standard)</span>
            <span>5.0 kg (Heavy)</span>
          </div>
        </div>

        {/* Sender Information Card */}
        <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">
            Sender Details (Pickup)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Sender Name"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pathao-red"
            />
            <input
              type="text"
              placeholder="Sender Phone"
              value={senderPhone}
              onChange={(e) => setSenderPhone(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pathao-red"
            />
          </div>
          <input
            type="text"
            placeholder="Detailed Pickup Address in Banani / Dhaka"
            value={senderAddress}
            onChange={(e) => setSenderAddress(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pathao-red"
          />
        </div>

        {/* Recipient Information Card */}
        <div className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-pathao-red block">
            Recipient Details (Drop-Off)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Recipient Name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pathao-red"
            />
            <input
              type="text"
              placeholder="Recipient Phone"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pathao-red"
            />
          </div>
          <input
            type="text"
            placeholder="Detailed Delivery Address in Dhanmondi / Dhaka"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pathao-red"
          />
          <input
            type="text"
            placeholder="Flat/Building Instructions (Optional)"
            value={deliveryInstructions}
            onChange={(e) => setDeliveryInstructions(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pathao-red"
          />
        </div>

        {/* Pricing & Guarantee Banner */}
        <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900/50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-900 dark:text-white">OTP Verification Protection</span>
              <p className="text-[10px] text-slate-500">4-digit pickup & delivery safety codes</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-slate-900 dark:text-white">৳{totalParcelRate}</span>
          </div>
        </div>

        {/* Submit Booking Button */}
        <button
          type="button"
          onClick={handleBookParcel}
          className="w-full py-3.5 rounded-2xl bg-pathao-red hover:bg-pathao-redDark text-white font-black text-sm tracking-wide shadow-glow-red flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <span>DISPATCH PARCEL COURIER (৳{totalParcelRate})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
