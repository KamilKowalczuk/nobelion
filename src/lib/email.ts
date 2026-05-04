import { Resend } from 'resend';

type BriefEmailData = {
    email: string;
    name: string;
    company: string;
    problemDescription: string;
};

type PaymentEmailData = {
    email: string;
    orderNumber: string;
    amount: number;
    currency: string;
};

type PaymentLinkEmailData = {
    email: string;
    name?: string;
    company: string;
    amount: number;
    currency: string;
    checkoutUrl: string;
};

function getClient(): Resend | null {
    const key = import.meta.env.RESEND_API_KEY;
    if (!key) return null;
    return new Resend(key);
}

function getFrom(): string {
    return import.meta.env.EMAIL_FROM || 'kontakt@nobelion.pl';
}

function getInternal(): string {
    return import.meta.env.EMAIL_INTERNAL || 'kontakt@nobelion.pl';
}

export async function sendBriefConfirmation(data: BriefEmailData): Promise<void> {
    const resend = getClient();
    if (!resend) return;
    await resend.emails.send({
        from: `Nobelion <${getFrom()}>`,
        to: data.email,
        subject: 'Otrzymaliśmy Twój brief — Nobelion',
        html: `<p>Cześć ${data.name}, otrzymaliśmy brief od ${data.company}.</p><p>Wrócimy do Ciebie w 24h robocze.</p><p>${data.problemDescription}</p>`
    });
}

export async function sendInternalNewBrief(data: BriefEmailData): Promise<void> {
    const resend = getClient();
    if (!resend) return;
    await resend.emails.send({
        from: `Nobelion <${getFrom()}>`,
        to: getInternal(),
        subject: `Nowe zgłoszenie: ${data.company}`,
        html: `<p>Nowy brief od ${data.name} (${data.email}).</p><p>Firma: ${data.company}</p><p>${data.problemDescription}</p>`
    });
}

export async function sendPaymentLinkEmail(data: PaymentLinkEmailData): Promise<void> {
    const resend = getClient();
    if (!resend) return;
    const amountText = `${data.amount.toFixed(2)} ${data.currency.toUpperCase()}`;
    const displayName = (data.name || '').trim() || 'Dzień dobry';
    await resend.emails.send({
        from: `Nobelion <${getFrom()}>`,
        to: data.email,
        subject: `Link do płatności — ${data.company}`,
        html: `<div style="max-width:600px;margin:0 auto;padding:24px 20px;background:#0f1722;color:#e8e6df;font-family:Manrope,Arial,sans-serif;"><h1 style="margin:0 0 14px;font-family:Georgia,Times New Roman,serif;color:#C5A059;font-size:28px;line-height:1.2;">Nobelion</h1><p style="margin:0 0 14px;font-size:16px;line-height:1.6;">${displayName},</p><p style="margin:0 0 14px;font-size:16px;line-height:1.6;">po weryfikacji briefu dla <strong>${data.company}</strong> przygotowaliśmy płatność za wdrożenie.</p><p style="margin:0 0 22px;font-size:16px;line-height:1.6;">Kwota: <strong>${amountText}</strong></p><a href="${data.checkoutUrl}" style="display:inline-block;background:#C5A059;color:#0f1722;text-decoration:none;padding:12px 22px;border-radius:6px;font-weight:700;">Przejdź do płatności</a><p style="margin:22px 0 0;font-size:13px;line-height:1.5;color:#b8b6ae;">Jeśli przycisk nie działa, skopiuj ten adres: ${data.checkoutUrl}</p></div>`
    });
}

export async function sendPaymentConfirmation(data: PaymentEmailData): Promise<void> {
    const resend = getClient();
    if (!resend) return;
    await resend.emails.send({
        from: `Nobelion <${getFrom()}>`,
        to: data.email,
        subject: 'Płatność potwierdzona — zaczynamy',
        html: `<p>Dziękujemy za płatność.</p><p>Numer zamówienia: ${data.orderNumber}</p><p>Kwota: ${data.amount} ${data.currency.toUpperCase()}</p>`
    });
}
