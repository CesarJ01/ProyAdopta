"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { login as apiLogin, register as apiRegister } from '@/libs/fetcher';

// Tipo para el payload del token (solo el ID, para simplificar)
interface AuthUser {
    userId: number;
}
// Tipo para las props del proveedor
interface AuthProviderProps {
    children: ReactNode;
}
// Interfaz para el Contexto (lo que se comparte)
export interface AuthContextType {
    token: string | null;
    user: AuthUser | null;
    isLoggedIn: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);
    const router = useRouter();

    // Se decodifica el token para obtener el userId sin jwt-decode
    const decodeToken = (jwtToken: string): AuthUser => {
        try {
            const payload = jwtToken.split('.')[1];
            const decoded = JSON.parse(atob(payload)); // atob para base64
            return { userId: decoded.userId };
        } catch (e) {
            console.error("Fallo al decodificar el token:", e);
            return { userId: 0 }; 
        }
    };

    // Se carga el token del localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('jwt_token');
        if (storedToken) {
            setToken(storedToken);
            setUser(decodeToken(storedToken));
        }
    }, []);

    // Función de Registro
    const register = async (username: string, password: string) => {
        await apiRegister(username, password); 

        // Opcional para iniciar sesión después de registrar
        // await login(username, password);
    };
    
    // Función de Login
    const login = async (username: string, password: string) => {
        const { token } = await apiLogin(username, password);
        
        localStorage.setItem('jwt_token', token);
        setToken(token);
        setUser(decodeToken(token));
        //router.push('/dashboard');
    };

    // Función de Logout
    const logout = () => {
        localStorage.removeItem('jwt_token');
        setToken(null);
        setUser(null);
        router.push('/');
    };

    const value = {
        token,
        user,
        isLoggedIn: !!token, // True si hay token, False si es null
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};