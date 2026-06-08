import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { backendEnv } from '../../lib/backend-env';
import { createDoc, patchDoc } from '../../lib/payload';
import { sendPaymentConfirmation } from '../../lib/email';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    const stripeKey = backendEnv('STRIPE_SECRET_KEY');
    const webhookSecret = backendEnv('STRIPE_WEBHOOK_SECRET');
    if (!stripeKey || !webhookSecret) {
        return new Response('Stripe nie skonfigurowany', { status: 503 });
    }

    const signature = request.headers.get('stripe-signature');
    if (!signature) {
        return new Response('Brak podpisu', { status: 400 });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2026-04-22.dahlia' });
    const rawBody = await request.text();

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch {
        return new Response('Błędny podpis webhooka', { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        const quoteId = session.metadata?.quoteId;
        const briefId = session.metadata?.briefId;
        const paymentModel = session.metadata?.paymentModel; // '50' | '100'
        const clientEmail = session.customer_email || '';
        const amountPln = Math.round((session.amount_total || 0) / 100);
        const paymentStatus = paymentModel === '50' ? 'paid_half' : 'paid_full';

        try {
            const createdOrder = await createDoc('orders', {
                stripeEventId: event.id,
                stripeSessionId: session.id,
                stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : '',
                amount: amountPln,
                currency: session.currency || 'pln',
                status: 'paid',
                customerEmail: clientEmail,
                ...(briefId && { briefId: parseInt(briefId, 10) }),
                payments: [{
                    amount: amountPln,
                    paidAt: new Date().toISOString(),
                    status: 'paid',
                }],
            });

            const orderId: number | undefined = createdOrder?.doc?.id;
            const orderNumber: string = createdOrder?.doc?.orderNumber || session.id;

            if (quoteId) {
                await patchDoc('quotes', quoteId, {
                    paymentStatus,
                    ...(orderId !== undefined && { orderId }),
                });
            }

            if (clientEmail) {
                await sendPaymentConfirmation({
                    email: clientEmail,
                    orderNumber,
                    amount: amountPln,
                    currency: session.currency || 'pln',
                });
            }

            console.log(`[stripe-webhook] checkout.session.completed — order ${orderNumber}, quote ${quoteId}, status ${paymentStatus}`);
        } catch (err: any) {
            console.error('[stripe-webhook] Błąd przetwarzania zdarzenia:', err?.message || err);
        }
    }

    return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};
