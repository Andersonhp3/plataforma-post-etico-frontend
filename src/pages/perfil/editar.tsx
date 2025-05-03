import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';

interface PerfilData {
  name: string;
  specialty?: string;
}

export default function EditarPerfil() {
  const router = useRouter();
  // Defina a URL base da API (pode vir de variável de ambiente)
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const [formData, setFormData] = useState<PerfilData>({ name: '', specialty: '' });
  const [error, setError] = useState<string>('');

  // Carrega dados atuais do perfil
  useEffect(() => {
    async function fetchPerfil() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API}/api/v1/perfil`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          throw new Error(`Erro ao carregar dados do perfil (${res.status})`);
        }
        const data = await res.json();
        setFormData({ name: data.name || '', specialty: data.specialty || '' });
      } catch (err: any) {
        setError(err.message);
      }
    }
    fetchPerfil();
  }, [API]);

  // Envia atualização do perfil
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/v1/perfil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error(`Falha ao atualizar perfil (${res.status})`);
      }
      router.push('/perfil');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-6">Editar Perfil</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome completo
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
              Especialidade (opcional)
            </label>
            <input
              type="text"
              id="specialty"
              value={formData.specialty}
              onChange={e => setFormData({ ...formData, specialty: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/perfil')}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
