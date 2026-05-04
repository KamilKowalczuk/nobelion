export type FakturaXlClientData = {
    companyName: string;
    firstName?: string;
    lastName?: string;
    email: string;
    taxNo?: string;
    street?: string;
    city?: string;
    postCode?: string;
    country?: string;
    phone?: string;
};

type CreateInvoiceInput = {
    client: FakturaXlClientData;
    orderNumber: string;
    serviceName: string;
    totalPriceGross: number;
};

function getApiToken(): string {
    return import.meta.env.FAKTURAXL_API_TOKEN || '';
}

function getBaseUrl(): string {
    return (import.meta.env.FAKTURAXL_API_URL || 'https://api.fakturaxl.pl').replace(/\/$/, '');
}

export async function createInvoice(input: CreateInvoiceInput): Promise<{ id: number } | null> {
    const token = getApiToken();
    if (!token) return null;
    const body = {
        api_token: token,
        invoice: {
            kind: 'vat',
            number: input.orderNumber,
            sell_date: new Date().toISOString().slice(0, 10),
            payment_to: new Date().toISOString().slice(0, 10),
            buyer_name: input.client.companyName,
            buyer_email: input.client.email,
            buyer_tax_no: input.client.taxNo || '',
            buyer_street: input.client.street || '',
            buyer_city: input.client.city || '',
            buyer_post_code: input.client.postCode || '',
            positions: [{ name: input.serviceName, total_price_gross: input.totalPriceGross, quantity: 1 }]
        }
    };
    const res = await fetch(`${getBaseUrl()}/invoices.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!res.ok) return null;
    const data = await res.json();
    const invoiceId = data?.id || data?.invoice?.id;
    if (!invoiceId) return null;
    return { id: Number(invoiceId) };
}

export async function downloadInvoicePdf(invoiceId: number): Promise<Buffer | null> {
    const token = getApiToken();
    if (!token) return null;
    const res = await fetch(`${getBaseUrl()}/invoices/${invoiceId}.pdf?api_token=${encodeURIComponent(token)}`);
    if (!res.ok) return null;
    const arr = await res.arrayBuffer();
    return Buffer.from(arr);
}
