import { useEffect } from "react";
import { useNightStore } from "../../store/NightStore";
import { FORCE_NIGHT, useNightWindow } from "./nightWindow";

/**
 * Renders nothing; keeps the night store in step with the clock. Its own
 * component so the minute tick re-renders only this, never the slideshow.
 */
export const NightController = () => {
  const inWindow = useNightWindow();
  const setNight = useNightStore((s) => s.setNight);
  const sleep = useNightStore((s) => s.sleep);

  useEffect(() => {
    setNight(FORCE_NIGHT || inWindow);
  }, [inWindow, setNight]);

  // Clears any pending wake timer.
  useEffect(() => sleep, [sleep]);

  return null;
};
