import Link from "next/link";
import { LabeledSection } from "@/components/ui/Section";
import { formatDate, getEventLists } from "@/content/events";
import styles from "./home.module.css";

/** Anteprima "tracklist": i prossimi eventi più l'ultimo in archivio. */
export async function EventiPreview() {
  const { upcoming, past } = await getEventLists();
  const latestPast = past[0];
  const rows = [
    ...upcoming.slice(0, 2).map((e) => ({ event: e, meta: e.teaser })),
    ...(latestPast ? [{ event: latestPast, meta: "Archivio" }] : []),
  ];

  return (
    <LabeledSection aria-label="Eventi" label="B2 — Eventi" style={{ paddingTop: 0 }}>
      <div>
        {rows.map(({ event, meta }) => (
          <Link key={event.slug} href={`/eventi#${event.slug}`} className={styles.track}>
            <span className={styles.trackDate}>{event.date ? formatDate(event.date) : event.dateLabel}</span>
            <span className={styles.trackTitle}>{event.title}</span>
            <span className={styles.trackMeta}>{meta} →</span>
          </Link>
        ))}
      </div>
    </LabeledSection>
  );
}
