import { useState, useEffect } from 'react';
import {
  fetchBookings,
  updateBookingStatus,
  deleteBooking,
  type Booking,
} from '../services/adminService';
import { Search, TrendingUp, Clock, CheckCircle, Loader2, Trash2, X, DollarSign } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import { PRESETS, DEFAULT_PRESET_ID, defaultPreset } from '../config/presets';
import { lightSurface, defaultFonts } from '../config/theme';
import type { IndustryConfig } from '../config/types';

/**
 * Decide whether a public Storage URL is a video or an image. Media URLs come
 * back as public URLs in the `clientimages` bucket; we determine the kind from
 * the file extension (and fall back to a signature match for URLs without a
 * clean extension), mirroring the booking flow's image/video distinction.
 */
function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov|m4v|ogg|ogv)(\?|$)/i.test(url) || /\/video\//i.test(url);
}

interface LightboxState {
  url: string;
  kind: 'image' | 'video';
}

/**
 * Tenant-aware, theme-driven admin dashboard.
 *
 * `tenantId` selects the active tenant's preset from the PRESETS registry by
 * id. Everything branded and visual comes from that preset:
 *  - `brand.logo` + `brand.businessName` drive the header branding (no hardcoded
 *    cleaning import).
 *  - `theme` (accent) + `surface`/`fonts` drive all surfaces, text, borders and
 *    accent colors, so the detailing admin adopts its dark "Noir & Or" look and
 *    the cleaning admin keeps the original light look (via the lightSurface
 *    defaults), byte-for-byte where unchanged.
 * Bookings are fetched scoped to the active tenant (`.eq('tenant_id')`), so each
 * admin's stats / revenue / monthly-profit are computed from that tenant's rows
 * only.
 */
export default function AdminDashboard({ tenantId = DEFAULT_PRESET_ID }: { tenantId?: string }) {
  // Resolve the active preset by id; fall back to the default (cleaning) if the
  // id is not a registered preset.
  const config: IndustryConfig = PRESETS[tenantId] ?? defaultPreset;
  const t = config.theme;
  const S = config.surface ?? lightSurface;
  const F = config.fonts ?? defaultFonts;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  useEffect(() => {
    loadBookings();
    // Re-fetch whenever the active tenant changes so each admin shows only its
    // own bookings.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.id]);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchBookings(config.id);
    if (result.success && result.bookings) {
      setBookings(result.bookings);
    } else {
      setError(result.error || 'Failed to load bookings');
    }
    setLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: Booking['status']) => {
    setUpdatingId(id);
    const result = await updateBookingStatus(id, newStatus);
    if (result.success) {
      setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } else {
      setError(result.error || 'Failed to update status');
    }
    setUpdatingId(null);
  };

  /**
   * Delete a booking after a confirm step. NOTE: Supabase RLS currently has no
   * anon DELETE policy on `bookings`, so the delete will only persist once an
   * `anon` DELETE policy is added at the Supabase console (server-side). The
   * client code below is written to succeed once that policy exists, and to
   * surface any RLS/other error gracefully.
   */
  const handleDelete = async (id: string, customerName: string) => {
    const ok = window.confirm(`Delete the booking for ${customerName}? This cannot be undone.`);
    if (!ok) return;
    setDeletingId(id);
    const result = await deleteBooking(id);
    if (result.success) {
      setBookings(bookings.filter(b => b.id !== id));
    } else {
      setError(result.error || 'Failed to delete booking');
    }
    setDeletingId(null);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  /**
   * Monthly profit, computed dynamically from the fetched (tenant-scoped)
   * bookings — no hardcoded numbers. A booking counts as revenue only when its
   * status is `completed` or `confirmed` (both are revenue-earning); `pending`
   * and `cancelled` are excluded. The month is derived from each booking's
   * `created_at` timestamp, compared against the current calendar month.
   */
  const REVENUE_STATUSES: Booking['status'][] = ['completed', 'confirmed'];
  const now = new Date();
  const monthlyProfit = bookings
    .filter(b => {
      const d = new Date(b.created_at);
      const isCurrentMonth =
        !isNaN(d.getTime()) &&
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth();
      return isCurrentMonth && REVENUE_STATUSES.includes(b.status);
    })
    .reduce((sum, b) => sum + b.price, 0);

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    revenue: bookings.reduce((sum, b) => sum + b.price, 0),
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Themed focus ring: "ring-current" follows the active text color (config-
  // driven) so it reads correctly on both light and dark surfaces.
  const focusRing = 'focus:outline-none focus:ring-2 focus:ring-current focus:border-transparent';

  if (loading) {
    return (
      <div className={`min-h-screen ${S.surfaceBg} ${F.body} flex items-center justify-center`}>
        <div className="text-center">
          <BrandLogo
            src={config.brand.logo}
            alt={`${config.brand.businessName} Logo`}
            className="h-12 w-auto mx-auto mb-4"
          />
          <Loader2 className={`h-8 w-8 animate-spin ${t.primaryText} mx-auto mb-4`} />
          <p className={S.textMuted}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${S.surfaceBg} ${F.body} p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <BrandLogo
              src={config.brand.logo}
              alt={`${config.brand.businessName} Logo`}
              className="h-12 w-auto"
            />
            <div>
              <h1 className={`text-3xl font-bold ${F.heading} ${S.textPrimary}`}>{config.brand.businessName} Admin</h1>
              <p className={S.textMuted}>Manage bookings and monitor performance</p>
            </div>
          </div>
        </div>

        {error && (
          <div className={`mb-6 p-4 ${S.mutedBg} border ${S.cardBorder} rounded-xl ${t.primaryText}`}>
            {error}
          </div>
        )}

        {/* Lightbox / detail viewer for client media */}
        {lightbox && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              className="absolute top-4 right-4 text-white/80 hover:text-white"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              <X className="h-8 w-8" />
            </button>
            {lightbox.kind === 'video' ? (
              <video
                src={lightbox.url}
                controls
                autoPlay
                className="max-h-[85vh] max-w-full rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img
                src={lightbox.url}
                alt="Client uploaded media"
                className="max-h-[85vh] max-w-full rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className={`${S.cardBg} rounded-xl p-6 border ${S.cardBorder} shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className={`h-8 w-8 ${t.primaryText}`} />
              <span className={`text-2xl font-bold ${S.textPrimary}`}>{stats.total}</span>
            </div>
            <p className={`text-sm ${S.textMuted}`}>Total Bookings</p>
          </div>

          <div className={`${S.cardBg} rounded-xl p-6 border ${S.cardBorder} shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <Clock className={`h-8 w-8 ${t.primaryText}`} />
              <span className={`text-2xl font-bold ${S.textPrimary}`}>{stats.pending}</span>
            </div>
            <p className={`text-sm ${S.textMuted}`}>Pending</p>
          </div>

          <div className={`${S.cardBg} rounded-xl p-6 border ${S.cardBorder} shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className={`h-8 w-8 ${t.primaryText}`} />
              <span className={`text-2xl font-bold ${S.textPrimary}`}>{stats.confirmed}</span>
            </div>
            <p className={`text-sm ${S.textMuted}`}>Confirmed</p>
          </div>

          <div className={`${S.cardBg} rounded-xl p-6 border ${S.cardBorder} shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className={`h-8 w-8 ${t.primaryText}`} />
              <span className={`text-2xl font-bold ${S.textPrimary}`}>${stats.revenue.toLocaleString()}</span>
            </div>
            <p className={`text-sm ${S.textMuted}`}>Total Revenue</p>
          </div>

          {/* Monthly profit — computed from tenant-scoped bookings with a revenue status this month */}
          <div className={`${S.cardBg} rounded-xl p-6 border ${S.cardBorder} shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <DollarSign className={`h-8 w-8 ${t.primaryText}`} />
              <span className={`text-2xl font-bold ${S.textPrimary}`}>{monthlyProfit.toLocaleString()}</span>
            </div>
            <p className={`text-sm ${S.textMuted}`}>This Month's Profit</p>
            <p className={`text-xs ${S.textFaint} mt-1`}>
              Revenue from completed/confirmed bookings this calendar month
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className={`${S.cardBg} rounded-xl p-6 border ${S.cardBorder} shadow-sm mb-6`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${S.textFaint}`} />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border ${S.inputBorder} rounded-lg ${S.inputBg} ${S.textPrimary} ${focusRing}`}
                />
              </div>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className={`px-4 py-2 border ${S.inputBorder} rounded-lg ${S.selectBg} ${S.selectText} ${focusRing}`}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className={`${S.cardBg} rounded-xl border ${S.cardBorder} shadow-sm overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${S.mutedBg} border-b ${S.cardBorder}`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-semibold ${S.textMuted} uppercase tracking-wider`}>Customer</th>
                  <th className={`px-6 py-3 text-left text-xs font-semibold ${S.textMuted} uppercase tracking-wider`}>Service</th>
                  <th className={`px-6 py-3 text-left text-xs font-semibold ${S.textMuted} uppercase tracking-wider`}>Date & Time</th>
                  <th className={`px-6 py-3 text-left text-xs font-semibold ${S.textMuted} uppercase tracking-wider`}>Media</th>
                  <th className={`px-6 py-3 text-left text-xs font-semibold ${S.textMuted} uppercase tracking-wider`}>Price</th>
                  <th className={`px-6 py-3 text-left text-xs font-semibold ${S.textMuted} uppercase tracking-wider`}>Status</th>
                  <th className={`px-6 py-3 text-left text-xs font-semibold ${S.textMuted} uppercase tracking-wider`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${S.borderSubtle}`}>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={`px-6 py-12 text-center ${S.textSubtle}`}>
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => {
                    const kind = booking.image_url ? (isVideoUrl(booking.image_url) ? 'video' as const : 'image' as const) : null;
                    return (
                    <tr key={booking.id} className={S.optionHoverBg}>
                      <td className="px-6 py-4">
                        <div>
                          <div className={`font-medium ${S.textPrimary}`}>{booking.customer_name}</div>
                          <div className={`text-sm ${S.textSubtle}`}>{booking.customer_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm ${S.textPrimary}`}>{booking.service_type}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm ${S.textPrimary}`}>{booking.booking_date}</div>
                        <div className={`text-sm ${S.textSubtle}`}>{booking.booking_time}</div>
                      </td>
                      <td className="px-6 py-4">
                        {booking.image_url && kind ? (
                          <button
                            type="button"
                            onClick={() => setLightbox({ url: booking.image_url!, kind })}
                            className={`block h-12 w-12 overflow-hidden rounded-lg border ${S.inputBorder} ${focusRing}`}
                            title="View client media"
                          >
                            {kind === 'video' ? (
                              <video
                                src={booking.image_url}
                                className="h-full w-full object-cover"
                                muted
                                preload="metadata"
                              />
                            ) : (
                              <img
                                src={booking.image_url}
                                alt={`${booking.customer_name} media`}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </button>
                        ) : (
                          <span className={`text-sm ${S.textFaint}`}>—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm font-medium ${S.textPrimary}`}>${booking.price}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {updatingId === booking.id ? (
                            <Loader2 className={`h-5 w-5 animate-spin ${t.primaryText}`} />
                          ) : (
                            <select
                              value={booking.status}
                              onChange={(e) => handleStatusChange(booking.id, e.target.value as Booking['status'])}
                              className={`px-3 py-1 border ${S.inputBorder} rounded-lg text-sm ${S.selectBg} ${S.selectText} ${focusRing}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          )}
                          {deletingId === booking.id ? (
                            <Loader2 className="h-5 w-5 animate-spin text-red-600" />
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleDelete(booking.id, booking.customer_name)}
                              className={`p-2 rounded-lg text-red-600 ${S.optionHoverBg} border ${S.inputBorder} hover:border-red-300 ${focusRing}`}
                              title="Delete booking"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
