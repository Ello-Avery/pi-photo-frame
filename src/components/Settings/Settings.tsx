import "./Settings.css";
import { Modal } from "../Modal/Modal";
import { useSettingStore, type ClockEntry } from "../../store/SettingStore";
import { ZONES } from "../Clock/zones";
import { THEMES } from "../../theme/theme";
import Toggle from "../Toggle/toggle";
import { useState } from "react";
import Keyboard from "../Keyboard/keyboard";

function nowPreview(tz: string): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const map: Record<string, string> = {};
    for (const part of formatter.formatToParts(new Date()))
      map[part.type] = part.value;
    let hh = map.hour;
    if (hh === "24") hh = "00";
    return `${hh}:${map.minute}`;
  } catch {
    return "--:--";
  }
}

// Night window start/end choices in 15-minute steps. Selects rather than
// <input type="time">, which needs a keyboard on the Pi's touchscreen.
const TIME_OPTIONS = Array.from({ length: 96 }, (_, i) => {
  const hh = String(Math.floor(i / 4)).padStart(2, "0");
  const mm = String((i % 4) * 15).padStart(2, "0");
  return `${hh}:${mm}`;
});

export const Settings = () => {
  const {
    clocks,
    setClockField,
    theme,
    setTheme,
    collapsed,
    setCollapsed,
    nightMode,
    setNightMode,
    closeSettings,
  } = useSettingStore();

  const [activeField, setActiveField] = useState<{
    index: number;
    field: "city" | "person";
  } | null>(null);

  const handleChange =
    (index: number, field: keyof ClockEntry) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setClockField(index, field, e.target.value);

  return (
    <Modal title="Settings" onClose={closeSettings}>
      <div className="settings-section-label">Clocks</div>
      <div className="settings-clocks">
        {clocks.map((clock, i) => (
          <div className="settings-clock-row" key={i}>
            <div className="settings-clock-row__fields">
              <label className="settings-field">
                <span className="settings-field__label">Location</span>
                <input
                  type="text"
                  className={`settings-input ${
                    activeField?.index === i && activeField.field === "city"
                      ? "is-active"
                      : ""
                  }`}
                  value={clock.city}
                  onChange={handleChange(i, "city")}
                  onFocus={() => setActiveField({ index: i, field: "city" })}
                  placeholder="City"
                  inputMode="none"
                />
              </label>
              <label className="settings-field">
                <span className="settings-field__label">Family Member</span>
                <input
                  type="text"
                  className={`settings-input ${
                    activeField?.index === i && activeField.field === "person"
                      ? "is-active"
                      : ""
                  }`}
                  value={clock.person}
                  onChange={handleChange(i, "person")}
                  onFocus={() => setActiveField({ index: i, field: "person" })}
                  placeholder="Person's name"
                  inputMode="none"
                />
              </label>
            </div>

            <label className="settings-field">
              <span className="settings-field__label">
                Time zone — now {nowPreview(clock.tz)}
              </span>
              <select
                className="settings-select"
                value={clock.tz}
                onChange={handleChange(i, "tz")}
              >
                {ZONES.map((z) => (
                  <option key={z.tz} value={z.tz}>
                    {z.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ))}
        <div>
          <label>
            <div className="settings-section-label">
              Show all clocks by default
            </div>
            <Toggle
              checked={!collapsed}
              onChange={(checked) => setCollapsed(!checked)}
            />
          </label>
        </div>
      </div>

      <div className="settings-section-label">Personalisation</div>
      <div className="settings-swatches">
        {THEMES.map((t) => (
          <button
            key={t.id}
            className="settings-swatch"
            onClick={() => setTheme(t.id)}
            type="button"
          >
            <div
              className="settings-swatch__preview"
              style={{
                background: t.swatch.background,
                border: t.swatch.border,
              }}
            >
              {theme === t.id && (
                <span className="settings-swatch__badge">✓</span>
              )}
            </div>
            <span className="settings-swatch__label">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="settings-section-label settings-section-label--spaced">
        Night mode
      </div>
      <div className="settings-night">
        <div className="settings-night__toggle">
          <span className="settings-field__label">
            Show a dim clock overnight (uses {clocks[0]?.city || "main clock"}{" "}
            time)
          </span>
          <Toggle
            checked={nightMode.enabled}
            onChange={(enabled) => setNightMode({ enabled })}
          />
        </div>
        <div className="settings-night__times">
          <label className="settings-field">
            <span className="settings-field__label">From</span>
            <select
              className="settings-select"
              value={nightMode.start}
              onChange={(e) => setNightMode({ start: e.target.value })}
            >
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="settings-field">
            <span className="settings-field__label">Until</span>
            <select
              className="settings-select"
              value={nightMode.end}
              onChange={(e) => setNightMode({ end: e.target.value })}
            >
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="settings-field">
          <span className="settings-field__label">
            A tap shows photos for {nightMode.wakeMinutes} min
          </span>
          <input
            type="range"
            className="settings-range"
            min={1}
            max={30}
            step={1}
            value={nightMode.wakeMinutes}
            onChange={(e) =>
              setNightMode({ wakeMinutes: Number(e.target.value) })
            }
          />
        </label>
        <label className="settings-field">
          <span className="settings-field__label">
            Clock brightness {Math.round(nightMode.clockOpacity * 100)}%
          </span>
          <input
            type="range"
            className="settings-range"
            min={0.03}
            max={0.5}
            step={0.01}
            value={nightMode.clockOpacity}
            onChange={(e) =>
              setNightMode({ clockOpacity: Number(e.target.value) })
            }
          />
        </label>
      </div>
      <Keyboard
        open={activeField !== null}
        value={activeField ? clocks[activeField.index][activeField.field] : ""}
        onChange={(value: string) => {
          if (activeField)
            setClockField(activeField.index, activeField.field, value);
        }}
        onEnter={() => setActiveField(null)}
      />
    </Modal>
  );
};
