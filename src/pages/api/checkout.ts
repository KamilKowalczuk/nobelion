import type { APIRoute } from 'astro';
import Stripe from 'stripe';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    const stripeKey = import.meta.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
        return new Response(JSON.stringify({ error: 'Stripe nie jest skonfigurowany' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
    }

    let body: { briefId?: string; amount?: number; email?: string; company?: string };
    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Nieprawidłowy JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    if (!body.briefId || !body.amount || body.amount <= 0) {
        return new Response(JSON.stringify({ error: 'Brak wymaganych danych: briefId, amount' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2026-04-22.dahlia' });
    const successUrl = import.meta.env.STRIPE_SUCCESS_URL || 'https://nobelion.pl/dziekujemy?session_id={CHECKOUT_SESSION_ID}';
    const cancelUrl = import.meta.env.STRIPE_CANCEL_URL || 'https://nobelion.pl/blad-platnosci';

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [{
            quantity: 1,
            price_data: {
                currency: 'pln',
                unit_amount: Math.round(body.amount * 100),
                product_data: {
                    name: `Nobelion wdrożenie #${body.briefId}`
                }
            }
        }],
        metadata: {
            briefId: body.briefId,
            email: body.email || '',
            company: body.company || ''
        },
        success_url: successUrl,
        cancel_url: cancelUrl
    });

    return new Response(JSON.stringify({ url: session.url }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
