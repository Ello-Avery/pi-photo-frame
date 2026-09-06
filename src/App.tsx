import { useState, useRef } from "react";
import "./App.css";
import Frame from "./components/Frame/Frame";
import { SidePanel } from "./components/SidePanel/SidePanel";

function App() {
  const [showSidePanel, setShowSidePanel] = useState(true);
  const lastTap = useRef(0);

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setShowSidePanel((prev) => !prev);
    }
    lastTap.current = now;
  };

  return (
    <div className="root" onClick={handleTap}>
      {showSidePanel && <SidePanel />}
      <Frame />
    </div>
  );
}

export default App;
