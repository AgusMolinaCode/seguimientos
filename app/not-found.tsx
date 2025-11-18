import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada - 404",
  description: "La página que buscas no existe. Encuentra el seguimiento de tu envío en nuestras páginas de transportistas disponibles.",
  robots: {
    index: false,
    follow: true,
  },
};

const carriers = [
  {
    name: "Correo Argentino",
    href: "/correo-argentino",
    logo: "/correoArg.png",
    description: "MercadoLibre envíos",
  },
  {
    name: "Via Cargo",
    href: "/via-cargo",
    logo: "/viacargo.svg",
    description: "Seguimiento Via Cargo",
  },
  {
    name: "BusPack",
    href: "/buspack",
    logo: "/buspack.png",
    description: "Rastreo BusPack",
  },
  {
    name: "OCA",
    href: "/oca",
    logo: "/logo-oca.jpg",
    description: "Seguimiento OCA",
  },
  {
    name: "Andreani",
    href: "/andreani",
    logo: "/andreani.svg",
    description: "Rastreo Andreani",
  },
];

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl w-full">
        {/* Error Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-red-100">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Página no encontrada
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>

          {/* Home Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Volver al inicio
          </Link>
        </div>

        {/* Carriers Section */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            ¿Buscas rastrear tu envío?
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {carriers.map((carrier) => (
              <Link
                key={carrier.href}
                href={carrier.href}
                className="group flex flex-col items-center p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200"
              >
                <div className="relative w-16 h-16 mb-3 rounded-lg overflow-hidden bg-white">
                  <Image
                    src={carrier.logo}
                    alt={`Logo ${carrier.name}`}
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 text-center transition-colors">
                  {carrier.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Si crees que esto es un error, por favor{" "}
            <Link href="/" className="text-blue-600 hover:text-blue-700 underline">
              contacta con soporte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
