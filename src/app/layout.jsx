import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import IntroOverlay from "./IntroOverlay"; // ⬅️ importa el client component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Invitación Padrinos",
  description: "Jacqueline & Braian – Nuestra Película",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* Precarga para que los videos/imagen aparezcan rápido */}
        <link rel="preload" as="video" href="/netflix.mp4" />
        <link rel="preload" as="video" href="/videos/0915.mp4" />
        <link rel="preload" as="image" href="/img/portada.jpg" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-neutral-900 text-white`}>
        {/* Overlay de intro (Client Component). Al terminar, se oculta solo */}
        <IntroOverlay />
        {children}
      </body>
    </html>
  );
}
