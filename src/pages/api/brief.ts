import type { APIRoute } from 'astro';
import { createDoc, uploadFile } from '../../lib/payload';
import { sendBriefConfirmation, sendInternalNewBrief } from '../../lib/email';
import sanitizeHtml from 'sanitize-html';

export const prerender = false;

type BriefBody = {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    nip?: string;
    problem?: string;
    diagnosis?: string;
    industry?: string;
    size?: string;
    tools?: string;
    budget?: string;
    urgency?: string;
    scope?: string;
    peopleInvolved?: string;
    hoursWeek?: number;
    laborRate?: string;
    growsWithScale?: string;
    triedBefore?: string[];
    triedNotes?: string;
    agreedPrivacy?: boolean;
    agreedTerms?: boolean;
    honeypot?: string;
};

type PayloadUploadDoc = {
    id: string | number;
};

function isEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Funkcja usuwająca wszystkie tagi HTML (bardzo rygorystycznie)
function sanitizeInput(text: string | undefined): string {
    if (!text) return '';
    return sanitizeHtml(text, {
        allowedTags: [],
        allowedAttributes: {},
    }).trim();
}

function normalizeUrgency(value?: string): string | undefined {
    if (!value) return undefined;
    const normalized = value.trim().toLowerCase();
    if (normalized === 'palace') return 'urgent';
    if (normalized === 'miesiac') return 'high';
    if (normalized === 'kwartal') return 'medium';
    if (normalized === 'rozwazam') return 'low';
    if (normalized === 'urgent' || normalized === 'high' || normalized === 'medium' || normalized === 'low') return normalized;
    return undefined;
}

function validate(body: BriefBody): string | null {
    if ((body.honeypot || '').trim() !== '') return 'Bot detected';
    if (!body.name || body.name.length < 2) return 'Nieprawidłowe imię i nazwisko';
    if (!body.email || !isEmail(body.email)) return 'Nieprawidłowy email';
    if (!body.company || body.company.length < 2) return 'Nieprawidłowa nazwa firmy';
    if (!body.problem || body.problem.length < 30) return 'Opis problemu musi mieć min. 30 znaków';
    if (!body.agreedPrivacy || !body.agreedTerms) return 'Wymagane zgody nie zostały zaakceptowane';
    return null;
}

export const POST: APIRoute = async ({ request }) => {
    let body: BriefBody;
    let files: File[] = [];

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
        let formData: FormData;
        try {
            formData = await request.formData();
        } catch {
            return new Response(JSON.stringify({ error: 'Nieprawidłowe dane formularza' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        const dataRaw = formData.get('data');
        if (typeof dataRaw !== 'string') {
            return new Response(JSON.stringify({ error: 'Brak danych briefu' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        try {
            body = JSON.parse(dataRaw) as BriefBody;
        } catch {
            return new Response(JSON.stringify({ error: 'Nieprawidłowy JSON w polu data' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        files = formData.getAll('attachments').filter((entry): entry is File => entry instanceof File && entry.size > 0);
    } else {
        try {
            body = await request.json();
        } catch {
            return new Response(JSON.stringify({ error: 'Nieprawidłowy JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
    }

    const sanitizedBody: BriefBody = {
        ...body,
        name: sanitizeInput(body.name),
        email: (body.email || '').trim(),
        phone: (body.phone || '').trim(),
        company: sanitizeInput(body.company),
        nip: (body.nip || '').trim(),
        problem: sanitizeInput(body.problem),
        tools: sanitizeInput(body.tools),
        triedNotes: sanitizeInput(body.triedNotes),
        triedBefore: Array.isArray(body.triedBefore) ? body.triedBefore.map(t => sanitizeInput(t)) : [],
    };

    const error = validate(sanitizedBody);
    if (error === 'Bot detected') return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    if (error) return new Response(JSON.stringify({ error }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    try {
        const uploadedAttachmentIds: Array<string | number> = [];
        const allowedMimeTypes = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/gif']);
        for (const file of files) {
            if (!allowedMimeTypes.has(file.type)) {
                return new Response(JSON.stringify({ error: 'Dozwolone są tylko pliki PDF oraz obrazy.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
            }
            if (file.size > 10 * 1024 * 1024) {
                return new Response(JSON.stringify({ error: 'Każdy załącznik może mieć maksymalnie 10 MB.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
            }
        }
        if (files.length > 5) {
            return new Response(JSON.stringify({ error: 'Maksymalnie 5 załączników.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        for (const file of files) {
            const uploaded = await uploadFile('media', file) as PayloadUploadDoc | null;
            if (!uploaded?.id) {
                console.error('[brief API] Upload attachment failed or returned no id:', JSON.stringify(uploaded));
                return new Response(JSON.stringify({ error: 'Nie udało się przesłać załączników.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
            }
            uploadedAttachmentIds.push(uploaded.id);
        }

        const payloadDoc = await createDoc('briefs', {
            clientName: sanitizedBody.name,
            clientEmail: sanitizedBody.email,
            phone: sanitizedBody.phone,
            company: sanitizedBody.company,
            nip: sanitizedBody.nip,
            diagnosis: sanitizedBody.diagnosis || undefined,
            industry: sanitizedBody.industry || '',
            size: sanitizedBody.size || '',
            tools: sanitizedBody.tools,
            problemDescription: sanitizedBody.problem,
            attachments: uploadedAttachmentIds,
            hoursWeek: Number(sanitizedBody.hoursWeek || 0),
            laborRate: (sanitizedBody.laborRate === 'low' || sanitizedBody.laborRate === 'mid' || sanitizedBody.laborRate === 'high') ? sanitizedBody.laborRate : 'mid',
            peopleInvolved: sanitizedBody.peopleInvolved || '',
            growsWithScale: sanitizedBody.growsWithScale || '',
            triedBefore: sanitizedBody.triedBefore,
            triedNotes: sanitizedBody.triedNotes,
            urgency: normalizeUrgency(sanitizedBody.urgency),
            scope: sanitizedBody.scope || undefined,
            budget: sanitizedBody.budget || '',
            agreedPrivacy: !!sanitizedBody.agreedPrivacy,
            agreedTerms: !!sanitizedBody.agreedTerms,
            status: 'new',
            source: 'brief-form'
        });

        if (!payloadDoc || payloadDoc.error) {
            console.error('[brief API] Payload FULL response:', JSON.stringify(payloadDoc, null, 2));
            console.error('[brief API] Payload status:', payloadDoc?.status);
            console.error('[brief API] Payload body:', payloadDoc?.body);
            return new Response(JSON.stringify({ 
                error: 'Nie udało się zapisać briefu - odrzucenie po stronie serwera.'
            }), { 
                status: 500, 
                headers: { 'Content-Type': 'application/json' } 
            });
        }

        await Promise.allSettled([
            sendBriefConfirmation({ email: sanitizedBody.email!, name: sanitizedBody.name!, company: sanitizedBody.company!, problemDescription: sanitizedBody.problem! }),
            sendInternalNewBrief({ email: sanitizedBody.email!, name: sanitizedBody.name!, company: sanitizedBody.company!, problemDescription: sanitizedBody.problem! })
        ]);

        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err: any) {
        console.error('[brief API] Nieoczekiwany błąd:', err?.message || err);
        // Zwracamy generyczny komunikat błędu
        return new Response(JSON.stringify({ error: 'Wewnętrzny błąd serwera' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};
