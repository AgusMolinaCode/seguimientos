import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BusPack - Seguimiento de Envíos',
  description: 'Rastrea tu envío de BusPack en tiempo real. Consulta el estado, ubicación y historial completo de tu paquete en Argentina. Seguimiento gratuito y actualizado.',
  keywords: ['buspack', 'seguimiento buspack', 'rastreo buspack', 'tracking buspack', 'envíos buspack', 'paquetes buspack', 'bus pack'],
  openGraph: {
    title: 'BusPack - Seguimiento de Envíos',
    description: 'Rastrea tu envío de BusPack en tiempo real con información actualizada.',
    url: '/buspack',
    type: 'website',
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary',
    title: 'BusPack - Seguimiento de Envíos',
    description: 'Rastrea tu envío de BusPack en tiempo real.',
  },
  alternates: {
    canonical: '/buspack',
  },
};

export default function BusPackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
