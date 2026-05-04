const env = (import.meta as any).env as Record<string, string | undefined>;

function getBaseUrl(): string {
    return (env.PAYLOAD_API_URL || env.PAYLOAD_URL || 'http://localhost:3001').replace(/\/$/, '');
}

function getHeaders(): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const apiKey = env.PAYLOAD_API_KEY;
    if (apiKey) headers.Authorization = `users API-Key ${apiKey}`;
    return headers;
}

export async function findSingle(collection: string, where: Record<string, string>): Promise<any | null> {
    const params = new URLSearchParams();
    Object.entries(where).forEach(([key, value]) => {
        params.set(`where[${key}][equals]`, value);
    });
    params.set('limit', '1');

    const res = await fetch(`${getBaseUrl()}/api/${collection}?${params.toString()}`, {
        headers: getHeaders(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.docs?.[0] || null;
}

export async function createDoc(collection: string, data: Record<string, unknown>): Promise<any | null> {
    const res = await fetch(`${getBaseUrl()}/api/${collection}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return await res.json();
}

export async function patchDoc(collection: string, id: string, data: Record<string, unknown>): Promise<any | null> {
    const res = await fetch(`${getBaseUrl()}/api/${collection}/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return await res.json();
}
