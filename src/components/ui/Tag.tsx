import type { ReactNode } from "react";
import styles from "./ui.module.css";

type TagProps = { children: ReactNode; inverted?: boolean; large?: boolean };

export function Tag({ children, inverted, large }: TagProps) {
  const cls = [styles.tag, inverted && styles.tagInverted, large && styles.tagLarge].filter(Boolean).join(" ");
  return <span className={cls}>{children}</span>;
}

/** Il marchio ® in apice, come nello slogan "E vado da Esco®". */
export function Registered() {
  return (
    <span className={styles.reg} aria-hidden="true">
      ®
    </span>
  );
}
