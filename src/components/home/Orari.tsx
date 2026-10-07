import { LabeledSection } from "@/components/ui/Section";
import { hours } from "@/content/site";
import styles from "./home.module.css";

export function Orari() {
  return (
    <LabeledSection id="orari" label="A2 — Orari" theme="night">
      <div className={styles.hoursList}>
        {[hours.daily, hours.weekend].map((row) => (
          <div key={row.label} className={styles.hoursRow}>
            <span className={styles.hoursDay}>{row.label}</span>
            <span className={styles.hoursTime}>{row.time}</span>
            <span className={styles.hoursNote}>{row.note}</span>
          </div>
        ))}
        <div className={styles.hoursRow}>
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
