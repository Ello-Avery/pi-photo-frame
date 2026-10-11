import "./Gallery.css";
import { Modal } from "../Modal/Modal";

type GalleryPhoto = { id: string; src: string; name: string };

type GalleryProps = {
  photos: GalleryPhoto[];
  currentId: string | null;
  onSelect: (index: number) => void;
  onClose: () => void;
};

/** Grid of every photo; tapping one jumps the frame to it. */
export const Gallery = ({
  photos,
  currentId,
  onSelect,
  onClose,
}: GalleryProps) => {
  return (
    <Modal title="Gallery" onClose={onClose}>
      <div className="gallery-grid">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            className={`gallery-thumb ${
              photo.id === currentId ? "gallery-thumb--current" : ""
            }`}
            onClick={() => onSelect(i)}
            title={photo.name}
            type="button"
          >
            <img src={photo.src} alt={photo.name} loading="lazy" />
          </button>
        ))}
      </div>
    </Modal>
  );
};
