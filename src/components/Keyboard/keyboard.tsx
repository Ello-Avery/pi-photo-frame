import { useState } from "react";
import { createPortal } from "react-dom";
import "./keyboard.css";
import Key from "./key";
import { useSettingStore } from "../../store/SettingStore";

type KeyboardProps = {
  open: boolean;
  value: string;
  onEnter: () => void;
  onChange: (value: string) => void;
};

export type KeyboardData = {
  row: number;
  data: KeyData[];
};

export type KeyData = {
  size: KeySize;
  action: KeyAction;
};

export type KeySize = "sm" | "lg" | "xl";

export type KeyAction =
  | { type: "char"; char: string }
  | { type: "backspace" }
  | { type: "space" }
  | { type: "caps" }
  | { type: "enter" };

const keyboard: KeyboardData[] = [
  {
    row: 0,
    data: [
      {
        action: { type: "char", char: "1" },
        size: "sm",
      },
      {
        action: { type: "char", char: "2" },
        size: "sm",
      },
      {
        action: { type: "char", char: "3" },
        size: "sm",
      },
      {
        action: { type: "char", char: "4" },
        size: "sm",
      },
      {
        action: { type: "char", char: "5" },
        size: "sm",
      },
      {
        action: { type: "char", char: "6" },
        size: "sm",
      },
      {
        action: { type: "char", char: "7" },
        size: "sm",
      },
      {
        action: { type: "char", char: "8" },
        size: "sm",
      },
      {
        action: { type: "char", char: "9" },
        size: "sm",
      },
      {
        action: { type: "char", char: "0" },
        size: "sm",
      },
      {
        action: { type: "backspace" },
        size: "lg",
      },
    ],
  },
  {
    row: 1,
    data: [
      {
        action: { type: "char", char: "q" },
        size: "sm",
      },
      {
        action: { type: "char", char: "w" },
        size: "sm",
      },

      {
        action: { type: "char", char: "e" },
        size: "sm",
      },
      {
        action: { type: "char", char: "r" },
        size: "sm",
      },
      {
        action: { type: "char", char: "t" },
        size: "sm",
      },
      {
        action: { type: "char", char: "y" },
        size: "sm",
      },
      {
        action: { type: "char", char: "u" },
        size: "sm",
      },
      {
        action: { type: "char", char: "i" },
        size: "sm",
      },
      {
        action: { type: "char", char: "o" },
        size: "sm",
      },
      {
        action: { type: "char", char: "p" },
        size: "sm",
      },
    ],
  },
  {
    row: 2,
    data: [
      {
        action: { type: "char", char: "a" },
        size: "sm",
      },
      {
        action: { type: "char", char: "s" },
        size: "sm",
      },
      {
        action: { type: "char", char: "d" },
        size: "sm",
      },
      {
        action: { type: "char", char: "f" },
        size: "sm",
      },
      {
        action: { type: "char", char: "g" },
        size: "sm",
      },
      {
        action: { type: "char", char: "h" },
        size: "sm",
      },
      {
        action: { type: "char", char: "j" },
        size: "sm",
      },
      {
        action: { type: "char", char: "k" },
        size: "sm",
      },
      {
        action: { type: "char", char: "l" },
        size: "sm",
      },
    ],
  },
  {
    row: 3,
    data: [
      {
        action: { type: "char", char: "z" },
        size: "sm",
      },
      {
        action: { type: "char", char: "x" },
        size: "sm",
      },
      {
        action: { type: "char", char: "c" },
        size: "sm",
      },
      {
        action: { type: "char", char: "v" },
        size: "sm",
      },
      {
        action: { type: "char", char: "b" },
        size: "sm",
      },
      {
        action: { type: "char", char: "n" },
        size: "sm",
      },
      {
        action: { type: "char", char: "m" },
        size: "sm",
      },
      {
        action: { type: "char", char: "&" },
        size: "sm",
      },
      {
        action: { type: "char", char: "!" },
        size: "sm",
      },
      {
        action: { type: "char", char: "?" },
        size: "sm",
      },
    ],
  },
  {
    row: 4,
    data: [
      {
        action: { type: "caps" },
        size: "lg",
      },
      {
        action: { type: "space" },
        size: "xl",
      },

      {
        action: { type: "char", char: "-" },
        size: "lg",
      },
      {
        action: { type: "char", char: "+" },
        size: "sm",
      },
      {
        action: { type: "enter" },
        size: "lg",
      },
    ],
  },
];

const getKeyId = (action: KeyAction) => {
  return action.type === "char" ? action.char : action.type;
};

const Keyboard = ({ open, value, onChange, onEnter }: KeyboardProps) => {
  const { theme } = useSettingStore();
  const [caps, setCaps] = useState(true);

  const handleKey = (action: KeyAction) => {
    if (action.type === "backspace") {
      onChange(value.slice(0, -1));

      if (value.length === 1) setCaps(true);
      return;
    }

    if (action.type === "enter") {
      onEnter();
      return;
    }

    if (action.type === "space") {
      onChange(`${value} `);
      return;
    }

    if (action.type === "caps") {
      setCaps(!caps);
      return;
    }

    //if first char
    if (value.length === 0) {
      onChange(`${value}${caps ? action.char.toUpperCase() : action.char}`);
      setCaps(false);
      return;
    }

    onChange(`${value}${caps ? action.char.toUpperCase() : action.char}`);
  };

  const getKeyLabel = (action: KeyAction) => {
    switch (action.type) {
      case "char":
        return caps ? action.char.toUpperCase() : action.char;
      case "space":
        return " ";
      case "backspace":
        return "⌫";
      case "enter":
        return "⏎";
      case "caps":
        return caps ? "Caps ⬆" : "Caps ⇧";
    }
  };
  return createPortal(
    <div
      className={`keyboard ${open ? "is-open" : ""}`}
      data-wc-theme={theme}
      aria-hidden={!open}
    >
      <div className="key-container">
        {keyboard.map((row) => (
          <div className="key-row" key={row.row}>
            {row.data.map((key) => (
              <Key
                label={getKeyLabel(key.action)}
                key={getKeyId(key.action)}
                size={key.size}
                action={key.action}
                onPress={() => handleKey(key.action)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>,
    document.body,
  );
};

export default Keyboard;
