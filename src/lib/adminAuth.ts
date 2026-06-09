import { backendEnv } from './backend-env';

/**
 * Bramka admina dla wrażliwych endpointów ops (faktury, linki płatności).
 * FAIL-CLOSED: brak skonfigurowanego sekretu = endpoint zablokowany (503),
 * a nie otwarty. Nagłówek: `x-admin-secret`.
 *
 * Zwraca Response (błąd) gdy autoryzacja nieudana, albo null gdy OK.
 */
export function requireAdmin(request: Request): Response | null {
    const secret = backendEnv('ADMIN_API_SECRET') || backendEnv('ADMIN_PAYMENT_LINK_SECRET');

    // Brak sekretu w środowisku → fail-closed (nie udostępniamy endpointu).
    if (!secret || secret.length < 16 || secret.includes('PASTE_')) {
        return new Response(JSON.stringify({ error: 'Endpoint niedostępny (brak konfiguracji autoryzacji).' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const provided = request.headers.get('x-admin-secret') || '';
    // Porównanie w czasie stałym (ochrona przed timing attack).
    if (!timingSafeEqual(provided, secret)) {
        return new Response(JSON.stringify({ error: 'Brak autoryzacji' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return null;
}

function timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) {
        diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return diff === 0;
}
