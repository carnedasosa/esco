"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef } from "react";
import { coverSourceRect, ditherRGBA, paintFrame } from "@/lib/motion/dither";
import { afterPageTransition } from "@/lib/motion/page-transition";

type DitherImageProps = ImageProps & {
  /** object-position orizzontale e verticale (0–1), per far coincidere il retino con la foto. */
  focus?: [number, number];
  /** Classe del contenitore (per immagini senza `fill`). */
  wrapperClassName?: string;
};

const CELL = 3; // un punto del retino = 3×3 px CSS
const STEPS = 6; // come --ease-pixel
const HOLD_MS = 180; // il retino pieno resta un istante prima di dissolversi
const STEP_MS = 120; // 180 + 6 × 120 ≈ 900 ms (--dur-scene)

/**
 * Foto che entra "a retino": quando arriva nel viewport parte come immagine 1-bit
 * (ordered dithering Bayer 8×8) e a step si risolve nella foto a colori. Una sola volta.
 * Senza JS o con prefers-reduced-motion si vede direttamente la foto.
 */
export function DitherImage({ focus = [0.5, 0.5], wrapperClassName, fill, style, alt, ...imageProps }: DitherImageProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fx, fy] = focus;

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !img || !canvas) return;

    const done = () => {
      wrap.dataset.state = "done";
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      done();
      return;
    }

    let cancelled = false;
    const timers: number[] = [];

    const run = async () => {
      try {
        await afterPageTransition();
        if (!img.complete) await new Promise((r) => img.addEventListener("load", r, { once: true }));
        await img.decode().catch(() => {});
        if (cancelled) return;

        const { width: boxW, height: boxH } = wrap.getBoundingClientRect();
        const w = Math.max(1, Math.ceil(boxW / CELL));
        const h = Math.max(1, Math.ceil(boxH / CELL));
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx || !img.naturalWidth) return done();

        // Ritaglio e riduzione fuori dal main thread: sul canvas arriva già una bitmap
        // piccola, così la lettura dei pixel non blocca la pagina.
        const r = coverSourceRect(w, h, img.naturalWidth, img.naturalHeight, fx, fy);
        const bitmap = await createImageBitmap(img, r.sx, r.sy, r.sw, r.sh, {
          resizeWidth: w,
          resizeHeight: h,
          resizeQuality: "low",
        });
        if (cancelled) return;
        ctx.drawImage(bitmap, 0, 0);
        bitmap.close();
        const frame = ditherRGBA(ctx.getImageData(0, 0, w, h).data, w, h);
        const out = ctx.createImageData(w, h);

        const paint = (step: number) => {
          paintFrame(frame, step, STEPS, out.data);
          ctx.putImageData(out, 0, 0);
        };

        paint(0);
        wrap.dataset.state = "running";
        for (let s = 1; s <= STEPS; s++) {
          timers.push(window.setTimeout(() => (s < STEPS ? paint(s) : done()), HOLD_MS + s * STEP_MS));
        }
      } catch {
        done();
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          void run();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(wrap);

    return () => {
      cancelled = true;
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [fx, fy]);

  return (
    <span
      ref={wrapRef}
      className={["dither", wrapperClassName].filter(Boolean).join(" ")}
      style={fill ? { position: "absolute", inset: 0 } : { position: "relative", display: "block" }}
    >
      <Image
        ref={imgRef}
        alt={alt}
        fill={fill}
        style={{
          objectFit: "cover",
          objectPosition: `${fx * 100}% ${fy * 100}%`,
          ...(fill ? null : { width: "100%", height: "100%" }),
          ...style,
        }}
        {...imageProps}
      />
      <canvas ref={canvasRef} aria-hidden="true" />
    </span>
  );
}
