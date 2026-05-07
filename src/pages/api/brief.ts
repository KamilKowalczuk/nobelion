import type { APIRoute } from 'astro';
import { createDoc } from '../../lib/payload';
import { sendBriefConfirmation, sendInternalNewBrief } from '../../lib/email';

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

function validate(body: BriefBody): string | null {
    if ((body.honeypot || '').trim() !== '') return 'Bot detected';
    if (!body.name || body.name.trim().length < 2) return 'Nieprawidłowe imię i nazwisko';
    if (!body.email || !isEmail(body.email)) return 'Nieprawidłowy email';
    if (!body.company || body.company.trim().length < 2) return 'Nieprawidłowa nazwa firmy';
    if (!body.problem || body.problem.trim().length < 30) return 'Opis problemu musi mieć min. 30 znaków';
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
    const error = validate(body);
    if (error === 'Bot detected') return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    if (error) return new Response(JSON.stringify({ error }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    try {
        const payloadDoc = await createDoc('briefs', {
            clientName: body.name?.trim(),
            clientEmail: body.email?.trim(),
            phone: body.phone?.trim() || '',
            company: body.company?.trim(),
            nip: body.nip?.trim() || '',
            diagnosis: body.diagnosis || '',
            industry: body.industry || '',
            size: body.size || '',
            tools: body.tools || '',
            problemDescription: body.problem?.trim(),
            hoursWeek: Number(body.hoursWeek || 0),
            peopleInvolved: body.peopleInvolved || '',
            growsWithScale: body.growsWithScale || '',
            triedBefore: body.triedBefore || [],
            triedNotes: body.triedNotes?.trim() || '',
            urgency: body.urgency || '',
            scope: body.scope || '',
            budget: body.budget || '',
            agreedPrivacy: !!body.agreedPrivacy,
            agreedTerms: !!body.agreedTerms,
            status: 'new',
            source: 'brief-form'
        });

        if (!payloadDoc) {
            console.error('[brief API] createDoc zwrócił null — Payload odrzucił request');
            return new Response(JSON.stringify({ error: 'Nie udało się zapisać briefu' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        await Promise.allSettled([
            sendBriefConfirmation({ email: body.email!.trim(), name: body.name!.trim(), company: body.company!.trim(), problemDescription: body.problem!.trim() }),
            sendInternalNewBrief({ email: body.email!.trim(), name: body.name!.trim(), company: body.company!.trim(), problemDescription: body.problem!.trim() })
        ]);

        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err: any) {
        console.error('[brief API] Nieoczekiwany błąd:', err?.message || err);
        return new Response(JSON.stringify({ error: 'Wewnętrzny błąd serwera', details: err?.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};
