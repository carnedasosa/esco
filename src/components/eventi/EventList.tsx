import Image from "next/image";
import { Tag } from "@/components/ui/Tag";
import { type EscoEvent, formatDate } from "@/content/events";
import styles from "./eventi.module.css";

export function UpcomingEvent({ event }: { event: EscoEvent }) {
  return (
    <article id={event.slug} className={styles.event}>
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

export function ArchivedEvent({ event }: { event: EscoEvent }) {
  return (
    <article id={event.slug} className={styles.archive}>
      {event.poster && (
        <Image src={event.poster.src} alt={event.poster.alt} className={styles.poster} sizes="160px" placeholder="blur" />
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
