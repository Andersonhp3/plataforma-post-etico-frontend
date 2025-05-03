import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';


export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      const url = new URL(window.location.href);
      if (url.searchParams.get('error') || url.searchParams.get('callbackUrl')) {
        window.location.replace('/dashboard');
      }
    }
  }, []);
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}