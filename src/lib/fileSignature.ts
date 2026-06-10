//
// Wykrywanie realnego typu pliku po sygnaturze bajtowej (magic bytes).
// Nagłówek MIME z przeglądarki (file.type) jest spoofowalny — ufamy zawartości.
//

export async function detectMime(file: File): Promise<string | null> {
    const buf = new Uint8Array(await file.slice(0, 16).arrayBuffer());
    const at = (sig: number[], offset = 0) => sig.every((b, i) => buf[offset + i] === b);

    if (at([0x25, 0x50, 0x44, 0x46])) return 'application/pdf';                 // %PDF
    if (at([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'image/png';
    if (at([0xff, 0xd8, 0xff])) return 'image/jpeg';
    if (at([0x47, 0x49, 0x46, 0x38])) return 'image/gif';                      // GIF8
    if (at([0x52, 0x49, 0x46, 0x46]) && at([0x57, 0x45, 0x42, 0x50], 8)) return 'image/webp'; // RIFF....WEBP
    return null;
}
