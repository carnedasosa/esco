import type { CSSProperties } from "react";
import { DitherImage } from "@/components/motion/DitherImage";
import { LineReveal } from "@/components/motion/LineReveal";
import { ButtonLink } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { hours, site } from "@/content/site";
import heroImage from "@/assets/images/hero-vinili-bancone.jpg";
import styles from "./home.module.css";

const tags = ["Esco brillo", "Esco & brillo", "Esco di casa"];

export function Hero() {
  return (
    <section aria-label="Benvenuti" className={`${styles.hero} theme-night`}>
      <div className={styles.heroText}>
        <div className={styles.tags}>
          {tags.map((tag, i) => (
            <Tag key={tag} className={styles.tagIn} style={{ "--i": i } as CSSProperties}>
              {tag}
            </Tag>
          ))}
        </div>
        <div className={styles.heroCopy}>
          <LineReveal text={site.tagline} className="t-poster" />
          <p>{site.description}</p>
        </div>
        <div className={styles.heroActions}>
          <ButtonLink href="/prenota">Prenota un tavolo</ButtonLink>
          <a href="#orari" className={`${styles.todayLink} u-link u-link--on`}>
            Oggi {hours.daily.time}
          </a>
        </div>
      </div>
      <div className={styles.heroMedia}>
        <DitherImage
          src={heroImage}
          alt="La parete di vinili e il bancone di ESCO"
          fill
          preload
          fetchPriority="high"
          focus={[0.5, 0.25]}
          sizes="(max-width: 1100px) 100vw, 57vw"
        />
      </div>
    </section>
  );
}
