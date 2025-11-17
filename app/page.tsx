import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { RecentTracking } from "@/components/RecentTracking";

const companies = [
  {
    id: "oca",
    name: "OCA",
    logo: "/logo-oca.jpg",
    href: "/oca",
  },
  {
    id: "correo-argentino",
    name: "MercadoLibre",
    logo: "/correoArg.png",
    href: "/correo-argentino",
  },
  {
    id: "andreani",
    name: "Andreani",
    logo: "/andreani.svg",
    href: "/andreani",
  },
  {
    id: "via-cargo",
    name: "Via Cargo",
    logo: "/viacargo.svg",
    href: "/via-cargo",
  },
  {
    id: "buspack",
    name: "BusPack",
    logo: "/buspack.png",
    href: "/buspack",
  },
];

function RecentTrackingFallback() {
  return (
    <div className="w-full max-w-7xl mt-12">
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-14">
      <div className="w-full max-w-7xl">
        <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">
          Seguimiento de Envíos
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Selecciona la empresa de transporte
        </p>

        {/* Grid de logos de empresas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 px-2 mb-12">
          {companies.map((company) => (
            <Link key={company.id} href={company.href}>
              <button className="group bg-gray-50 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 p-4 flex flex-col items-center justify-center gap-4 border-2 border-gray-300 hover:border-blue-500 w-full cursor-pointer">
                <div className="relative w-full h-12 flex items-center justify-center">
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={160}
                    height={80}
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-lg font-medium text-gray-500 group-hover:text-blue-600">
                  {company.name}
                </span>
              </button>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent tracking queries dashboard */}
      <Suspense fallback={<RecentTrackingFallback />}>
        <RecentTracking />
      </Suspense>
    </div>
  );
}
