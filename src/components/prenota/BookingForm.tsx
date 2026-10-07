"use client";

import { useActionState, useState } from "react";
import { submitReservation } from "@/app/prenota/actions";
import { FlipNumber } from "@/components/motion/FlipNumber";
import { Button } from "@/components/ui/Button";
import { booking } from "@/content/site";
import type { ReservationField, ReservationState, ReservationType } from "@/lib/reservation";
import styles from "./prenota.module.css";

const initialState: ReservationState = { status: "idle" };

const hints: Record<ReservationType, string> = {
  tavolo: `Tavoli fino a ${booking.tavolo.max} persone`,
  birthday: `Birthday: ${booking.birthday.note.toLowerCase()}`,
};

export function BookingForm({ minDate }: { minDate: string }) {
  const [state, formAction, pending] = useActionState(submitReservation, initialState);
  const [tipo, setTipo] = useState<ReservationType>("tavolo");
  // Lo stato di successo già chiuso con "Nuova richiesta": un nuovo invio produce un nuovo oggetto.
  const [dismissed, setDismissed] = useState<ReservationState | null>(null);

  if (state.status === "success" && state !== dismissed) {
    return (
      <div className={styles.sent} role="status">
        <p className={`${styles.stamp} t-headline`}>Richiesta inviata</p>
        <p className="t-body">Ti ricontatteremo per confermare.</p>
        <Button variant="outline" small onClick={() => setDismissed(state)}>
          Nuova richiesta
        </Button>
      </div>
    );
  }

  const error = state.status === "error" ? state : undefined;
  const value = (f: ReservationField) => error?.values?.[f];
  const fieldProps = (f: ReservationField) => ({
    name: f,
    "aria-invalid": error?.fieldErrors?.[f] ? true : undefined,
    "aria-describedby": error?.fieldErrors?.[f] ? `${f}-errore` : undefined,
  });
  const errorText = (f: ReservationField) =>
    error?.fieldErrors?.[f] ? (
      <span id={`${f}-errore`} className={styles.fieldError}>
        {error.fieldErrors[f]}
      </span>
    ) : null;
  const max = booking[tipo].max;

  return (
    <form action={formAction} className={styles.form} noValidate>
      <fieldset className={styles.typeFieldset}>
        <legend className="t-caption">Tipo di prenotazione</legend>
        <div className={styles.typeButtons}>
          {(["tavolo", "birthday"] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tipo === t}
              className={styles.typeButton}
              onClick={() => setTipo(t)}
            >
              {booking[t].label}
            </button>
          ))}
        </div>
        <input type="hidden" name="tipo" value={tipo} />
      </fieldset>

      <div className={styles.grid}>
        <label className={styles.label}>
          Nome
          <input
            type="text"
            autoComplete="name"
            required
            defaultValue={value("nome")}
            className={styles.input}
            {...fieldProps("nome")}
          />
          {errorText("nome")}
        </label>
        <label className={styles.label}>
          Telefono
          <input
            type="tel"
            autoComplete="tel"
            required
            defaultValue={value("telefono")}
            className={styles.input}
            {...fieldProps("telefono")}
          />
          {errorText("telefono")}
        </label>
        <label className={styles.label}>
          Data
          <input
            type="date"
            min={minDate}
            required
            defaultValue={value("data")}
            className={styles.input}
            {...fieldProps("data")}
          />
          {errorText("data")}
        </label>
        <label className={styles.label}>
          Ora
          <select defaultValue={value("ora") ?? booking.slots[0]} className={styles.input} {...fieldProps("ora")}>
            {booking.slots.map((slot) => (
              <option key={slot}>{slot}</option>
            ))}
          </select>
          {errorText("ora")}
        </label>
        <label className={styles.label}>
          Persone · max <FlipNumber value={max} />
          <input
            type="number"
            min={1}
            max={max}
            inputMode="numeric"
            required
            defaultValue={value("persone") ?? "2"}
            className={styles.input}
            {...fieldProps("persone")}
          />
          {errorText("persone")}
        </label>
      </div>

      <label className={styles.label}>
        Note
        <textarea
          rows={3}
          maxLength={500}
          defaultValue={value("note")}
          className={`${styles.input} ${styles.textarea}`}
          {...fieldProps("note")}
        />
        {errorText("note")}
      </label>

      {/* Campo trappola anti-spam: nascosto a persone e screen reader. */}
      <div className={styles.trap} aria-hidden="true">
        <label>
          Sito web
          <input type="text" name="sito" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {error && (
        <p className={styles.formError} role="alert">
          {error.message}
        </p>
      )}

      <div className={styles.submitRow}>
        <p className="t-caption">{hints[tipo]}</p>
        <Button type="submit" disabled={pending}>
          {pending ? "Invio…" : "Invia richiesta"}
        </Button>
      </div>
    </form>
  );
}
