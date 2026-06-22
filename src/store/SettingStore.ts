import { create } from "zustand";

interface SettingStore {
  clockEnabled: boolean;
  toggleClockEnabled: () => void;
}

export const useSettingStore = create<SettingStore>()((set) => ({
  clockEnabled: true,
  toggleClockEnabled: () =>
    set((state) => ({ clockEnabled: !state.clockEnabled })),
}));
