// Toast notification event emitter
export const toastListeners = new Set();

export const toast = {
  show(toastData) {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast = {
      id,
      type: toastData.type || 'info', // 'success' | 'error' | 'loading' | 'info'
      title: toastData.title || '',
      message: toastData.message || '',
      duration: toastData.duration !== undefined ? toastData.duration : (toastData.type === 'error' ? 6000 : 3500),
    };

    toastListeners.forEach((listener) => listener(newToast));
    return id;
  },

  success(message, options = {}) {
    return toast.show({ type: 'success', message, title: options.title || 'Success', ...options });
  },

  error(message, options = {}) {
    return toast.show({ type: 'error', message, title: options.title || 'Supabase Error', ...options });
  },

  info(message, options = {}) {
    return toast.show({ type: 'info', message, title: options.title || 'Information', ...options });
  },

  loading(message, options = {}) {
    return toast.show({ type: 'loading', message, title: options.title || 'Syncing...', duration: 0, ...options });
  },
};

export default toast;
