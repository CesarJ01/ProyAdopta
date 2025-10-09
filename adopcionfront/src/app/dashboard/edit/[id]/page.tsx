// src/app/dashboard/edit/[id]/page.tsx
// SIN 'use client'

import EditPetLoader from '@/components/EditPetLoader';

interface EditPetPageProps {
  params: {
    id: string; 
  };
}

export default async function EditPetPage({ params }: EditPetPageProps) {
  
  const resolvedParams = await params; // Politica de Next que params should be awaited
  
  const petIdString = resolvedParams.id;
  const petId = parseInt(petIdString);
  
  if (isNaN(petId)) {
    return <div className="text-center py-20 text-red-600">ID de mascota no válido.</div>;
  }
  
  return <EditPetLoader id={petId} />;
}