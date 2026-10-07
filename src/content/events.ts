// Eventi: aggiungere qui i nuovi appuntamenti. `date` in formato ISO serve
// per ordinare e per decidere cosa è "prossimo" e cosa è "archivio".

import { cacheLife } from "next/cache";
import type { StaticImageData } from "next/image";
import posterOpeningAct from "@/assets/images/poster-opening-act.jpg";
import posterSonoMetropolitan from "@/assets/images/poster-sono-metropolitan.jpg";

export type EscoEvent = {
  slug: string;
  title: string;
  /** Data ISO (YYYY-MM-DD). Assente per gli appuntamenti ricorrenti. */
  date?: string;
  /** Etichetta mostrata al posto della data (es. "Sab & dom"). */
  dateLabel?: string;
  time?: string;
  subtitle: string;
  /** Riga breve per l'anteprima in home. */
  teaser: string;
  badge?: { label: string; inverted?: boolean };
  recurring?: boolean;
  poster?: { src: StaticImageData; alt: string };
};

export const events: EscoEvent[] = [
  {
    slug: "side-b-soul-jazz",
    title: "Side B — Soul & jazz dal vinile",
    date: "2026-10-24",
    time: "21:00",
    subtitle: "Selector: Nico Brillo · Solo lati B, solo vinile",
    teaser: "Nico Brillo · 21:00",
    badge: { label: "Ingresso libero" },
  },
  {
    slug: "wake-n-bake",
    title: "Wake ‘n’ bake",
    dateLabel: "Sab & dom",
    time: "10:30 - 15:00",
    subtitle: "Ogni weekend · Colazione e vinili",
    teaser: "Ogni weekend",
    badge: { label: "Ogni settimana", inverted: true },
    recurring: true,
  },
  {
    slug: "sono-metropolitan-fest",
    title: "Esco × Sono Metropolitan Fest",
    date: "2026-09-05",
    subtitle: "Premium bar · Arena del Levante, Bari",
    teaser: "Archivio",
    poster: {
      src: posterSonoMetropolitan,
      alt: "Poster ESCO per Sono Metropolitan Fest con la line-up",
    },
  },
  {
    slug: "opening-act",
    title: "Opening act",
    date: "2026-04-02",
    time: "19:00",
    subtitle: "Vinyl & friends · Via Giuseppe Palmieri, 29",
    teaser: "Archivio",
    poster: {
      src: posterOpeningAct,
      alt: "Poster Opening Act su alluminio spazzolato",
    },
  },
];

/**
 * Divide gli eventi in prossimi (per data, poi i ricorrenti) e archivio (dal più recente).
 * Il risultato resta in cache qualche ora, così gli eventi passano in archivio da soli.
 */
export async function getEventLists(): Promise<{ upcoming: EscoEvent[]; past: EscoEvent[] }> {
  "use cache";
  cacheLife("hours");

  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(new Date());
  const dated = events.filter((e) => e.date);
  return {
    upcoming: [
      ...dated.filter((e) => e.date! >= today).sort((a, b) => a.date!.localeCompare(b.date!)),
      ...events.filter((e) => e.recurring),
    ],
    past: dated.filter((e) => e.date! < today).sort((a, b) => b.date!.localeCompare(a.date!)),
  };
}

/** "2026-10-24" → "24.10" (o "24.10.2026" con l'anno). */
export function formatDate(iso: string, withYear = false): string {
  const [y, m, d] = iso.split("-");
  return withYear ? `${d}.${m}.${y}` : `${d}.${m}`;
}
