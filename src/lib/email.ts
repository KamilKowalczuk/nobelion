import { Resend } from 'resend';
import { backendEnv } from './backend-env';

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

type EmailSection = {
    label: string;
    value: string;
};

type BrandedEmailData = {
    preheader: string;
    eyebrow: string;
    title: string;
    intro: string;
    sections?: EmailSection[];
    cta?: {
        label: string;
        url: string;
    };
    note?: string;
};

function getClient(): Resend | null {
    const key = backendEnv('RESEND_API_KEY');
    if (!key) return null;
    return new Resend(key);
}

function getFrom(): string {
    return backendEnv('EMAIL_FROM') || 'kontakt@nobelion.pl';
}

function getInternal(): string {
    return backendEnv('EMAIL_INTERNAL') || 'kontakt@nobelion.pl';
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatMoney(amount: number, currency = 'pln'): string {
    return new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: currency.toUpperCase(),
        maximumFractionDigits: 0,
    }).format(amount);
}

export function renderBrandedEmail({ preheader, eyebrow, title, intro, sections = [], cta, note }: BrandedEmailData): string {
    const sectionHtml = sections.map(section => `
        <tr>
            <td style="padding:18px 0;border-top:1px solid rgba(232,230,223,0.12);">
                <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#C5A059;margin-bottom:8px;">${escapeHtml(section.label)}</div>
                <div style="font-size:16px;line-height:1.65;color:#F7F4ED;">${escapeHtml(section.value).replace(/\n/g, '<br>')}</div>
            </td>
        </tr>
    `).join('');

    const ctaHtml = cta ? `
        <tr>
            <td align="center" style="padding:34px 0 10px;">
                <a href="${escapeHtml(cta.url)}" style="display:inline-block;background:#C5A059;color:#080B10;text-decoration:none;font-family:Arial,sans-serif;font-weight:700;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;padding:17px 28px;border-radius:999px;box-shadow:0 18px 42px rgba(197,160,89,0.22);">${escapeHtml(cta.label)}</a>
            </td>
        </tr>
        <tr>
            <td style="padding:12px 0 0;text-align:center;font-size:12px;line-height:1.6;color:#9CA3AF;">
                Jeśli przycisk nie działa, skopiuj adres:<br><span style="color:#C5A059;word-break:break-all;">${escapeHtml(cta.url)}</span>
            </td>
        </tr>
    ` : '';

    const noteHtml = note ? `
        <tr>
            <td style="padding:22px 0 0;font-size:14px;line-height:1.7;color:#B8B6AE;">${escapeHtml(note).replace(/\n/g, '<br>')}</td>
        </tr>
    ` : '';

    return `<!doctype html>
<html lang="pl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Nobelion</title>
</head>
<body style="margin:0;padding:0;background:#080B10;color:#F7F4ED;font-family:Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;color:transparent;opacity:0;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#080B10;background-image:linear-gradient(135deg,#080B10 0%,#101722 55%,#080B10 100%);padding:32px 14px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;border:1px solid rgba(197,160,89,0.22);background:#101722;border-radius:28px;overflow:hidden;box-shadow:0 28px 90px rgba(0,0,0,0.42);">
                    <tr>
                        <td style="padding:34px 34px 20px;background:linear-gradient(135deg,rgba(197,160,89,0.16),rgba(255,255,255,0.02));border-bottom:1px solid rgba(232,230,223,0.08);">
                            <div style="font-family:Georgia,'Times New Roman',serif;font-size:24px;letter-spacing:0.24em;color:#F7F4ED;text-transform:uppercase;">Nobelion</div>
                            <div style="margin-top:22px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#C5A059;">${escapeHtml(eyebrow)}</div>
                            <h1 style="margin:14px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.16;font-weight:400;color:#F7F4ED;">${escapeHtml(title)}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:30px 34px 36px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="font-size:17px;line-height:1.75;color:#D8D5CB;">${escapeHtml(intro).replace(/\n/g, '<br>')}</td>
                                </tr>
                                ${sectionHtml}
                                ${ctaHtml}
                                ${noteHtml}
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:22px 34px 30px;border-top:1px solid rgba(232,230,223,0.08);font-size:12px;line-height:1.7;color:#838A96;text-align:center;">
                            Nobelion Sp. z o.o. · Automatyzacje AI i systemy dla firm<br>
                            <a href="https://nobelion.pl" style="color:#C5A059;text-decoration:none;">nobelion.pl</a> · <a href="mailto:kontakt@nobelion.pl" style="color:#C5A059;text-decoration:none;">kontakt@nobelion.pl</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

export async function sendBriefConfirmation(data: BriefEmailData): Promise<void> {
    const resend = getClient();
    if (!resend) return;
    await resend.emails.send({
        from: `Nobelion <${getFrom()}>`,
        to: data.email,
        subject: 'Otrzymaliśmy Twój brief — Nobelion',
        html: renderBrandedEmail({
            preheader: 'Brief został przyjęty. Wracamy z konkretną odpowiedzią w ciągu 24 godzin roboczych.',
            eyebrow: 'Brief przyjęty',
            title: `Dziękujemy, ${data.name}`,
            intro: `Otrzymaliśmy brief dla ${data.company}. Teraz analizujemy zakres, potencjał automatyzacji i najkrótszą drogę do sensownego wdrożenia.`,
            sections: [
                { label: 'Co dalej', value: 'W ciągu 24 godzin roboczych wrócimy z odpowiedzią, pytaniami doprecyzowującymi albo konkretną propozycją następnego kroku.' },
                { label: 'Opis wyzwania', value: data.problemDescription },
            ],
            note: 'Nie musisz odpowiadać na tę wiadomość, chyba że chcesz dopisać coś ważnego do briefu.',
        }),
    });
}

export async function sendInternalNewBrief(data: BriefEmailData): Promise<void> {
    const resend = getClient();
    if (!resend) return;
    await resend.emails.send({
        from: `Nobelion <${getFrom()}>`,
        to: getInternal(),
        subject: `Nowe zgłoszenie: ${data.company}`,
        html: renderBrandedEmail({
            preheader: `Nowy brief od ${data.company}`,
            eyebrow: 'Nowy brief',
            title: data.company,
            intro: `Nowe zgłoszenie od ${data.name}.`,
            sections: [
                { label: 'Kontakt', value: `${data.name}\n${data.email}` },
                { label: 'Firma', value: data.company },
                { label: 'Opis problemu', value: data.problemDescription },
            ],
        }),
    });
}

export async function sendPaymentLinkEmail(data: PaymentLinkEmailData): Promise<void> {
    const resend = getClient();
    if (!resend) return;
    const amountText = formatMoney(data.amount, data.currency);
    const displayName = (data.name || '').trim() || 'Dzień dobry';
    await resend.emails.send({
        from: `Nobelion <${getFrom()}>`,
        to: data.email,
        subject: `Link do płatności — ${data.company}`,
        html: renderBrandedEmail({
            preheader: `Bezpieczny link do płatności za projekt ${data.company}.`,
            eyebrow: 'Płatność',
            title: 'Link do płatności',
            intro: `${displayName}, przygotowaliśmy bezpieczny link płatności dla projektu ${data.company}.`,
            sections: [
                { label: 'Kwota', value: amountText },
                { label: 'Firma', value: data.company },
            ],
            cta: {
                label: 'Przejdź do płatności',
                url: data.checkoutUrl,
            },
            note: 'Płatność obsługuje Stripe. Po zaksięgowaniu płatności otrzymasz potwierdzenie i przechodzimy do kolejnego etapu.',
        }),
    });
}

export async function sendPaymentConfirmation(data: PaymentEmailData): Promise<void> {
    const resend = getClient();
    if (!resend) return;
    await resend.emails.send({
        from: `Nobelion <${getFrom()}>`,
        to: data.email,
        subject: 'Płatność potwierdzona — zaczynamy',
        html: renderBrandedEmail({
            preheader: 'Płatność została potwierdzona. Rozpoczynamy realizację kolejnego etapu.',
            eyebrow: 'Płatność potwierdzona',
            title: 'Zaczynamy',
            intro: 'Dziękujemy za płatność. Zamówienie zostało potwierdzone i przechodzimy do realizacji ustalonego zakresu.',
            sections: [
                { label: 'Numer zamówienia', value: data.orderNumber },
                { label: 'Kwota', value: formatMoney(data.amount, data.currency) },
            ],
        }),
    });
}
