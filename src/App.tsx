import { useState } from "react";
import "./App.css";
import Frame from "./components/Frame/Frame";
import { SidePanel } from "./components/SidePanel/SidePanel";

function App() {
  const [showSidePanel, setshowSidePanel] = useState(true);

  const toggleshowSidePanel = () => {
    setshowSidePanel(!showSidePanel);
  };

  return (
    <div className="root" onDoubleClick={() => toggleshowSidePanel()}>
      {showSidePanel && <SidePanel />}
      <Frame />
    </div>
  );
}

export default App;
