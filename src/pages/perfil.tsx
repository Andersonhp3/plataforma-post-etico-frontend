import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';

interface PerfilData {
  id: number;
  name: string;
  email: string;
  specialty?: string;
  createdAt?: string;
}

export default function Perfil() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPerfil() {
      try {
        // Faz request para a rota API do Next.js, enviando cookies de sessão
        const res = await fetch('/api/perfil', {
          credentials: 'include'
        });
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.message || `Erro ao buscar perfil (${res.status})`);
        }
        const data: PerfilData = await res.json();
        setPerfil(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPerfil();
  }, []);

  const handleLogout = async () => {
    // Chama signout do NextAuth (ou sua rota de logout)
    await fetch('/api/auth/signout', { method: 'POST', credentials: 'include' });
    router.push('/login');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="max-w-4xl mx-auto p-6">
          <p>Carregando...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Perfil</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Sair
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}

        {!error && perfil && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm text-gray-500">Nome completo</h2>
              <p className="text-lg font-medium">{perfil.name}</p>
            </div>
            <div>
              <h2 className="text-sm text-gray-500">Email</h2>
              <p className="text-lg font-medium">{perfil.email}</p>
            </div>
            <div>
              <h2 className="text-sm text-gray-500">Especialidade</h2>
              <p className="text-lg font-medium">
                {perfil.specialty || 'Não definida'}
              </p>
            </div>
            <div>
              <h2 className="text-sm text-gray-500">Data de cadastro</h2>
              <p className="text-lg font-medium">
                {perfil.createdAt
                  ? new Date(perfil.createdAt).toLocaleDateString()
                  : 'Não disponível'}
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => router.push('/perfil/editar')}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Editar Perfil
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
