import "./App.css";
import Frame from "./components/Frame/Frame";
import { NightController } from "./components/NightMode/NightController";
import { NightOverlay } from "./components/NightMode/NightOverlay";
import { useNightActive, useNightStore } from "./store/NightStore";

function App() {
  const nightActive = useNightActive();
  const extendWake = useNightStore((s) => s.extendWake);

  return (
    // Capture phase, so taps on panels that stopPropagation() still count as
    // activity while woken during the night.
    <div className="root" onPointerDownCapture={extendWake}>
      <NightController />
      <Frame paused={nightActive} />
      {nightActive && <NightOverlay />}
    </div>
  );
}

export default App;
