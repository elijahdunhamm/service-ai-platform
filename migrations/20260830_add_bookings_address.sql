-- Adds a customer service-address column to the bookings table.
--
-- The booking flow writes `address` when the column exists and is written to
-- tolerate its absence (it retries the insert without address/image so bookings
-- still save until this migration runs). Run this in the Supabase SQL editor /
-- via the CLI to persist address for new bookings end-to-end.
alter table public.bookings
  add column if not exists address text;
