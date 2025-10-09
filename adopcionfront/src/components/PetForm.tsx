"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Pet, createPet, updatePet } from '@/libs/fetcher';

interface PetFormProps {
  initialData?: Pet; // Opcional para crear, requerido para editar
}

// Básicamente Omite id y createdAt para el formulario
const defaultInitialData: Omit<Pet, 'id' | 'createdAt'> = {
    nombre: '',
    especie: 'Perro', // Valor por defecto
    raza: '',
    edad: null,
    descripcion: '',
    fotoAnimal: '', 
    estadoPublicacion: true,
};

export default function PetForm({ initialData }: PetFormProps) {
  const isEditing = !!initialData; // Lo transforma a booleano para saber si es edición
  const router = useRouter();

  // Inicializa el estado con los datos pasados o con los valores por defecto
  const [formData, setFormData] = useState<Omit<Pet, 'id' | 'createdAt'>>(
    initialData || defaultInitialData
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'edad') {
        // Edad debe ser un número o null 
        setFormData(prev => ({ ...prev, [name]: value ? parseInt(value) : null }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing) {
        // MODO EDICION (PUT)
        if (initialData) {
            await updatePet(initialData.id, formData);
        }
      } else {
        // MODO CREACIÓN (POST)
        await createPet(formData);
        setFormData(defaultInitialData); 
      }
      router.push('/dashboard');

    } catch (err) {
      console.error("Error al enviar el formulario:", err);
      alert('Ocurrió un error. Revisa la consola para más detalles.');
      
    }
  };

  const title = isEditing ? `Editar a ${initialData?.nombre}` : 'Añadir Nueva Mascota';

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 p-8">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-xl">
        
        <h2 className="text-3xl font-bold text-gray-900 text-center">{title}</h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          
          {/* Nombre */}
          <div className="col-span-2">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              value={formData.nombre}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          {/* Especie y Raza */}
          <div>
            <label htmlFor="especie" className="block text-sm font-medium text-gray-700">Especie</label>
            <select
              id="especie"
              name="especie"
              value={formData.especie}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            >
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Otros">Otros</option>
            </select>
          </div>
          <div>
            <label htmlFor="raza" className="block text-sm font-medium text-gray-700">Raza</label>
            <input
              id="raza"
              name="raza"
              type="text"
              value={formData.raza || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          {/* Edad y Foto/URL */}
          <div>
            <label htmlFor="edad" className="block text-sm font-medium text-gray-700">Edad (Años)</label>
            <input
              id="edad"
              name="edad"
              type="number"
              min="0"
              value={formData.edad || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label htmlFor="fotoAnimal" className="block text-sm font-medium text-gray-700">URL de la Foto</label>
            <input
              id="fotoAnimal"
              name="fotoAnimal"
              type="url"
              value={formData.fotoAnimal || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
              placeholder="/img/mascota-ejemplo.jpg"
            />
          </div>

          {/* Descripción */}
          <div className="col-span-2">
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows={3}
              value={formData.descripcion || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          
          {/* Checkbox de Publicación */}
          <div className="col-span-2 flex items-center">
            <input
              id="estadoPublicacion"
              name="estadoPublicacion"
              type="checkbox"
              checked={formData.estadoPublicacion}
              onChange={handleChange}
              className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="estadoPublicacion" className="ml-2 block text-sm text-gray-900">
              Marcar como **Publicado** (Visible en el sitio)
            </label>
          </div>
          
          {/* Botón de Envío */}
          <div className="col-span-2 pt-4">
            <button
              type="submit"
              className="w-full py-3 px-4 text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {isEditing ? 'Guardar Cambios' : 'Crear Mascota'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}