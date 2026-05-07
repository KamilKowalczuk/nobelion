/**
 * Backend environment helper.
 * Na Netlify: zmienne brane z process.env (ustawione w panelu Netlify).
 * Lokalnie: zmienne brane z process.env (ładowane przez Astro z .env).
 */
export function backendEnv(key: string): string {
    return process.env[key] || '';
}
