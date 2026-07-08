
-- Add landmark column
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS landmark text;

-- Drop the existing "all" policy and recreate as explicit INSERT
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can insert orders" ON public.orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
