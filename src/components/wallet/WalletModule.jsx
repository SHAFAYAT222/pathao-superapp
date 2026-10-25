import React, { useState, useEffect } from 'react';
import { Wallet, Plus, ArrowUpRight, QrCode, CreditCard, Sparkles, ShieldCheck, ArrowLeft, ArrowDownLeft, RefreshCcw } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import { walletService } from '../../services';

export default function WalletModule({
  walletBalance,
  onOpenTopUp,
  onBack,
  userProfile,
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    walletService.getTransactions().then((txs) => {
      if (txs && txs.length > 0) {
        setTransactions(txs);
      }
    });
  }, [walletBalance]);

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 select-none overflow-hidden relative">
      {/* Header */}
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
            Pathao Pay Digital Wallet
          </h2>
          <span className="text-[10px] text-emerald-600 font-bold">
            Bangladesh Bank Licensed MFS Partner
          </span>
        </div>
        <div className="w-9" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        {/* Virtual Pathao Pay Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-rose-700 to-slate-900 text-white p-5 shadow-glow-red space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-base">
                ৳
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-red-100 font-black">
                  PATHAO PAY
                </span>
                <p className="text-[9px] text-white/70">Platinum Member Card</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[9px] font-mono font-bold">
              Active Verified
            </span>
          </div>

          <div>
            <span className="text-[11px] text-white/80 font-medium">Available Balance</span>
            <div className="text-3xl font-black tracking-tight mt-0.5">
              ৳{walletBalance.toLocaleString()}
            </div>
          </div>

          <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs">
            <span className="font-mono text-white/80">•••• •••• •••• 8912</span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-300">
              <Sparkles className="w-3 h-3 fill-amber-300" />
              <span>850 Points</span>
            </div>
          </div>
        </div>

        {/* Action Grid Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {/* Add Money */}
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              onOpenTopUp && onOpenTopUp();
            }}
            className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-xs flex flex-col items-center justify-center text-center hover:bg-red-50 dark:hover:bg-red-950/20 active:scale-95 transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/40 text-pathao-red flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">Add Money</span>
            <span className="text-[9px] text-slate-400">bKash / Card</span>
          </button>

          {/* Send Money */}
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              alert('Send Money: Instantly transfer funds to any registered Pathao user in Dhaka!');
            }}
            className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-xs flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">Send Money</span>
            <span className="text-[9px] text-slate-400">Zero Fee</span>
          </button>

          {/* Pay QR */}
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              alert('Scan & Pay: Bangla QR and Pathao Merchant scanner ready.');
            }}
            className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-xs flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">Scan QR</span>
            <span className="text-[9px] text-slate-400">Bangla QR</span>
          </button>
        </div>

        {/* Linked Accounts */}
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Linked Accounts & MFS
            </span>
            <span className="text-[10px] text-pathao-red font-bold cursor-pointer hover:underline">
              + Link New
            </span>
          </div>

          <div className="space-y-2">
            {/* bKash */}
            <div className="p-2.5 rounded-xl bg-pink-50/60 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-bkash-pink text-white flex items-center justify-center font-bold text-xs">
                  ৳
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">bKash Account</span>
                  <p className="text-[10px] text-slate-500 font-mono">+880 1712-•••678</p>
                </div>
              </div>
              <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                LINKED
              </span>
            </div>

            {/* City Bank Visa */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <CreditCard className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">City Bank Visa Platinum</span>
                  <p className="text-[10px] text-slate-500 font-mono">•••• 4129</p>
                </div>
              </div>
              <span className="text-[9px] font-bold bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-200 px-1.5 py-0.5 rounded">
                DEFAULT
              </span>
            </div>
          </div>
        </div>

        {/* Transactions Ledger */}
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Recent Transactions
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">October 2026</span>
          </div>

          <div className="space-y-2.5">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      tx.type === 'credit'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                        : 'bg-red-50 dark:bg-red-950/40 text-pathao-red'
                    }`}
                  >
                    {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white leading-tight">
                      {tx.title}
                    </h5>
                    <p className="text-[10px] text-slate-400">{tx.date} • {tx.method}</p>
                  </div>
                </div>
                <span
                  className={`font-black font-mono ${
                    tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {tx.type === 'credit' ? `+৳${tx.amount}` : `-৳${tx.amount}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
