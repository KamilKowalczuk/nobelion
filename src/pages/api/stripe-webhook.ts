import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { createDoc, findSingle, patchDoc } from '../../lib/payload';
import { sendPaymentConfirmation } from '../../lib/email';
import { createInvoice, downloadInvoicePdf, type FakturaXlClientData } from '../../lib/fakturaxl';
import { dispatchInvoiceEmailWithPdf } from '../../lib/emailInvoices';

export const prerender = false;

async function issueInvoiceForOrder(order: any, paymentIndex: number): Promise<void> {
    const clientData: FakturaXlClientData = {
        companyName: order.billingCompanyName || order.billingName || order.customerEmail || 'Klient Nobelion',
        email: order.customerEmail || '',
        taxNo: order.billingNip || '',
        street: order.billingStreet || '',
        city: order.billingCity || '',
        postCode: order.billingPostalCode || '',
        country: order.billingCountry || 'PL',
        phone: order.billingPhone || ''
    };

    const invoice = await createInvoice({
        client: clientData,
        orderNumber: order.orderNumber || order.id,
        serviceName: `Nobelion wdrożenie ${order.orderNumber || order.id}`,
        totalPriceGross: order.amount || order.monthlyAmount || 0
    });

    if (!invoice?.id) return;

    const pdf = await downloadInvoicePdf(invoice.id);
    const sent = pdf
        ? await dispatchInvoiceEmailWithPdf({
            toEmail: clientData.email,
            pdfBuffer: pdf,
            orderNumber: order.orderNumber || order.id,
            serviceName: `Nobelion wdrożenie ${order.orderNumber || order.id}`,
            amountGross: order.amount || order.monthlyAmount || 0
        })
        : false;

    const payments = [...(order.payments || [])];
    if (payments[paymentIndex]) {
        payments[paymentIndex] = {
            ...payments[paymentIndex],
            fakturaXlInvoiceId: String(invoice.id),
            invoiceStatus: sent ? 'sent' : 'error'
        };
        await patchDoc('orders', String(order.id), { payments });
    }
}

export const POST: APIRoute = async ({ request }) => {
    const stripeKey = import.meta.env.STRIPE_SECRET_KEY;
    const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;
    if (!stripeKey || !webhookSecret) {
        return new Response('Stripe nie skonfigurowany', { status: 503 });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: '2025-02-24.acacia' });
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    if (!signature) return new Response('Brak podpisu', { status: 400 });

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch {
        return new Response('Błędny podpis webhooka', { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const existing = await findSingle('orders', { stripeEventId: String(event.id) });
        if (existing) return new Response(JSON.stringify({ received: true, duplicate: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });

        const amount = Math.round((session.amount_total || 0) / 100);
        const customerEmail = session.customer_details?.email || String(session.metadata?.email || '');
        const payment = {
            stripeInvoiceId: typeof session.invoice === 'string' ? session.invoice : '',
            amount,
            paidAt: new Date().toISOString(),
            status: 'paid',
            fakturaXlInvoiceId: ''
        };

        const created = await createDoc('orders', {
            briefId: String(session.metadata?.briefId || ''),
            stripeEventId: String(event.id),
            stripeSessionId: session.id,
            stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : '',
            amount,
            currency: session.currency || 'pln',
            status: 'paid',
            customerEmail,
            billingName: session.customer_details?.name || '',
            billingPhone: session.customer_details?.phone || '',
            payments: [payment]
        });

        if (created) {
            await sendPaymentConfirmation({
                email: customerEmail,
                orderNumber: created.orderNumber || created.id,
                amount,
                currency: session.currency || 'pln'
            });
            await issueInvoiceForOrder(created, 0);
        }
    }

    if (event.type === 'payment_intent.payment_failed') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const order = await findSingle('orders', { stripePaymentIntentId: paymentIntent.id });
        if (order) {
            await patchDoc('orders', String(order.id), { status: 'failed' });
        }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
