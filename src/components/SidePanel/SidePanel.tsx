import { Info, Settings } from "lucide-react";
import "./SidePanel.css";
import { useSettingStore } from "../../store/SettingStore";

export const SidePanel = () => {
  const { toggleSetttingsPageVisibility } = useSettingStore();

  return (
    <div className="side-panel">
      <Info
        onClick={toggleSetttingsPageVisibility}
        className="icon"
        size={32}
      />
      <Settings className="icon" size={32} />
    </div>
  );
};
