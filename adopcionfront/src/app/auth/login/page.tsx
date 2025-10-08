"use client"

import Link from "next/link";
import { useState } from "react";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Aquí manejamos la lógica de envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "username") {
            setUsername(value);
        } else if (name === "password") {
            setPassword(value);
        }
    }

return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-lg">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
                Iniciar Sesión
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
                Ingresa tus credenciales para acceder a tu cuenta
            </p>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {/* Campo Usuario */}
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Usuario
                    </label>
                    <div className="mt-1">
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            required
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-gray-100"
                            placeholder="tu_usuario"
                            value={username}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                {/* Campo Contraseña */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Contraseña
                    </label>
                    <div className="mt-1">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-gray-100"
                            placeholder="*******"
                            value={password}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                {/* Botón Iniciar Sesión */}
                <div>
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                        Iniciar Sesión
                    </button>
                </div>
            </form>
            {/* Enlace a Registro */}
            <div className="text-sm text-center">
                <Link href="/auth/register" className="font-medium text-purple-600 hover:text-purple-500">
                    ¿No tienes cuenta? <span className="underline">Regístrate</span>
                </Link>
            </div>
        </div>
    </div>
);
}