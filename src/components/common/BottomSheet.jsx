import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxHeight = 'max-h-[85vh]',
  showClose = true,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end overflow-hidden select-none">
      {/* Backdrop */}
      <div
        onClick={() => {
          sounds.playTap();
          onClose();
        }}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
      />

      {/* Sheet Modal Container */}
      <div
        className={`relative z-10 w-full bg-white dark:bg-slate-900 rounded-t-[28px] shadow-sheet border-t border-slate-100 dark:border-slate-800 ${maxHeight} flex flex-col animate-slide-up transition-transform duration-300 ease-out`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* iOS Pull Handle Bar */}
        <div className="w-full pt-3 pb-1 flex justify-center cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full" />
        </div>

        {/* Header */}
        {(title || showClose) && (
          <div className="px-5 py-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div>
              {title && (
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            {showClose && (
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  onClose();
                }}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-slate-700 dark:text-slate-200">
          {children}
        </div>

        {/* Sticky Footer */}
        {footer && (
          <div className="p-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
