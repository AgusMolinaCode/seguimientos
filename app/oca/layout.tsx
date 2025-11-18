import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OCA - Seguimiento de Envíos',
  description: 'Rastrea tu envío de OCA en tiempo real. Consulta el estado, ubicación y historial completo de tu paquete en Argentina. Seguimiento gratuito y actualizado.',
  keywords: ['oca', 'seguimiento oca', 'rastreo oca', 'tracking oca', 'envíos oca', 'paquetes oca', 'oca e-pak'],
  openGraph: {
    title: 'OCA - Seguimiento de Envíos',
    description: 'Rastrea tu envío de OCA en tiempo real con información actualizada.',
    url: '/oca',
    type: 'website',
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary',
    title: 'OCA - Seguimiento de Envíos',
    description: 'Rastrea tu envío de OCA en tiempo real.',
  },
  alternates: {
    canonical: '/oca',
  },
};

export default function OCALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
