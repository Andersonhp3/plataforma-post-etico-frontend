import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Limpar tokens locais se existirem
      localStorage.removeItem('token');
      sessionStorage.removeItem('authToken');
      
      // 2. Fazer logout via NextAuth
      await signOut({ redirect: false });
      
      // 3. Redirecionar para login com limpeza de estado
      router.push({
        pathname: '/login',
        query: { logout: 'success' }, // Opcional: para mostrar mensagem
      });
      
    } catch (error) {
      console.error('Erro durante logout:', error);
      // Redirecionar mesmo em caso de erro
      router.push('/login');
    }
  };

  return (
    <nav className="bg-white shadow-sm w-full border-0">
      <div className="w-full">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center pl-4">
            <Link href="/dashboard" className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Image
                  src="/logo.svg"
                  alt="PostSaúde Logo"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-800 hidden sm:block">
                PostSaúde
              </span>
            </Link>
          </div>

          <div className="flex items-center pr-4">
            {session?.user && (
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-700">
                    {session.user.name}
                  </p>
                </div>
                
                <div className="relative">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="User profile"
                      width={40}
                      height={40}
                      className="rounded-full"
                      unoptimized={true}
                    />
                  ) : (
                    <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}