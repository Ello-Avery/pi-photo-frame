import "./PhotoMenu.css";
import { useSettingStore } from "../../store/SettingStore";

type PhotoMenuProps = {
  onPrev: () => void;
  onGallery: () => void;
  onNext: () => void;
};

/** Bottom-left photo controls: previous, open gallery, next. */
export const PhotoMenu = ({ onPrev, onGallery, onNext }: PhotoMenuProps) => {
  const { theme } = useSettingStore();

  return (
    <div className="photo-menu" data-wc-theme={theme}>
      <button
        className="photo-menu__button"
        onClick={onPrev}
        title="Previous photo"
        type="button"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 6 9 12l5.5 6" />
        </svg>
      </button>
      <button
        className="photo-menu__button"
        onClick={onGallery}
        title="Gallery"
        type="button"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinejoin="round"
        >
          <rect x="4" y="4" width="6.5" height="6.5" rx="1.6" />
          <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" />
          <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" />
          <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" />
        </svg>
      </button>
      <button
        className="photo-menu__button"
        onClick={onNext}
        title="Next photo"
        type="button"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9.5 6 15 12l-5.5 6" />
        </svg>
      </button>
    </div>
  );
};
