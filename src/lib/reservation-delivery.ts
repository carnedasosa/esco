import "server-only";
import type { Reservation } from "./reservation";

/**
 * Inoltra la richiesta di prenotazione al locale.
 *
 * Se è impostata RESERVATION_WEBHOOK_URL, la richiesta viene inviata lì come JSON
 * (va bene un webhook di Make/Zapier/n8n, Slack, Discord o un servizio email).
 * In sviluppo, senza webhook, la richiesta viene solo stampata in console.
 */
export async function deliverReservation(reservation: Reservation): Promise<void> {
  const webhook = process.env.RESERVATION_WEBHOOK_URL;

  if (!webhook) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESERVATION_WEBHOOK_URL non configurata");
    }
    console.info("[prenotazione] (dev, nessun webhook configurato)", reservation);
    return;
  }

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...reservation, receivedAt: new Date().toISOString() }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    throw new Error(`Webhook prenotazioni: risposta ${res.status}`);
  }
}
