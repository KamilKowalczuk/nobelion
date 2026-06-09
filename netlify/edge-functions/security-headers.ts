import type { Context } from '@netlify/edge-functions';

export default async (request: Request, context: Context) => {
    const response = await context.next();
    const headers = new Headers(response.headers);

    const nonce = headers.get('X-Page-Nonce');
    const scriptSrc = nonce
        ? `'self' 'nonce-${nonce}' 'unsafe-inline' 'wasm-unsafe-eval' 'unsafe-eval'`
        : `'self' 'unsafe-inline' 'wasm-unsafe-eval' 'unsafe-eval'`;

    const url = new URL(request.url);
    const isGtmPreview =
        url.searchParams.has('gtm_debug') ||
        url.searchParams.has('gtm_auth') ||
        url.searchParams.has('gtm_preview');

    const trustedScriptDomains = [
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
        'https://analytics.google.com'
    ].join(' ');

    const isLocal = url.hostname === 'localhost';
    const connectSrc = [
        "'self'",
        'https://admin.nobelion.pl',
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
        'https://*.google-analytics.com',
        'https://stats.g.doubleclick.net',
        'https://api.stripe.com',
        'https://*.stripe.com',
        ...(isLocal ? ['http://localhost:3000', 'http://localhost:4321'] : [])
    ].join(' ');

    const styleSrc = [
        "'self'",
        "'unsafe-inline'",
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        ...(isGtmPreview ? ['https://www.googletagmanager.com'] : [])
    ].join(' ');

    const imgSrc = [
        "'self'",
        'data:',
        'blob:',
        'https://www.google-analytics.com',
        'https://analytics.google.com',
        'https://www.googletagmanager.com',
        'https://fonts.gstatic.com',
        'https://www.gstatic.com',
        'https://*.stripe.com',
        ...(isLocal ? ['http://localhost:*'] : [])
    ].join(' ');

    const frameSrc = [
        "'self'",
        'https://js.stripe.com',
        'https://hooks.stripe.com',
        'https://www.googletagmanager.com'
    ].join(' ');

    const csp = [
        "default-src 'self'",
        `script-src ${scriptSrc} ${trustedScriptDomains}`,
        `style-src ${styleSrc}`,
        `img-src ${imgSrc}`,
        "font-src 'self' data: https://fonts.gstatic.com https://fonts.googleapis.com",
        `connect-src ${connectSrc}`,
        `frame-src ${frameSrc}`,
        "worker-src 'self' blob: data:",
        "child-src 'self' blob: data:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self' https://checkout.stripe.com",
        "manifest-src 'self'",
        "media-src 'self'",
        'upgrade-insecure-requests'
    ].join('; ');

    headers.set('Content-Security-Policy', csp);
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-XSS-Protection', '1; mode=block');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

    headers.set(
        'Permissions-Policy',
        [
            'geolocation=()',
            'microphone=()',
            'camera=()',
            'payment=(self)',
            'usb=()',
            'magnetometer=()',
            'accelerometer=()',
            'gyroscope=()',
            'fullscreen=(self)',
            'display-capture=()',
            'clipboard-read=()',
            'clipboard-write=(self)'
        ].join(', ')
    );

    headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none');
    headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    headers.set('Cross-Origin-Resource-Policy', 'cross-origin');

    headers.delete('X-Page-Nonce');

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
    });
};
