"use client";

import { useSyncExternalStore } from "react";
import { getOpenStatus } from "@/lib/motion/opening-hours";
import styles from "./motion.module.css";

// Ricontrolla ogni 30 secondi; lo snapshot è una stringa, quindi stabile tra un tick e l'altro.
const subscribe = (onChange: () => void) => {
  const id = window.setInterval(onChange, 30_000);
  return () => window.clearInterval(id);
};

const getSnapshot = () => {
  const s = getOpenStatus(new Date());
  return s.open ? `open|${s.closesAt}` : `closed|${s.opensAt}`;
};

// Sul server (e prima dell'idratazione) l'ora del visitatore non si conosce.
const getServerSnapshot = () => "";

/** "Aperto ora · chiude alle 01:00" / "Chiuso · apre alle 18:00", con il LED. */
export function OpenStatus() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [state, time] = snapshot.split("|");
  const open = state === "open";

  return (
    <span className={`${styles.status} t-caption`} data-pending={snapshot === "" || undefined}>
      <span className="led" data-on={open} aria-hidden="true" />
      {snapshot === "" ? "Aperto ora · chiude alle 01:00" : open ? `Aperto ora · chiude alle ${time}` : `Chiuso · apre alle ${time}`}
    </span>
  );
}
