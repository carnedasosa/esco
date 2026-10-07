import type { CSSProperties } from "react";
import { LabeledSection } from "@/components/ui/Section";
import { hours } from "@/content/site";
import styles from "./home.module.css";

// Ogni riga entra in sequenza (--i) e la sua hairline si disegna da sinistra.
const rowProps = (i: number, last = false) => ({
  "data-reveal": "rise",
  style: { "--i": i } as CSSProperties,
  className: [styles.hoursRow, "hairline-top", last && "hairline-bottom"].filter(Boolean).join(" "),
});

export function Orari() {
  return (
    <LabeledSection id="orari" label="A2 — Orari" theme="night">
      <div className={styles.hoursList}>
        {[hours.daily, hours.weekend].map((row, i) => (
          <div key={row.label} {...rowProps(i)}>
            <span className={styles.hoursDay}>{row.label}</span>
            <span className={styles.hoursTime}>{row.time}</span>
            <span className={styles.hoursNote}>{row.note}</span>
          </div>
        ))}
        <div {...rowProps(2, true)}>
          <span className={styles.hoursDay}>{hours.lateNight.label}</span>
          <span className={styles.hoursText}>
            Preferiamo concentrare il <b>servizio all’interno</b>, dove puoi bere in piedi o seduto e vivere al meglio
            l’atmosfera del locale.
          </span>
        </div>
      </div>
    </LabeledSection>
  );
}
