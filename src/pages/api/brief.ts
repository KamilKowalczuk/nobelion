import type { APIRoute } from 'astro';
import { createDoc } from '../../lib/payload';
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
    growsWithScale?: string;
    triedBefore?: string[];
    triedNotes?: string;
    agreedPrivacy?: boolean;
    agreedTerms?: boolean;
    honeypot?: string;
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
    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: 'Nieprawidłowy JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Sanityzacja danych wejściowych przed walidacją (ochrona XSS w Payload admin panel i mailach)
    // UWAGA: email i phone NIE przechodzą przez sanitize-html — mają własną walidację
    //         i sanitizer HTML może uszkodzić znaki specjalne (np. @ w adresie email)
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
            hoursWeek: Number(sanitizedBody.hoursWeek || 0),
            peopleInvolved: sanitizedBody.peopleInvolved || '',
            growsWithScale: sanitizedBody.growsWithScale || '',
            triedBefore: sanitizedBody.triedBefore,
            triedNotes: sanitizedBody.triedNotes,
            urgency: sanitizedBody.urgency || undefined,
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
