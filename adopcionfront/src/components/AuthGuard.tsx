"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Ruta que necesitan auth
const PROTECTED_ROUTES = ["/dashboard"];
// Rutas que no necesitan auth
const PUBLIC_ROUTES = ["/auth/login", "/auth/register"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isLoggedIn, token } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
        const isPublicAuthRoute = PUBLIC_ROUTES.includes(pathname);

        // Redirigir si no hay auth y la ruta es protegida
        if (isProtected && !isLoggedIn && token === null) {
            router.push("/auth/login");
            setIsChecking(false);
            return;
        }
        // Redirigir si hay auth y la ruta es pública de autenticación
        if (isPublicAuthRoute && isLoggedIn) {
            router.push("/dashboard");
            setIsChecking(false);
            return;
        }
        // Para rutas públicas
        setIsChecking(false);

    }, [isLoggedIn, pathname, router, token]);

    if (isChecking) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <p className="text-xl font-medium text-purple-600">Cargando...</p>
            </div>
        );
    }

    return <>{children}</>;
}
