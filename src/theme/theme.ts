export type ClockTheme = "glass" | "graphite" | "paper";

/** Swatch preview shown in the settings picker for each theme. */
type Swatch = { background: string; border: string };

export const THEMES: { id: ClockTheme; label: string; swatch: Swatch }[] = [
  {
    id: "glass",
    label: "Glass",
    swatch: {
      background:
        "linear-gradient(135deg, rgba(120,140,120,0.5), rgba(40,45,40,0.6))",
      border: "1px solid rgba(255,255,255,0.28)",
    },
  },
  {
    id: "graphite",
    label: "Graphite",
    swatch: {
      background: "#17171a",
      border: "1px solid rgba(255,255,255,0.12)",
    },
  },
  {
    id: "paper",
    label: "Paper card",
    swatch: {
      background: "#f7f5f1",
      border: "1px solid rgba(0,0,0,0.12)",
    },
  },
];

/** The flip tiles use lighter gradients on the paper theme. */
export const isLightTheme = (theme: ClockTheme) => theme === "paper";
