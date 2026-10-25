import React, { useState } from 'react';
import BottomSheet from '../common/BottomSheet';
import { PROMO_CODES } from '../../data/mockData';
import { Trash2, Plus, Minus, Tag, Check, ShieldCheck, ArrowRight, Utensils } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function FoodCheckoutSheet({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  walletBalance,
  onTriggerBkash,
}) {
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wallet'); // 'wallet' | 'bkash' | 'cod'

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const vat = Math.round(subtotal * 0.05); // 5% VAT
  const baseDelivery = cartItems.length > 0 ? (cartItems[0]?.restaurant?.deliveryFee || 40) : 0;
  
  // Delivery discount from promo
  const deliveryDiscount = appliedPromo && appliedPromo.type === 'delivery' ? baseDelivery : 0;
  const flatDiscount = appliedPromo && appliedPromo.type === 'flat' ? appliedPromo.discount : 0;
  const totalDiscount = deliveryDiscount + flatDiscount;
  const effectiveDelivery = Math.max(0, baseDelivery - deliveryDiscount);

  const grandTotal = Math.max(0, subtotal + vat + effectiveDelivery - flatDiscount);

  const handleApplyPromo = () => {
    sounds.playTap();
    const code = promoInput.trim().toUpperCase();
    const found = PROMO_CODES[code];
    if (found) {
      setAppliedPromo(found);
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try "PATHAOFREE" or "KACCHILOVE"');
    }
  };

  const handleCheckout = () => {
    sounds.playTap();
    if (paymentMethod === 'bkash') {
      onTriggerBkash({
        amount: grandTotal,
        purpose: 'Pathao Food Delivery Order',
        onSuccess: () => {
          onPlaceOrder({
            items: cartItems,
            subtotal,
            vat,
            deliveryFee: effectiveDelivery,
            discount: totalDiscount,
            grandTotal,
            paymentMethod: 'bKash',
            restaurant: cartItems[0]?.restaurant,
          });
          onClose();
        }
      });
    } else {
      onPlaceOrder({
        items: cartItems,
        subtotal,
        vat,
        deliveryFee: effectiveDelivery,
        discount: totalDiscount,
        grandTotal,
        paymentMethod: paymentMethod === 'wallet' ? 'Pathao Pay' : 'Cash on Delivery',
        restaurant: cartItems[0]?.restaurant,
      });
      onClose();
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Basket & Checkout"
      subtitle={cartItems[0]?.restaurant?.name || 'Dhaka Food Hub'}
      maxHeight="max-h-[88vh]"
    >
      <div className="space-y-4 select-none">
        {cartItems.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Utensils className="w-12 h-12 mx-auto stroke-1" />
            <p className="text-xs font-semibold">Your food basket is empty</p>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0 text-left">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                      {item.name}
                    </h4>
                    {/* Render selected options chips */}
                    {Object.entries(item.selectedOptions || {}).map(([cat, opts]) => (
                      <p key={cat} className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {opts.map(o => o.name).join(', ')}
                      </p>
                    ))}
                    {item.specialInstructions && (
                      <p className="text-[10px] text-amber-600 truncate italic">
                        Note: {item.specialInstructions}
                      </p>
                    )}
                    <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block">
                      ৳{item.totalPrice}
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1.5 shrink-0 bg-white dark:bg-slate-700 p-1 rounded-xl shadow-xs">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        if (item.quantity === 1) {
                          onRemoveItem(item.id);
                        } else {
                          onUpdateQuantity(item.id, item.quantity - 1);
                        }
                      }}
                      className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-red-50 hover:text-red-600"
                    >
                      {item.quantity === 1 ? <Trash2 className="w-3 h-3 text-red-500" /> : <Minus className="w-3 h-3" />}
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-slate-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        onUpdateQuantity(item.id, item.quantity + 1);
                      }}
                      className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Voucher Box */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter Voucher (e.g. PATHAOFREE)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs uppercase font-bold focus:outline-none focus:ring-1 focus:ring-pathao-red"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold hover:bg-slate-800 active:scale-95"
                >
                  Apply
                </button>
              </div>

              {appliedPromo && (
                <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>{appliedPromo.description}</span>
                </div>
              )}
              {promoError && (
                <div className="text-[11px] font-semibold text-red-500 mt-1">
                  {promoError}
                </div>
              )}
            </div>

            {/* Bill Summary */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">৳{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Govt VAT (5%)</span>
                <span>৳{vat}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Delivery Fee</span>
                <span className={appliedPromo?.type === 'delivery' ? 'line-through text-slate-400' : ''}>
                  ৳{baseDelivery}
                </span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Promo Voucher Discount</span>
                  <span>-৳{totalDiscount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-black text-sm text-slate-900 dark:text-white">
                <span>Grand Total</span>
                <span>৳{grandTotal}</span>
              </div>
            </div>

            {/* Payment Method Switcher */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {/* Pathao Pay */}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setPaymentMethod('wallet');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    paymentMethod === 'wallet'
                      ? 'border-pathao-red bg-red-50/50 dark:bg-red-950/20 ring-1 ring-pathao-red'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    Pathao Pay
                  </div>
                  <div className="text-[9px] text-slate-500 truncate">
                    ৳{walletBalance}
                  </div>
                </button>

                {/* bKash */}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setPaymentMethod('bkash');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    paymentMethod === 'bkash'
                      ? 'border-bkash-pink bg-pink-50/50 dark:bg-pink-950/20 ring-1 ring-bkash-pink'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-black text-bkash-pink">
                    bKash
                  </div>
                  <div className="text-[9px] text-slate-500">
                    Instant PIN
                  </div>
                </button>

                {/* Cash */}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playTap();
                    setPaymentMethod('cod');
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-900'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    Cash
                  </div>
                  <div className="text-[9px] text-slate-500">
                    On Delivery
                  </div>
                </button>
              </div>
            </div>

            {/* Place Order Action Button */}
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-2xl bg-pathao-red hover:bg-pathao-redDark text-white font-black text-sm tracking-wide shadow-glow-red flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <span>CONFIRM ORDER (৳{grandTotal})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </BottomSheet>
  );
}
