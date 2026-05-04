import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { backendEnv } from '../../../lib/backend-env';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
    const sessionId = url.searchParams.get('session_id');
    if (!sessionId) {
        return new Response(JSON.stringify({ error: 'Brak session_id' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const stripeKey = backendEnv('STRIPE_SECRET_KEY');
    if (!stripeKey) {
        return new Response(JSON.stringify({ error: 'Stripe nie skonfigurowany' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const stripe = new Stripe(stripeKey, { apiVersion: '2026-04-22.dahlia' });
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