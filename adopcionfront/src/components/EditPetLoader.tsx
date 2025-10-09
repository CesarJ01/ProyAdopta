'use client';

import { useState, useEffect } from 'react';
import { fetchPetById, Pet } from '@/libs/fetcher';
import PetForm from './PetForm';

interface EditPetLoaderProps {
  id: number;
}

export default function EditPetLoader({ id }: EditPetLoaderProps) {
  const [petData, setPetData] = useState<Pet | undefined>(undefined);

  useEffect(() => {
    if (isNaN(id)) {
        console.error("ID de mascota inválido.");
        return;
    }

    const loadData = async () => {
      try {
        const data = await fetchPetById(id);
        setPetData(data); 
      } catch (err) {
        console.error(`Fallo al cargar la mascota con ID ${id}:`, err);
      }
    };
    loadData();
  }, [id]);

  if (!petData) {
    return <div className="text-center py-20 text-gray-500">Cargando formulario de edición...</div>;
  }
  
  return (
    <div className="py-8">
      <PetForm initialData={petData} />
    </div>
  );
}