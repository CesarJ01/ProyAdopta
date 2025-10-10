"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      await register(username, password);
      setUsername("");
      setPassword("");
      alert("Registro con éxito. Puedes iniciar sesión.");
    } catch (err) {
      const errorMessage = (err as Error).message;
      setErrorMsg(errorMessage);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-xl bg-white">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
          Crear Cuenta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Regístrate para comenzar a publicar mascotas
        </p>
        {/* Mensaje de Error */}
            {errorMsg && (
                <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md text-center border border-red-300">
                    {errorMsg}
                </div>
            )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Campo Usuario */}
          <div>
            <label
              htmlFor="reg-username"
              className="block text-sm font-medium text-gray-700"
            >
              Usuario
            </label>
            <div className="mt-1">
              <input
                id="reg-username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-gray-100"
                placeholder="tu_usuario"
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div>
            <label
              htmlFor="reg-password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <div className="mt-1">
              <input
                id="reg-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-gray-100"
                placeholder="*******"
              />
            </div>
          </div>

          {/* Botón de Registro */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed"
            >
              Registrarme
            </button>
          </div>
        </form>

        {/* Enlace a Iniciar Sesión */}
        <div className="text-sm text-center">
          <Link
            href="/auth/login"
            className="font-medium text-purple-600 hover:text-purple-500"
          >
            ¿Ya tienes cuenta? <span className="underline">Inicia Sesión</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
