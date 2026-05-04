import { backendEnv } from './backend-env';

export type FakturaXlClientData = {
    companyName: string;
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

function getToken(): string {
    return backendEnv('FAKTURAXL_API_TOKEN') || '';
}

function getApiUrl(): string {
    return (backendEnv('FAKTURAXL_API_URL') || 'https://api.fakturaxl.pl').replace(/\/$/, '');
}

export async function createInvoice(input: CreateInvoiceInput): Promise<{ id: number } | null> {
    const token = getToken();
    if (!token) return null;

    const res = await fetch(`${getApiUrl()}/invoices`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const id = Number(data?.id);
    if (!id) return null;
    return { id };
}

export async function downloadInvoicePdf(invoiceId: number): Promise<Buffer | null> {
    const token = getToken();
    if (!token) return null;

    const res = await fetch(`${getApiUrl()}/invoices/${invoiceId}/pdf`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) return null;
    const bytes = await res.arrayBuffer();
    return Buffer.from(bytes);
}
