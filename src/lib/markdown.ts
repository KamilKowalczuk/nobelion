import sanitizeHtml from 'sanitize-html';

/*
 * Lekki, samodzielny renderer Markdown -> HTML (bez zależności zewnętrznych).
 * Obsługuje: nagłówki, pogrubienie, kursywę, kod inline, linki [tekst](url),
 * listy punktowane i numerowane, cytaty, linie poziome, akapity, łamanie linii.
 * Wynik jest sanityzowany (sanitize-html) - bezpieczny do wstrzyknięcia przez set:html.
 */

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function inline(text: string): string {
    let t = escapeHtml(text);
    // kod inline (najpierw, żeby nie formatować jego wnętrza)
    t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
    // linki [tekst](url)
    t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
    // pogrubienie
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    // kursywa
    t = t.replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, '$1<em>$2</em>');
    t = t.replace(/(^|[^_])_([^_\s][^_]*?)_/g, '$1<em>$2</em>');
    return t;
}

function mdToHtml(src: string): string {
    const lines = src.replace(/\r\n/g, '\n').split('\n');
    const out: string[] = [];
    let i = 0;

    const flushParagraph = (buf: string[]) => {
        if (buf.length) out.push(`<p>${buf.map(inline).join('<br>')}</p>`);
    };

    while (i < lines.length) {
        const line = lines[i];

        // pusta linia
        if (/^\s*$/.test(line)) { i++; continue; }

        // linia pozioma
        if (/^\s*([-*_])\1{2,}\s*$/.test(line)) { out.push('<hr>'); i++; continue; }

        // nagłówek
        const h = line.match(/^(#{1,6})\s+(.*)$/);
        if (h) { out.push(`<h${h[1].length}>${inline(h[2].trim())}</h${h[1].length}>`); i++; continue; }

        // cytat
        if (/^\s*>\s?/.test(line)) {
            const buf: string[] = [];
            while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
                buf.push(lines[i].replace(/^\s*>\s?/, ''));
                i++;
            }
            out.push(`<blockquote>${buf.map(inline).join('<br>')}</blockquote>`);
            continue;
        }

        // lista numerowana
        if (/^\s*\d+\.\s+/.test(line)) {
            const items: string[] = [];
            while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
                items.push(`<li>${inline(lines[i].replace(/^\s*\d+\.\s+/, ''))}</li>`);
                i++;
            }
            out.push(`<ol>${items.join('')}</ol>`);
            continue;
        }

        // lista punktowana
        if (/^\s*[-*]\s+/.test(line)) {
            const items: string[] = [];
            while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
                items.push(`<li>${inline(lines[i].replace(/^\s*[-*]\s+/, ''))}</li>`);
                i++;
            }
            out.push(`<ul>${items.join('')}</ul>`);
            continue;
        }

        // akapit (kolejne nie-puste linie)
        const buf: string[] = [];
        while (
            i < lines.length &&
            !/^\s*$/.test(lines[i]) &&
            !/^(#{1,6})\s+/.test(lines[i]) &&
            !/^\s*>\s?/.test(lines[i]) &&
            !/^\s*\d+\.\s+/.test(lines[i]) &&
            !/^\s*[-*]\s+/.test(lines[i]) &&
            !/^\s*([-*_])\1{2,}\s*$/.test(lines[i])
        ) {
            buf.push(lines[i]);
            i++;
        }
        flushParagraph(buf);
    }

    return out.join('\n');
}

export function renderMarkdown(src: unknown): string {
    if (typeof src !== 'string' || !src.trim()) return '';
    const html = mdToHtml(src);
    return sanitizeHtml(html, {
        allowedTags: ['p', 'br', 'strong', 'em', 'b', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'hr'],
        allowedAttributes: { a: ['href', 'target', 'rel'] },
        allowedSchemes: ['http', 'https', 'mailto', 'tel'],
        transformTags: {
            a: (tagName, attribs) => ({
                tagName: 'a',
                attribs: { ...attribs, target: '_blank', rel: 'noopener noreferrer' },
            }),
        },
    });
}
