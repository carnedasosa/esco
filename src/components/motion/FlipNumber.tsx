"use client";

import { useState } from "react";
import styles from "./motion.module.css";

/** Numero che, quando cambia, scorre dal basso a scatti come un contatore meccanico. */
export function FlipNumber({ value }: { value: number }) {
  const [prev, setPrev] = useState(value);
  const [flips, setFlips] = useState(0);

  // Pattern "stato derivato dal render precedente": niente effect.
  if (value !== prev) {
    setPrev(value);
    setFlips((n) => n + 1);
  }

  return (
    <span className={styles.flip}>
      <span key={flips} className={flips > 0 ? styles.flipIn : undefined}>
        {value}
      </span>
    </span>
  );
}
