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
/**
 * Discriminated availability result:
 * - `verified: true`  => check ran cleanly; `available` is a real answer.
 * - `verified: false` => the check could NOT be determined (query/RLS/network
 *   error). Callers MUST NOT treat this as "booked" — they should surface a
 *   neutral notice and proceed (attempting the save) rather than block.
 */
export interface AvailabilityResult {
  verified: boolean;
  available: boolean;
}

export async function checkAvailability(
  tenantId: string,
  date: string,
  timeSlot: string
): Promise<AvailabilityResult> {
  if (!isSupabaseConfigured || !supabase) {
    console.error('Supabase Error: not configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). Cannot check availability.');
    return { verified: false, available: false };
  }
  try {
    // Use `.select('id').limit(1)` (NOT `.maybeSingle()`) so duplicate/stale
    // rows for the same slot can never error the query. A slot with any
    // non-cancelled row is booked; if no row is returned it is available.
    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('booking_date', date)
      .eq('booking_time', timeSlot)
      .neq('status', 'cancelled')
      .limit(1);
    if (error) {
      console.error('Supabase Error:', error);
      return { verified: false, available: false };
    }
    // No existing active booking for that slot => available
    return { verified: true, available: !data || data.length === 0 };
  } catch (error) {
    console.error('Supabase Error:', error);
    return { verified: false, available: false };
  }
}

/**
 * Upload customer booking media (image or video) to Supabase Storage and return
 * its public URL. The bucket name is supplied by the caller from the active
 * tenant's config (never hardcoded here). Defensive: every failure is swallowed
 * and surfaced as a message so the caller can still complete the booking
 * without crashing.
 */
export type UploadMediaKind = "image" | "video" | "other";
export interface UploadResult {
  url?: string;
  error?: string;
  /** Determined from `file.type` — 'image' or 'video' when recognized. */
  kind?: UploadMediaKind;
}

const IMAGE_TYPE_RE = /^image\/(jpe?g|png|webp|gif|heic)$/i;
const VIDEO_TYPE_RE = /^video\/(mp4|webm|mov)$/i;

function mediaKind(file: File): UploadMediaKind {
  const type = (file.type || "").toLowerCase();
  if (IMAGE_TYPE_RE.test(type)) return "image";
  if (VIDEO_TYPE_RE.test(type)) return "video";
  return "other";
}

export async function uploadBookingImage(
  file: File,
  bucket: string
): Promise<UploadResult> {
  const kind = mediaKind(file);
  if (!isSupabaseConfigured || !supabase) {
    return {
      error:
        'Media upload is unavailable (Supabase not configured). Your booking can still be saved without it.',
    };
  }
  try {
    // Keep a safe, unique object key under a folder. Content type is taken from
    // the file itself (falling back only when absent) so both image/* and
    // video/* upload correctly.
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_") || "media";
    const path = `booking-media/${Date.now()}-${safeName}`;
    const contentType =
      file.type ||
      (kind === "video" ? "video/mp4" : kind === "image" ? "image/jpeg" : "application/octet-stream");
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { contentType, upsert: false });
    if (uploadError) {
      console.error("Supabase Storage Error:", uploadError);
      return {
        error:
          'Your photo or video could not be uploaded right now. Your booking can still be saved without it.',
      };
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return { url: data.publicUrl, kind };
  } catch (error) {
    console.error("Supabase Storage Error:", error);
    return {
      error:
        'Your photo or video could not be uploaded right now. Your booking can still be saved without it.',
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
