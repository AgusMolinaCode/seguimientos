import Image from "next/image";
import Link from "next/link";
import React from "react";

const navbar = () => {
  return (
    <div className="flex py-2 justify-between md:justify-evenly items-center px-2 md:px-12 border-b border-gray-300">
      <Link href="/">
        <div className="flex items-center gap-2 md:gap-4">
          <Image src="/logo.png" alt="Logo" width={50} height={50} />
          <p className="text-xl md:text-2xl font-bold text-black">SM Envios</p>
        </div>
      </Link>
      <div>
        <Link
          href="https://wa.me/5491138911856?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20servicios."
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="text-lg md:text-xl font-bold hover:bg-blue-400/20 p-2 duration-300 rounded-lg cursor-pointer text-black">
            Contacto
          </p>
        </Link>
      </div>
    </div>
  );
};

export default navbar;
