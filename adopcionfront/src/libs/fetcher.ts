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
export async function fetchAllPets(token: string): Promise<Pet[]> {
  const res = await fetch(`${API_URL}/pets/user`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`, 
        },
    });

  if (!res.ok) {
    throw new Error("Error fetching pets");
  }

  return res.json() as Promise<Pet[]>;
}

// Función GET para obtener una mascota por ID
export async function fetchPetById(id: number): Promise<Pet> {
  const token = localStorage.getItem("jwt_token");
  const res = await fetch(`${API_URL}/pets/${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Error fetching pet with ID ${id}`);
  }
  return res.json() as Promise<Pet>;
}
 
type PetData = Omit<Pet, "id" | "createdAt">; // Datos para enviar, sin ID ni createdAt

// Función POST para crear una nueva mascota
export async function createPet(data: PetData): Promise<Pet> {
  const token = localStorage.getItem("jwt_token");
  const res = await fetch(`${API_URL}/pets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error creating pet");
  }

  return res.json() as Promise<Pet>;
}

// Función PUT para actualizar una mascota
export async function updatePet(
  id: number,
  data: Partial<PetData>
): Promise<Pet> {
  const token = localStorage.getItem("jwt_token");
  const res = await fetch(`${API_URL}/pets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
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
  const token = localStorage.getItem("jwt_token");
  const res = await fetch(`${API_URL}/pets/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    throw new Error(`Error deleting pet with ID ${id}`);
  }

  return;
}

// Función de Login
export async function login(
  username: string,
  password: string
): Promise<{ token: string }> {
  
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  let data;
    try {
        data = await res.json();
    } catch (e) {
        throw new Error(`Fallo en el login (Status: ${res.status}). La respuesta no es JSON.`);
    }

    if (!res.ok) {

        throw new Error(data.error || `Error desconocido en el login. Status: ${res.status}`);
    }
    
    // Si res.ok es true, devuelve la data (que contiene el token)
    return data as { token: string };
}

// Función de Registro
export async function register(
  username: string,
  password: string
): Promise<{ token: string }> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  let data;
    try {
        data = await res.json();
    } catch (e) {
        throw new Error(`Fallo en el registro (Status: ${res.status}). La respuesta no es JSON.`);
    }

    if (!res.ok) {
        // Si el estado es 4xx/5xx (ej: 409 Conflict), lanza el error con el mensaje del servidor
        throw new Error(data.error || `Error desconocido en el registro. Status: ${res.status}`);
    }
    
    // Si res.ok es true, devuelve la data (que contiene el token)
    return data as { token: string };
}
