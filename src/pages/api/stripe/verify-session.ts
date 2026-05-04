import type { APIRoute } from 'astro';
import Stripe from 'stripe';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
    const sessionId = url.searchParams.get('session_id');
    if (!sessionId) {
        return new Response(JSON.stringify({ error: 'Brak session_id' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const stripeKey = import.meta.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
        return new Response(JSON.stringify({ error: 'Stripe nie skonfigurowany' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2025-02-24.acacia' });

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.payment_status !== 'paid') {
            return new Response(JSON.stringify({ error: 'Płatność nie została potwierdzona' }), { status: 402, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify({
            valid: true,
            customerEmail: session.customer_details?.email || '',
            amount: Math.round((session.amount_total || 0) / 100),
            currency: session.currency || 'pln',
            briefId: session.metadata?.briefId || ''
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch {
        return new Response(JSON.stringify({ error: 'Nieprawidłowa sesja płatności' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
};
