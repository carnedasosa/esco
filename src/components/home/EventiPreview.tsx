import Link from "next/link";
import type { CSSProperties } from "react";
import { PosterTrail } from "@/components/motion/PosterTrail";
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
  const posters = rows.flatMap(({ event }) => (event.poster ? [{ slug: event.slug, ...event.poster }] : []));

  return (
    <LabeledSection aria-label="Eventi" label="B2 — Eventi" style={{ paddingTop: 0 }}>
      <PosterTrail posters={posters}>
        {rows.map(({ event, meta }, i) => (
          <Link
            key={event.slug}
            href={`/eventi#${event.slug}`}
            className={[styles.track, "hairline-top", i === rows.length - 1 && "hairline-bottom"]
              .filter(Boolean)
              .join(" ")}
            data-reveal="rise"
            data-poster={event.poster ? event.slug : undefined}
            style={{ "--i": i } as CSSProperties}
          >
            <span className={styles.trackDate}>{event.date ? formatDate(event.date) : event.dateLabel}</span>
            <span className={styles.trackTitle}>{event.title}</span>
            <span className={styles.trackMeta}>
              {meta} <span className={styles.arrow}>→</span>
            </span>
          </Link>
        ))}
      </PosterTrail>
    </LabeledSection>
  );
}
