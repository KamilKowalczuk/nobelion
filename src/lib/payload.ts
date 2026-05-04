export function getPayloadBaseUrl(): string {
    return (import.meta.env.PAYLOAD_API_URL || import.meta.env.PAYLOAD_URL || 'http://localhost:3001').replace(/\/$/, '');
}

export function getPayloadHeaders(withJson = true): Record<string, string> {
    const headers: Record<string, string> = withJson ? { 'Content-Type': 'application/json' } : {};
    const apiKey = import.meta.env.PAYLOAD_API_KEY;
    if (apiKey) headers.Authorization = `users API-Key ${apiKey}`;
    return headers;
}

export async function payloadRequest(path: string, init: RequestInit = {}): Promise<Response> {
    const base = getPayloadBaseUrl();
    return fetch(`${base}${path}`, {
        ...init,
        headers: {
            ...getPayloadHeaders(),
            ...(init.headers || {})
        }
    });
}

export async function findSingle(collection: string, where: Record<string, string>): Promise<any | null> {
    const params = new URLSearchParams();
    params.set('limit', '1');
    for (const [field, value] of Object.entries(where)) {
        params.set(`where[${field}][equals]`, value);
    }
    const res = await payloadRequest(`/api/${collection}?${params.toString()}`, { method: 'GET' });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.docs?.[0] || null;
}

export async function createDoc(collection: string, data: Record<string, unknown>): Promise<any | null> {
    const res = await payloadRequest(`/api/${collection}`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
    if (!res.ok) return null;
    return await res.json();
}

export async function patchDoc(collection: string, id: string, data: Record<string, unknown>): Promise<any | null> {
    const res = await payloadRequest(`/api/${collection}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    });
    if (!res.ok) return null;
    return await res.json();
}
