// Environment configuration reader for Pathao Super-App
// Safely reads and validates Vite import.meta.env variables with fallbacks

export const env = {
  // Base URL for the backend API
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',

  // Supabase credentials
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',

  // Mapbox / Google Maps API token
  mapboxToken: import.meta.env.VITE_MAPBOX_TOKEN || '',

  // Runtime flags
  isProduction: import.meta.env.PROD || false,
  isDevelopment: import.meta.env.DEV || false,
  mode: import.meta.env.MODE || 'development',
};

export default env;
