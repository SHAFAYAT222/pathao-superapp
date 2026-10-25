import React, { useState, useEffect } from 'react';
import { PROMO_BANNERS } from '../../data/mockData';
import { Sparkles, ArrowRight } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function PromoCarousel({ onSelectBanner }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PROMO_BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const banner = PROMO_BANNERS[activeIndex];

  return (
    <div className="px-5 py-2 select-none">
      <div
        onClick={() => {
          sounds.playTap();
          onSelectBanner && onSelectBanner(banner.service);
        }}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${banner.gradient} text-white p-4 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl active:scale-99`}
      >
        {/* Background decorative shapes */}
        <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute right-12 top-2 w-16 h-16 rounded-full bg-white/5 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-24">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-300 fill-amber-300" />
              <span>{banner.badge}</span>
            </span>
            <div className="flex gap-1">
              {PROMO_BANNERS.map((_, idx) => (
                <div
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activeIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black tracking-tight drop-shadow-xs">
              {banner.title}
            </h3>
            <p className="text-[11px] text-white/90 font-medium leading-tight mt-0.5">
              {banner.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-bold text-white/80">
            <span>Explore offer</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
