import type { CSSProperties, ReactNode } from "react";
import styles from "./ui.module.css";

type TagProps = { children: ReactNode; inverted?: boolean; large?: boolean; className?: string; style?: CSSProperties };

export function Tag({ children, inverted, large, className, style }: TagProps) {
  const cls = [styles.tag, inverted && styles.tagInverted, large && styles.tagLarge, className].filter(Boolean).join(" ");
  return (
    <span className={cls} style={style}>
      {children}
    </span>
  );
}

/** Il marchio ® in apice, come nello slogan "E vado da Esco®". */
export function Registered() {
  return (
    <span className={styles.reg} aria-hidden="true">
      ®
    </span>
  );
}
