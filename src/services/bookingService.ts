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
  /** Public URL / path of a customer-uploaded image, when the upload succeeds. */
  imageUrl?: string;
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
  imageUrl?: string;
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

/**
 * Upload a booking image to Supabase Storage ("bookings" bucket) and return its
 * public URL. Defensive: every failure is swallowed and surfaced as a message
 * so the caller can still complete the booking without crashing.
 */
export async function uploadBookingImage(
  file: File
): Promise<{ url?: string; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      error:
        'Image upload is unavailable (Supabase not configured). Your booking can still be saved without the photo.',
    };
  }
  try {
    // Keep a safe, unique object key.
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_') || 'photo';
    const path = `bookings/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from('bookings')
      .upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) {
      console.error('Supabase Storage Error:', uploadError);
      return {
        error:
          'Your photo could not be uploaded right now. Your booking can still be saved without it.',
      };
    }
    const { data } = supabase.storage.from('bookings').getPublicUrl(path);
    return { url: data.publicUrl };
  } catch (error) {
    console.error('Supabase Storage Error:', error);
    return {
      error:
        'Your photo could not be uploaded right now. Your booking can still be saved without it.',
    };
  }
}

export async function createBooking(bookingData: BookingData): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    console.error('Supabase Error: not configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). Cannot save booking.');
    return { success: false, error: 'Supabase is not configured. Booking was not saved.' };
  }

  const client = supabase;
  try {
    const basePayload = {
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
    };

    const insertRow = (payload: Record<string, unknown>) =>
      client.from('bookings').insert(payload).select().single();

    let { data, error } = await insertRow({
      ...basePayload,
      // Only try to write the image column when an upload succeeded. If the
      // table lacks the column the insert will fail, so we retry below without
      // the image to keep the booking itself intact.
      ...(bookingData.imageUrl ? { image_url: bookingData.imageUrl } : {}),
    });

    // Defensive fallback: the "bookings" table may not have an image column yet
    // (it cannot be altered from the client). Retry without image_url so the
    // booking still saves.
    if (error && bookingData.imageUrl) {
      console.error('Supabase Error (image insert, retrying without image):', error.message);
      ({ data, error } = await insertRow(basePayload));
    }

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
      imageUrl: row.image_url ? String(row.image_url) : bookingData.imageUrl,
    };

    return { success: true, booking };
  } catch (error) {
    console.error('Supabase Error:', error);
    return { success: false, error: 'Failed to create booking' };
  }
}
