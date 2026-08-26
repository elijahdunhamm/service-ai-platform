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
}

export async function fetchBookings(): Promise<{ success: boolean; bookings?: Booking[]; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    console.error('Supabase Error: not configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). Cannot fetch bookings.');
    return { success: true, bookings: [], error: undefined };
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

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
