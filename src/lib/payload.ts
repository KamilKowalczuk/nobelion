// Łączymy zmienne z Astro i z procesu Node/Netlify
const env = {
    ...(import.meta as any).env,
    ...process.env
} as Record<string, string | undefined>;

function getBaseUrl(): string {
    const url = (env.PAYLOAD_API_URL || env.PAYLOAD_URL || 'http://localhost:3001').replace(/\/$/, '');
    return url;
}

function getHeaders(json = true): Record<string, string> {
    const headers: Record<string, string> = {};
    if (json) {
        headers['Content-Type'] = 'application/json';
    }
    const apiKey = env.PAYLOAD_API_KEY;
    if (apiKey && !apiKey.includes('PASTE_') && apiKey.length > 10) {
        headers.Authorization = `users API-Key ${apiKey}`;
    }
    return headers;
}

export async function findSingle(collection: string, where: Record<string, string>): Promise<any | null> {
    const params = new URLSearchParams();
    Object.entries(where).forEach(([key, value]) => {
        params.set(`where[${key}][equals]`, value);
    });
    params.set('limit', '1');

    const url = `${getBaseUrl()}/api/${collection}?${params.toString()}`;
    try {
        const res = await fetch(url, { headers: getHeaders() });
        if (!res.ok) {
            const body = await res.text().catch(() => '');
            console.error(`[payload] findSingle ${collection} failed: ${res.status}`, body);
            return null;
        }
        const data = await res.json();
        return data?.docs?.[0] || null;
    } catch (err: any) {
        console.error(`[payload] findSingle ${collection} network error:`, err?.message);
        return null;
    }
}

export async function createDoc(collection: string, data: Record<string, unknown>): Promise<any | null> {
    const url = `${getBaseUrl()}/api/${collection}`;
    console.log(`[payload] createDoc → POST ${url}`, JSON.stringify(data));
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const body = await res.text().catch(() => '');
            console.error(`[payload] createDoc ${collection} failed: ${res.status}`, body);
            // Zwracamy obiekt z błędem, żeby API mogło go przekazać dalej
            return { error: true, status: res.status, body };
        }
        return await res.json();
    } catch (err: any) {
        console.error(`[payload] createDoc ${collection} network error:`, err?.message);
        return { error: true, message: err?.message };
    }
}

export async function uploadFile(collection: string, file: File): Promise<any | null> {
    const url = `${getBaseUrl()}/api/${collection}`;
    const formData = new FormData();
    formData.set('file', file, file.name);
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: getHeaders(false),
            body: formData,
        });
        if (!res.ok) {
            const body = await res.text().catch(() => '');
            console.error(`[payload] uploadFile ${collection} failed: ${res.status}`, body);
            return null;
        }
        return await res.json();
    } catch (err: any) {
        console.error(`[payload] uploadFile ${collection} network error:`, err?.message);
        return null;
    }
}

export async function patchDoc(collection: string, id: string, data: Record<string, unknown>): Promise<any | null> {
    const url = `${getBaseUrl()}/api/${collection}/${id}`;
    try {
        const res = await fetch(url, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const body = await res.text().catch(() => '');
            console.error(`[payload] patchDoc ${collection}/${id} failed: ${res.status}`, body);
            return null;
        }
        return await res.json();
    } catch (err: any) {
        console.error(`[payload] patchDoc ${collection}/${id} network error:`, err?.message);
        return null;
    }
}
