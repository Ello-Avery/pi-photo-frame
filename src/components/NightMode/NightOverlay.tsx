import "./NightMode.css";
import { useSettingStore } from "../../store/SettingStore";
import { useNightStore } from "../../store/NightStore";
import { timeParts, useMinute } from "../Clock/time";
import { useMainClockTz } from "./nightWindow";

/** Full-screen black with a large, dim clock. A tap wakes the slideshow. */
export const NightOverlay = () => {
  const tz = useMainClockTz();
  const opacity = useSettingStore((s) => s.nightMode.clockOpacity);
  const wake = useNightStore((s) => s.wake);
  const now = useMinute();
  const { hh, mm } = timeParts(now, tz);

  return (
    <div
      className="night-overlay"
      onClick={(e) => {
        // The waking tap shouldn't also act on anything else.
        e.stopPropagation();
        wake();
      }}
    >
      <span className="night-overlay__time" style={{ opacity }}>
        {hh}:{mm}
      </span>
    </div>
  );
};
