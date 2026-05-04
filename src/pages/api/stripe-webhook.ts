import type { APIRoute } from 'astro';
import Stripe from 'stripe';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    const env = (import.meta as any).env as Record<string, string | undefined>;
    const stripeKey = env.STRIPE_SECRET_KEY;
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
    if (!stripeKey || !webhookSecret) {
        return new Response('Stripe nie skonfigurowany', { status: 503 });
    }

    const signature = request.headers.get('stripe-signature');
    if (!signature) {
        return new Response('Brak podpisu', { status: 400 });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2025-02-24.acacia' });
    const payload = await request.text();

    try {
        stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch {
        return new Response('Błędny podpis webhooka', { status: 400 });
    }
};
