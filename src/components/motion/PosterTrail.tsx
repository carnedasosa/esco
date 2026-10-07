"use client";

import Image, { type StaticImageData } from "next/image";
import { type ReactNode, useEffect, useRef } from "react";
import styles from "./motion.module.css";

type Poster = { slug: string; src: StaticImageData; alt: string };

/**
 * Su desktop con mouse, passando su una riga con `data-poster="<slug>"` la miniatura
 * del poster appare accanto al cursore e lo segue (solo transform, in rAF).
 * Su touch e schermi stretti non fa nulla.
 */
export function PosterTrail({ posters, children }: { posters: Poster[]; children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const follower = followerRef.current;
    if (!root || !follower || posters.length === 0) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 900px)");

    let frame = 0;
    let x = 0;
    let y = 0;
    let active: string | null = null;

    const place = () => {
      frame = 0;
      follower.style.transform = `translate3d(${x + 24}px, ${y - 100}px, 0)`;
    };

    const show = (slug: string | null) => {
      if (slug === active) return;
      active = slug;
      follower.dataset.active = slug ?? "";
      follower.querySelectorAll<HTMLElement>("[data-slug]").forEach((el) => {
        el.dataset.visible = String(el.dataset.slug === slug);
      });
    };

    const onMove = (e: PointerEvent) => {
      if (!mq.matches || e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      const row = (e.target as Element).closest<HTMLElement>("[data-poster]");
      show(row?.dataset.poster ?? null);
      if (!frame) frame = requestAnimationFrame(place);
    };
    const onLeave = () => show(null);

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [posters.length]);

  return (
    <div ref={rootRef}>
      {children}
      {posters.length > 0 && (
        <div ref={followerRef} className={styles.trail} aria-hidden="true">
          {posters.map((p) => (
            <div key={p.slug} data-slug={p.slug} data-visible="false" className={styles.trailItem}>
              <Image src={p.src} alt="" sizes="180px" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
