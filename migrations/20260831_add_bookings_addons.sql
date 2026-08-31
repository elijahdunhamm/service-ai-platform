-- Adds a selected-add-ons column to the bookings table.
--
-- The booking flow writes `addons` (a newline- or comma-joined string of the
-- selected add-on names) when the column exists, and is written to tolerate its
-- absence (it retries the insert without image/address/addons so bookings still
-- save until this migration runs). Run this in the Supabase SQL editor / via
-- the CLI to persist selected add-ons for new bookings end-to-end.
alter table public.bookings
  add column if not exists addons text;
