import type { Metadata } from "next";
import { Vollkorn, Flamenco, Padauk } from "next/font/google";
import "./globals.css";

const vollkorn = Vollkorn({
  variable: "--font-vollkorn",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const flamenco = Flamenco({
  variable: "--font-flamenco",
  subsets: ["latin"],
  weight: ["400"],
});

const padauk = Padauk({
  variable: "--font-padauk",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Historial Clínico",
  description: "Sistema de gestión de historial clínico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${vollkorn.variable} ${flamenco.variable} ${padauk.variable}`}
    >
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}