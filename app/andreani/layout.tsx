import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Andreani - Seguimiento de Envíos',
  description: 'Rastrea tu envío de Andreani en tiempo real. Consulta el estado, ubicación y historial completo de tu paquete en Argentina. Seguimiento gratuito y actualizado.',
  keywords: ['andreani', 'seguimiento andreani', 'rastreo andreani', 'tracking andreani', 'envíos andreani', 'paquetes andreani', 'courier andreani'],
  openGraph: {
    title: 'Andreani - Seguimiento de Envíos',
    description: 'Rastrea tu envío de Andreani en tiempo real con información actualizada.',
    url: '/andreani',
    type: 'website',
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary',
    title: 'Andreani - Seguimiento de Envíos',
    description: 'Rastrea tu envío de Andreani en tiempo real.',
  },
  alternates: {
    canonical: '/andreani',
  },
};

export default function AndreaniLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
