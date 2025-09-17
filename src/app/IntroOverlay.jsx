"use client";
import { useRef, useState, useEffect } from "react";

export default function IntroOverlay() {
  const [hidden, setHidden] = useState(false);
  const ref = useRef(null); // ✅ sin tipos TS

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;       // para permitir autoplay
    v.playsInline = true; // necesario en iOS
    v.play().catch(() => {
      /* si falla autoplay, el usuario puede tocar */
    });
  }, []);

  if (hidden) return null;

  return (
    <video
      ref={ref}
      src="/netflix.mp4"
      autoPlay
      muted
      playsInline
      onEnded={() => setHidden(true)}
      onError={() => setHidden(true)}
      className="fixed inset-0 w-full h-full object-cover z-[9999] bg-black"
    />
  );
}
