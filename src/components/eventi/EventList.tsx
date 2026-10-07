import type { CSSProperties } from "react";
import { DitherImage } from "@/components/motion/DitherImage";
import { Tag } from "@/components/ui/Tag";
import { type EscoEvent, formatDate } from "@/content/events";
import styles from "./eventi.module.css";

type RowProps = { event: EscoEvent; index: number; last: boolean };

const rowAttrs = (base: string, index: number, last: boolean) => ({
  className: [base, "hairline-top", last && "hairline-bottom"].filter(Boolean).join(" "),
  "data-reveal": "rise",
  style: { "--i": index } as CSSProperties,
});

export function UpcomingEvent({ event, index, last }: RowProps) {
  return (
    <article id={event.slug} {...rowAttrs(styles.event, index, last)}>
      <div className={styles.when}>
        {event.date ? (
          <>
            <p className={styles.date}>{formatDate(event.date)}</p>
            {event.time && <p className={styles.time}>{event.time}</p>}
          </>
        ) : (
          <>
            <p className={styles.dateLabel}>{event.dateLabel}</p>
            {event.time && <p className={styles.timeBadge}>{event.time}</p>}
          </>
        )}
      </div>
      <div className={styles.what}>
        <h2 className="t-headline">{event.title}</h2>
        <p className={styles.sub}>{event.subtitle}</p>
      </div>
      {event.badge && (
        <Tag large inverted={event.badge.inverted}>
          {event.badge.label}
        </Tag>
      )}
    </article>
  );
}

export function ArchivedEvent({ event, index, last }: RowProps) {
  return (
    <article id={event.slug} {...rowAttrs(styles.archive, index, last)}>
      {event.poster && (
        <DitherImage
          src={event.poster.src}
          alt={event.poster.alt}
          wrapperClassName={styles.poster}
          sizes="160px"
        />
      )}
      <p className={styles.archiveDate}>
        {event.date && formatDate(event.date, true)}
        {event.time && ` · ${event.time}`}
      </p>
      <div className={styles.archiveWhat}>
        <h3 className={styles.archiveTitle}>{event.title}</h3>
        <p className={styles.archiveSub}>{event.subtitle}</p>
      </div>
    </article>
  );
}
