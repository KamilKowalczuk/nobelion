import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { backendEnv } from '../../lib/backend-env';

export const prerender = false;

/**
 * ⚠️ ENDPOINT ZDEPRECJONOWANY — NIE PRZETWARZA PŁATNOŚCI.
 *
 * Kanoniczny webhook Stripe to CMS: https://admin.nobelion.pl/api/stripe/webhook
 * (tworzy Order, aktualizuje Wycenę, wystawia fakturę FakturaXL, wysyła potwierdzenie).
 *
 * Ten endpoint istniał jako duplikat i powodował ryzyko podwójnych zamówień/faktur.
 * Zostawiamy go jako bezpieczny no-op: weryfikuje podpis (odrzuca śmieci) i potwierdza 200,
 * ale NIE wykonuje żadnych skutków ubocznych. W panelu Stripe ten URL należy usunąć.
 */
export const POST: APIRoute = async ({ request }) => {
    const stripeKey = backendEnv('STRIPE_SECRET_KEY');
    const webhookSecret = backendEnv('STRIPE_WEBHOOK_SECRET');
    if (!stripeKey || !webhookSecret) {
        return new Response('Stripe nie skonfigurowany', { status: 503 });
    }

    const signature = request.headers.get('stripe-signature');
    if (!signature) return new Response('Brak podpisu', { status: 400 });

    const stripe = new Stripe(stripeKey, { apiVersion: '2026-04-22.dahlia' });
    const rawBody = await request.text();

    try {
        const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
        console.warn(`[stripe-webhook FRONT — ZDEPRECJONOWANY] Otrzymano zdarzenie ${event.type} (${event.id}). ` +
            `Przekieruj webhook w Stripe na https://admin.nobelion.pl/api/stripe/webhook. Pomijam przetwarzanie.`);
        return new Response(JSON.stringify({ received: true, ignored: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch {
        return new Response('Błędny podpis webhooka', { status: 400 });
    }
};
