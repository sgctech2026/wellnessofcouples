
ALTER TABLE public.orders
  DROP COLUMN IF EXISTS address,
  ADD COLUMN street_address text,
  ADD COLUMN province_code text,
  ADD COLUMN province_name text,
  ADD COLUMN city_code text,
  ADD COLUMN city_name text,
  ADD COLUMN barangay_code text,
  ADD COLUMN barangay_name text,
  ADD COLUMN country text DEFAULT 'Philippines';
