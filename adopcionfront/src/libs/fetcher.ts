const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Definición de tipos
export interface Pet {
  id: number;
  nombre: string;
  descripcion: string | null;
  edad: number | null;
  especie: string;
  raza: string | null;
  estadoPublicacion: boolean;
  fotoAnimal: string | null;
  createdAt: Date;
}

// Función GET para obtener solo las mascotas publicadas para la HomePage
export async function fetchPublishedPets(): Promise<Pet[]> {
  const res = await fetch(`${API_URL}/pets`);

  if (!res.ok) {
    throw new Error(`Error fetching pets: ${res.status}`);
  }

  return res.json() as Promise<Pet[]>;
}

// Función GET para obtener todas las mascotas para el Dashboard (incluye no publicadas)
export async function fetchAllPets(): Promise<Pet[]> {
  const res = await fetch(`${API_URL}/pets?all=true`);

  if (!res.ok) {
    throw new Error("Error fetching pets");
  }

  return res.json() as Promise<Pet[]>;
}

// Función GET para obtener una mascota por ID
export async function fetchPetById(id: number): Promise<Pet> {
  const res = await fetch(`${API_URL}/pets/${id}`);
  if (!res.ok) {
    throw new Error(`Error fetching pet with ID ${id}`);
  }
  return res.json() as Promise<Pet>;
}

type PetData = Omit<Pet, "id" | "createdAt">; // Datos para enviar, sin ID ni createdAt

// Función POST para crear una nueva mascota
export async function createPet(data: PetData): Promise<Pet> {
  const res = await fetch(`${API_URL}/pets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error creating pet");
  }

  return res.json() as Promise<Pet>;
}

// Función PUT para actualizar una mascota
export async function updatePet(id: number, data: Partial<PetData>): Promise<Pet> {
  const res = await fetch(`${API_URL}/pets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Error updating pet with ID ${id}`);
  }

  return res.json() as Promise<Pet>;
}

// Función DELETE para eliminar una mascota
export async function deletePet(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/pets/${id}`, {
    method: "DELETE",
  });

  if (!res.ok && res.status !== 204) {
    throw new Error(`Error deleting pet with ID ${id}`);
  }

  return;
}