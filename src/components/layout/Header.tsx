"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { nav } from "@/content/site";
import styles from "./Header.module.css";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  // data-scrolled abilita la rotazione dell'emblema all'hover (vedi MOTION.md).
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const update = () => header.toggleAttribute("data-scrolled", window.scrollY > 40);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header ref={headerRef} className={`${styles.header} theme-night`}>
      <Link href="/" aria-label="ESCO, torna alla home" className={`${styles.logo} vinyl-spin`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- SVG statico, nessuna ottimizzazione necessaria */}
        <img src="/brand/esco-logo.svg" alt="ESCO" width={80} height={52} className="vinyl" />
      </Link>

      <button
        type="button"
        className={styles.menuToggle}
        aria-expanded={open}
        aria-controls="menu-principale"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Chiudi" : "Menu"}
      </button>

      <nav id="menu-principale" aria-label="Principale" className={styles.nav} data-open={open}>
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.link} u-link`}
            aria-current={pathname === item.href ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <ButtonLink href="/prenota" variant="solid" small onClick={() => setOpen(false)}>
          Prenota
        </ButtonLink>
      </nav>
    </header>
  );
}
