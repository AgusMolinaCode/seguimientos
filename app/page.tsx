import Image from "next/image";
import Link from "next/link";

const companies = [
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

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-14">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">
          Seguimiento de Envíos
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Selecciona la empresa de transporte
        </p>

        {/* Grid de logos de empresas */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {companies.map((company) => (
            <Link key={company.id} href={company.href}>
              <button className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 flex flex-col items-center justify-center gap-4 border-2 border-transparent hover:border-blue-500 w-full cursor-pointer">
                <div className="relative w-full h-12 flex items-center justify-center">
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={200}
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
    </div>
  );
}
