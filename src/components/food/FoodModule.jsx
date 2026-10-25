import React, { useState, useEffect } from 'react';
import { FOOD_CATEGORIES, RESTAURANTS } from '../../data/mockData';
import { foodService, walletService } from '../../services';
import { insertFoodOrderToSupabase } from '../../lib/supabaseClient';
import { toast } from '../../utils/toast';
import RestaurantCard from './RestaurantCard';
import RestaurantDetailModal from './RestaurantDetailModal';
import ItemCustomizerSheet from './ItemCustomizerSheet';
import FoodCheckoutSheet from './FoodCheckoutSheet';
import FoodDeliveryTracker from './FoodDeliveryTracker';
import { Search, SlidersHorizontal, ArrowLeft, ShoppingBag, Loader2 } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function FoodModule({
  cartItems,
  setCartItems,
  activeFoodOrder,
  setActiveFoodOrder,
  walletBalance,
  setWalletBalance,
  onTriggerBkash,
  onBack,
  isDark = false,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRestaurant, setActiveRestaurant] = useState(null);
  const [customizingItem, setCustomizingItem] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Dynamic API state
  const [categories, setCategories] = useState(FOOD_CATEGORIES);
  const [restaurants, setRestaurants] = useState(RESTAURANTS);

  // Fetch categories from API
  useEffect(() => {
    foodService.getCategories().then((cats) => {
      if (cats && cats.length > 0) {
        setCategories(cats);
      }
    });
  }, []);

  // Fetch restaurants dynamically from /api/restaurants
  useEffect(() => {
    let isMounted = true;
    foodService.getRestaurants({ category: selectedCategory, search: searchQuery }).then((data) => {
      if (isMounted && data) {
        setRestaurants(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [selectedCategory, searchQuery]);

  // If there's an ongoing delivery and user hasn't explicitly backed out to browse
  const [viewingTracker, setViewingTracker] = useState(activeFoodOrder && activeFoodOrder.status !== 'idle');

  const filteredRestaurants = restaurants;

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleAddToCart = (newItem) => {
    setCartItems(prev => {
      // Check if item from another restaurant, clear if so
      if (prev.length > 0 && prev[0].restaurant.id !== newItem.restaurant.id) {
        if (!confirm(`Your cart contains items from ${prev[0].restaurant.name}. Start a fresh basket with ${newItem.restaurant.name}?`)) {
          return prev;
        }
        return [newItem];
      }
      return [...prev, newItem];
    });
  };

  const handleUpdateQuantity = (id, newQty) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          quantity: newQty,
          totalPrice: item.unitPrice * newQty,
        };
      }
      return item;
    }));
  };

  const handleRemoveItem = (id) => {
    sounds.playTap();
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handlePlaceOrder = async (orderData) => {
    sounds.playSuccess();

    // 1. Insert into Supabase 'food_orders' table
    const supabaseResult = await insertFoodOrderToSupabase({
      items: orderData.items,
      restaurant: orderData.restaurant,
      subtotal: orderData.subtotal,
      vat: orderData.vat,
      deliveryFee: orderData.deliveryFee,
      discount: orderData.discount,
      grandTotal: orderData.grandTotal,
      paymentMethod: orderData.paymentMethod,
      status: 'preparing',
    });

    if (supabaseResult.success) {
      toast.success(
        `Order persisted to Supabase! (${orderData.items.length} items, Total: ৳${orderData.grandTotal})`,
        { title: 'Supabase Connected' }
      );
    } else if (supabaseResult.error) {
      toast.error(
        `${supabaseResult.message || supabaseResult.error.message}`,
        { title: 'Supabase Sync Notice' }
      );
    }

    // Deduct from wallet if wallet payment
    if (orderData.paymentMethod === 'Pathao Pay') {
      const deductRes = await walletService.deduct({
        amount: orderData.grandTotal,
        purpose: `Food Order from ${orderData.restaurant?.name || 'Restaurant'}`,
      });
      if (deductRes?.balance != null) {
        setWalletBalance(deductRes.balance);
      } else {
        setWalletBalance(prev => Math.max(0, prev - orderData.grandTotal));
      }
    }

    // Call dynamic backend API /api/orders/food
    const createdOrder = await foodService.placeOrder(orderData);

    setActiveFoodOrder({
      status: 'preparing',
      ...orderData,
      id: supabaseResult?.data?.[0]?.id || createdOrder?.id || `ord_${Date.now()}`,
    });
    setCartItems([]);
    setViewingTracker(true);
  };

  if (viewingTracker && activeFoodOrder && activeFoodOrder.status !== 'idle') {
    return (
      <FoodDeliveryTracker
        activeFoodOrder={activeFoodOrder}
        onBack={() => setViewingTracker(false)}
        onCompleteDelivery={() => {
          setActiveFoodOrder({ status: 'idle' });
          setViewingTracker(false);
        }}
        isDark={isDark}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-hidden select-none relative">
      {/* Top Search & Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 space-y-3 z-10 shrink-0">
        <div className="flex items-center gap-3">
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

          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Sultan's Dine, Chillox burgers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pathao-red"
            />
          </div>

          {/* Cart Icon Button */}
          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setIsCheckoutOpen(true);
            }}
            className="relative w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-pathao-red" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pathao-red text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Cuisine Category Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                sounds.playTap();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-pathao-red text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Ongoing Order Floating Chip (if exists) */}
      {activeFoodOrder && activeFoodOrder.status !== 'idle' && (
        <div
          onClick={() => {
            sounds.playTap();
            setViewingTracker(true);
          }}
          className="mx-4 mt-2 p-2.5 bg-amber-500 text-white rounded-xl flex items-center justify-between text-xs font-bold cursor-pointer shadow-md"
        >
          <span>Delivery in Progress: {activeFoodOrder.restaurant?.name}</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">Track Live</span>
        </div>
      )}

      {/* Restaurant Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Dhaka's Best Rated Restaurants
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            {filteredRestaurants.length} Places Nearby
          </span>
        </div>

        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onClick={(rest) => setActiveRestaurant(rest)}
          />
        ))}
      </div>

      {/* Modals */}
      <RestaurantDetailModal
        isOpen={Boolean(activeRestaurant)}
        onClose={() => setActiveRestaurant(null)}
        restaurant={activeRestaurant}
        onSelectItem={(item, rest) => setCustomizingItem({ item, restaurant: rest })}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      <ItemCustomizerSheet
        isOpen={Boolean(customizingItem)}
        onClose={() => setCustomizingItem(null)}
        item={customizingItem?.item}
        restaurant={customizingItem?.restaurant}
        onAddToCart={handleAddToCart}
      />

      <FoodCheckoutSheet
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onPlaceOrder={handlePlaceOrder}
        walletBalance={walletBalance}
        onTriggerBkash={onTriggerBkash}
      />
    </div>
  );
}
