import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";

const outfit = Outfit({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Seguimiento de Envíos Argentina',
    template: '%s | Seguimiento de Envíos'
  },
  description: 'Rastrea tus envíos en tiempo real de Correo Argentino, Via Cargo, BusPack, OCA y Andreani. Seguimiento gratuito y actualizado de paquetes en Argentina.',
  keywords: ['seguimiento de envíos', 'rastreo de paquetes', 'correo argentino', 'via cargo', 'buspack', 'oca', 'andreani', 'tracking argentina'],
  authors: [{ name: 'Seguimiento de Envíos Argentina' }],
  creator: 'Seguimiento de Envíos Argentina',
  publisher: 'Seguimiento de Envíos Argentina',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: '/',
    siteName: 'Seguimiento de Envíos Argentina',
    title: 'Seguimiento de Envíos Argentina',
    description: 'Rastrea tus envíos en tiempo real de Correo Argentino, Via Cargo, BusPack, OCA y Andreani.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Seguimiento de Envíos Argentina',
    description: 'Rastrea tus envíos en tiempo real de múltiples transportistas argentinos.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR">
      <body className={`${outfit.className} bg-white`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
