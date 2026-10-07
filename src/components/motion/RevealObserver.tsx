"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { afterPageTransition } from "@/lib/motion/page-transition";

/**
 * Un solo IntersectionObserver per tutto il sito: ogni elemento con `data-reveal`
 * riceve `data-revealed` la prima volta che entra nel viewport, poi non viene più osservato.
 * Le animazioni vere sono in src/styles/motion.css.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => (el.dataset.revealed = ""));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = "";
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    // Durante la tenda la nuova pagina non si vede: si osserva solo dopo.
    let cancelled = false;
    void afterPageTransition().then(() => {
      if (!cancelled) targets.forEach((el) => io.observe(el));
    });
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
