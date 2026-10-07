# ESCO — Motion

Il movimento di ESCO è quello di un giradischi: **costante, preciso, mai rimbalzante**.
Niente bounce, elastic, parallax pesante o cursore personalizzato. Si animano solo
`transform`, `opacity` e `clip-path` (più il disegno su canvas del retino).

## Token

Definiti in `src/app/globals.css`, accanto agli altri token del design system.

| Token            | Valore                         | Uso                                          |
| ---------------- | ------------------------------ | -------------------------------------------- |
| `--dur-fast`     | 120ms                          | hover, bottoni, tag                          |
| `--dur-base`     | 240ms                          | piccoli cambi di stato (freccia, contatore)  |
| `--dur-slow`     | 480ms                          | reveal di testo e righe                      |
| `--dur-scene`    | 900ms                          | ingresso hero, retino, transizioni di pagina |
| `--ease-out`     | `cubic-bezier(0.2, 0, 0, 1)`   | tutto ciò che scorre                         |
| `--ease-pixel`   | `steps(6, end)`                | effetti "pixel", coerenti con Redaction      |
| `--dur-reveal`   | `--dur-slow` (300ms su mobile) | durata effettiva dei reveal                  |
| `--stagger-line` | 80ms                           | sfasamento tra le righe di un titolo         |
| `--stagger-row`  | 60ms                           | sfasamento tra le righe di tabelle/liste     |

Le rotazioni continue sono sempre `linear`.

## Dove sta il codice

```
src/styles/motion.css            keyframes globali + pattern (reveal, hairline, u-link, vinile, LED, retino, tenda, reduced motion)
src/components/motion/
  RevealObserver.tsx             un solo IntersectionObserver per tutto il sito
  DitherImage.tsx                foto che entra a retino (canvas sopra next/image)
  LineReveal.tsx                 titolo che entra riga per riga
  Marquee.tsx                    fascia nera con testo che scorre
  OpenStatus.tsx                 "Aperto ora · chiude alle…" con LED
  PosterTrail.tsx                miniatura del poster che segue il cursore
  PageTransition.tsx             View Transition tra le pagine + stato "navigating"
  FlipNumber.tsx                 numero che scorre a scatti
  motion.module.css              stili dei componenti sopra
src/lib/motion/dither.ts         Bayer 8×8, dithering 1-bit, rettangolo "cover"
src/lib/motion/opening-hours.ts  stato aperto/chiuso sull'ora di Bari
src/lib/motion/page-transition.ts  coordinamento tenda ↔ animazioni d'ingresso
```

Niente librerie di animazione: tutto è CSS + IntersectionObserver (GSAP non serve).

## Pattern

### Scroll reveal — `data-reveal`

Aggiungi l'attributo all'elemento; `RevealObserver` imposta `data-revealed` la prima
volta che entra nel viewport (una sola volta).

| Valore                 | Effetto                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `data-reveal="pixel"`  | compare a scatti (`--ease-pixel`). Etichette A1/A2/B1/B2.                           |
| `data-reveal="rise"`   | `translateY(12px) → 0` + opacity. Righe; `style={{ "--i": n }}` per lo sfasamento. |
| `data-reveal="line"`   | il contenuto resta fermo, si disegna solo la hairline.                             |

**Hairline**: invece di `border-top` / `border-bottom` usa le classi `hairline-top` /
`hairline-bottom`. Sono pseudo-elementi che, insieme a un `data-reveal`, si disegnano
da sinistra a destra (`scaleX 0 → 1`).

```tsx
<div className={`${styles.row} hairline-top`} data-reveal="rise" style={{ "--i": 2 } as CSSProperties}>…</div>
```

Gli stati nascosti valgono solo con `html.js` (classe aggiunta da uno script in
`layout.tsx`): senza JavaScript si vede tutto.

### Immagini a retino — `<DitherImage>`

Stesse props di `next/image`, più `focus={[x, y]}` (l'`object-position` tra 0 e 1).
Quando la foto entra nel viewport viene disegnata su un canvas a bassa risoluzione
(1 punto = 3 px), convertita in 1-bit con ordered dithering Bayer 8×8, e in ~900 ms
(un istante di pausa + 6 step) i punti si dissolvono nell'ordine della matrice
rivelando la foto a colori. Una sola volta per immagine.

La foto è nel DOM e visibile da subito (conta per l'LCP); finché il retino non parte
la copre il canvas nero. Ritaglio e riduzione passano da `createImageBitmap`
(asincrono, fuori dal main thread): leggere i pixel della foto grande con
`getImageData` bloccava la pagina per 15–80 ms per immagine.

### Titolo riga per riga — `<LineReveal>`

Divide il testo in parole, misura dopo il layout su quale riga cade ciascuna e anima
ogni riga con una maschera dal basso (`clip-path` + `translateY`), 80 ms tra le righe.

### Sottolineatura — `.u-link`

Pseudo-elemento che si disegna da sinistra all'hover. `.u-link--on` per i link
sempre sottolineati (si ridisegna all'hover).

### Emblema come vinile — `.vinyl-spin` / `.vinyl`

33⅓ giri = **1,8 s a giro**, `linear`. Gira solo all'hover (nell'header solo dopo
aver scrollato) e mentre una navigazione è in corso (`html[data-navigating]`,
impostato da `PageTransition`). Mai in loop continuo a schermo.

### Hover

- Bottoni e tag: inversione bianco/nero in `--dur-fast`, nessuna ombra.
- Righe della tracklist eventi: inversione istantanea, la freccia avanza di 8 px.
  Su desktop con mouse la miniatura del poster segue il cursore (`PosterTrail`).
- Focus da tastiera: outline solido 2 px, mai animato.

### Transizione tra pagine

`PageTransition` intercetta (in fase di capture) i clic sui link interni verso un'altra
pagina e avvolge `router.push` in `document.startViewTransition` (API nativa). La fase
di aggiornamento si chiude quando il nuovo `pathname` è montato. La tenda è in
`motion.css` sullo snapshot `root`: il vecchio si ritira verso l'alto (la tenda nera
sale in 600 ms a scatti), resta un istante l'emblema bianco al centro (sfondo di
`::view-transition`), poi il nuovo si scopre dall'alto (la tenda scende).
`next/link` vede `defaultPrevented` e non naviga due volte, ma esegue comunque i
propri `onClick` (es. chiusura del menu mobile).

Durante la tenda `html[data-vt]` mette in pausa le animazioni CSS e
`afterPageTransition()` (`src/lib/motion/page-transition.ts`) fa aspettare reveal e
retino: la nuova pagina si anima quando è davvero visibile.

Note tecniche:
- Non usiamo `<ViewTransition>` di React: React annulla l'animazione dello snapshot
  `root` quando tutte le modifiche stanno dentro un boundary, e la tenda sparirebbe.
- Nessun `requestAnimationFrame` nella fase di aggiornamento: mentre la transizione
  è in corso il rendering è sospeso e il callback non scatterebbe (timeout del browser).

Senza supporto della View Transitions API, o con reduced motion, il cambio pagina è
normale e l'emblema gira finché la nuova pagina non arriva.

### Prenota

- `<FlipNumber>`: il "max persone" scorre a scatti quando si passa da Tavolo a Birthday.
- "Richiesta inviata" arriva come un timbro (`scale 1.06 → 1`, `--ease-pixel`).

## Regole

- **prefers-reduced-motion**: niente marquee, rotazioni, retino animato, reveal e tenda;
  tutto è visibile subito. Le inversioni all'hover restano.
- **Prestazioni**: niente animazioni su width/height/top/left; il canvas del retino si
  crea solo per le immagini in vista ed è a 1/3 della risoluzione; il JS di motion è
  ~4,5 KB gzip; il follower del poster si muove in `requestAnimationFrame` con `translate3d`.
- **Mobile**: niente miniatura che segue il cursore, marquee più lento (60 s), reveal da 300 ms.
- **CSS Modules**: i keyframe sono globali (`motion.css`). Nei moduli il nome va passato
  tramite variabile, altrimenti il compilatore lo rende locale:
  `--kf: motion-rise; animation: var(--kf) var(--dur-slow) var(--ease-out) both;`
