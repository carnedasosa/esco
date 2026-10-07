// Coordinamento tra la transizione di pagina e le animazioni d'ingresso:
// reveal e retino della nuova pagina partono solo quando la tenda si è aperta.

const END_EVENT = "esco:page-transition-end";

export function markPageTransitionStart(): void {
  document.documentElement.dataset.vt = "";
}

export function markPageTransitionEnd(): void {
  delete document.documentElement.dataset.vt;
  window.dispatchEvent(new Event(END_EVENT));
}

/** Si risolve subito, oppure alla fine della transizione di pagina in corso. */
export function afterPageTransition(): Promise<void> {
  if (!("vt" in document.documentElement.dataset)) return Promise.resolve();
  return new Promise((resolve) => window.addEventListener(END_EVENT, () => resolve(), { once: true }));
}
