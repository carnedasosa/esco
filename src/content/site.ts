// Informazioni del locale: unica fonte per header, footer, home e metadata.

export const site = {
  name: "ESCO",
  tagline: "Esco è un listening bar.",
  description:
    "Un bar in cui la proposta si integra con un’atmosfera musicale strutturata. Vinili, selector, session aperte.",
  url: "https://escoesco.it", // TODO: sostituire con il dominio definitivo
  address: {
    street: "Via Giuseppe Palmieri, 29",
    short: "Via G. Palmieri, 29",
    city: "Bari",
  },
  instagram: {
    handle: "@escoesco.bari",
    url: "https://instagram.com/escoesco.bari",
  },
  slogan: "E vado da Esco",
  footerLine: "Esco® family world wide · It’s all about music",
} as const;

export const hours = {
  daily: { label: "Tutti i giorni", time: "18:00 — 01:00", note: "Drink & selector" },
  weekend: {
    label: "Sabato & domenica",
    shortLabel: "Sab & dom",
    time: "10:30 — 15:00",
    note: "Wake ‘n’ bake",
  },
  lateNight: {
    label: "Dopo le 22:30",
    // Il grassetto è gestito nel componente per "servizio all’interno".
  },
} as const;

export const booking = {
  tavolo: { label: "Tavolo", max: 6 },
  birthday: { label: "Birthday", max: 20, note: "In piedi, senza tavoli · Fiches pack disponibili" },
  slots: ["18:00", "19:00", "20:00", "21:00", "22:00"],
} as const;

export const nav = [
  { href: "/#locale", label: "Il locale" },
  { href: "/#orari", label: "Orari" },
  { href: "/#come-funziona", label: "Come funziona" },
  { href: "/eventi", label: "Eventi" },
] as const;
