//
// Lekki rate limiter (fixed-window, in-memory) dla endpointów Astro.
// UWAGA: w serverless pamięć jest per-instancja i znika przy cold-startcie —
// to ochrona przed BURSTAMI z jednej instancji, nie twarda gwarancja globalna.
// Dla twardych limitów włącz rate limiting na poziomie Netlify/Cloudflare (WAF).
//

type Bucket = { count: number; reset: number };
const store = new Map<string, Bucket>();

export function clientIp(request: Request): string {
    return (
        request.headers.get('x-nf-client-connection-ip') ||
        (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
        'unknown'
    );
}

/**
 * Zwraca Response 429 gdy limit przekroczony, albo null gdy żądanie dozwolone.
 */
export function rateLimit(
    request: Request,
    opts: { key: string; limit: number; windowMs: number }
): Response | null {
    const id = `${opts.key}:${clientIp(request)}`;
    const now = Date.now();
    const b = store.get(id);

    if (!b || now > b.reset) {
        store.set(id, { count: 1, reset: now + opts.windowMs });
    } else {
        b.count++;
        if (b.count > opts.limit) {
            const retry = Math.max(1, Math.ceil((b.reset - now) / 1000));
            return new Response(
                JSON.stringify({ error: 'Zbyt wiele żądań. Spróbuj ponownie za chwilę.' }),
                { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(retry) } }
            );
        }
    }

    // Okresowe sprzątanie wygasłych wpisów, żeby Map nie rósł w nieskończoność.
    if (store.size > 5000) {
        for (const [k, v] of store) if (now > v.reset) store.delete(k);
    }
    return null;
}
