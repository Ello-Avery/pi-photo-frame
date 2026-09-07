import type { ReactNode } from "react";
import "./Modal.css";
import { useSettingStore } from "../../store/SettingStore";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

/**
 * Shared popup chrome for Settings and About: overlay (click to close), card
 * (clicks inside don't close it), title row with a close button, and a Done
 * footer button.
 *
 * `data-wc-theme` is set here on the overlay root, so every popup rendered
 * through Modal is themed automatically — see src/theme/theme.css.
 */
export function Modal({ title, onClose, children }: ModalProps) {
  const { theme } = useSettingStore();

  return (
    <div
      className="modal-overlay"
      data-wc-theme={theme}
      onClick={onClose}
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button
            className="modal-close"
            onClick={onClose}
            title="Close"
            type="button"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {children}

        <div className="modal-footer">
          <button className="modal-done" onClick={onClose} type="button">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
