import { supabase } from '../lib/supabase';

export interface Booking {
  id: string;
  tenant_id: string;
  date: string;
  time_slot: string;
  customer_name: string;
  customer_email: string;
  service_type: string;
  estimated_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

export async function fetchBookings(): Promise<{ success: boolean; bookings?: Booking[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      return { success: false, error: error.message };
    }

    return { success: true, bookings: data as Booking[] };
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return { success: false, error: 'Failed to fetch bookings' };
  }
}

export async function updateBookingStatus(id: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled'): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating booking status:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating booking status:', error);
    return { success: false, error: 'Failed to update booking status' };
  }
}