import styles from "./motion.module.css";

/**
 * Fascia nera con testo che scorre lento (≈40 s a giro, lineare; più lento su mobile).
 * Si ferma all'hover. Decorativa: nascosta agli screen reader.
 */
export function Marquee({ items }: { items: readonly string[] }) {
  const run = items.join(" · ") + " ·";
  // Ogni metà contiene il testo due volte, così copre anche gli schermi larghi;
  // la traccia scorre di -50% e ricomincia senza salti.
  const half = (
    <span className={styles.marqueeHalf}>
      <span>{run}</span>
      <span>{run}</span>
    </span>
  );
  return (
    <div className={`${styles.marquee} theme-night`} aria-hidden="true">
      <div className={styles.marqueeTrack}>
        {half}
        {half}
      </div>
    </div>
  );
}
