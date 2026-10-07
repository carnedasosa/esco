import type { ComponentProps, ReactNode } from "react";
import styles from "./ui.module.css";

type Theme = "paper" | "night";

type LabeledSectionProps = Omit<ComponentProps<"section">, "children"> & {
  label: ReactNode;
  theme?: Theme;
  children: ReactNode;
  bodyClassName?: string;
};

/** Sezione con l'etichetta (es. "A1 — Il locale") a sinistra e il contenuto a destra. */
export function LabeledSection({
  label,
  theme = "paper",
  children,
  className,
  bodyClassName,
  ...props
}: LabeledSectionProps) {
  return (
    <section className={[styles.section, `theme-${theme}`, className].filter(Boolean).join(" ")} {...props}>
      <div className={styles.sectionInner}>
        <p className={`${styles.sectionLabel} t-eyebrow`} data-reveal="pixel">
          {label}
        </p>
        <div className={[styles.sectionBody, bodyClassName].filter(Boolean).join(" ")}>{children}</div>
      </div>
    </section>
  );
}

/** Testata nera delle pagine interne: titolo gigante + intro. */
export function PageHero({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={`${styles.pageHero} theme-night`}>
      <div className={styles.pageHeroInner}>
        <h1 className="t-giant">{title}</h1>
        <p className="t-body">{children}</p>
      </div>
    </section>
  );
}
