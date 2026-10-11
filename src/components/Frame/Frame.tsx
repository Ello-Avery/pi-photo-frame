import { useEffect, useRef, useState } from "react";
import "./Frame.css";
import { Clock } from "../Clock/Clock";
import { useSettingStore } from "../../store/SettingStore";
import { Settings } from "../Settings/Settings";
import { About } from "../About/About";
import { PhotoMenu } from "../PhotoMenu/PhotoMenu";
import { Gallery } from "../Gallery/Gallery";

type Photo = { id: string; src: string; name: string; takenAt: string | null };
const INTERVAL = 30000;
// Drive thumbnail links expire after a few hours, and new uploads should show
// up without a reload, so the list is refetched periodically.
const REFRESH_INTERVAL = 30 * 60 * 1000;

// Longest edge of the screen in device pixels, so the Pi only downloads
// photos as large as it can actually display.
const PHOTO_SIZE = Math.round(
  Math.max(window.screen.width, window.screen.height) *
    (window.devicePixelRatio || 1),
);

function Slide({ photo, className }: { photo: Photo; className?: string }) {
  return (
    <div className={`slide ${className ?? ""}`}>
      <img src={photo.src} alt="" className="photo photo-bg" />
      <img src={photo.src} alt={photo.name} className="photo photo-fg" />
    </div>
  );
}

export default function Frame() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [index, setIndex] = useState(0);
  // The photo shown before the current one, kept as the underlay for the
  // crossfade. Tracked explicitly because manual navigation can jump anywhere.
  const [previousId, setPreviousId] = useState<string | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const { settingsOpen, aboutOpen } = useSettingStore();

  const currentId = useRef<string | null>(null);

  useEffect(() => {
    const load = () =>
      fetch(`/api/images?size=${PHOTO_SIZE}`)
        .then((r) => r.json())
        .then((data: { images: Photo[] }) => {
          if (!data.images?.length) return;
          // Stay on the photo currently showing rather than restarting.
          const kept = data.images.findIndex((p) => p.id === currentId.current);
          setPhotos(data.images);
          setIndex((i) => (kept >= 0 ? kept : i % data.images.length));
        })
        // Keep showing the existing list if a refresh fails.
        .catch(() => {});

    load();
    const timer = setInterval(load, REFRESH_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    currentId.current = photos[index]?.id ?? null;
  }, [photos, index]);

  const goTo = (i: number) => {
    const n = photos.length;
    if (n === 0) return;
    setPreviousId(currentId.current);
    setIndex(((i % n) + n) % n);
  };

  // Depends on `index` so manual navigation restarts the countdown, giving
  // the chosen photo a full interval. Paused while browsing the gallery.
  useEffect(() => {
    if (photos.length === 0 || galleryOpen) return;
    const timer = setTimeout(() => {
      setPreviousId(currentId.current);
      setIndex((i) => (i + 1) % photos.length);
    }, INTERVAL);
    return () => clearTimeout(timer);
  }, [photos, index, galleryOpen]);

  if (photos.length === 0) return <div className="frame" />;

  const n = photos.length;
  const current = photos[index];
  const previous = photos.find((p) => p.id === previousId);
  const next = photos[(index + 1) % n];

  return (
    <>
      <div className="frame">
        {previous && previous.id !== current.id && (
          <Slide key={previous.id} photo={previous} />
        )}
        <Slide key={current.id} photo={current} className="fade" />
        {next.id !== current.id && (
          <img
            key={`preload-${next.id}`}
            src={next.src}
            alt=""
            className="preload-img"
          />
        )}
      </div>
      <PhotoMenu
        onPrev={() => goTo(index - 1)}
        onGallery={() => setGalleryOpen(true)}
        onNext={() => goTo(index + 1)}
      />
      <Clock />
      {galleryOpen && (
        <Gallery
          photos={photos}
          currentId={current.id}
          onSelect={(i) => {
            if (i !== index) goTo(i);
            setGalleryOpen(false);
          }}
          onClose={() => setGalleryOpen(false)}
        />
      )}
      {settingsOpen && <Settings />}
      {aboutOpen && <About />}
    </>
  );
}
