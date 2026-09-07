import { useEffect, useRef, useState } from "react";
import "./FlipUnit.css";

const FLIP_DURATION_MS = 640;

function FlipHalf({
  digit,
  isTop,
  light,
}: {
  digit: string;
  isTop: boolean;
  light: boolean;
}) {
  return (
    <div
      className={`flip-half ${isTop ? "flip-half--top" : "flip-half--bottom"} ${
        light ? "flip-half--light" : "flip-half--dark"
      }`}
    >
      <div
        className={`flip-half__glyph ${
          isTop ? "flip-half__glyph--top" : "flip-half__glyph--bottom"
        } ${light ? "flip-half__glyph--light" : "flip-half__glyph--dark"}`}
      >
        {digit}
      </div>
    </div>
  );
}

/**
 * A single split-flap tile. Watches `value`; when it changes, keeps the
 * previous value in a ref and briefly stacks four layers (two static reveals,
 * two hinged leaves) to animate the fold, then settles back to the two-layer
 * static state. See "Flip Effect Explained" in the source design for why the
 * layering and keyframe timing work this way.
 */
export function FlipUnit({ value, light }: { value: string; light?: boolean }) {
  // Holds the last value committed to `flip`, so the effect can detect a
  // change. Written only inside the effect below, never read during render.
  const lastCommitted = useRef(value);
  const [flip, setFlip] = useState<{ flipping: boolean; prev: string }>({
    flipping: false,
    prev: value,
  });

  useEffect(() => {
    if (value !== lastCommitted.current) {
      const prev = lastCommitted.current;
      lastCommitted.current = value;
      setFlip({ flipping: true, prev });
      const t = setTimeout(
        () => setFlip((s) => ({ ...s, flipping: false })),
        FLIP_DURATION_MS,
      );
      return () => clearTimeout(t);
    }
  }, [value]);

  const unitClass = `flip-unit ${light ? "flip-unit--light" : "flip-unit--dark"}`;

  if (!flip.flipping) {
    return (
      <div className={`${unitClass} flip-unit--static`}>
        <FlipHalf digit={value} isTop light={!!light} />
        <FlipHalf digit={value} isTop={false} light={!!light} />
      </div>
    );
  }

  const prev = flip.prev;
  return (
    <div className={`${unitClass} flip-unit--flipping`}>
      <div className="flip-layer flip-layer--static-top">
        <FlipHalf digit={value} isTop light={!!light} />
      </div>
      <div className="flip-layer flip-layer--static-bottom">
        <FlipHalf digit={prev} isTop={false} light={!!light} />
      </div>
      <div className="flip-layer flip-layer--leaf-top">
        <FlipHalf digit={prev} isTop light={!!light} />
      </div>
      <div className="flip-layer flip-layer--leaf-bottom">
        <FlipHalf digit={value} isTop={false} light={!!light} />
      </div>
    </div>
  );
}
