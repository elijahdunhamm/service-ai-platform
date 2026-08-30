import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface Booking {
  id: string;
  tenant_id: string;
  booking_date: string;
  booking_time: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  service_type: string;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  /**
   * Public Storage URL of the customer's uploaded media (photo or video) in the
   * `clientimages` bucket, set by the booking flow's createBooking insert. Only
   * present when the upload succeeded.
   */
  image_url?: string;
  /** Customer's service address (street line), stored when the column exists. */
  address?: string;
}

/**
 * Fetch bookings. When `tenantId` is provided the query is scoped with
 * `.eq('tenant_id', tenantId)` so each tenant admin sees ONLY its own bookings.
 * Passing no `tenantId` returns all rows (backward-compatible with the original
 * unfiltered behavior).
 */
export async function fetchBookings(tenantId?: string): Promise<{ success: boolean; bookings?: Booking[]; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    console.error('Supabase Error: not configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). Cannot fetch bookings.');
    return { success: true, bookings: [], error: undefined };
  }

  try {
    let query = supabase.from('bookings').select('*');

    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, bookings: data as Booking[] };
  } catch (error) {
    console.error('Supabase Error:', error);
    return { success: false, error: 'Failed to fetch bookings' };
  }
}

export async function updateBookingStatus(id: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled'): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    console.error('Supabase Error: not configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). Cannot update booking status.');
    return { success: false, error: 'Supabase is not configured. Status not updated.' };
  }

  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Supabase Error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Supabase Error:', error);
    return { success: false, error: 'Failed to update booking status' };
  }
}
export async function deleteBooking(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    console.error('Supabase Error: not configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). Cannot delete booking.');
    return { success: false, error: 'Supabase is not configured. Booking not deleted.' };
  }
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Supabase Error:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error) {
    console.error('Supabase Error:', error);
    return { success: false, error: 'Failed to delete booking' };
  }
}
