process.env.NODE_ENV = 'test';
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import app from '../server/index.js';

let server;
let baseUrl;

describe('Pathao Super-App Multi-Service API Test Suite', () => {
  before(async () => {
    // Start test server on dynamic free port
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server?.closeAllConnections) {
      server.closeAllConnections();
    }
    await new Promise((resolve) => server.close(resolve));
  });

  test('GET /api/health should return healthy status', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.status, 'healthy');
  });

  test('POST /api/rides/request & GET /api/rides/:id/status (Dispatch Worker)', async () => {
    const ridePayload = {
      pickup: { id: 'loc-1', name: 'Banani 11' },
      destination: { id: 'loc-2', name: 'Gulshan 2' },
      vehicle: { id: 'bike', name: 'Pathao Bike' },
      fare: 135,
    };

    const res = await fetch(`${baseUrl}/api/rides/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ridePayload),
    });

    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.ride.id, 'Ride should have an ID');
    assert.strictEqual(body.ride.status, 'searching');

    // Query status
    const statusRes = await fetch(`${baseUrl}/api/rides/${body.ride.id}/status`);
    assert.strictEqual(statusRes.status, 200);
    const statusBody = await statusRes.json();
    assert.strictEqual(statusBody.ride.id, body.ride.id);
  });

  test('GET /api/restaurants & GET /api/restaurants/:id/menu', async () => {
    const res = await fetch(`${baseUrl}/api/restaurants`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(Array.isArray(body.restaurants));
    assert.ok(body.restaurants.length > 0);

    const firstRestId = body.restaurants[0].id;
    const menuRes = await fetch(`${baseUrl}/api/restaurants/${firstRestId}/menu`);
    assert.strictEqual(menuRes.status, 200);
    const menuBody = await menuRes.json();
    assert.strictEqual(menuBody.success, true);
    assert.ok(Array.isArray(menuBody.menu));
    assert.ok(menuBody.menu.length > 0);
  });

  test('POST /api/orders/food computes VAT, delivery fees, and persists order', async () => {
    const orderPayload = {
      items: [
        { id: 'item-1', name: 'Kacchi Biryani', totalPrice: 500, quantity: 1 },
        { id: 'item-2', name: 'Borhani', totalPrice: 100, quantity: 1 },
      ],
      restaurantId: 'rest-1',
      paymentMethod: 'Pathao Pay',
      discount: 50,
    };

    const res = await fetch(`${baseUrl}/api/orders/food`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });

    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.order.subtotal, 600);
    assert.strictEqual(body.order.vat, 30); // 5% of 600
    assert.strictEqual(body.order.deliveryFee, 40);
    // grandTotal = 600 + 30 + 40 - 50 = 620
    assert.strictEqual(body.order.grandTotal, 620);
    assert.strictEqual(body.order.status, 'preparing');
  });

  test('POST /api/parcels/create generates 4-digit verification OTPs', async () => {
    const parcelPayload = {
      sender: { name: 'Tanvir', phone: '+8801712000000', address: 'Banani' },
      recipient: { name: 'Nazmul', phone: '+8801819000000', address: 'Dhanmondi' },
      category: { id: 'electronic', name: 'Electronics', price: 120 },
      weightKg: 2,
    };

    const res = await fetch(`${baseUrl}/api/parcels/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parcelPayload),
    });

    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.parcel.pickupOtp, 'Pickup OTP generated');
    assert.ok(body.parcel.deliveryOtp, 'Delivery OTP generated');
    assert.strictEqual(body.parcel.pickupOtp.length, 4, 'Pickup OTP must be 4 digits');
    assert.strictEqual(body.parcel.deliveryOtp.length, 4, 'Delivery OTP must be 4 digits');
    // Fare: 120 base + (2-1)*25 = 145
    assert.strictEqual(body.parcel.totalFare, 145);
  });

  test('POST /api/wallet/topup & GET /api/wallet/balance', async () => {
    const initialRes = await fetch(`${baseUrl}/api/wallet/balance`);
    const initialBody = await initialRes.json();
    const currentBalance = initialBody.balance;

    const topupRes = await fetch(`${baseUrl}/api/wallet/topup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 500, method: 'bKash MFS' }),
    });

    assert.strictEqual(topupRes.status, 200);
    const topupBody = await topupRes.json();
    assert.strictEqual(topupBody.success, true);
    assert.strictEqual(topupBody.balance, currentBalance + 500);

    const balanceRes = await fetch(`${baseUrl}/api/wallet/balance`);
    const balanceBody = await balanceRes.json();
    assert.strictEqual(balanceBody.balance, currentBalance + 500);
  });
});
