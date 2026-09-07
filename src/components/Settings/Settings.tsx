import "./Settings.css";
import { Modal } from "../Modal/Modal";
import { useSettingStore, type ClockEntry } from "../../store/SettingStore";
import { ZONES } from "../Clock/zones";
import { THEMES } from "../../theme/theme";
import Toggle from "../Toggle/toggle";

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

export const Settings = () => {
  const {
    clocks,
    setClockField,
    theme,
    setTheme,
    collapsed,
    setCollapsed,
    closeSettings,
  } = useSettingStore();

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
                  className="settings-input"
                  value={clock.city}
                  onChange={handleChange(i, "city")}
                  placeholder="City"
                />
              </label>
              <label className="settings-field">
                <span className="settings-field__label">Family Member</span>
                <input
                  type="text"
                  className="settings-input"
                  value={clock.person}
                  onChange={handleChange(i, "person")}
                  placeholder="Person's name"
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
    </Modal>
  );
};
