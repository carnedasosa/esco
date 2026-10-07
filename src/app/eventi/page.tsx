import type { Metadata } from "next";
import { ArchivedEvent, UpcomingEvent } from "@/components/eventi/EventList";
import styles from "@/components/eventi/eventi.module.css";
import { LabeledSection, PageHero } from "@/components/ui/Section";
import { getEventLists } from "@/content/events";

export const metadata: Metadata = {
  title: "Eventi",
  description: "Selector con session aperte, ospiti e collaborazioni da ESCO, listening bar a Bari.",
};

export default async function EventiPage() {
  const { upcoming, past } = await getEventLists();

  return (
    <>
      <PageHero title="Eventi">
        Selector con session aperte, ospiti e collaborazioni. Ingresso dalle 18:00, salvo dove indicato.
      </PageHero>

      <section aria-labelledby="prossimi" className={`${styles.upcoming} theme-paper`}>
        <div className={styles.upcomingInner}>
          <p id="prossimi" className={`${styles.heading} t-label`} data-reveal="pixel">
            Prossimi
          </p>
          {upcoming.length > 0 ? (
            <div>
              {upcoming.map((event, i) => (
                <UpcomingEvent key={event.slug} event={event} index={i} last={i === upcoming.length - 1} />
              ))}
            </div>
          ) : (
            <p className={`${styles.empty} t-body`}>Nuove date in arrivo. Seguici su Instagram per gli annunci.</p>
          )}
        </div>
      </section>

      {past.length > 0 && (
        <LabeledSection aria-label="Archivio" label="Archivio" theme="night" style={{ paddingTop: 96 }}>
          <div>
            {past.map((event, i) => (
              <ArchivedEvent key={event.slug} event={event} index={i} last={i === past.length - 1} />
            ))}
          </div>
        </LabeledSection>
      )}
    </>
  );
}
