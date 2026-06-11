import type { MiddlewareHandler } from "astro";

// Baseline nagłówków bezpieczeństwa dla odpowiedzi SSR (głównie /api/*).
// Kanoniczny, pełny zestaw nagłówków dla stron HTML — w tym CSP —
// ustawia netlify/edge-functions/security-headers.ts (nadpisuje te wartości).
export const onRequest: MiddlewareHandler = async (_context, next) => {
    const response = await next();

    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;
};
