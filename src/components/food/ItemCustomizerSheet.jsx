import React, { useState } from 'react';
import BottomSheet from '../common/BottomSheet';
import { Plus, Minus, Check, Sparkles } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function ItemCustomizerSheet({
  isOpen,
  onClose,
  item,
  restaurant,
  onAddToCart,
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [specialInstructions, setSpecialInstructions] = useState('');

  if (!isOpen || !item) return null;

  const handleOptionToggle = (groupTitle, option, isSingle) => {
    sounds.playTap();
    if (isSingle) {
      setSelectedOptions(prev => ({ ...prev, [groupTitle]: [option] }));
    } else {
      const current = selectedOptions[groupTitle] || [];
      const exists = current.some(o => o.name === option.name);
      if (exists) {
        setSelectedOptions(prev => ({
          ...prev,
          [groupTitle]: current.filter(o => o.name !== option.name),
        }));
      } else {
        setSelectedOptions(prev => ({
          ...prev,
          [groupTitle]: [...current, option],
        }));
      }
    }
  };

  // Calculate total item price with options
  const optionsPrice = Object.values(selectedOptions)
    .flat()
    .reduce((sum, opt) => sum + (opt.price || 0), 0);

  const unitPrice = item.price + optionsPrice;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    sounds.playTap();
    onAddToCart({
      id: `${item.id}-${Date.now()}`,
      itemId: item.id,
      name: item.name,
      basePrice: item.price,
      unitPrice,
      totalPrice,
      quantity,
      selectedOptions,
      specialInstructions,
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        branch: restaurant.branch,
        deliveryFee: restaurant.deliveryFee,
      },
    });
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={item.name}
      subtitle={restaurant?.name}
      maxHeight="max-h-[85vh]"
    >
      <div className="space-y-4 select-none">
        {/* Item Image & Description */}
        <div className="relative h-44 rounded-2xl overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
            <span className="text-xl font-black text-white">৳{item.price}</span>
            {item.originalPrice && (
              <span className="text-xs line-through text-slate-300 ml-2 mb-0.5">
                ৳{item.originalPrice}
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {item.description}
        </p>

        {/* Customizers Groups */}
        {item.customizers?.map((group, gIdx) => (
          <div key={gIdx} className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {group.title}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400">
                {group.single ? 'Select 1' : 'Optional'}
              </span>
            </div>

            <div className="space-y-1.5">
              {group.options.map((opt, oIdx) => {
                const groupSelected = selectedOptions[group.title] || [];
                const isSelected = groupSelected.some(o => o.name === opt.name);

                return (
                  <div
                    key={oIdx}
                    onClick={() => handleOptionToggle(group.title, opt, group.single)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'border-pathao-red bg-red-50/50 dark:bg-red-950/20'
                        : 'border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-${group.single ? 'full' : 'md'} border flex items-center justify-center ${
                          isSelected
                            ? 'bg-pathao-red border-pathao-red text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {opt.name}
                      </span>
                    </div>
                    {opt.price > 0 && (
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        +৳{opt.price}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Special Instructions */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
          <label className="text-xs font-bold text-slate-900 dark:text-white block">
            Special instructions for kitchen (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Less spicy, extra salad, no cutlery..."
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-pathao-red"
          />
        </div>

        {/* Quantity & Add to Cart Bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
          {/* Quantity Controls */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl p-1">
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setQuantity(q => Math.max(1, q - 1));
              }}
              className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-xs active:scale-95"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-9 text-center text-xs font-black text-slate-900 dark:text-white">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setQuantity(q => q + 1);
              }}
              className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-xs active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 py-3.5 rounded-2xl bg-pathao-red hover:bg-pathao-redDark text-white font-black text-xs shadow-glow-red flex items-center justify-between px-4 active:scale-98 transition-all"
          >
            <span>ADD TO BASKET</span>
            <span>৳{totalPrice}</span>
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
