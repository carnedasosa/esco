import { ButtonLink } from "@/components/ui/Button";
import { LabeledSection } from "@/components/ui/Section";
import { booking } from "@/content/site";
import styles from "./home.module.css";

export function ComeFunziona() {
  return (
    <LabeledSection id="come-funziona" label="B1 — Come funziona" bodyClassName={styles.howBody}>
      <div className={styles.cards}>
        <div className={styles.card}>
          <h3 className="t-headline">{booking.tavolo.label}</h3>
          <p className={styles.cardMax}>
            Max <b>{booking.tavolo.max} px</b>
          </p>
          <p className={`${styles.cardFoot} t-body`}>Su prenotazione. Per gruppi più grandi, il birthday.</p>
        </div>
        <div className={styles.card}>
          <h3 className="t-headline">{booking.birthday.label}</h3>
          <p className={styles.cardMax}>
            Max <b>{booking.birthday.max} px</b>
          </p>
          <p className={`${styles.cardFoot} t-statement`}>{booking.birthday.note}</p>
        </div>
      </div>
      <div className={styles.howCta}>
        <ButtonLink href="/prenota">Prenota</ButtonLink>
        <span className={styles.walkin}>Walk-in sempre benvenuti</span>
      </div>
    </LabeledSection>
  );
}
