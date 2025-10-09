"use client";

import { useState, useEffect } from "react";
import { Pet, fetchPublishedPets } from "@/libs/fetcher";

export default function PetListing() {
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    const loadPets = async () => {
      try {
        const data = await fetchPublishedPets();
        setPets(data);
      } catch (err) {
        console.error("Error al obtener las mascotas:", err);
      }
    };
    loadPets();
  }, []);

  // La lista de mascotas para mostrar es simplemente el estado 'pets'
  const petsToDisplay = pets;

  if (petsToDisplay.length === 0) {
    return (
      <div className="text-center py-20 text-lg text-gray-600">
        ¡Vaya! No hay mascotas disponibles para adoptar.
      </div>
    );
  }

  return (
    <section id="pets-section" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-extrabold text-gray-900">
            Mascotas Disponibles
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Conoce a nuestros amigos sin hogar.
          </p>
        </div>

        {/* Listado de Tarjetas */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {petsToDisplay.map((pet) => (
            <div
              key={pet.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-xl"
            >
              {/* CardHeader con la Imagen */}
              <div className="h-64 overflow-hidden">
                <img
                  src={pet.fotoAnimal || "https://ih1.redbubble.net/image.5375387998.4989/flat,750x,075,f-pad,750x1000,f8f8f8.u1.jpg"}  //! MODIFICAR EL PLACEHOLDER X SI NO SE INGRESA IMAGEN
                  alt={pet.nombre}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* CardContent con la Información */}
              <div className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {pet.nombre.toUpperCase()}{" "}
                    {pet.edad ? `- ${pet.edad} años` : ""}
                  </h3>

                  <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                    {pet.especie}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-4 text-sm font-medium text-gray-500">
                  <span>{`Raza: ${pet.raza || "Desconocida"}`}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(pet.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-gray-700 text-sm">{pet.descripcion}</p>
              </div>

              {/* CardFooter con el Botón */}
              <div className="p-6 pt-0">
                <button className="w-full py-2 px-4 text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                  Adoptar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
