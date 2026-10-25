import { useSettingStore } from "../../store/SettingStore";
import { timeParts, useMinute } from "../Clock/time";

const HHMM = /^\d{2}:\d{2}$/;

/**
 * Whether `hhmm` falls inside [start, end), all zero-padded 24h "HH:MM"
 * strings, so plain string comparison orders them. A window with
 * start > end crosses midnight; start === end is an empty window.
 */
export function isInNightWindow(
  hhmm: string,
  start: string,
  end: string,
): boolean {
  // "--:--" (unknown time zone) would otherwise sort before every real time.
  if (!HHMM.test(hhmm) || !HHMM.test(start) || !HHMM.test(end)) return false;
  if (start <= end) return hhmm >= start && hhmm < end;
  return hhmm >= start || hhmm < end;
}

/** `?night=1` forces night mode, for checking it without changing the clock. */
export const FORCE_NIGHT =
  new URLSearchParams(window.location.search).get("night") === "1";

/** The main clock's time zone, so the night window matches the time shown. */
export const useMainClockTz = () =>
  useSettingStore((s) => s.clocks[0]?.tz ?? "UTC");

/** Whether night mode is enabled and it is currently inside the window. */
export function useNightWindow(): boolean {
  const tz = useMainClockTz();
  const { enabled, start, end } = useSettingStore((s) => s.nightMode);
  const now = useMinute();
  const { hh, mm } = timeParts(now, tz);
  return enabled && isInNightWindow(`${hh}:${mm}`, start, end);
}
