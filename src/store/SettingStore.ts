import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ClockTheme } from "../theme/theme";

export type ClockEntry = { person: string; city: string; tz: string };

const DEFAULT_CLOCKS: ClockEntry[] = [
  { person: "Mom", city: "Cape Town", tz: "Africa/Johannesburg" },
  { person: "Elliot", city: "Melbourne", tz: "Australia/Melbourne" },
  { person: "Olivia", city: "Seoul", tz: "Asia/Seoul" },
];

export type NightModeSettings = {
  enabled: boolean;
  /** 24h "HH:MM"; the window may cross midnight. */
  start: string;
  end: string;
  /** How long a tap keeps the slideshow on during the night. */
  wakeMinutes: number;
  clockOpacity: number;
};

const DEFAULT_NIGHT_MODE: NightModeSettings = {
  enabled: true,
  start: "21:00",
  end: "07:00",
  wakeMinutes: 5,
  clockOpacity: 0.12,
};

interface SettingStore {
  clocks: ClockEntry[];
  setClockField: (
    index: number,
    field: keyof ClockEntry,
    value: string,
  ) => void;

  theme: ClockTheme;
  setTheme: (theme: ClockTheme) => void;

  collapsed: boolean;
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;

  nightMode: NightModeSettings;
  setNightMode: (patch: Partial<NightModeSettings>) => void;

  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;

  aboutOpen: boolean;
  openAbout: () => void;
  closeAbout: () => void;
}

export const useSettingStore = create<SettingStore>()(
  persist(
    (set) => ({
      clocks: DEFAULT_CLOCKS,
      setClockField: (index, field, value) =>
        set((state) => ({
          clocks: state.clocks.map((clock, i) =>
            i === index ? { ...clock, [field]: value } : clock,
          ),
        })),

      theme: "glass",
      setTheme: (theme) => set({ theme }),

      collapsed: true,
      toggleCollapse: () => set((state) => ({ collapsed: !state.collapsed })),
      setCollapsed: (collapsed) => set({ collapsed }),

      nightMode: DEFAULT_NIGHT_MODE,
      setNightMode: (patch) =>
        set((state) => ({ nightMode: { ...state.nightMode, ...patch } })),

      settingsOpen: false,
      openSettings: () => set({ settingsOpen: true }),
      closeSettings: () => set({ settingsOpen: false }),

      aboutOpen: false,
      openAbout: () => set({ aboutOpen: true }),
      closeAbout: () => set({ aboutOpen: false }),
    }),
    {
      name: "wclock-prefs",
      partialize: (state) => ({
        clocks: state.clocks,
        theme: state.theme,
        collapsed: state.collapsed,
        nightMode: state.nightMode,
      }),
      // Fill in night mode fields missing from older saved prefs, rather than
      // the default shallow merge dropping them.
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<SettingStore>;
        return {
          ...current,
          ...saved,
          nightMode: { ...current.nightMode, ...saved.nightMode },
        };
      },
    },
  ),
);
