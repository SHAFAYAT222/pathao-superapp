import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Loader2, Info, X } from 'lucide-react';
import { toastListeners } from '../../utils/toast';

/**
 * ToastContainer renders floating notifications on top of the mobile device view
 */
export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleNewToast = (item) => {
      setToasts((prev) => [...prev, item]);

      if (item.duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== item.id));
        }, item.duration);
      }
    };

    toastListeners.add(handleNewToast);
    return () => toastListeners.delete(handleNewToast);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="absolute top-12 left-3 right-3 z-50 flex flex-col gap-2 pointer-events-none select-none">
      {toasts.map((t) => {
        const isError = t.type === 'error';
        const isSuccess = t.type === 'success';
        const isLoading = t.type === 'loading';

        return (
          <div
            key={t.id}
            className={`pointer-events-auto p-3 rounded-2xl shadow-xl border backdrop-blur-md flex items-start gap-2.5 transition-all animate-slide-down ${
              isError
                ? 'bg-red-950/90 border-red-500/40 text-red-100 shadow-red-950/50'
                : isSuccess
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100 shadow-emerald-950/50'
                : isLoading
                ? 'bg-slate-900/90 border-amber-500/40 text-amber-100 shadow-slate-950/50'
                : 'bg-slate-900/90 border-slate-700 text-white'
            }`}
          >
            {/* Status Icon */}
            <div className="shrink-0 mt-0.5">
              {isError && <AlertCircle className="w-5 h-5 text-red-400" />}
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isLoading && <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />}
              {!isError && !isSuccess && !isLoading && <Info className="w-5 h-5 text-blue-400" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-1">
              {t.title && (
                <h4 className="text-xs font-black tracking-tight leading-snug">
                  {t.title}
                </h4>
              )}
              <p className="text-[11px] leading-relaxed opacity-90 break-words mt-0.5 font-medium">
                {t.message}
              </p>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="shrink-0 p-1 rounded-lg hover:bg-white/10 active:scale-90 transition-all opacity-70 hover:opacity-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
