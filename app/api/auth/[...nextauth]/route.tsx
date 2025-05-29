//this file is for initializing next-auth

import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/prisma/client";
import bcrypt from 'bcrypt';


//use the authOptions using getServerSession() function to grab session data to server components
//and also apis (route.tsx) in order not to use hooks
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password", placeholder: "Password"}
      },
      async authorize(credentials, req) {
        if(!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({where: {email: credentials.email}})
        if(!user) return null
        const passwordsMatch = await bcrypt.compare(credentials.password, user.hashedPassword!);

        return passwordsMatch ? user : null;
      }
      
    }),
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
        token.role = dbUser?.role || "user";
        token.id = dbUser?.id; // Add user ID to token
      }
      return token;
    },
    async session({ session, token }) {
      session.user!.role = token.role as string;
      session.user!.id = token.id as string; // Add user ID to session
      return session;
    }
  }  
}
//use useSession() hook for client components

const handler = NextAuth(authOptions)


export {handler as GET, handler as POST}