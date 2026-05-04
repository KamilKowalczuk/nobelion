import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

let cache: Record<string, string> | null = null;

function load(): Record<string, string> {
    if (cache) return cache;
    const envPath = resolve(process.cwd(), 'nobelion-cms', '.env');
    let content: string;
    try {
        content = readFileSync(envPath, 'utf-8');
    } catch {
        return (cache = {});
    }
    cache = {};
    for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        cache[trimmed.slice(0, eqIdx)] = trimmed.slice(eqIdx + 1);
    }
    return cache;
}

export function backendEnv(key: string): string {
    return load()[key] || '';
}
