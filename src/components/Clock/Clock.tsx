import { useState, useEffect } from "react";
import "./Clock.css";

export const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;

    const tick = () => {
      setTime(new Date());
      const msToNextMinute = 60000 - (Date.now() % 60000);
      timeoutId = setTimeout(tick, msToNextMinute);
    };

    tick();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="clock">
      <div className="clock__time">
        {time.toLocaleTimeString("en-AU", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
      <div className="clock__date">
        {time.toLocaleDateString("en-AU", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </div>
    </div>
  );
};
