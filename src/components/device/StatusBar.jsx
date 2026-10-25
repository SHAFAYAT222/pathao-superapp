import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Sparkles } from 'lucide-react';

export default function StatusBar({ isDark = false }) {
  const [time, setTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const mins = now.getMinutes();
      const formatted = `${hours % 12 || 12}:${mins < 10 ? '0' : ''}${mins}`;
      setTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`h-11 px-7 pt-2 flex items-center justify-between text-xs font-semibold select-none z-40 transition-colors ${
        isDark ? 'text-white' : 'text-slate-900'
      }`}
    >
      {/* Time */}
      <span className="tracking-tight font-medium text-[13px]">{time}</span>

      {/* Right icons: 5G, Wi-Fi, Battery */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] tracking-tighter font-extrabold uppercase bg-slate-200/50 dark:bg-slate-700/50 px-1 rounded text-slate-700 dark:text-slate-300">
          5G
        </span>
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono">98%</span>
          <div className="w-5 h-2.5 rounded-sm border border-current p-0.5 flex items-center">
            <div className="w-full h-full bg-current rounded-2xs" />
          </div>
        </div>
      </div>
    </div>
  );
}
