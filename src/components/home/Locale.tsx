import { DitherImage } from "@/components/motion/DitherImage";
import pareteVinili from "@/assets/images/parete-vinili.jpg";
import consolle from "@/assets/images/consolle.jpg";
import styles from "./home.module.css";

export function Locale() {
  return (
    <section id="locale" className={`${styles.locale} theme-paper`}>
      <div className={styles.localeInner}>
        <div className={styles.split}>
          <p className={`${styles.splitLabel} t-eyebrow`} data-reveal="pixel">
            A1 — Il locale
          </p>
          <div className={styles.splitBody}>
            <h2 className={styles.localeTitle}>
              Miscelazione e selezione musicale si incontrano per creare un ambiente coerente e curato.
            </h2>
            <div className={styles.twoCols}>
              <p className="t-body">La musica è gestita da selector con session aperte.</p>
              <p className="t-body">
                In via Giuseppe Palmieri, a Bari, ESCO è il posto dove fermarsi ad ascoltare: un disco alla volta, un
                drink alla volta. Al bancone classici e signature, in consolle un selector diverso ogni settimana.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.photos}>
          <div className={styles.photoMain}>
            <DitherImage
              src={pareteVinili}
              alt="La parete di vinili sotto il soffitto in sughero"
              fill
              sizes="(max-width: 900px) 100vw, 60vw"
            />
          </div>
          <figure className={styles.photoSide} style={{ margin: 0 }}>
            <div className={styles.photoSideImg}>
              <DitherImage
                src={consolle}
                alt="Giradischi e mixer rotativo in consolle"
                fill
                sizes="(max-width: 900px) 100vw, 38vw"
              />
            </div>
            <figcaption className="t-eyebrow">La consolle: giradischi e mixer rotativo</figcaption>
          </figure>
        </div>

        <blockquote className={styles.split}>
          <span className={styles.splitLabel} aria-hidden="true" />
          <p className={`${styles.splitBody} ${styles.quote}`}>“L’atmosfera è ciò che proteggiamo.”</p>
        </blockquote>
      </div>
    </section>
  );
}
