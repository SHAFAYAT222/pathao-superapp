-- =============================================================================
-- Pathao Super-App Supabase Database Schema
-- Paste this script into your Supabase Dashboard SQL Editor:
-- https://supabase.com/dashboard/project/fkfvzxlabviobjjulefa/sql/new
-- =============================================================================

-- 1. Create 'rides' table
CREATE TABLE IF NOT EXISTS public.rides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pickup_address TEXT NOT NULL,
    dropoff_address TEXT NOT NULL,
    pickup_coords JSONB,
    dropoff_coords JSONB,
    vehicle_type TEXT NOT NULL DEFAULT 'bike',
    fare NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'searching',
    payment_method TEXT DEFAULT 'Pathao Pay',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create 'food_orders' table
CREATE TABLE IF NOT EXISTS public.food_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_name TEXT NOT NULL,
    restaurant_id TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    vat NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 40.00,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    grand_total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_method TEXT DEFAULT 'Pathao Pay',
    status TEXT NOT NULL DEFAULT 'preparing',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_orders ENABLE ROW LEVEL SECURITY;

-- 4. Create Public/Anon Policies (Allows prototype to insert and read)
DROP POLICY IF EXISTS "Allow anon insert to rides" ON public.rides;
CREATE POLICY "Allow anon insert to rides"
    ON public.rides
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon select to rides" ON public.rides;
CREATE POLICY "Allow anon select to rides"
    ON public.rides
    FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Allow anon insert to food_orders" ON public.food_orders;
CREATE POLICY "Allow anon insert to food_orders"
    ON public.food_orders
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon select to food_orders" ON public.food_orders;
CREATE POLICY "Allow anon select to food_orders"
    ON public.food_orders
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 5. Realtime publication (Optional: enables live subscriptions)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'rides'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.rides;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'food_orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.food_orders;
  END IF;
END $$;
