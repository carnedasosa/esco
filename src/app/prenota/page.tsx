import type { Metadata } from "next";
import { connection } from "next/server";
import { type CSSProperties, Suspense } from "react";
import vetrina from "@/assets/images/vetrina.jpg";
import { DitherImage } from "@/components/motion/DitherImage";
import { BookingForm } from "@/components/prenota/BookingForm";
import styles from "@/components/prenota/prenota.module.css";
import { PageHero } from "@/components/ui/Section";
import { booking } from "@/content/site";
import { todayInRome } from "@/lib/reservation";

export const metadata: Metadata = {
  title: "Prenota",
  description: `Prenota un tavolo (fino a ${booking.tavolo.max} persone) o un birthday (fino a ${booking.birthday.max}) da ESCO, listening bar a Bari.`,
};

// La data minima del calendario dipende dal giorno della richiesta: questa parte si
// rende a ogni visita, il resto della pagina resta statico.
async function BookingFormWithToday() {
  await connection();
  return <BookingForm minDate={todayInRome()} />;
}

export default function PrenotaPage() {
  return (
    <>
      <PageHero title="Prenota">
        Tavoli fino a {booking.tavolo.max} persone, birthday fino a {booking.birthday.max}. Chi passa senza prenotare è
        sempre il benvenuto.
      </PageHero>

      <section className={`${styles.section} theme-paper`}>
        <div className={styles.inner}>
          <div className={styles.rules}>
            <p className="t-eyebrow" data-reveal="pixel">
              Come funziona
            </p>
            <div className={`${styles.rule} hairline-top`} data-reveal="rise" style={{ "--i": 0 } as CSSProperties}>
              <div className={styles.ruleHead}>
                <span className={styles.ruleTitle}>{booking.tavolo.label}</span>
                <span className={styles.ruleMax}>
                  Max <b>{booking.tavolo.max} px</b>
                </span>
              </div>
            </div>
            <div className={`${styles.rule} hairline-top`} data-reveal="rise" style={{ "--i": 1 } as CSSProperties}>
              <div className={styles.ruleHead}>
                <span className={styles.ruleTitle}>{booking.birthday.label}</span>
                <span className={styles.ruleMax}>
                  Max <b>{booking.birthday.max} px</b>
                </span>
              </div>
              <span className="t-statement">{booking.birthday.note}</span>
            </div>
            <div className={`${styles.rule} hairline-top hairline-bottom`} data-reveal="rise" style={{ "--i": 2 } as CSSProperties}>
              <span className={styles.ruleTitle}>Dopo le 22:30</span>
              <span className="t-body">
                Preferiamo concentrare il <b>servizio all’interno</b>.
              </span>
            </div>
            <p className={styles.walkin}>Walk-in sempre benvenuti</p>
          </div>

          <div className={styles.panel}>
            <Suspense fallback={<div className={styles.sent} aria-busy="true" />}>
              <BookingFormWithToday />
            </Suspense>
          </div>
        </div>
      </section>

      <section aria-label="Il locale" className={`${styles.photo} theme-night`}>
        <DitherImage
          src={vetrina}
          focus={[0.5, 0.4]}
          alt="La vetrina di ESCO in via Giuseppe Palmieri con la panca in alluminio"
          fill
          sizes="100vw"
        />
      </section>
    </>
  );
}
