import { useEffect, useState } from "react";
import "./Frame.css";

type Photo = { id: string; src: string; name: string; takenAt: string | null };
const INTERVAL = 15000;

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

  useEffect(() => {
    fetch("/api/images")
      .then((r) => r.json())
      .then((data) => setPhotos(data.images));
  }, []);

  useEffect(() => {
    if (photos.length === 0) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, [photos]);

  if (photos.length === 0) return <div className="frame" />;

  const n = photos.length;
  const current = photos[index];
  const previous = photos[(index - 1 + n) % n];
  const next = photos[(index + 1) % n];

  return (
    <div className="frame">
      {previous.id !== current.id && (
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
  );
}
