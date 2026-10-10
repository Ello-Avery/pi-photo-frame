import "./key.css";
import type { KeyAction, KeySize } from "./keyboard";

type KeyProps = {
  label: string;
  size: KeySize;
  action: KeyAction;
  onPress: () => void;
};

const Key = ({ label, size, action, onPress }: KeyProps) => {
  const variant =
    action.type === "enter"
      ? "key-action key-enter"
      : action.type === "char" || action.type === "space"
        ? ""
        : "key-action";

  return (
    <button
      onClick={onPress}
      onMouseDown={(e) => e.preventDefault()}
      className={`key key-${size} ${variant}`}
      type="button"
    >
      {label}
    </button>
  );
};

export default Key;
