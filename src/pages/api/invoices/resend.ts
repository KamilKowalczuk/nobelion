import type { APIRoute } from 'astro';
import { downloadInvoicePdf } from '../../../lib/fakturaxl';
import { dispatchInvoiceEmailWithPdf } from '../../../lib/emailInvoices';
import { findSingle } from '../../../lib/payload';
import { requireAdmin } from '../../../lib/adminAuth';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    // Ponowna wysyłka faktury — tylko admin (fail-closed).
    const denied = requireAdmin(request);
    if (denied) return denied;

    let body: { fakturaXlInvoiceId?: string };
    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Nieprawidłowy JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const fakturaXlInvoiceId = (body.fakturaXlInvoiceId || '').trim();
    if (!fakturaXlInvoiceId) {
        return new Response(JSON.stringify({ error: 'Brak fakturaXlInvoiceId' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const invoiceIdNum = parseInt(fakturaXlInvoiceId, 10);
    if (!Number.isInteger(invoiceIdNum) || invoiceIdNum <= 0) {
        return new Response(JSON.stringify({ error: 'Nieprawidłowy fakturaXlInvoiceId' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const order = await findSingle('orders', { 'payments.fakturaXlInvoiceId': fakturaXlInvoiceId });
    if (!order?.customerEmail) {
        return new Response(JSON.stringify({ error: 'Nie znaleziono powiązanego zamówienia' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    const pdf = await downloadInvoicePdf(invoiceIdNum);
    if (!pdf) {
        return new Response(JSON.stringify({ error: 'Nie udało się pobrać PDF faktury' }), { status: 502, headers: { 'Content-Type': 'application/json' } });
    }

    const amount = order.monthlyAmount || order.amount || 0;
    const success = await dispatchInvoiceEmailWithPdf({
        toEmail: order.customerEmail,
        pdfBuffer: pdf,
        orderNumber: order.orderNumber || order.id,
        serviceName: `Nobelion wdrożenie ${order.orderNumber || order.id}`,
        amountGross: amount,
        isResend: true
    });

    if (!success) {
        return new Response(JSON.stringify({ error: 'Nieudana wysyłka wiadomości e-mail' }), { status: 502, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
