import { Info, Settings } from "lucide-react";
import "./SidePanel.css";

export const SidePanel = () => {
  return (
    <div className="side-panel">
      <Info className="icon" size={32} />
      <Settings className="icon" size={32} />
    </div>
  );
};
