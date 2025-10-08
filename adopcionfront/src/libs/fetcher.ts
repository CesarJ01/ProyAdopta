const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Pet {
  id: number;
  nombre: string;
  especie: string;
  raza: string | null;
  edad: string | null;
  descripcion: string | null;
  fotoAnimal: string | null;
  createdAt: string;
}

export async function fetchMascotas(): Promise<Pet[]> {
  const res = await fetch(`${API_URL}/pets`);

  if (!res.ok) {
    throw new Error("Error fetching pets");
  }

  return res.json() as Promise<Pet[]>;
}
