import { Resend } from 'resend';

type DispatchInput = {
    toEmail: string;
    pdfBuffer: Buffer;
    orderNumber: string;
    serviceName: string;
    amountGross: number;
    isResend?: boolean;
};

export async function dispatchInvoiceEmailWithPdf(input: DispatchInput): Promise<boolean> {
    const apiKey = import.meta.env.RESEND_API_KEY;
    const from = import.meta.env.EMAIL_FROM || 'kontakt@nobelion.pl';
    if (!apiKey) return false;
    const resend = new Resend(apiKey);
    const subject = input.isResend
        ? `Ponowna wysyłka faktury ${input.orderNumber}`
        : `Faktura ${input.orderNumber}`;
    const html = `<p>Dziękujemy za płatność.</p><p>Zamówienie: <strong>${input.orderNumber}</strong></p><p>Usługa: ${input.serviceName}</p><p>Kwota: ${input.amountGross} PLN</p>`;
    const result = await resend.emails.send({
        from: `Nobelion <${from}>`,
        to: input.toEmail,
        subject,
        html,
        attachments: [{
            filename: `faktura-${input.orderNumber}.pdf`,
            content: input.pdfBuffer.toString('base64')
        }]
    });
    return !result.error;
}
