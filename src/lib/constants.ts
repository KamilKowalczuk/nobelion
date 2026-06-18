export const BUSINESS_CONFIG = {
  // Wskaźnik rabatu dla płatności jednorazowej (np. 0.90 to 10% rabatu)
  DISCOUNT_RATE: 0.9,
  // Dzielnik dla płatności ratalnej (2 = 50% na start, 50% na koniec)
  INSTALLMENT_DIVISOR: 2,
};

export const PAYMENT_MODELS = {
  FULL: '100',       // Płatność jednorazowa
  HALF: '50',        // Płatność w dwóch ratach (50% na start)
  FINAL_HALF: 'final50', // Płatność końcowa (druga rata 50%)
  SUBSCRIPTION: 'subscription', // Płatność subskrypcyjna (utrzymanie)
} as const;

export const PAYMENT_STATUSES = {
  UNPAID: 'unpaid',
  PAID_FULL: 'paid_full',
  PAID_HALF: 'paid_half',
} as const;

// Wspólny getter dla adresu API, rozwiązujący różnice między SSR a klientem
export const getApiUrl = () => {
  const rawUrl =
    (typeof process !== 'undefined' && process.env.PAYLOAD_API_URL) ||
    (import.meta.env && import.meta.env.PUBLIC_PAYLOAD_API_URL) ||
    (import.meta.env && import.meta.env.PAYLOAD_API_URL) ||
    'http://localhost:3001';
  return rawUrl.replace(/\/$/, '');
};

// Centralny rejestr ścieżek API
export const API_ENDPOINTS = {
  quoteByToken: (token: string) => `/api/quotes/client/${token}`,
  publicDocuments: () => `/api/documents/public`,
  checkout: (token: string) => `/api/quotes/checkout/${token}`,
  maintenance: (token: string) => `/api/quotes/client/${token}/maintenance`,
  requestChange: (token: string) => `/api/quotes/request-change/${token}`,
};
