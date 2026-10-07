"use server";

import { deliverReservation } from "@/lib/reservation-delivery";
import { type ReservationField, type ReservationState, reservationSchema } from "@/lib/reservation";
import { site } from "@/content/site";

const fields: ReservationField[] = ["tipo", "nome", "telefono", "data", "ora", "persone", "note"];

export async function submitReservation(_prev: ReservationState, formData: FormData): Promise<ReservationState> {
  // Campo trappola per i bot: invisibile alle persone, se compilato fingiamo successo.
  if (formData.get("sito")) {
    return { status: "success" };
  }

  const values = Object.fromEntries(fields.map((f) => [f, String(formData.get(f) ?? "")])) as Record<
    ReservationField,
    string
  >;

  const parsed = reservationSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<ReservationField, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as ReservationField;
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "Controlla i campi evidenziati.", fieldErrors, values };
  }

  try {
    await deliverReservation(parsed.data);
  } catch (error) {
    console.error("[prenotazione] invio fallito", error);
    return {
      status: "error",
      message: `Non siamo riusciti a inviare la richiesta. Riprova tra poco o scrivici su Instagram ${site.instagram.handle}.`,
      values,
    };
  }

  return { status: "success" };
}
