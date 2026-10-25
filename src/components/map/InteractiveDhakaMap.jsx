import React, { useState, useEffect, useRef } from 'react';
import { Navigation, Compass, Layers, Plus, Minus, Shield, Zap } from 'lucide-react';

export default function InteractiveDhakaMap({
  mode = 'browse', // 'browse' | 'searching' | 'en_route' | 'destination'
  vehicleType = 'bike',
  pickup = { name: 'Banani Road 11', coords: { x: 380, y: 220 } },
  destination = { name: 'Gulshan 2 Circle', coords: { x: 440, y: 240 } },
  driverProgress = 0, // 0 to 1
  height = '100%',
  interactive = true,
  theme = 'light',
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [ambientDrivers, setAmbientDrivers] = useState([
    { id: 1, x: 350, y: 200, type: 'bike', angle: 45 },
    { id: 2, x: 410, y: 260, type: 'car', angle: 120 },
    { id: 3, x: 360, y: 310, type: 'bike', angle: 210 },
    { id: 4, x: 470, y: 190, type: 'bike', angle: 80 },
    { id: 5, x: 310, y: 240, type: 'car', angle: 15 },
  ]);

  // Jitter ambient drivers slightly to give living city feel
  useEffect(() => {
    const interval = setInterval(() => {
      setAmbientDrivers(prev =>
        prev.map(d => ({
          ...d,
          x: d.x + (Math.random() - 0.5) * 3,
          y: d.y + (Math.random() - 0.5) * 3,
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Compute curved polyline between pickup and destination
  const pX = pickup?.coords?.x || 380;
  const pY = pickup?.coords?.y || 220;
  const dX = destination?.coords?.x || 440;
  const dY = destination?.coords?.y || 240;

  // Realistic city road waypoints via intersections
  const midX1 = pX + (dX - pX) * 0.4 + 25;
  const midY1 = pY + (dY - pY) * 0.2 - 15;
  const midX2 = pX + (dX - pX) * 0.75 - 10;
  const midY2 = pY + (dY - pY) * 0.8 + 20;

  const pathD = `M ${pX} ${pY} Q ${midX1} ${midY1}, ${(pX + dX) / 2} ${(pY + dY) / 2} T ${dX} ${dY}`;

  // Calculate position along curve based on progress
  const getCurvePoint = (t) => {
    // Quadratic Bezier approximation for silky smooth movement
    const cpX = (pX + dX) / 2 + 15;
    const cpY = (pY + dY) / 2 - 25;
    const x = (1 - t) * (1 - t) * pX + 2 * (1 - t) * t * cpX + t * t * dX;
    const y = (1 - t) * (1 - t) * pY + 2 * (1 - t) * t * cpY + t * t * dY;
    
    // Tangent angle
    const dx = 2 * (1 - t) * (cpX - pX) + 2 * t * (dX - cpX);
    const dy = 2 * (1 - t) * (cpY - pY) + 2 * t * (dY - cpY);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    return { x, y, angle };
  };

  const currentPos = getCurvePoint(Math.min(0.99, Math.max(0.01, driverProgress)));

  const handleMouseDown = (e) => {
    if (!interactive) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetCenter = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  const isDark = theme === 'dark';

  return (
    <div
      className="relative w-full overflow-hidden select-none cursor-grab active:cursor-grabbing transition-colors duration-300"
      style={{ height }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* SVG Vector Map Container */}
      <svg
        viewBox="100 50 500 550"
        className="w-full h-full object-cover transition-transform duration-100 ease-out"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
        }}
      >
        <defs>
          {/* Hatirjheel / Gulshan Lake Water Gradient */}
          <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#0e3a53' : '#b2e2f8'} />
            <stop offset="100%" stopColor={isDark ? '#062031' : '#88d1f2'} />
          </linearGradient>

          {/* Park Green Gradient */}
          <linearGradient id="parkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? '#143828' : '#dcfce7'} />
            <stop offset="100%" stopColor={isDark ? '#0e291d' : '#bbf7d0'} />
          </linearGradient>

          {/* Route Active Glow */}
          <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EE2A24" />
            <stop offset="100%" stopColor="#FF6B66" />
          </linearGradient>

          {/* Marker Drop Shadow */}
          <filter id="markerShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* 1. Parks / Green Spaces */}
        <path
          d="M 160 300 Q 200 280, 240 330 T 210 390 Q 150 370, 160 300 Z"
          fill="url(#parkGrad)"
          opacity="0.8"
        />
        <path
          d="M 430 110 Q 480 100, 490 150 T 440 180 Q 410 140, 430 110 Z"
          fill="url(#parkGrad)"
          opacity="0.7"
        />
        <rect x="290" y="440" width="70" height="60" rx="12" fill="url(#parkGrad)" opacity="0.6" />

        {/* 2. Water Bodies (Gulshan Lake & Hatirjheel representation) */}
        {/* Gulshan Lake */}
        <path
          d="M 460 140 Q 430 200, 450 280 T 430 360 Q 410 400, 420 440 L 440 440 Q 430 390, 465 350 T 475 220 Z"
          fill="url(#waterGrad)"
        />
        {/* Hatirjheel Lake curving through central Dhaka */}
        <path
          d="M 330 340 Q 380 325, 420 350 T 480 380 Q 410 420, 360 390 Z"
          fill="url(#waterGrad)"
        />
        {/* Dhanmondi Lake */}
        <path
          d="M 230 400 Q 250 430, 240 470 T 260 520 Q 240 530, 220 480 Z"
          fill="url(#waterGrad)"
          opacity="0.85"
        />

        {/* 3. Secondary City Road Grid */}
        <g stroke={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          {/* East-West roads */}
          <line x1="120" y1="140" x2="580" y2="140" />
          <line x1="100" y1="220" x2="580" y2="220" />
          <line x1="120" y1="290" x2="580" y2="290" />
          <line x1="110" y1="380" x2="580" y2="380" />
          <line x1="140" y1="460" x2="580" y2="460" />
          <line x1="160" y1="530" x2="580" y2="530" />

          {/* North-South avenues */}
          <line x1="180" y1="80" x2="180" y2="580" />
          <line x1="260" y1="80" x2="260" y2="580" />
          <line x1="330" y1="80" x2="330" y2="580" />
          <line x1="400" y1="80" x2="400" y2="580" />
          <line x1="480" y1="80" x2="480" y2="580" />
          <line x1="550" y1="80" x2="550" y2="580" />
        </g>

        {/* 4. Primary Arteries & Highways (Kemal Ataturk, Airport Rd, Mohakhali Flyover) */}
        <g stroke={isDark ? '#334155' : '#cbd5e1'} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
          {/* Airport Rd -> Mohakhali Expressway */}
          <path d="M 390 70 L 380 180 L 360 300 L 350 420 L 370 570" />
          {/* Kemal Ataturk Ave (Banani 11 -> Gulshan 2) */}
          <path d="M 240 220 L 380 220 L 460 225 L 560 230" />
          {/* Pragati Sarani */}
          <path d="M 520 90 L 510 230 L 490 390 L 500 560" />
          {/* Mirpur Road */}
          <path d="M 230 100 L 250 260 L 260 410 L 270 560" />
        </g>

        {/* Inner highway lanes */}
        <g stroke={isDark ? '#475569' : '#ffffff'} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 390 70 L 380 180 L 360 300 L 350 420 L 370 570" />
          <path d="M 240 220 L 380 220 L 460 225 L 560 230" />
          <path d="M 520 90 L 510 230 L 490 390 L 500 560" />
          <path d="M 230 100 L 250 260 L 260 410 L 270 560" />
        </g>

        {/* Highway center dash marks */}
        <path
          d="M 390 70 L 380 180 L 360 300 L 350 420 L 370 570"
          stroke={isDark ? '#64748b' : '#e2e8f0'}
          strokeWidth="1.5"
          strokeDasharray="6 6"
        />

        {/* 5. City Landmark Labels */}
        <g className="font-semibold select-none text-[10px]" fill={isDark ? '#94a3b8' : '#64748b'}>
          <text x="365" y="210" textAnchor="middle">Banani Rd 11</text>
          <text x="475" y="248" textAnchor="middle">Gulshan-2 Circle</text>
          <text x="350" y="325" textAnchor="middle">Mohakhali Hub</text>
          <text x="235" y="435" textAnchor="middle">Dhanmondi 27</text>
          <text x="410" y="105" textAnchor="middle">Shahjalal Airport</text>
          <text x="495" y="170" textAnchor="middle">Bashundhara</text>
        </g>

        {/* 6. Ambient Active Drivers (City Life) */}
        {ambientDrivers.map((d) => (
          <g key={d.id} transform={`translate(${d.x}, ${d.y}) rotate(${d.angle})`}>
            <circle r="7" fill={isDark ? '#1e293b' : '#ffffff'} filter="url(#markerShadow)" />
            {d.type === 'bike' ? (
              <circle r="4" fill="#EE2A24" />
            ) : (
              <rect x="-4" y="-3" width="8" height="6" rx="1.5" fill="#2563EB" />
            )}
          </g>
        ))}

        {/* 7. Active Trip Route (if searching, en route, or booked) */}
        {(mode === 'en_route' || mode === 'searching' || mode === 'destination') && (
          <>
            {/* Route Outer Casing */}
            <path
              d={pathD}
              fill="none"
              stroke="#B91C1C"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.3"
            />
            {/* Route Inner Glowing Track */}
            <path
              d={pathD}
              fill="none"
              stroke="url(#routeGlow)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Animated Flow Dashes */}
            <path
              d={pathD}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
              className="route-flow"
              opacity="0.8"
            />
          </>
        )}

        {/* 8. Pickup Location Pin & Pulsing Wave */}
        <g transform={`translate(${pX}, ${pY})`} filter="url(#markerShadow)">
          {/* Outer Radar Rings when searching */}
          {mode === 'searching' && (
            <>
              <circle r="40" fill="none" stroke="#EE2A24" strokeWidth="2" opacity="0.2" className="animate-radar-1" />
              <circle r="40" fill="none" stroke="#EE2A24" strokeWidth="2" opacity="0.2" className="animate-radar-2" />
              <circle r="40" fill="none" stroke="#EE2A24" strokeWidth="2" opacity="0.2" className="animate-radar-3" />
            </>
          )}

          {/* Pickup Pin */}
          <circle r="12" fill="#10B981" />
          <circle r="5" fill="#FFFFFF" />
          <path d="M 0 12 L 0 20" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
          {/* Pickup Label */}
          <rect x="-44" y="-32" width="88" height="20" rx="10" fill="#10B981" />
          <text x="0" y="-18" fill="#FFFFFF" fontSize="9" fontWeight="700" textAnchor="middle">
            PICKUP HERE
          </text>
        </g>

        {/* 9. Destination Location Pin */}
        <g transform={`translate(${dX}, ${dY})`} filter="url(#markerShadow)">
          <circle r="12" fill="#EE2A24" />
          <path d="M -4 -4 L 4 4 M 4 -4 L -4 4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <path d="M 0 12 L 0 20" stroke="#EE2A24" strokeWidth="3" strokeLinecap="round" />
          {/* Dest Label */}
          <rect x="-42" y="-32" width="84" height="20" rx="10" fill="#EE2A24" />
          <text x="0" y="-18" fill="#FFFFFF" fontSize="9" fontWeight="700" textAnchor="middle">
            DROP-OFF
          </text>
        </g>

        {/* 10. Live Captain Marker moving along route */}
        {mode === 'en_route' && (
          <g
            transform={`translate(${currentPos.x}, ${currentPos.y})`}
            filter="url(#markerShadow)"
            className="transition-transform duration-75"
          >
            {/* Wave ring around moving captain */}
            <circle r="18" fill="#EE2A24" opacity="0.2" className="animate-ping" />
            
            {/* Captain Vehicle Badge */}
            <circle r="14" fill="#EE2A24" />
            <circle r="12" fill="#FFFFFF" />

            {/* Rotated Vehicle Symbol */}
            <g transform={`rotate(${currentPos.angle})`}>
              {vehicleType === 'bike' ? (
                // Motorcycle SVG Silhouette
                <g fill="#EE2A24" transform="scale(0.7) translate(-12, -12)">
                  <circle cx="6" cy="18" r="4" />
                  <circle cx="18" cy="18" r="4" />
                  <path d="M6 18 L10 10 L15 10 L18 18 M10 10 L14 14 L18 14" stroke="#EE2A24" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <circle cx="12" cy="7" r="2.2" />
                </g>
              ) : (
                // Car SVG Silhouette
                <g fill="#2563EB" transform="scale(0.7) translate(-12, -12)">
                  <path d="M 5 9 L 8 4 L 16 4 L 19 9 L 20 15 L 4 15 Z" />
                  <circle cx="7" cy="16" r="2.5" fill="#111" />
                  <circle cx="17" cy="16" r="2.5" fill="#111" />
                  <rect x="7" y="6" width="10" height="4" rx="1" fill="#FFFFFF" />
                </g>
              )}
            </g>

            {/* ETA Speech Bubble over Captain */}
            <rect x="-35" y="-34" width="70" height="18" rx="9" fill="#1E2022" />
            <polygon points="-4,-16 4,-16 0,-12" fill="#1E2022" />
            <text x="0" y="-22" fill="#FFFFFF" fontSize="8" fontWeight="800" textAnchor="middle">
              {Math.max(1, Math.round((1 - driverProgress) * 7))} MINS ETA
            </text>
          </g>
        )}
      </svg>

      {/* Map Floating HUD Overlays */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-sm text-xs font-semibold text-slate-700 dark:text-slate-200 pointer-events-auto">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Dhaka Live Grid</span>
        <span className="text-[10px] text-slate-400">| 18°C</span>
      </div>

      {/* Map Control Buttons: Zoom, Recenter, Traffic */}
      <div className="absolute right-3 bottom-4 flex flex-col gap-2 pointer-events-auto">
        <button
          type="button"
          onClick={resetCenter}
          title="Recenter Map"
          className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all"
        >
          <Navigation className="w-4 h-4 text-pathao-red" />
        </button>
        <div className="flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden divide-y divide-slate-100 dark:divide-slate-700">
          <button
            type="button"
            onClick={() => setZoom(z => Math.min(2.0, z + 0.2))}
            title="Zoom In"
            className="w-9 h-9 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 active:bg-slate-100"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(z => Math.max(0.7, z - 0.2))}
            title="Zoom Out"
            className="w-9 h-9 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 active:bg-slate-100"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
