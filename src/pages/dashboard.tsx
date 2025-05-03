import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Navbar from '../components/Navbar';

type Post = {
  id: number;
  especialidade: string;
  tipo: string;
  texto: string;
  violacoes: string[];
  criado_em?: string;
};

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [especialidade, setEspecialidade] = useState('psicologia');
  const [tipo, setTipo] = useState('dicas');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  // Redireciona se não autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const gerarPost = async () => {
    setLoading(true);
    try {
      await axios.post(
        'http://localhost:3000/api/v1/posts',
        { especialidade, tipo },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            'X-User-Email': session?.user?.email || '',
          },
        }
      ).then((res) => {
        setPosts((prev) => [res.data, ...prev]);
      });
    } catch (err) {
      alert('Erro ao gerar post');
    }
    setLoading(false);
  };

  const carregarPosts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/v1/posts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          'X-User-Email': session?.user?.email || '',
        },
      });
      setPosts(res.data);
    } catch (err) {
      alert('Erro ao carregar posts');
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      carregarPosts();
    }
  }, [status]);

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <p>Verificando sessão...</p>
    </div>;
  }

  return (

    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      {/* Conteúdo principal agora pode ter suas próprias margens */}
      <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="min-h-screen bg-gray-100 px-4 py-8">
      
      

      {/* Área de geração */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Criar novo post</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Especialidade</label>
            <select
              value={especialidade}
              onChange={(e) => setEspecialidade(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="psicologia">Psicologia</option>
              <option value="odontologia">Odontologia</option>
              <option value="nutricao">Nutrição</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Tipo</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="dicas">Dicas</option>
              <option value="informativo">Informativo</option>
            </select>
          </div>
        </div>

        <button
          onClick={gerarPost}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Gerando...' : 'Gerar Post'}
        </button>
      </div>

      {/* Lista de posts */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Seus posts recentes</h2>

        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhum post ainda. Crie o primeiro acima!</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-gray-700 capitalize">{post.especialidade}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {post.tipo}
                  </span>
                </div>
                
                <p className="text-gray-800 whitespace-pre-line mb-3">{post.texto}</p>
                
                {post.violacoes.length > 0 ? (
                  <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
                    ⚠️ Violação ética: {post.violacoes.join(', ')}
                  </div>
                ) : (
                  <div className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded">
                    ✅ Sem violações éticas
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
      </main>
    </div>
    
  );
}