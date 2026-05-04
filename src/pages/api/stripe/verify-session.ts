import type { APIRoute } from 'astro';
import Stripe from 'stripe';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
    const sessionId = url.searchParams.get('session_id');
    if (!sessionId) {
        return new Response(JSON.stringify({ error: 'Brak session_id' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const env = (import.meta as any).env as Record<string, string | undefined>;
    const stripeKey = env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
        return new Response(JSON.stringify({ error: 'Stripe nie skonfigurowany' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const stripe = new Stripe(stripeKey, { apiVersion: '2025-02-24.acacia' });
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const paid = session.payment_status === 'paid';
        return new Response(JSON.stringify({ valid: paid }), {
            status: paid ? 200 : 402,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch {
        return new Response(JSON.stringify({ error: 'Nieprawidłowa sesja płatności' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
