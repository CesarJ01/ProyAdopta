"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <ul className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <li>
          <Link
            href="/"
            className="text-2xl font-bold text-purple-700 hover:text-purple-900 transition-colors"
          >
            ProAdopta
          </Link>
        </li>

        <li className="flex items-center space-x-2">
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center px-3 py-2 rounded-md text-sm font-bold text-gray-700 transition hover:bg-purple-50 hover:text-purple-700"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="flex items-center px-3 py-2 rounded-md text-sm font-bold text-white bg-red-500 transition hover:bg-red-600 shadow-md"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-3 py-2 rounded-md text-sm font-bold text-gray-700 transition hover:bg-purple-50 hover:text-purple-700"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/auth/register"
                className="px-3 py-2 rounded-md text-sm font-bold text-white bg-purple-600 transition hover:bg-purple-700 shadow-md"
              >
                Registrarse
              </Link>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
}
