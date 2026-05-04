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
    budget?: string;
    urgency?: string;
    peopleInvolved?: string;
    hoursWeek?: number;
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

    const payloadDoc = await createDoc('briefs', {
        name: body.name?.trim(),
        email: body.email?.trim(),
        phone: body.phone?.trim() || '',
        company: body.company?.trim(),
        nip: body.nip?.trim() || '',
        problemDescription: body.problem?.trim(),
        budget: body.budget || '',
        urgency: body.urgency || '',
        peopleInvolved: body.peopleInvolved || '',
        hoursWeek: Number(body.hoursWeek || 0),
        agreedPrivacy: !!body.agreedPrivacy,
        agreedTerms: !!body.agreedTerms,
        status: 'new',
        source: 'brief-form'
    });

    if (!payloadDoc) return new Response(JSON.stringify({ error: 'Nie udało się zapisać briefu' }), { status: 500, headers: { 'Content-Type': 'application/json' } });

    await Promise.allSettled([
        sendBriefConfirmation({ email: body.email!.trim(), name: body.name!.trim(), company: body.company!.trim(), problemDescription: body.problem!.trim() }),
        sendInternalNewBrief({ email: body.email!.trim(), name: body.name!.trim(), company: body.company!.trim(), problemDescription: body.problem!.trim() })
    ]);

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
