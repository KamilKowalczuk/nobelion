import { Resend } from 'resend';
import { backendEnv } from './backend-env';
import { renderBrandedEmail } from './email';

type DispatchInput = {
    toEmail: string;
    pdfBuffer: Buffer;
    orderNumber: string;
    serviceName: string;
    amountGross: number;
    isResend?: boolean;
};

export async function dispatchInvoiceEmailWithPdf(input: DispatchInput): Promise<boolean> {
    const apiKey = backendEnv('RESEND_API_KEY');
    const from = backendEnv('EMAIL_FROM') || 'kontakt@nobelion.pl';
    if (!apiKey) return false;

    const resend = new Resend(apiKey);

    const amountFormatted = new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
        maximumFractionDigits: 0,
    }).format(input.amountGross);

    const subject = input.isResend
        ? `Ponowna wysyłka faktury ${input.orderNumber} — Nobelion`
        : `Faktura ${input.orderNumber} — Nobelion`;

    const result = await resend.emails.send({
        from: `Nobelion <${from}>`,
        to: input.toEmail,
        subject,
        html: renderBrandedEmail({
            preheader: `Faktura ${input.orderNumber} za usługę: ${input.serviceName}`,
            eyebrow: input.isResend ? 'Ponowna wysyłka faktury' : 'Faktura VAT',
            title: `Faktura ${input.orderNumber}`,
            intro: `Dziękujemy za współpracę. W załączniku przesyłamy fakturę za zrealizowaną usługę.`,
            sections: [
                { label: 'Numer zamówienia', value: input.orderNumber },
                { label: 'Usługa', value: input.serviceName },
                { label: 'Kwota brutto', value: amountFormatted },
            ],
            note: 'Faktura w formacie PDF znajduje się w załączniku. W razie pytań odpowiedz na tę wiadomość lub napisz na kontakt@nobelion.pl.',
        }),
        attachments: [
            {
                filename: `faktura-${input.orderNumber}.pdf`,
                content: input.pdfBuffer,
            },
        ],
    });

    return !result.error;
}
