"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Loader2, QrCode, Film, PartyPopper } from "lucide-react";

// --------------------------------------------------
// Invitación Padrinos – Página estilo Netflix
// --------------------------------------------------

export default function NetflixInvite() {
  const [mounted, setMounted] = useState(false);
  const [params, setParams] = useState({ padrino: "", titulo: "", v: "", poster: "", clean: "", perfil: "", skipIntro: "", skipProfiles: "" });

  useEffect(() => {
    setMounted(true);
    const qs = new URLSearchParams(window.location.search);
    const p = ["padrino","titulo","v","poster","clean","perfil","skipIntro","skipProfiles"].reduce((acc,k)=>{if(qs.get(k))acc[k]=qs.get(k);return acc;},{});
    setParams(p);
  }, []);

const heroImage =  "/couple.jpg";
  const posterSrc = params.poster || "/img/portada.jpg";
  const title = params.titulo ? decodeURIComponent(params.titulo) : "Jacqueline & Braian – Nuestra Pelicula";
  const name = params.padrino ? decodeURIComponent(params.padrino) : "";
  const isClean = params.clean === "1" || params.clean === "true";
  const isImageHero = /\.(jpg|jpeg|png|webp)$/i.test(heroImage);


  const [screen, setScreen] = useState("splash");
  const [selectedProfile, setSelectedProfile] = useState("");

  useEffect(() => {
    if (!mounted) return;
    if (params.skipProfiles === "1" || params.skipProfiles === "true") {
      setSelectedProfile(params.perfil || "");
      setScreen("home");
    } else if (params.skipIntro === "1" || params.skipIntro === "true" || params.perfil) {
      setSelectedProfile(params.perfil || "");
      setScreen("profiles");
    } else {
      setScreen("splash");
    }
  }, [mounted, params.skipProfiles, params.skipIntro, params.perfil]);

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    if (screen !== "home") return;
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = async () => {
      try { await v.play(); setIsPlaying(true);} catch {setIsPlaying(false);setShowOverlay(true);} };
    v.muted = true; v.playsInline = true; tryPlay();
  }, [screen]);

  // useEffect(() => {
  //   if (screen !== "splash") return;
  //   const t = setTimeout(() => setScreen("profiles"), 2400);
  //   return () => clearTimeout(t);
  // }, [screen]);

  const selectProfile = (id) => {
    setSelectedProfile(id);
    const url = new URL(window.location.href);
    url.searchParams.set("perfil", id);
    window.history.replaceState({}, "", url.toString());
    setScreen("home");
  };

  const togglePlay = async () => {
    const v = videoRef.current; if (!v) return;
    if (v.paused) { try{await v.play();setIsPlaying(true);}catch{} } else { v.pause();setIsPlaying(false);} };
  const toggleMute = () => { const v=videoRef.current;if(!v)return;v.muted=!v.muted;setMuted(v.muted); };
  const onCanPlay = () => setLoading(false);

  const downloadQR = async () => {
    const url = window.location.href;
    const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=600x600&chl=${encodeURIComponent(url)}`;
    const blob = await fetch(qrUrl).then(r => r.blob());
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'QR-Padrinos.png';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const backstageVideos = [
  { id: "v-1", src: "/1video.MOV", poster: "/img/thumb7.jpg", title: "Making of 1" },
  { id: "v-2", src: "/2video.MOV", poster: "/img/thumb8.jpg", title: "Making of 2" },
  { id: "v-3", src: "/3video.MOV", poster: "/img/thumb9.jpg", title: "Making of 3" },
  { id: "v-4", src: "/4video.MOV", poster: "/img/thumb10.jpg", title: "Making of 4" },
  { id: "v-5", src: "/5video.MOV", poster: "/img/thumb11.jpg", title: "Making of 5" },
  { id: "v-6", src: "/6video.MOV", poster: "/img/thumb12.jpg", title: "Making of 6" },
  { id: "v-7", src: "/7video.MOV", poster: "/img/thumb12.jpg", title: "Making of 7" },

];


  const rows = [
  {
    label: "Detrás de escena",
    items: backstageVideos,
  },
];

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {screen === "splash" && <Splash onSkip={() => setScreen("profiles")} />}
      {screen === "profiles" && (<Profiles onSelect={selectProfile} onBackToIntro={() => setScreen("splash")} />)}
      {screen === "home" && (<Home title={title} name={name} posterSrc={posterSrc} heroImage={heroImage} isClean={isClean} rows={rows} downloadQR={downloadQR} videoRef={videoRef} onCanPlay={onCanPlay} togglePlay={togglePlay} toggleMute={toggleMute} isPlaying={isPlaying} muted={muted} loading={loading} showOverlay={showOverlay} setShowOverlay={setShowOverlay} goToProfiles={() => setScreen("profiles")} selectedProfile={selectedProfile} />)}
    </div>
  );
}

function Splash({ onSkip }){
  return (
    <motion.section initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 grid place-items-center bg-black">
      <AnimatedN onDone={onSkip} />
      {/* Tocá la pantalla para saltar la intro */}
      <button onClick={onSkip} className="absolute inset-0" aria-label="skip-intro" />
    </motion.section>
  );
}

function AnimatedN({ onDone }){
  React.useEffect(() => {
    const t = setTimeout(() => { onDone?.(); }, 1850); // sincronizado con la animación
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="relative select-none" aria-hidden>
      <svg width="220" height="220" viewBox="0 0 100 100" className="drop-shadow-[0_0_20px_rgba(255,0,0,0.35)]">
        <rect x="0" y="0" width="100" height="100" fill="#000"/>
        <defs>
          <clipPath id="clipN">
            <polygon points="18,88 18,12 34,12 66,72 66,12 82,12 82,88 66,88 34,28 34,88" />
          </clipPath>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff2a2a"/>
            <stop offset="50%" stopColor="#ff5a5a"/>
            <stop offset="100%" stopColor="#ff2a2a"/>
          </linearGradient>
        </defs>
        <g clipPath="url(#clipN)">
          <rect x="0" y="0" width="100" height="100" fill="#220000" />
          <g className="sweep">
            {Array.from({length:8}).map((_,i)=> (
              <rect key={i} x={-140 + i*30} y="0" width="20" height="100" fill="url(#grad)" opacity="0.9"/>
            ))}
          </g>
        </g>
        <g clipPath="url(#clipN)">
          <rect className="glow" x="-120" y="0" width="60" height="100" fill="#ffffff" opacity="0.0"/>
        </g>
      </svg>
      <style jsx>{`
        .sweep { animation: sweep 1.6s ease-out forwards; }
        .glow  { animation: glow 1.2s 1.0s ease-out forwards; }
        @keyframes sweep {
          0%   { transform: translateX(0px); opacity: 0.6; }
          60%  { transform: translateX(220px); opacity: 1; }
          100% { transform: translateX(260px); opacity: 0.85; }
        }
        @keyframes glow {
          0%   { transform: translateX(0px); opacity: 0.0; }
          100% { transform: translateX(260px); opacity: 0.08; }
        }
      `}</style>
    </div>
  );
}


function Profiles({ onSelect, onBackToIntro }){
  const profiles = [
    { id: "madrinas", label: "Madrinas", img: "/madrinas.jpg" },
    { id: "padrinos", label: "Padrinos", img: "/padrinos.jpeg" },
  ];
  return (
    <section className="fixed inset-0 flex flex-col items-center justify-center bg-neutral-900">
      <div className="absolute top-6 left-0 right-0 flex justify-center"><LogoNetflix /></div>
      <motion.h2 initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="text-2xl md:text-3xl font-bold mb-6">¿Quién está mirando?</motion.h2>
      <div className="grid grid-cols-2 gap-6">
        {profiles.map(p => (
          <button key={p.id} onClick={() => onSelect(p.id)} className="group w-40 md:w-48 focus:outline-none">
            <div className="rounded-md overflow-hidden ring-2 ring-transparent group-hover:ring-white/60 transition">
              <img src={p.img} alt={p.label} className="w-full aspect-square object-cover"/>
            </div>
            <div className="mt-2 text-center text-sm md:text-base opacity-90 group-hover:opacity-100">{p.label}</div>
          </button>
        ))}
      </div>
      <button onClick={onBackToIntro} className="mt-8 text-sm text-neutral-400 hover:text-white">Volver a la intro</button>
    </section>
  );
}

function Home({
  title, name, posterSrc, heroImage, isClean, rows, downloadQR,
  videoRef, onCanPlay, togglePlay, toggleMute, isPlaying, muted, loading,
  showOverlay, setShowOverlay, goToProfiles, selectedProfile
}) {
  // ===== Modal de video =====
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState("");

  // abrir modal con un src
  const openModal = (src) => {
    setModalSrc(src);
    setModalOpen(true);
    // opcional: bloquear scroll de fondo
    document.documentElement.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalSrc("");
    document.documentElement.style.overflow = "";
  };

  // cerrar con ESC
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  // Renderiza el primer frame de cada preview cuando entra en viewport (mobile)
useEffect(() => {
  const vids = Array.from(document.querySelectorAll('video.preview-video'));
  if (vids.length === 0) return;

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  const playOneFrame = async (video) => {
    try {
      video.muted = true;
      video.playsInline = true;
      // Cargar lo suficiente como para pintar un frame
      video.preload = "auto";
      // Intenta reproducir un instante y pausar
      await video.play();
      // mover un poquito el tiempo ayuda a que pinte frame en iOS
      if (video.currentTime < 0.05) video.currentTime = 0.05;
      setTimeout(() => video.pause(), 120);
    } catch (e) {
      // iOS puede bloquear; lo intentamos de nuevo al hacer tap
    }
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        playOneFrame(video);
      }
    });
  }, { rootMargin: "200px 0px", threshold: 0.25 });

  vids.forEach(v => io.observe(v));

  return () => io.disconnect();
}, []);

// Dentro de Home, junto a otros useEffect:
useEffect(() => {
  if (!modalOpen || !modalSrc) return;
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  const v = document.getElementById("modal-video");
  if (!v) return;

  // Intento de fullscreen nativo iOS
  const tryIOSFullscreen = async () => {
    try {
      // iOS nativo
      if (isIOS && v.webkitEnterFullscreen) {
        v.webkitEnterFullscreen();
      } else if (document.fullscreenElement == null && v.requestFullscreen) {
        await v.requestFullscreen();
      }
      await v.play().catch(() => {});
    } catch {}
  };

  // Esperamos un microtick para asegurar que el <video> esté listo
  const t = setTimeout(tryIOSFullscreen, 50);
  return () => clearTimeout(t);
}, [modalOpen, modalSrc]);



  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/80 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
          <LogoNetflix clickable onClick={goToProfiles} />
          <div className="text-sm md:text-base opacity-80 hidden sm:block">
            {title}{selectedProfile ? ` — ${capitalize(selectedProfile)}` : ''}
          </div>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="relative flex flex-col min-h-[calc(100vh-64px)]">
        {/* HERO */}
        <section className="relative w-full h-[58vh] md:h-[62vh] lg:h-[65vh] overflow-hidden bg-black">
          <img
            src={heroImage}
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover object-[center_15%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/10 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-neutral-900/95 via-neutral-900/40 to-transparent pointer-events-none" />
        </section>

        {/* Título y botón */}
        <div className="mx-auto w-full max-w-6xl px-4 py-6">
          <h1 className="text-2xl md:text-4xl font-black tracking-tight">{title}</h1>
          {name ? (
            <p className="mt-2 text-neutral-300">
              Hola <b>{name}</b>, te elegimos para protagonizar esta historia. 💫
            </p>
          ) : (
            <p className="mt-2 text-neutral-300">Preparate para una historia inolvidable 💫</p>
          )}

          {/* Abrir video principal en modal */}
          <button
            onClick={() => openModal("/0915.mp4")}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-white text-black px-5 py-2 font-semibold hover:bg-white/90 transition"
          >
            <Play className="w-5 h-5" />
            Reproducir video
          </button>
        </div>
      </div>

      {/* Filas de videos */}
      {!isClean && (
        <main className="mx-auto max-w-6xl px-4 pb-24">
          {rows.map((row) => (
            <div key={row.label} className="mt-8">
              <h3 className="mb-3 font-semibold flex items-center gap-2">
                <Film className="w-4 h-4" />
                {row.label}
              </h3>

              <div className="grid grid-flow-col auto-cols-[45%] sm:auto-cols-[28%] md:auto-cols-[22%] lg:auto-cols-[18%] gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {row.items.map((it) => (
                  <div
                    key={it.id}
                    className="group relative aspect-[16/9] rounded-md overflow-hidden bg-neutral-800 cursor-pointer"
                    onClick={() => openModal(it.src)}
                  >
                    {/* mini-preview hover (silencioso) */}
                    <video
  src={it.src}
  className="preview-video absolute inset-0 w-full h-full object-cover transition group-hover:scale-105"
  muted
  playsInline
  preload="auto"         // 👈 importante para pintar frame
  // En desktop sigue el “hover preview”
  onMouseEnter={(e) => {
    e.currentTarget.currentTime = 0;
    e.currentTarget.play().catch(() => {});
  }}
  onMouseLeave={(e) => {
    e.currentTarget.pause();
    e.currentTarget.currentTime = 0;
  }}
  // En cuanto pueda, aseguramos que quede un frame visible
  onLoadedData={(e) => {
    if (e.currentTarget.currentTime < 0.05) e.currentTarget.currentTime = 0.05;
    // no hacemos play acá para no disparar autoplay en desktop innecesario
  }}
/>
                    <div className="pointer-events-none absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition grid place-items-center">
                      <Play className="w-8 h-8 text-white opacity-80" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-neutral-400 flex flex-col sm:flex-row items-center gap-2 justify-between">
          <div>Hecho con ♥ para nuestros padrinos</div>
          <div>
            Tip: agrega <code>?padrino=Tu%20Nombre</code> a la URL para personalizar el saludo.
          </div>
        </div>
      </footer>

      {/* ===== Modal de Video ===== */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              // cerrar si hace click en el fondo
              if (e.currentTarget === e.target) closeModal();
            }}
          >
            <motion.div
  className="relative w-full h-full sm:h-auto sm:w-full sm:max-w-5xl sm:aspect-[16/9] bg-black rounded-none sm:rounded-lg overflow-hidden shadow-2xl"
  initial={{ scale: 0.98, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.98, opacity: 0 }}
>
  {/* WRAPPER que podemos rotar en iOS */}
  <div
    id="landscape-wrap"
    className="absolute inset-0"
    style={{ background: "black" }}
  >
    <video
      key={modalSrc}
      id="modal-video"
      src={modalSrc}
      controls
      autoPlay
      playsInline
      className="absolute inset-0 h-full w-full object-contain bg-black"
      onEnded={closeModal}
    />
  </div>

  {/* botón cerrar (oculto en mobile si querés) */}
  <button
    onClick={closeModal}
    aria-label="Cerrar"
    className="hidden sm:block absolute -top-3 -right-3 rounded-full bg-white text-black p-2 shadow-lg hover:scale-105 active:scale-95 transition"
  >
    ✕
  </button>
</motion.div>


          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


function LogoNetflix({ big, clickable, onClick }){
  const Comp = clickable ? 'button' : 'div';
  return (
    <Comp onClick={onClick} className={`flex items-center gap-2 select-none ${clickable ? 'cursor-pointer' : ''}`}>
      <div className={`${big ? 'text-6xl' : 'text-xl'} font-black tracking-tight`}><span className="text-red-600">Shake</span>&Brai</div>
    </Comp>
  );
}

function capitalize(s){ return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
