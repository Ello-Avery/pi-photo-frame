import { create } from "zustand";
import { useSettingStore } from "./SettingStore";

// Transient night-mode state. Deliberately not persisted: a reboot during the
// night should come back up in night mode, not awake.
interface NightStore {
  /** Night mode is scheduled (enabled and inside the window) or forced. */
  night: boolean;
  setNight: (night: boolean) => void;

  /** A tap has woken the slideshow for `wakeMinutes`. */
  awake: boolean;
  /** Wake the slideshow, or restart the countdown if already awake. */
  wake: () => void;
  /** Restart the countdown, but only while awake during the night. */
  extendWake: () => void;
  sleep: () => void;
}

let wakeTimer: ReturnType<typeof setTimeout> | undefined = undefined;

export const useNightStore = create<NightStore>()((set, get) => ({
  night: false,
  setNight: (night) => {
    set({ night });
    // Leaving the night window ends any wake period with it.
    if (!night) get().sleep();
  },

  awake: false,
  wake: () => {
    clearTimeout(wakeTimer);
    const { wakeMinutes } = useSettingStore.getState().nightMode;
    wakeTimer = setTimeout(() => set({ awake: false }), wakeMinutes * 60000);
    set({ awake: true });
  },
  extendWake: () => {
    const { night, awake, wake } = get();
    if (night && awake) wake();
  },
  sleep: () => {
    clearTimeout(wakeTimer);
    wakeTimer = undefined;
    set({ awake: false });
  },
}));

/**
 * Whether the black night clock is showing. The planned self-update should
 * only reload while this is true; outside React, read
 * `isNightActive(useNightStore.getState())`.
 */
export const isNightActive = (s: Pick<NightStore, "night" | "awake">) =>
  s.night && !s.awake;

export const useNightActive = () => useNightStore(isNightActive);
