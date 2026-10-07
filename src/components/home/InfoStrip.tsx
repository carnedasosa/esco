import { hours, site } from "@/content/site";
import styles from "./home.module.css";

const items = [
  { label: "Dove", value: `${site.address.short} · ${site.address.city}`, upper: true },
  { label: hours.daily.label, value: hours.daily.time },
  { label: `${hours.weekend.shortLabel} · ${hours.weekend.note}`, value: hours.weekend.time },
  { label: "Walk-in", value: "Sempre benvenuti", upper: true },
];

export function InfoStrip() {
  return (
    <section aria-label="In breve" className={`${styles.strip} theme-paper`}>
      <div className={styles.stripGrid}>
        {items.map((item) => (
          <div key={item.label} className={styles.stripItem}>
            <span className="t-caption">{item.label}</span>
            <span className={[styles.stripValue, item.upper && styles.upper].filter(Boolean).join(" ")}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
