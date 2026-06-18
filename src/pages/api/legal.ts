import type { APIRoute } from 'astro';
import { getApiUrl, API_ENDPOINTS } from '../../lib/constants';
import { renderMarkdown } from '../../lib/markdown';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const apiUrl = getApiUrl();
    const res = await fetch(`${apiUrl}${API_ENDPOINTS.publicDocuments()}`);
    
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch' }), { status: res.status });
    }

    const data = await res.json();
    const legalDocs: Record<string, { title: string; html: string; version?: string }> = {};
    
    for (const d of (data.documents || [])) {
      legalDocs[d.docType] = { 
        title: d.title, 
        html: renderMarkdown(d.content), 
        version: d.version 
      };
    }

    return new Response(JSON.stringify(legalDocs), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
