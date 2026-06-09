import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

//
// Pełny renderer Markdown -> HTML oparty o markdown-it (CommonMark + GFM).
// Obsługuje: nagłówki, pogrubienie, kursywę, przekreślenie, kod, cytaty,
// listy (zagnieżdżone), TABELE, linie poziome, linki, autolinki, obrazy, akapity.
// html:false + sanitize-html = brak surowego HTML ze źródła (bezpieczne dla set:html).
//

const md = new MarkdownIt({
    html: false,        // surowy HTML w treści jest ignorowany/escapowany
    linkify: true,      // automatyczne linkowanie adresów URL
    breaks: true,       // pojedynczy enter -> <br>
    typographer: true,  // ładne cudzysłowy i myślniki
});

const SANITIZE_OPTS: sanitizeHtml.IOptions = {
    allowedTags: [
        'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's', 'del', 'ins', 'mark', 'small', 'sub', 'sup',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li',
        'a', 'blockquote', 'code', 'pre', 'hr', 'img', 'span',
        'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
    ],
    allowedAttributes: {
        a: ['href', 'target', 'rel'],
        img: ['src', 'alt', 'title'],
        th: ['style', 'colspan', 'rowspan', 'scope'],
        td: ['style', 'colspan', 'rowspan'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    // Zachowujemy tylko wyrównanie tekstu w tabelach (markdown-it używa text-align).
    allowedStyles: {
        '*': { 'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/] },
    },
    transformTags: {
        a: (_tag, attribs) => ({
            tagName: 'a',
            attribs: { ...attribs, target: '_blank', rel: 'noopener noreferrer' },
        }),
    },
};

export function renderMarkdown(src: unknown): string {
    if (typeof src !== 'string' || !src.trim()) return '';
    const html = md.render(src);
    return sanitizeHtml(html, SANITIZE_OPTS);
}
