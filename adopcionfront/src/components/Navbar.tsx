"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <ul className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <li>
          <Link href="/" className="text-2xl font-bold">
            ProAdopta
          </Link>
        </li>
        <li>
          <Link
            href="/auth/login"
            className="px-3 py-2 rounded-md text-sm font-bold transition hover:bg-blue-100"
          >
            Inicio Sesión
          </Link>
          <Link
            href="/auth/register"
            className="px-3 py-2 rounded-md text-sm font-bold transition hover:bg-blue-100"
          >
            Registrarse
          </Link>
        </li>
      </ul>
    </nav>
  );
}
