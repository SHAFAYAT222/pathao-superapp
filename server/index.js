import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

// Load environment variables from .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route handlers
import ridesRouter from './routes/rides.js';
import restaurantsRouter from './routes/restaurants.js';
import ordersRouter from './routes/orders.js';
import parcelsRouter from './routes/parcels.js';
import walletRouter from './routes/wallet.js';

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

// Global Middleware
const allowedOrigin = process.env.CORS_ORIGIN || '*';
app.use(
  cors({
    origin: allowedOrigin === '*' ? true : allowedOrigin.split(','),
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (!isProd) {
  app.use((req, _res, next) => {
    console.log(`[API] ${req.method} ${req.url}`);
    next();
  });
}

// Health Check Endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'Pathao Super-App Backend API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Mount Core Super-App Service Routers
app.use('/api/rides', ridesRouter);
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/parcels', parcelsRouter);
app.use('/api/wallet', walletRouter);

// Serve Frontend Static Assets in Production if dist directory exists
const distPath = path.resolve(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // Catch-all fallback for client-side SPA routing (Express 4 & 5 compatible)
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    return next();
  });
}

// 404 handler for API routes
app.use('/api', (_req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
  });
});

// Global Error Handler
app.use((err, _req, res, _next) => {
  console.error('[API Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error occurred',
  });
});

// Start Express Server only when run directly as main entry point
let server = null;
const isMainModule = process.argv[1] && /server[/\\]index\.js$/.test(process.argv[1]);

if (isMainModule) {
  server = app.listen(PORT, () => {
    console.log(`🚀 Pathao Super-App API Server running on port ${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health`);
    console.log(`   Rides API:    http://localhost:${PORT}/api/rides`);
    console.log(`   Food API:     http://localhost:${PORT}/api/restaurants`);
    console.log(`   Orders API:   http://localhost:${PORT}/api/orders`);
    console.log(`   Parcels API:  http://localhost:${PORT}/api/parcels`);
    console.log(`   Wallet API:   http://localhost:${PORT}/api/wallet`);
  });
}

export { server };
export default app;
