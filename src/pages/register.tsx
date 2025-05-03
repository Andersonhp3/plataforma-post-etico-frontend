import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';

export default function RegisterPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [especialidade, setEspecialidade] = useState('psicologia');
    const [erro, setErro] = useState('');

    useEffect(() => {
        if (status === 'authenticated') {
          router.push('/dashboard');
        }
      }, [status, router]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');

        try {
            await axios.post('http://localhost:3000/api/v1/auth/registrar', {
                nome,
                email,
                senha,
                especialidade,
            });

            router.push('/login');
        } catch (err) {
            setErro('Erro ao registrar. Verifique os dados.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <form onSubmit={handleRegister} className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-semibold mb-4 text-center">Cadastro no PostSaúde</h2>

                <button
                    className="w-full flex items-center justify-center gap-2 mb-4 py-2 px-4 border border-gray-300 rounded-md 
             hover:bg-gray-50 hover:shadow-sm hover:border-gray-400 
             transition-all duration-200 ease-in-out
             active:bg-gray-100 active:scale-95"
                    onClick={() => signIn('google', { callbackUrl: 'http://localhost:5000/dashboard' })}
                >
                    <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
                    <span className="text-gray-700 hover:text-gray-900">Continuar com Google</span>
                </button>

                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-gray-500">ou</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {erro && <p className="text-red-500 text-sm mb-3">{erro}</p>}

                <label className="block mb-1 text-sm">Nome</label>
                <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                    required
                />

                <label className="block mb-1 text-sm">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                    required
                />

                <label className="block mb-1 text-sm">Senha</label>
                <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                    required
                />

                <label className="block mb-1 text-sm">Especialidade</label>
                <select
                    value={especialidade}
                    onChange={(e) => setEspecialidade(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                >
                    <option value="psicologia">Psicologia</option>
                    <option value="odontologia">Odontologia</option>
                    <option value="nutricao">Nutrição</option>
                </select>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4"
                >
                    Criar Conta
                </button>

                <div className="text-center text-sm">
                    <span>Já tem conta? </span>
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Faça login
                    </Link>
                </div>
            </form>
        </div>
    );
}