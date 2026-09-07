import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ClockTheme } from "../theme/theme";

export type ClockEntry = { person: string; city: string; tz: string };

const DEFAULT_CLOCKS: ClockEntry[] = [
  { person: "Mom", city: "Cape Town", tz: "Africa/Johannesburg" },
  { person: "Elliot", city: "Melbourne", tz: "Australia/Melbourne" },
  { person: "Olivia", city: "Seoul", tz: "Asia/Seoul" },
];

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
      }),
    },
  ),
);
