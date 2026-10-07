import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { hours, site } from "@/content/site";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={`${styles.footer} theme-night`}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <p className={styles.slogan}>
            E vado
            <br />
            da Esco<span className={styles.reg}>®</span>
          </p>
          <ButtonLink href="/prenota">Prenota un tavolo</ButtonLink>
        </div>

        <div className={`${styles.grid} hairline-top`} data-reveal="line">
          <div className={styles.col}>
            <p className="t-caption">Dove</p>
            <p className={styles.big}>{site.address.street}</p>
            <p className={styles.small}>{site.address.city}</p>
          </div>
          <div className={styles.col}>
            <p className="t-caption">Orari</p>
            <p className={`${styles.big} ${styles.numerals}`}>{hours.daily.time}</p>
            <p className={styles.small}>
              {hours.daily.label} · {hours.weekend.shortLabel} anche {hours.weekend.time}
            </p>
          </div>
          <div className={styles.col}>
            <p className="t-caption">Seguici</p>
            <a href={site.instagram.url} className={`${styles.big} u-link`} target="_blank" rel="noopener noreferrer">
              {site.instagram.handle}
            </a>
          </div>
          <nav aria-label="Pagine" className={styles.col}>
            <p className="t-caption">Pagine</p>
            <Link href="/#locale" className={`${styles.navLink} u-link`}>Il locale</Link>
            <Link href="/#orari" className={`${styles.navLink} u-link`}>Orari</Link>
            <Link href="/eventi" className={`${styles.navLink} u-link`}>Eventi</Link>
            <Link href="/prenota" className={`${styles.navLink} u-link`}>Prenota</Link>
          </nav>
        </div>

        <div className={`${styles.bottom} hairline-top`} data-reveal="line">
          {/* L'emblema gira come un disco a 33⅓ giri all'hover. */}
          <span className="vinyl-spin">
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG statico */}
            <img src="/brand/esco-logo.svg" alt="ESCO" width={120} height={78} className="vinyl" />
          </span>
          <p className="t-caption">{site.footerLine}</p>
        </div>
      </div>
    </footer>
  );
}
