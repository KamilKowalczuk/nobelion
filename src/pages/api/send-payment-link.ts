import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { sendPaymentLinkEmail } from '../../lib/email';
import { backendEnv } from '../../lib/backend-env';

type SendPaymentLinkBody = {
    briefId?: string;
    amount?: number;
    email?: string;
    company?: string;
    name?: string;
    currency?: string;
};

export const prerender = false;

function json(data: Record<string, unknown>, status = 200): Response {
    return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

function isEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export const POST: APIRoute = async ({ request }) => {
    const stripeKey = backendEnv('STRIPE_SECRET_KEY');
    if (!stripeKey) return json({ error: 'Stripe nie jest skonfigurowany' }, 503);

    const adminSecret = backendEnv('ADMIN_PAYMENT_LINK_SECRET');
    if (adminSecret) {
        const providedSecret = request.headers.get('x-admin-secret') || '';
        if (providedSecret !== adminSecret) return json({ error: 'Brak autoryzacji' }, 401);
    }

    let body: SendPaymentLinkBody;
    try {
        body = await request.json();
    } catch {
        return json({ error: 'Nieprawidłowy JSON' }, 400);
    }

    if (!body.briefId || !body.amount || body.amount <= 0 || !body.email || !isEmail(body.email) || !body.company) {
        return json({ error: 'Brak wymaganych danych: briefId, amount, email, company' }, 400);
    }

    const currency = (body.currency || 'pln').toLowerCase();
    const stripe = new Stripe(stripeKey, { apiVersion: '2026-04-22.dahlia' });
    const successUrl = backendEnv('STRIPE_SUCCESS_URL') || 'https://nobelion.pl/dziekujemy?session_id={CHECKOUT_SESSION_ID}';
    const cancelUrl = backendEnv('STRIPE_CANCEL_URL') || 'https://nobelion.pl/blad-platnosci';

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [{
            quantity: 1,
            price_data: {
                currency,
                unit_amount: Math.round(body.amount * 100),
                product_data: {
                    name: `Nobelion wdrożenie #${body.briefId}`
                }
            }
        }],
        metadata: {
            briefId: body.briefId,
            email: body.email,
            company: body.company
        },
        success_url: successUrl,
        cancel_url: cancelUrl
    });

    if (!session.url) return json({ error: 'Nie udało się utworzyć linku płatności' }, 500);

    await sendPaymentLinkEmail({
        email: body.email,
        name: body.name,
        company: body.company,
        amount: body.amount,
        currency,
        checkoutUrl: session.url
    });

    return json({ success: true, url: session.url });
};