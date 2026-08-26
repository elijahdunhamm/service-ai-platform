import { supabase } from '../lib/supabase';

export interface BookingData {
  tenantId: string;
  date: string;
  timeSlot: string;
  customerName: string;
  customerEmail: string;
  serviceType: string;
  estimatedPrice: number;
}

export interface Booking {
  id: string;
  tenantId: string;
  date: string;
  timeSlot: string;
  customerName: string;
  customerEmail: string;
  serviceType: string;
  estimatedPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export async function checkAvailability(tenantId: string, date: string, timeSlot: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('date', date)
      .eq('time_slot', timeSlot)
      .neq('status', 'cancelled')
      .single();

    if (error) {
      // If no exact match found, treat as available
      if (error.code === 'PGRST116') {
        return true;
      }
      console.error('Error checking availability:', error);
      return false;
    }

    return !data; // Return false if booking exists, true if available
  } catch (error) {
    console.error('Error checking availability:', error);
    return false;
  }
}

export async function createBooking(bookingData: BookingData): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        tenant_id: bookingData.tenantId,
        date: bookingData.date,
        time_slot: bookingData.timeSlot,
        customer_name: bookingData.customerName,
        customer_email: bookingData.customerEmail,
        service_type: bookingData.serviceType,
        estimated_price: bookingData.estimatedPrice,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      return { success: false, error: error.message };
    }

    return { success: true, booking: data as Booking };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { success: false, error: 'Failed to create booking' };
  }
}