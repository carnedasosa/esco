import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { hours, site } from "@/content/site";
import heroImage from "@/assets/images/hero-vinili-bancone.jpg";
import styles from "./home.module.css";

export function Hero() {
  return (
    <section aria-label="Benvenuti" className={`${styles.hero} theme-night`}>
      <div className={styles.heroText}>
        <div className={styles.tags}>
          <Tag>Esco brillo</Tag>
          <Tag>Esco &amp; brillo</Tag>
          <Tag>Esco di casa</Tag>
        </div>
        <div className={styles.heroCopy}>
          <h1 className="t-poster">{site.tagline}</h1>
          <p>{site.description}</p>
        </div>
        <div className={styles.heroActions}>
          <ButtonLink href="/prenota">Prenota un tavolo</ButtonLink>
          <a href="#orari" className={styles.todayLink}>
            Oggi {hours.daily.time}
          </a>
        </div>
      </div>
      <div className={styles.heroMedia}>
        <Image
          src={heroImage}
          alt="La parete di vinili e il bancone di ESCO"
          fill
          priority
          placeholder="blur"
          sizes="(max-width: 1100px) 100vw, 57vw"
        />
      </div>
    </section>
  );
}
