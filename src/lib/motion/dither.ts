// Ordered dithering 1-bit con matrice di Bayer 8x8.

/** Matrice di Bayer 8x8 (valori 0–63), costruita per ricorsione dalla 2x2. */
export const BAYER_8: readonly number[] = (() => {
  let m = [
    [0, 2],
    [3, 1],
  ];
  while (m.length < 8) {
    const n = m.length;
    const next: number[][] = Array.from({ length: n * 2 }, () => new Array<number>(n * 2));
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const v = m[y][x] * 4;
        next[y][x] = v;
        next[y][x + n] = v + 2;
        next[y + n][x] = v + 3;
        next[y + n][x + n] = v + 1;
      }
    }
    m = next;
  }
  return m.flat();
})();

export type DitherFrame = {
  width: number;
  height: number;
  /** Per ogni pixel: 1 = bianco, 0 = nero. */
  bits: Uint8Array;
  /** Per ogni pixel: la sua soglia di Bayer (0–63), usata anche per dissolvere a step. */
  order: Uint8Array;
};

/** Converte i pixel RGBA in un'immagine 1-bit. */
export function ditherRGBA(rgba: Uint8ClampedArray, width: number, height: number): DitherFrame {
  const size = width * height;
  const bits = new Uint8Array(size);
  const order = new Uint8Array(size);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const p = i * 4;
      // Luminanza percepita (Rec. 709), 0–1.
      const lum = (0.2126 * rgba[p] + 0.7152 * rgba[p + 1] + 0.0722 * rgba[p + 2]) / 255;
      const b = BAYER_8[(y & 7) * 8 + (x & 7)];
      order[i] = b;
      bits[i] = lum > (b + 0.5) / 64 ? 1 : 0;
    }
  }
  return { width, height, bits, order };
}

/**
 * Scrive in `out` il fotogramma `step` di `steps`: al passo 0 il retino è pieno,
 * a ogni passo spariscono (alpha 0) i pixel con soglia di Bayer più bassa.
 */
export function paintFrame(frame: DitherFrame, step: number, steps: number, out: Uint8ClampedArray): void {
  const cut = (step / steps) * 64;
  for (let i = 0; i < frame.bits.length; i++) {
    const p = i * 4;
    const v = frame.bits[i] ? 255 : 0;
    out[p] = v;
    out[p + 1] = v;
    out[p + 2] = v;
    out[p + 3] = frame.order[i] < cut ? 0 : 255;
  }
}

/**
 * Porzione della foto (in pixel naturali) visibile nel riquadro con
 * `object-fit: cover` e `object-position` (fx, fy tra 0 e 1).
 */
export function coverSourceRect(boxW: number, boxH: number, imgW: number, imgH: number, fx = 0.5, fy = 0.5) {
  const scale = Math.max(boxW / imgW, boxH / imgH);
  const sw = boxW / scale;
  const sh = boxH / scale;
  return { sx: (imgW - sw) * fx, sy: (imgH - sh) * fy, sw, sh };
}
