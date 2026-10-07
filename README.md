# ESCO — sito web

Sito del listening bar ESCO (Bari), costruito sul design "ESCO — Sito web"
e sul design system ESCO (token in `design/esco-tokens.json`).

**Stack:** Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · CSS Modules · Zod.
Nessun framework CSS: il design è bianco/nero con pochi token, bastano variabili CSS.

## Avvio

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build di produzione
npm run lint
```

## Struttura

```
src/
├── app/                      # Routing (App Router)
│   ├── layout.tsx            # Font Redaction, Header/Footer, metadata
│   ├── globals.css           # Token del design system + classi tipografiche (t-*)
│   ├── page.tsx              # Home
│   ├── eventi/page.tsx       # Eventi (prossimi + archivio)
│   ├── prenota/
│   │   ├── page.tsx          # Prenota
│   │   └── actions.ts        # Server Action del form
│   ├── fonts/                # Redaction 35 / Redaction 10 (woff2)
│   ├── icon.svg, sitemap.ts, robots.ts, not-found.tsx
├── components/
│   ├── ui/                   # Button, Tag, LabeledSection, PageHero
│   ├── layout/               # Header (menu mobile), Footer
│   ├── home/                 # Sezioni della home (Hero, Locale, Orari, …)
│   ├── eventi/               # Righe evento (prossimi/archivio)
│   └── prenota/              # BookingForm (client)
├── content/                  # ⇐ TESTI E DATI DA AGGIORNARE
│   ├── site.ts               # Indirizzo, orari, Instagram, regole prenotazione, menu
│   └── events.ts             # Elenco eventi
├── lib/
│   ├── reservation.ts        # Schema Zod + tipi della prenotazione
│   └── reservation-delivery.ts  # Dove viene inoltrata la prenotazione
└── assets/images/            # Foto (ottimizzate da next/image)
public/brand/esco-logo.svg    # Logo
```

## Aggiornare i contenuti

- **Orari, indirizzo, Instagram, limiti tavolo/birthday:** `src/content/site.ts`.
- **Nuovo evento:** aggiungi un oggetto in `src/content/events.ts`. Gli eventi con `date`
  passata finiscono da soli in "Archivio" (la lista si ricalcola ogni ora). Per i poster
  metti l'immagine in `src/assets/images/` e importala in cima al file.

## Temi Paper / Night

Le sezioni usano `theme-paper` (bianco) o `theme-night` (nero). Dentro, i componenti usano solo
`var(--ground)` e `var(--ink)`, quindi bottoni e tag si invertono da soli.

## Prenotazioni

Il form valida i dati lato server (`src/lib/reservation.ts`) e poi li inoltra tramite
`deliverReservation()`:

- imposta `RESERVATION_WEBHOOK_URL` (vedi `.env.example`) con un webhook che riceve JSON:
  Make/Zapier/n8n, Slack, Discord, o un servizio email;
- in sviluppo, senza webhook, la richiesta viene stampata nella console del server;
- in produzione, senza webhook, il form mostra un errore (così nessuna richiesta va persa in silenzio).

## Da completare

- `site.url` in `src/content/site.ts`: dominio definitivo (usato per sitemap e Open Graph).
- `RESERVATION_WEBHOOK_URL` in produzione.
