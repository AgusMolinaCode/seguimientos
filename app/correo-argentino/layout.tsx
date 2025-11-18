import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Correo Argentino - Seguimiento de Envíos',
  description: 'Rastrea tu envío de Correo Argentino en tiempo real. Consulta el estado, ubicación y historial completo de tu paquete. Seguimiento oficial gratuito y actualizado.',
  keywords: ['correo argentino', 'seguimiento correo argentino', 'rastreo correo argentino', 'tracking correo argentino', 'envíos correo argentino', 'paquetes correo argentino', 'mercadolibre envíos'],
  openGraph: {
    title: 'Correo Argentino - Seguimiento de Envíos',
    description: 'Rastrea tu envío de Correo Argentino en tiempo real con información actualizada.',
    url: '/correo-argentino',
    type: 'website',
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary',
    title: 'Correo Argentino - Seguimiento de Envíos',
    description: 'Rastrea tu envío de Correo Argentino en tiempo real.',
  },
  alternates: {
    canonical: '/correo-argentino',
  },
};

export default function CorreoArgentinoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
