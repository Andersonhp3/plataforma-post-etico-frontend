import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import axios, { AxiosError } from 'axios';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
    
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const response = await axios.post('http://localhost:3000/api/v1/auth/login', {
            email: credentials?.email,
            senha: credentials?.password
          });

          if (response.data?.token) {
            return {
              id: response.data.user?.id || '',
              email: response.data.user?.email || credentials?.email || '',
              name: response.data.user?.name || credentials?.email.split('@')[0] || 'User',
              token: response.data.token
            };
          }
          return null;
        } catch (error) {
          const axiosError = error as AxiosError;
          console.error('Erro na autenticação:', {
            status: axiosError.response?.status,
            data: axiosError.response?.data,
            message: axiosError.message
          });
          return null;
        }
      }
    })
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.id = user.id;
      }
      return token;
    },
    
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.id = token.id;
      return session;
    },
    
    
  },
  
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/login',
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
});