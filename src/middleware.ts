import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (context, next) => {
    const response = await next();

    // Dodanie nagłówków bezpieczeństwa do każdej odpowiedzi
    
    // Wymusza pobieranie po HTTPS (HSTS)
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    
    // Zabezpiecza przed atakami MIME-sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');
    
    // Zabezpiecza przed Clickjackingiem (nie pozwala osadzić strony w iframie)
    response.headers.set('X-Frame-Options', 'DENY');
    
    // Ogranicza przesyłanie informacji o tym skąd przyszedł użytkownik (Referrer)
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Content Security Policy (CSP)
    // Otwarty na własną domenę, backend (admin.nobelion.pl) oraz skrypty Google i Facebooka
    const cspDirectives = [
        "default-src 'self'",
        // Zezwolenie na skrypty Google Analytics, GTM, oraz nasze własne (w tym Svelte, Astro)
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net",
        // Zezwolenie na style (inline używane przez frameworki) oraz Google Fonts
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        // Zezwolenie na obrazki z naszej domeny, inline (data:), GA i FB
        "img-src 'self' data: https://www.google-analytics.com https://www.facebook.com https://admin.nobelion.pl",
        // Zezwolenie na czcionki Google
        "font-src 'self' data: https://fonts.gstatic.com",
        // Zezwolenie na połączenia API/XHR do naszego backendu, statystyk GA i dev serwera
        "connect-src 'self' https://nobelion.pl https://admin.nobelion.pl https://www.google-analytics.com https://stats.g.doubleclick.net ws://localhost:* http://localhost:* wss://localhost:*",
        // Zezwolenie na iframe dla GTM (jeśli potrzebne)
        "frame-src 'self' https://www.googletagmanager.com",
        "object-src 'none'",
        "base-uri 'self'"
    ];

    response.headers.set('Content-Security-Policy', cspDirectives.join('; '));

    return response;
};
