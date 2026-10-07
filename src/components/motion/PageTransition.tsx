"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { markPageTransitionEnd, markPageTransitionStart } from "@/lib/motion/page-transition";

const NAV_TIMEOUT_MS = 4000;

/**
 * Transizione tra pagine con la View Transitions API nativa.
 *
 * Intercetta (in fase di capture) i clic sui link interni verso un'altra pagina e
 * avvolge `router.push` in `document.startViewTransition`: lo snapshot vecchio resta
 * finché la nuova pagina è montata, poi parte la "tenda" definita in motion.css
 * sullo snapshot `root`. `next/link` vede `defaultPrevented` e non naviga una seconda
 * volta, ma esegue comunque i propri onClick (es. chiusura del menu mobile).
 *
 * Non usiamo <ViewTransition> di React perché React annulla l'animazione di `root`
 * quando tutte le modifiche stanno dentro un boundary.
 *
 * Senza supporto, o con prefers-reduced-motion, il cambio pagina è normale; in quel
 * caso `html[data-navigating]` fa girare l'emblema finché la pagina non cambia.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const finish = useRef<(() => void) | null>(null);

  // La nuova pagina è montata: chiude la fase "update" della transizione.
  // Niente requestAnimationFrame qui: durante l'update il rendering è sospeso e il rAF non scatterebbe.
  useEffect(() => {
    delete document.documentElement.dataset.navigating;
    const done = finish.current;
    finish.current = null;
    done?.();
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!document.startViewTransition || reduce) {
        document.documentElement.dataset.navigating = "";
        return; // ci pensa next/link
      }

      e.preventDefault();
      markPageTransitionStart();
      const transition = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            const timer = window.setTimeout(resolve, NAV_TIMEOUT_MS);
            finish.current = () => {
              window.clearTimeout(timer);
              resolve();
            };
            router.push(url.pathname + url.search + url.hash);
          }),
      );
      transition.finished.finally(markPageTransitionEnd);
    };

    window.addEventListener("click", onClick, { capture: true });
    return () => window.removeEventListener("click", onClick, { capture: true });
  }, [router]);

  return null;
}
