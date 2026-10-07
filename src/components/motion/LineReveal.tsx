"use client";

import { Fragment, useLayoutEffect, useRef } from "react";
import styles from "./motion.module.css";

type LineRevealProps = { text: string; className?: string; as?: "h1" | "h2" | "p" };

/**
 * Titolo che entra riga per riga con una maschera dal basso. Le righe dipendono
 * dalla larghezza, quindi le misuriamo dopo il layout e passiamo l'indice di riga
 * a ogni parola come `--line` (80 ms di sfasamento tra righe).
 */
export function LineReveal({ text, className, as: Tag = "h1" }: LineRevealProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = text.split(" ");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let line = -1;
    let lastTop = -Infinity;
    el.querySelectorAll<HTMLElement>("[data-word]").forEach((w) => {
      if (w.offsetTop > lastTop + 2) {
        line++;
        lastTop = w.offsetTop;
      }
      w.style.setProperty("--line", String(line));
    });
    el.dataset.ready = "";
  }, []);

  return (
    <Tag ref={ref} className={[styles.lineReveal, className].filter(Boolean).join(" ")}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span data-word="" className={styles.word}>
            {word}
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}
