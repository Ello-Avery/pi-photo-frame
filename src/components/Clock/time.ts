import { useEffect, useState } from "react";

export function timeParts(now: Date, tz: string): { hh: string; mm: string } {
  try {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const map: Record<string, string> = {};
    for (const part of formatter.formatToParts(now)) map[part.type] = part.value;
    let hh = map.hour;
    if (hh === "24") hh = "00";
    return { hh, mm: map.minute };
  } catch {
    // Timezone not recognized by this device's ICU data.
    return { hh: "--", mm: "--" };
  }
}

/** The current time, updated on each minute boundary. */
export function useMinute(): Date {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;

    const tick = () => {
      setNow(new Date());
      const msToNextMinute = 60000 - (Date.now() % 60000);
      timeoutId = setTimeout(tick, msToNextMinute);
    };

    tick();

    return () => clearTimeout(timeoutId);
  }, []);

  return now;
}
