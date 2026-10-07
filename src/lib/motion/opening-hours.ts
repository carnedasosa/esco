import { schedule } from "@/content/site";

export type OpenStatus = { open: true; closesAt: string } | { open: false; opensAt: string };

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const romeParts = new Intl.DateTimeFormat("en-GB", {
  timeZone: schedule.timeZone,
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Giorno della settimana (0 = domenica) e minuti dalla mezzanotte, ora di Bari. */
export function romeClock(now: Date): { day: number; minutes: number } {
  const parts = Object.fromEntries(romeParts.formatToParts(now).map((p) => [p.type, p.value]));
  return { day: WEEKDAYS.indexOf(parts.weekday), minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

/**
 * Stato del locale in un dato istante. Il turno serale attraversa la mezzanotte
 * (18:00 — 01:00); sabato e domenica c'è anche il turno 10:30 — 15:00.
 */
export function getOpenStatus(now: Date): OpenStatus {
  const { day, minutes } = romeClock(now);
  const evOpen = toMinutes(schedule.evening.open);
  const evClose = toMinutes(schedule.evening.close); // < evOpen: chiude il giorno dopo
  const isWeekend = (schedule.weekend.days as readonly number[]).includes(day);
  const wkOpen = toMinutes(schedule.weekend.open);
  const wkClose = toMinutes(schedule.weekend.close);

  if (minutes < evClose || minutes >= evOpen) {
    return { open: true, closesAt: schedule.evening.close };
  }
  if (isWeekend && minutes >= wkOpen && minutes < wkClose) {
    return { open: true, closesAt: schedule.weekend.close };
  }
  if (isWeekend && minutes < wkOpen) {
    return { open: false, opensAt: schedule.weekend.open };
  }
  return { open: false, opensAt: schedule.evening.open };
}
