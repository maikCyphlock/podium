import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import {NavbarWrapper} from "@/components/ui/NavbarWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Podium - Gestión de eventos deportivos",
  description: "Plataforma SaaS para la gestión de competencias deportivas: inscripciones, resultados, análisis y más.",
  keywords: [
    "deportes",
    "eventos",
    "carreras",
    "inscripciones",
    "resultados",
    "podium",
    "maratón",
    "atletismo",
    "Venezuela"
  ],
  authors: [
    { name: "MaikCyphlock", url: "https://podium.com.ve" }
  ],
  creator: "Podium",
  publisher: "Podium",
  openGraph: {
    title: "Podium - Gestión de eventos deportivos",
    description: "Organiza, gestiona y analiza tus competencias deportivas con Podium.",
    url: "https://podium.com.ve",
    siteName: "Podium",
    images: [
      {
        url: "https://podium.com.ve/og-image.png",
        width: 1200,
        height: 630,
        alt: "Podium - Gestión de eventos deportivos"
      }
    ],
    locale: "es_VE",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Podium - Gestión de eventos deportivos",
    description: "Organiza, gestiona y analiza tus competencias deportivas con Podium.",
    site: "@podiumve",
    creator: "@maikcyphlock",
    images: ["aguidom.vercel.app/og-image.png"]
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  },
  manifest: "/site.webmanifest",
  themeColor: "#0A1128",
  colorScheme: "light",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavbarWrapper/>
          {children}
 
        <Toaster richColors />
      </body>
    </html>
  );
}
