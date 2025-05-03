import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';

export default function PaginaLogin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  // Redireciona se já estiver autenticado
  useEffect(() => {
    if (status === 'authenticated') {
      // Corrige redirecionamentos malformados
      const url = new URL(
        router.query.callbackUrl?.toString() || '/dashboard',
        window.location.origin
      )
      router.push(url.pathname)
    }
  }, [status, router])

  const fazerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password: senha, // Note que agora usamos 'password' em vez de 'senha'
    });

    if (result?.error) {
      setErro('E-mail ou senha incorretos');
    } else {
      router.push('/dashboard');
    }
  };


  if (status === 'loading' || status === 'authenticated') {
    return <div>Carregando...</div>; // Ou um spinner de carregamento
  }

  // Restante do seu código de renderização...
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center">Entrar no PostSaúde</h2>

        <button
          onClick={() => {
            const callbackUrl = `${window.location.origin}/dashboard`;
            signIn('google', { callbackUrl });
          }}
          className="w-full flex items-center justify-center gap-2 mb-4 py-2 px-4 
  border border-gray-300 rounded-md bg-white
  hover:bg-gray-50 hover:shadow-sm hover:border-gray-400
  active:bg-gray-100 active:scale-95
  transition-all duration-200 ease-in-out"
        >
          <Image
            src="/google-icon.svg"
            alt="Google"
            width={20}
            height={20}
          />
          <span className="text-gray-700">
            Continuar com Google
          </span>
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">ou</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {erro && <p className="text-red-500 text-sm mb-3">{erro}</p>}

        <form onSubmit={fazerLogin}>
          <label className="block mb-2 text-sm font-medium">E-MAIL</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            required
          />

          <label className="block mb-2 text-sm font-medium">SENHA</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4"
          >
            Entrar
          </button>
        </form>

        <div className="text-center space-y-3 text-sm">
          <a href="#" className="text-blue-600 hover:underline block">Redefinir senha</a>
          <div className="text-gray-500">
            Não tem conta? <a href="/register" className="text-blue-600 hover:underline">Crie uma</a>
          </div>
        </div>
      </div>
    </div>
  );
}   