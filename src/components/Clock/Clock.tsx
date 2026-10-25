import "./Clock.css";
import { useSettingStore } from "../../store/SettingStore";
import { isLightTheme } from "../../theme/theme";
import { FlipUnit } from "./FlipUnit";
import { timeParts, useMinute } from "./time";

export const Clock = () => {
  const {
    clocks,
    theme,
    collapsed,
    toggleCollapse,
    openSettings,
    openAbout,
  } = useSettingStore();
  const now = useMinute();

  const light = isLightTheme(theme);

  const dateLabel = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(now);

  const visibleClocks = collapsed ? clocks.slice(0, 1) : clocks;

  return (
    <div className="clock-card" data-wc-theme={theme}>
      <div className="clock-card__header">
        <span className="clock-card__date">{dateLabel}</span>
        <button
          className="clock-card__collapse"
          onClick={toggleCollapse}
          title={collapsed ? "Show all clocks" : "Collapse"}
          type="button"
        >
          <svg
            className={`clock-card__collapse-icon ${
              collapsed ? "clock-card__collapse-icon--collapsed" : ""
            }`}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 14.5 12 9l6 5.5" />
          </svg>
        </button>
      </div>

      <div className="clock-card__rows">
        {visibleClocks.map((clock, i) => {
          const { hh, mm } = timeParts(now, clock.tz);
          return (
            <div className="clock-row" key={clock.city + i}>
              <div className="clock-row__labels">
                <div className="clock-row__city">{clock.city}</div>
                <div className="clock-row__person">{clock.person}</div>
              </div>
              <FlipUnit key={`h${i}${theme}`} value={hh} light={light} />
              <FlipUnit key={`m${i}${theme}`} value={mm} light={light} />
            </div>
          );
        })}
      </div>

      <div className="clock-card__footer">
        <button className="clock-card__about" onClick={openAbout} type="button">
          <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5.2" />
            <path d="M12 7.6v.1" />
          </svg>
          <span>About this image</span>
        </button>
        <button
          className="clock-card__settings"
          onClick={openSettings}
          title="Settings"
          type="button"
        >
          <svg
            width="23"
            height="23"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="3.1" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-2.87 1.2v.17a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-2.93-1.16l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 2.6 15H2.4a2 2 0 1 1 0-4h.17A1.7 1.7 0 0 0 3.73 8.1l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9.4 4.1V4a2 2 0 1 1 4 0v.17a1.7 1.7 0 0 0 2.87 1.2l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0 1.2 2.87h.17a2 2 0 1 1 0 4h-.17a1.7 1.7 0 0 0-1.57 1z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
