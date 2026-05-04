import { Resend } from 'resend';
import { backendEnv } from './backend-env';

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

    const result = await resend.emails.send({
        from,
        to: input.toEmail,
        subject: input.isResend ? `Ponowna wysyłka faktury ${input.orderNumber}` : `Faktura ${input.orderNumber}`,
        html: `<p>Dzień dobry,</p><p>W załączniku przesyłamy fakturę za usługę: ${input.serviceName}.</p><p>Kwota brutto: ${input.amountGross} PLN.</p>`,
        attachments: [
            {
                filename: `faktura-${input.orderNumber}.pdf`,
                content: input.pdfBuffer,
            },
        ],
    });

    return !result.error;
}
