# Nobelion — Frontend (Onyx)

Strona główna i obsługa klienta agencji [nobelion.pl](https://nobelion.pl):
landing, formularz briefu, strona wyceny dla klienta, płatności Stripe.

## Stack

- **Astro 5** (hybrid SSR, adapter Netlify) + **Svelte 5** (wyspy interaktywne) + **Tailwind CSS 4**
- Backend: Payload CMS 3 (osobne repozytorium `nobelion-cms`, produkcja: `admin.nobelion.pl`)
- Integracje: Stripe (Checkout), Resend (e-maile transakcyjne), FakturaXL (faktury)

## Struktura

```
src/
  pages/              strona główna, /wycena/[token], /dziekujemy, /blad-platnosci
  pages/api/          brief, send-payment-link, invoices/*, stripe/verify-session
  components/         sections (Astro, statyczne) + core/ui (Svelte, wyspy)
  lib/                klient Payload, e-maile, FakturaXL, walidacja, rate limit
  middleware.ts       baseline nagłówków bezpieczeństwa dla odpowiedzi SSR
netlify/edge-functions/security-headers.ts   kanoniczne CSP + nagłówki dla stron
```

## Uruchomienie

```sh
npm install
cp .env.example .env   # uzupełnij klucze (Payload, Stripe, Resend, FakturaXL)
npm run dev            # http://localhost:4321
```

Pełny flow wymaga działającego CMS (`nobelion-cms`, port 3001).

## Komendy

| Komenda           | Działanie                          |
| :---------------- | :--------------------------------- |
| `npm run dev`     | Serwer deweloperski                |
| `npm run build`   | Build produkcyjny do `./dist/`     |
| `npm run preview` | Podgląd builda                     |
| `npx astro check` | Typecheck                          |

## Deploy

Netlify — build `npm run build`, publish `dist/`. Zmienne środowiskowe z `.env.example`
ustawiane w panelu Netlify. Webhook Stripe wskazuje **wyłącznie** na CMS
(`https://admin.nobelion.pl/api/stripe/webhook`); endpoint `/api/stripe-webhook`
w tym repo to świadomy no-op (do czasu usunięcia starego URL-a z panelu Stripe).
