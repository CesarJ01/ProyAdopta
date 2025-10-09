"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Pet, fetchAllPets, deletePet } from "@/libs/fetcher";

export default function Dashboard() {
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    const loadPets = async () => {
      try {
        const data = await fetchAllPets();
        setPets(data);
      } catch (err) {
        console.log(err);
      }
    };
    loadPets();
  }, []);

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta mascota?")) {
      deletePet(id)
        .then(() => {
          setPets((prevPets) => prevPets.filter((pet) => pet.id !== id));
            // Podemos filtrar el eliminado del arreglo pets o podemos recargar la página
            // window.location.reload();
        })
        .catch((err) => {
          console.error("Error al eliminar la mascota:", err);
          alert("No se pudo eliminar la mascota. Inténtalo de nuevo.");
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Encabezado del Dashboard */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de Mascotas
          </h1>
          {/* Botón para Añadir Nueva Mascota (Morado) */}
          <Link href="/dashboard/new">
            <button className="px-6 py-2 text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              + Añadir Mascota
            </button>
          </Link>
        </div>

        {/* Tabla de Listado CRUD */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Cabecera de la Tabla */}
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nombre
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Especie / Raza
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>

            {/* Cuerpo de la Tabla */}
            <tbody className="bg-white divide-y divide-gray-200">
              {pets.map((pet) => (
                <tr
                  key={pet.id}
                  className="hover:bg-purple-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {pet.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pet.especie} / {pet.raza || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Badge de Estado */}
                    <span
                      className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          pet.estadoPublicacion
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {pet.estadoPublicacion ? "Publicado" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {/* Botón Editar */}
                    <Link href={`/dashboard/edit/${pet.id}`} passHref>
                      <button className="text-purple-600 hover:text-purple-900 border border-purple-300 px-3 py-1 rounded-md text-xs transition-colors">
                        Editar
                      </button>
                    </Link>
                    {/* Botón Eliminar */}
                    <button
                      onClick={() => handleDelete(pet.id)}
                      className="text-red-600 hover:text-red-900 border border-red-300 px-3 py-1 rounded-md text-xs transition-colors"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Si no hay mascotas */}
        {pets.length === 0 && (
          <div className="p-10 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg bg-white">
            Aún no hay mascotas registradas para administrar. ¡Añade la primera!
          </div>
        )}
      </div>
    </div>
  );
}
