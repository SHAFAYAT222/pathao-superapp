import React, { useState, useEffect } from 'react';
import InteractiveDhakaMap from '../map/InteractiveDhakaMap';
import LocationSelectorModal from './LocationSelectorModal';
import VehicleSelectorCard from './VehicleSelectorCard';
import SearchingCaptainView from './SearchingCaptainView';
import CaptainEnRouteView from './CaptainEnRouteView';
import TripCompletedSheet from './TripCompletedSheet';
import ChatModal from '../common/ChatModal';
import SosModal from '../common/SosModal';
import { MOCK_CAPTAINS, DHAKA_LOCATIONS } from '../../data/mockData';
import { MapPin, Navigation, ArrowLeft } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import { ridesService, walletService } from '../../services';

export default function RidesModule({
  activeRide,
  setActiveRide,
  walletBalance,
  setWalletBalance,
  onBack,
  isDark = false,
}) {
  const [pickup, setPickup] = useState(DHAKA_LOCATIONS[0]); // Banani Rd 11
  const [destination, setDestination] = useState(DHAKA_LOCATIONS[1]); // Gulshan 2
  const [selectedVehicleId, setSelectedVehicleId] = useState('bike');
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.0);
  const [driverProgress, setDriverProgress] = useState(0);

  // Modals state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);

  // Auto driver movement when en_route
  useEffect(() => {
    let timer;
    if (activeRide.status === 'en_route') {
      timer = setInterval(() => {
        setDriverProgress((prev) => {
          if (prev >= 1) {
            clearInterval(timer);
            return 1;
          }
          return Math.min(1, prev + 0.05);
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeRide.status]);

  const handleBookRide = async (bookingData) => {
    sounds.playTap();
    setActiveRide({
      status: 'searching',
      pickup: bookingData.pickup,
      destination: bookingData.destination,
      vehicle: bookingData.vehicle,
      fare: bookingData.fare,
      captain: null,
    });

    const newRide = await ridesService.requestRide({
      pickup: bookingData.pickup,
      destination: bookingData.destination,
      vehicle: bookingData.vehicle,
      fare: bookingData.fare,
      paymentMethod: 'Pathao Pay',
    });

    if (newRide?.id) {
      setActiveRide((prev) => ({
        ...prev,
        id: newRide.id,
      }));
    }
  };

  const handleCaptainFound = () => {
    sounds.playSuccess();
    const assignedCaptain = selectedVehicleId === 'bike' ? MOCK_CAPTAINS[0] : MOCK_CAPTAINS[1];
    setActiveRide((prev) => ({
      ...prev,
      status: 'captain_found',
      captain: prev.captain || assignedCaptain,
    }));

    // Auto transition to en_route after 2 seconds
    setTimeout(() => {
      setActiveRide((prev) => ({
        ...prev,
        status: 'en_route',
      }));
    }, 2200);
  };

  const handleAdvanceTrip = () => {
    setDriverProgress((p) => Math.min(1, p + 0.25));
  };

  const handleCompleteTrip = async () => {
    sounds.playSuccess();
    const fare = activeRide.fare || 140;

    // Deduct fare via wallet API
    const deductRes = await walletService.deduct({
      amount: fare,
      purpose: `Pathao ${activeRide?.vehicle?.name || 'Ride'} Trip`,
    });

    if (deductRes?.balance != null) {
      setWalletBalance(deductRes.balance);
    } else {
      setWalletBalance((prev) => Math.max(0, prev - fare));
    }

    if (activeRide.id) {
      ridesService.completeRide(activeRide.id);
    }

    setActiveRide((prev) => ({
      ...prev,
      status: 'completed',
    }));
    setIsRatingOpen(true);
  };

  const handleFinishRating = () => {
    setActiveRide({
      status: 'idle',
      pickup: null,
      destination: null,
      vehicle: null,
      fare: 0,
      captain: null,
    });
    setDriverProgress(0);
  };

  const handleCancel = () => {
    sounds.playTap();
    if (activeRide.id) {
      ridesService.cancelRide(activeRide.id);
    }
    setActiveRide({
      status: 'idle',
      pickup: null,
      destination: null,
      vehicle: null,
      fare: 0,
      captain: null,
    });
    setDriverProgress(0);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 relative overflow-hidden select-none">
      {/* Top Floating Navigation Header */}
      <div className="absolute top-3 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        <button
          type="button"
          onClick={() => {
            sounds.playTap();
            onBack && onBack();
          }}
          className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-md flex items-center justify-center hover:bg-slate-50 active:scale-95 pointer-events-auto transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Compact Location Pill */}
        <div
          onClick={() => {
            if (activeRide.status === 'idle') {
              sounds.playTap();
              setIsLocationModalOpen(true);
            }
          }}
          className="flex-1 max-w-xs mx-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700 pointer-events-auto cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              {pickup?.name}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <MapPin className="w-3 h-3 text-pathao-red shrink-0" />
            <span className="text-xs font-black text-slate-900 dark:text-white truncate">
              {destination?.name}
            </span>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative min-h-[300px]">
        <InteractiveDhakaMap
          mode={activeRide.status === 'idle' ? 'browse' : activeRide.status}
          vehicleType={selectedVehicleId}
          pickup={pickup}
          destination={destination}
          driverProgress={driverProgress}
          theme={isDark ? 'dark' : 'light'}
        />
      </div>

      {/* Dynamic Bottom Controls Section */}
      <div className="relative z-20">
        {activeRide.status === 'idle' && (
          <VehicleSelectorCard
            selectedVehicleId={selectedVehicleId}
            onSelectVehicle={setSelectedVehicleId}
            pickup={pickup}
            destination={destination}
            surgeMultiplier={surgeMultiplier}
            onToggleSurge={() => setSurgeMultiplier((s) => (s === 1.0 ? 1.25 : 1.0))}
            onBookRide={handleBookRide}
            paymentMethod="wallet"
            walletBalance={walletBalance}
          />
        )}

        {activeRide.status === 'searching' && (
          <SearchingCaptainView
            rideBooking={activeRide}
            onCancel={handleCancel}
            onFoundCaptain={handleCaptainFound}
          />
        )}

        {(activeRide.status === 'captain_found' || activeRide.status === 'en_route') && (
          <CaptainEnRouteView
            rideBooking={activeRide}
            driverProgress={driverProgress}
            onOpenChat={() => setIsChatOpen(true)}
            onOpenCall={() => alert(`Calling captain ${activeRide.captain?.name} at ${activeRide.captain?.phone}`)}
            onOpenSos={() => setIsSosOpen(true)}
            onAdvanceTrip={handleAdvanceTrip}
            onCompleteTrip={handleCompleteTrip}
          />
        )}
      </div>

      {/* Modals */}
      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        pickup={pickup}
        destination={destination}
        onSelectPickup={setPickup}
        onSelectDestination={setDestination}
        onSwap={() => {
          const temp = pickup;
          setPickup(destination);
          setDestination(temp);
        }}
      />

      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        captain={activeRide.captain}
      />

      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        activeTripInfo={activeRide}
      />

      <TripCompletedSheet
        isOpen={isRatingOpen}
        onClose={() => setIsRatingOpen(false)}
        rideBooking={activeRide}
        onFinishRating={handleFinishRating}
      />
    </div>
  );
}
