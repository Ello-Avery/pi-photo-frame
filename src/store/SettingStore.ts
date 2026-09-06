import { create } from "zustand";

interface SettingStore {
  showSettingsPage: boolean;
  clockEnabled: boolean;
  toggleSetttingsPageVisibility: () => void;
  toggleClockEnabled: () => void;
}

export const useSettingStore = create<SettingStore>()((set) => ({
  showSettingsPage: false,
  clockEnabled: true,
  toggleSetttingsPageVisibility: () =>
    set((state) => ({ showSettingsPage: !state.showSettingsPage })),
  toggleClockEnabled: () =>
    set((state) => ({ clockEnabled: !state.clockEnabled })),
}));
