import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Via Cargo - Seguimiento de Envíos',
  description: 'Rastrea tu envío de Via Cargo en tiempo real. Consulta el estado, ubicación y historial completo de tu paquete en Argentina. Seguimiento gratuito y actualizado.',
  keywords: ['via cargo', 'seguimiento via cargo', 'rastreo via cargo', 'tracking via cargo', 'envíos via cargo', 'paquetes via cargo', 'viacargo'],
  openGraph: {
    title: 'Via Cargo - Seguimiento de Envíos',
    description: 'Rastrea tu envío de Via Cargo en tiempo real con información actualizada.',
    url: '/via-cargo',
    type: 'website',
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary',
    title: 'Via Cargo - Seguimiento de Envíos',
    description: 'Rastrea tu envío de Via Cargo en tiempo real.',
  },
  alternates: {
    canonical: '/via-cargo',
  },
};

export default function ViaCargoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
