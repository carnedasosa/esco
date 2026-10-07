import { z } from "zod";
import { booking } from "@/content/site";

export const reservationTypes = ["tavolo", "birthday"] as const;
export type ReservationType = (typeof reservationTypes)[number];

/** Data di oggi a Bari, in formato YYYY-MM-DD. */
export function todayInRome(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome" }).format(new Date());
}

export const reservationSchema = z
  .object({
    tipo: z.enum(reservationTypes),
    nome: z.string().trim().min(2, "Inserisci il tuo nome").max(80),
    telefono: z
      .string()
      .trim()
      .regex(/^\+?[0-9\s\-().]{6,20}$/, "Inserisci un numero di telefono valido"),
    data: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Scegli una data")
      .refine((d) => d >= todayInRome(), "La data non può essere nel passato"),
    ora: z.enum(booking.slots, { message: "Scegli un orario" }),
    persone: z.coerce.number().int("Numero non valido").min(1, "Almeno 1 persona"),
    note: z.string().trim().max(500, "Massimo 500 caratteri").optional().default(""),
  })
  .superRefine((value, ctx) => {
    const max = booking[value.tipo].max;
    if (value.persone > max) {
      ctx.addIssue({
        code: "custom",
        path: ["persone"],
        message: `${booking[value.tipo].label}: massimo ${max} persone`,
      });
    }
  });

export type Reservation = z.infer<typeof reservationSchema>;
export type ReservationField = keyof Reservation;

export type ReservationState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<ReservationField, string>>;
      values?: Partial<Record<ReservationField, string>>;
    };
