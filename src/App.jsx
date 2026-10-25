import React, { useState, useEffect } from 'react';
import MobileContainer from './components/device/MobileContainer';
import Header from './components/dashboard/Header';
import ServiceGrid from './components/dashboard/ServiceGrid';
import PromoCarousel from './components/dashboard/PromoCarousel';
import RecentTrips from './components/dashboard/RecentTrips';
import ActiveOrderBanner from './components/dashboard/ActiveOrderBanner';
import BottomNav from './components/device/BottomNav';

// Service Modules
import RidesModule from './components/rides/RidesModule';
import FoodModule from './components/food/FoodModule';
import ParcelModule from './components/parcel/ParcelModule';
import WalletModule from './components/wallet/WalletModule';

// Common Modals
import LocationSelectorModal from './components/rides/LocationSelectorModal';
import NotificationsDrawer from './components/common/NotificationsDrawer';
import TopUpModal from './components/wallet/TopUpModal';
import BkashPaymentModal from './components/wallet/BkashPaymentModal';
import ProfileModal from './components/common/ProfileModal';
import ToastContainer from './components/common/Toast';

import { DHAKA_LOCATIONS } from './data/mockData';
import { sounds } from './utils/soundEffects';
import { walletService, ridesService } from './services';

export default function App() {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'rides' | 'food' | 'parcel' | 'wallet'
  const [frameMode, setFrameMode] = useState('iphone'); // 'iphone' | 'android' | 'full'
  const [isDark, setIsDark] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // User & Wallet Unified State (Fetched dynamically from /api/wallet/balance)
  const [walletBalance, setWalletBalance] = useState(1450);
  const [userProfile, setUserProfile] = useState({
    name: 'Tanvir Hasan',
    phone: '+880 1712-345678',
    badge: 'Platinum Club',
    rating: 4.95,
  });

  // Fetch initial wallet balance and user profile from API
  useEffect(() => {
    walletService.getBalance().then((data) => {
      if (data?.balance != null) {
        setWalletBalance(data.balance);
      }
      if (data?.user) {
        setUserProfile(data.user);
      }
    });
  }, []);

  // Location detected
  const [currentAddress, setCurrentAddress] = useState(DHAKA_LOCATIONS[0]); // Banani Rd 11

  // Cart State
  const [cartItems, setCartItems] = useState([]);

  // Active Services State Machines
  const [activeRide, setActiveRide] = useState({
    status: 'idle', // 'idle' | 'searching' | 'captain_found' | 'en_route' | 'completed'
    pickup: null,
    destination: null,
    vehicle: null,
    fare: 0,
    captain: null,
  });

  const [activeFoodOrder, setActiveFoodOrder] = useState({
    status: 'idle', // 'idle' | 'preparing' | 'picked_up' | 'arriving' | 'delivered'
    restaurant: null,
    items: [],
    grandTotal: 0,
  });

  const [activeParcel, setActiveParcel] = useState({
    status: 'idle', // 'idle' | 'courier_assigned' | 'in_transit' | 'delivered'
    sender: null,
    recipient: null,
    totalFare: 0,
    pickupOtp: '',
    deliveryOtp: '',
    courier: null,
  });

  // Global Modals State
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [bkashModalData, setBkashModalData] = useState(null); // { amount, purpose, onSuccess }

  // Quick Action Handlers
  const handleSelectService = (serviceType, subOption) => {
    sounds.playTap();
    setActiveTab(serviceType);
  };

  const handleTriggerBkash = ({ amount, purpose, onSuccess }) => {
    setBkashModalData({
      isOpen: true,
      amount,
      purpose,
      onSuccess: (amt) => {
        onSuccess && onSuccess(amt);
      }
    });
  };

  // Poll live backend status for active ride
  useEffect(() => {
    if (!activeRide?.id || activeRide.status === 'idle' || activeRide.status === 'completed' || activeRide.status === 'cancelled') {
      return;
    }

    const interval = setInterval(async () => {
      const live = await ridesService.getRideStatus(activeRide.id);
      if (live && live.status && live.status !== activeRide.status) {
        setActiveRide(prev => ({ ...prev, ...live }));
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [activeRide?.id, activeRide?.status]);

  const handleTopUpPayment = async ({ amount, method }) => {
    setIsTopUpOpen(false);
    if (method === 'bkash') {
      handleTriggerBkash({
        amount,
        purpose: 'Pathao Pay Wallet Top-Up',
        onSuccess: async (amt) => {
          const res = await walletService.topUp({ amount: amt, method: 'bKash MFS' });
          if (res?.balance != null) {
            setWalletBalance(res.balance);
          } else {
            setWalletBalance(prev => prev + amt);
          }
        }
      });
    } else {
      sounds.playCash();
      const res = await walletService.topUp({ amount, method: 'Credit/Debit Card' });
      if (res?.balance != null) {
        setWalletBalance(res.balance);
      } else {
        setWalletBalance(prev => prev + amount);
      }
      alert(`Card payment successful! ৳${amount} credited to your Pathao Pay wallet.`);
    }
  };

  const handleResetDemo = () => {
    sounds.playTap();
    setActiveRide({ status: 'idle', pickup: null, destination: null, vehicle: null, fare: 0, captain: null });
    setActiveFoodOrder({ status: 'idle', restaurant: null, items: [], grandTotal: 0 });
    setActiveParcel({ status: 'idle', sender: null, recipient: null, totalFare: 0, pickupOtp: '', deliveryOtp: '', courier: null });
    setCartItems([]);
    setWalletBalance(1450);
    setActiveTab('home');
  };

  const handleQuickAddWallet = async (amt = 1000) => {
    sounds.playCash();
    const res = await walletService.topUp({ amount: amt, method: 'Quick Top-Up' });
    if (res?.balance != null) {
      setWalletBalance(res.balance);
    } else {
      setWalletBalance(prev => prev + amt);
    }
  };

  return (
    <MobileContainer
      frameMode={frameMode}
      setFrameMode={setFrameMode}
      isDark={isDark}
      setIsDark={setIsDark}
      soundEnabled={soundEnabled}
      setSoundEnabled={setSoundEnabled}
      activeRide={activeRide}
      activeFoodOrder={activeFoodOrder}
      activeParcel={activeParcel}
      onExpandRide={() => setActiveTab('rides')}
      onExpandFood={() => setActiveTab('food')}
      onExpandParcel={() => setActiveTab('parcel')}
      onResetDemo={handleResetDemo}
      onQuickAddWallet={handleQuickAddWallet}
    >
      {/* Dynamic Tab Views */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        {/* Tab 1: Unified Super-App Shell Dashboard */}
        {activeTab === 'home' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
            {/* Header */}
            <Header
              userProfile={userProfile}
              currentAddress={currentAddress}
              walletBalance={walletBalance}
              onOpenLocationPicker={() => setIsLocationPickerOpen(true)}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onOpenTopUp={() => setIsTopUpOpen(true)}
              onOpenSearch={() => setActiveTab('rides')}
              onOpenProfile={() => setIsProfileOpen(true)}
            />

            {/* Promo Carousel */}
            <PromoCarousel onSelectBanner={(srv) => setActiveTab(srv)} />

            {/* Service Grid */}
            <ServiceGrid onSelectService={handleSelectService} />

            {/* Persistent Active Order Alert Banner if any active */}
            <ActiveOrderBanner
              activeRide={activeRide}
              activeFoodOrder={activeFoodOrder}
              activeParcel={activeParcel}
              onExpand={() => {
                if (activeRide.status !== 'idle') setActiveTab('rides');
                else if (activeFoodOrder.status !== 'idle') setActiveTab('food');
                else if (activeParcel.status !== 'idle') setActiveTab('parcel');
              }}
            />

            {/* Recent Trips Feed */}
            <RecentTrips
              onRebook={(trip) => {
                if (trip.type === 'food') setActiveTab('food');
                else setActiveTab('rides');
              }}
            />

            {/* Bottom spacer for clean scrolling */}
            <div className="h-6" />
          </div>
        )}

        {/* Tab 2: Pathao Rides Module */}
        {activeTab === 'rides' && (
          <RidesModule
            activeRide={activeRide}
            setActiveRide={setActiveRide}
            walletBalance={walletBalance}
            setWalletBalance={setWalletBalance}
            onBack={() => setActiveTab('home')}
            isDark={isDark}
          />
        )}

        {/* Tab 3: Pathao Food Module */}
        {activeTab === 'food' && (
          <FoodModule
            cartItems={cartItems}
            setCartItems={setCartItems}
            activeFoodOrder={activeFoodOrder}
            setActiveFoodOrder={setActiveFoodOrder}
            walletBalance={walletBalance}
            setWalletBalance={setWalletBalance}
            onTriggerBkash={handleTriggerBkash}
            onBack={() => setActiveTab('home')}
            isDark={isDark}
          />
        )}

        {/* Tab 4: Pathao Parcel Module */}
        {activeTab === 'parcel' && (
          <ParcelModule
            activeParcel={activeParcel}
            setActiveParcel={setActiveParcel}
            walletBalance={walletBalance}
            setWalletBalance={setWalletBalance}
            onBack={() => setActiveTab('home')}
          />
        )}

        {/* Tab 5: Pathao Pay Wallet Module */}
        {activeTab === 'wallet' && (
          <WalletModule
            walletBalance={walletBalance}
            onOpenTopUp={() => setIsTopUpOpen(true)}
            onBack={() => setActiveTab('home')}
            userProfile={userProfile}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation Bar (Persistent) */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartItems.reduce((s, i) => s + i.quantity, 0)}
        hasActiveRide={activeRide && activeRide.status !== 'idle' && activeRide.status !== 'completed'}
        isDark={isDark}
      />

      {/* Global Application Modals */}
      <LocationSelectorModal
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        pickup={currentAddress}
        destination={DHAKA_LOCATIONS[1]}
        onSelectPickup={setCurrentAddress}
        onSelectDestination={() => {}}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        currentBalance={walletBalance}
        onInitiatePayment={handleTopUpPayment}
      />

      <BkashPaymentModal
        isOpen={Boolean(bkashModalData?.isOpen)}
        onClose={() => setBkashModalData(null)}
        amount={bkashModalData?.amount || 0}
        purpose={bkashModalData?.purpose}
        onSuccess={bkashModalData?.onSuccess}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        walletBalance={walletBalance}
      />

      {/* Global Animated Toasts (Supabase feedback & Error Handling) */}
      <ToastContainer />
    </MobileContainer>
  );
}
