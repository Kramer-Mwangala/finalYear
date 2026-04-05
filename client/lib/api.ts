/**
 * HTTP client for the Nairobi Skin Centre backend.
 * Set NEXT_PUBLIC_API_URL to your API origin (no trailing slash), e.g. http://localhost:4000
 * or an ngrok URL. Ngrok free hosts get `ngrok-skip-browser-warning` automatically on requests.
 *
 * Auth: store JWT via setAuthToken() after login/verify-otp; Bearer is sent on protected calls.
 */

/** localStorage key for JWT (use with sign-in / verify-otp flows). */
export const AUTH_TOKEN_KEY = 'nsc_jwt';

export function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';
  return base;
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
  else localStorage.removeItem(AUTH_TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = RequestInit & {
  /** JSON body; not used if `body` is already set to FormData */
  json?: unknown;
  /** When true (default for most helpers), attach Authorization if token exists */
  auth?: boolean;
};

function buildUrl(path: string): string {
  const base = getApiBaseUrl();
  const p = path.startsWith('/') ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}

function withQuery(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>
): string {
  if (!params) return path;
  const u = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) u.set(key, String(value));
  }
  const q = u.toString();
  return q ? `${path}?${q}` : path;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { json, auth = true, headers: initHeaders, body: initBody, ...rest } = options;
  const headers = new Headers(initHeaders);

  let body: BodyInit | undefined | null = initBody;
  if (json !== undefined && !(initBody instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(json);
  }

  if (auth) {
    const token = getAuthToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const base = getApiBaseUrl();
  if (base.includes('ngrok')) {
    headers.set('ngrok-skip-browser-warning', 'true');
  }

  const url = buildUrl(path);
  const res = await fetch(url, { ...rest, headers, body: body ?? undefined });

  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const parsed = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const fallback = res.statusText || `HTTP ${res.status}`;
    let message = fallback;
    if (typeof parsed === 'object' && parsed !== null) {
      const o = parsed as Record<string, unknown>;
      if (typeof o.error === 'string') message = o.error;
      else if (typeof o.message === 'string') message = o.message;
    } else if (typeof parsed === 'string' && parsed.trim()) {
      message = parsed;
    }
    throw new ApiError(message, res.status, parsed);
  }

  return parsed as T;
}

/* -------------------------------------------------------------------------- */
/* Auth (no Bearer unless noted)                                               */
/* -------------------------------------------------------------------------- */

export type SignupPayload = Record<string, unknown>;
export type VerifyOtpPayload = Record<string, unknown>;
export type ResendOtpPayload = Record<string, unknown>;
export type LoginPayload = Record<string, unknown>;

export const authApi = {
  health: () => apiRequest<unknown>('/api/health', { auth: false }),

  signup: (json: SignupPayload) =>
    apiRequest<unknown>('/api/auth/signup', { method: 'POST', json, auth: false }),

  verifyOtp: (json: VerifyOtpPayload) =>
    apiRequest<unknown>('/api/auth/verify-otp', { method: 'POST', json, auth: false }),

  resendOtp: (json: ResendOtpPayload) =>
    apiRequest<unknown>('/api/auth/resend-otp', { method: 'POST', json, auth: false }),

  login: (json: LoginPayload) =>
    apiRequest<unknown>('/api/auth/login', { method: 'POST', json, auth: false }),

  /** Validate JWT */
  verify: () => apiRequest<unknown>('/api/auth/verify', { method: 'GET' }),
};

/* -------------------------------------------------------------------------- */
/* Users (Bearer)                                                               */
/* -------------------------------------------------------------------------- */

export type ProfilePatch = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
};

export const usersApi = {
  profile: () => apiRequest<unknown>('/api/users/profile'),

  updateProfile: (json: ProfilePatch) =>
    apiRequest<unknown>('/api/users/profile', { method: 'PATCH', json }),

  /** Admin: alternate user list */
  list: () => apiRequest<unknown>('/api/users/'),
};

/* -------------------------------------------------------------------------- */
/* Bookings (Bearer; staff for some routes)                                    */
/* -------------------------------------------------------------------------- */

export type CreateBookingPayload = {
  appointmentDate: string;
  notes?: string;
  dermatologistId: string;
};

export type PatchBookingPayload = Record<string, unknown>;

export const bookingsApi = {
  list: () => apiRequest<unknown>('/api/bookings'),

  create: (json: CreateBookingPayload) =>
    apiRequest<unknown>('/api/bookings', { method: 'POST', json }),

  get: (bookingId: string) => apiRequest<unknown>(`/api/bookings/${bookingId}`),

  /** Dermatologist or admin */
  listAll: () => apiRequest<unknown>('/api/bookings/all'),

  /** Dermatologist or admin */
  update: (bookingId: string, json: PatchBookingPayload) =>
    apiRequest<unknown>(`/api/bookings/${bookingId}`, { method: 'PATCH', json }),
};

/* -------------------------------------------------------------------------- */
/* AI (Bearer)                                                                  */
/* -------------------------------------------------------------------------- */

export const aiApi = {
  analyzeImage: (image: File | Blob, bookingId?: string) => {
    const form = new FormData();
    form.append('image', image);
    if (bookingId) form.append('bookingId', bookingId);
    return apiRequest<unknown>('/api/ai/analyze-image', {
      method: 'POST',
      body: form,
    });
  },

  listAnalyses: () => apiRequest<unknown>('/api/ai/'),

  getAnalysis: (imageId: string) => apiRequest<unknown>(`/api/ai/${imageId}`),
};

/* -------------------------------------------------------------------------- */
/* Payments (Bearer + callbacks)                                              */
/* -------------------------------------------------------------------------- */

export type InitiateBookingPaymentPayload = {
  bookingId: string;
  phoneNumber: string;
};

export type CompletePaymentPayload = {
  transactionId: string;
};

export const paymentsApi = {
  initiateBookingPayment: (json: InitiateBookingPaymentPayload) =>
    apiRequest<unknown>('/api/payments/initiate-booking-payment', { method: 'POST', json }),

  completePayment: (json: CompletePaymentPayload) =>
    apiRequest<unknown>('/api/payments/complete-payment', { method: 'POST', json }),

  history: () => apiRequest<unknown>('/api/payments/history'),

  getTransaction: (transactionId: string) =>
    apiRequest<unknown>(`/api/payments/${transactionId}`),

  /** Safaricom webhook — typically server-side only */
  mpesaCallback: (json: unknown) =>
    apiRequest<unknown>('/api/payments/mpesa-callback', { method: 'POST', json, auth: false }),
};

/* -------------------------------------------------------------------------- */
/* Pharmacy (Bearer)                                                            */
/* -------------------------------------------------------------------------- */

export type CreatePharmacyOrderPayload = {
  prescriptionId: string;
  deliveryMethod: string;
  deliveryAddress?: string;
};

export const pharmacyApi = {
  myPrescriptions: () => apiRequest<unknown>('/api/pharmacy/my-prescriptions'),

  orders: () => apiRequest<unknown>('/api/pharmacy/orders'),

  prescription: (prescriptionId: string) =>
    apiRequest<unknown>(`/api/pharmacy/${prescriptionId}`),

  createOrder: (json: CreatePharmacyOrderPayload) =>
    apiRequest<unknown>('/api/pharmacy/order/create', { method: 'POST', json }),
};

/* -------------------------------------------------------------------------- */
/* SMS (Bearer + internal/webhook)                                              */
/* -------------------------------------------------------------------------- */

export const smsApi = {
  scheduleReminders: (bookingId: string) =>
    apiRequest<unknown>(`/api/sms/schedule-reminders/${bookingId}`, { method: 'POST' }),

  logs: (query?: Record<string, string | number | boolean | undefined | null>) =>
    apiRequest<unknown>(withQuery('/api/sms/logs', query)),

  bookingLogs: (bookingId: string) =>
    apiRequest<unknown>(`/api/sms/booking/${bookingId}`),

  /** Webhook */
  africasTalkingCallback: (json: unknown) =>
    apiRequest<unknown>('/api/sms/africastalking-callback', { method: 'POST', json, auth: false }),

  /** Server/admin — unsecured in many backends */
  sendReminder: (bookingId: string, reminderType: '48h' | '24h') =>
    apiRequest<unknown>(`/api/sms/send-reminder/${bookingId}`, {
      method: 'POST',
      json: { reminderType },
      auth: false,
    }),

  sendConfirmation: (bookingId: string) =>
    apiRequest<unknown>(`/api/sms/send-confirmation/${bookingId}`, { method: 'POST', auth: false }),

  resend: (smsLogId: string) =>
    apiRequest<unknown>(`/api/sms/resend/${smsLogId}`, { method: 'POST', auth: false }),
};

/* -------------------------------------------------------------------------- */
/* Dermatologist (Bearer + role)                                                */
/* -------------------------------------------------------------------------- */

export const dermatologistApi = {
  scheduleToday: () => apiRequest<unknown>('/api/dermatologist/schedule/today'),

  scheduleByDate: (date: string) =>
    apiRequest<unknown>(`/api/dermatologist/schedule/${encodeURIComponent(date)}`),

  patientImages: (patientId: string) =>
    apiRequest<unknown>(`/api/dermatologist/patient-images/${patientId}`),

  createPrescription: (json: {
    bookingId: string;
    medicationName: string;
    dosage: string;
    duration: string;
    notes?: string;
  }) => apiRequest<unknown>('/api/dermatologist/prescription/create', { method: 'POST', json }),
};

/* -------------------------------------------------------------------------- */
/* Admin (Bearer + role)                                                        */
/* -------------------------------------------------------------------------- */

export type AdminPaginationQuery = {
  page?: number;
  limit?: number;
};

export type AdminBookingsQuery = AdminPaginationQuery & {
  status?: string;
};

export type AdminTransactionsQuery = AdminPaginationQuery & {
  startDate?: string;
  endDate?: string;
};

export const adminApi = {
  summary: () => apiRequest<unknown>('/api/admin/summary'),

  users: (query?: AdminPaginationQuery) =>
    apiRequest<unknown>(withQuery('/api/admin/users', query)),

  bookings: (query?: AdminBookingsQuery) =>
    apiRequest<unknown>(withQuery('/api/admin/bookings', query)),

  transactions: (query?: AdminTransactionsQuery) =>
    apiRequest<unknown>(withQuery('/api/admin/transactions', query)),

  deactivateUser: (userId: string) =>
    apiRequest<unknown>(`/api/admin/users/${userId}/deactivate`, { method: 'PUT' }),
};

/* -------------------------------------------------------------------------- */
/* Default export: single object for convenience                                */
/* -------------------------------------------------------------------------- */

export const api = {
  request: apiRequest,
  auth: authApi,
  users: usersApi,
  bookings: bookingsApi,
  ai: aiApi,
  payments: paymentsApi,
  pharmacy: pharmacyApi,
  sms: smsApi,
  dermatologist: dermatologistApi,
  admin: adminApi,
};

export default api;
