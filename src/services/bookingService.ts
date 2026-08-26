import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface BookingData {
  tenantId: string;
  date: string;
  timeSlot: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
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
  customerPhone?: string;
  serviceType: string;
  estimatedPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export async function checkAvailability(tenantId: string, date: string, timeSlot: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    console.error('Supabase Error: not configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). Cannot check availability.');
    return true;
  }
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('booking_date', date)
      .eq('booking_time', timeSlot)
      .neq('status', 'cancelled')
      .maybeSingle();

    if (error) {
      console.error('Supabase Error:', error);
      return false;
    }

    // No existing active booking for that slot => available
    return !data;
  } catch (error) {
    console.error('Supabase Error:', error);
    return false;
  }
}

export async function createBooking(bookingData: BookingData): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    console.error('Supabase Error: not configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). Cannot save booking.');
    return { success: false, error: 'Supabase is not configured. Booking was not saved.' };
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        tenant_id: bookingData.tenantId,
        booking_date: bookingData.date,
        booking_time: bookingData.timeSlot,
        customer_name: bookingData.customerName,
        customer_email: bookingData.customerEmail,
        customer_phone: bookingData.customerPhone ?? null,
        service_type: bookingData.serviceType,
        price: bookingData.estimatedPrice,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase Error:', error);
      return { success: false, error: error.message };
    }

    // Map DB row -> app-shaped Booking so the UI contract stays stable.
    const row = data as Record<string, unknown>;
    const booking: Booking = {
      id: String(row.id),
      tenantId: String(row.tenant_id),
      date: String(row.booking_date),
      timeSlot: String(row.booking_time),
      customerName: String(row.customer_name),
      customerEmail: String(row.customer_email),
      customerPhone: row.customer_phone ? String(row.customer_phone) : undefined,
      serviceType: String(row.service_type),
      estimatedPrice: Number(row.price),
      status: (row.status as Booking['status']) ?? 'pending',
      createdAt: String(row.created_at),
    };

    return { success: true, booking };
  } catch (error) {
    console.error('Supabase Error:', error);
    return { success: false, error: 'Failed to create booking' };
  }
}
