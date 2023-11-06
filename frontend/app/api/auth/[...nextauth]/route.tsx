// pages/api/auth/[...nextauth].js

import NextAuth from 'next-auth';
import { PrismaClient } from '@prisma/client'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

const handler = NextAuth({
    secret : "Hello",
    
    pages:{
      signIn:"signin"
    },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials:any) {
        if(credentials.password==null) return null
        const res = await fetch("http://localhost:3001/auth/login", {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' },
        })

        const user = await res.json()
        if (user && res.ok) {
          return user;
        } 
        // If credentials are invalid, throw an error
        throw new Error("Invalid username or password");
      
      }
    }),
    GoogleProvider({
      clientId: "205061424218-08uogm1rqah0jsn9ulmbaqr3iskh7q4g.apps.googleusercontent.com",
      clientSecret: "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",
      
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log(profile,"acc");
      
        if (account.provider === 'google') {
          const { email, name, picture } = profile;
          let dbUser = await prisma.users.findUnique({ where: { email } });
          if (!dbUser) {
            dbUser = await prisma.users.create({
              data: {
                email,
                name,
                image:picture,
                provider: account.provider,
              },
            });
          }
          return true;
        }
        return true;
      },
      async jwt( {token, user, account, profile}) {
    
        if (user) {
          token.email = user.email
          };
        
        return token;
      },
     
    async session({session, token}) {
      session.user.email = token.email;
      session.user.id = token.id as number
      
      return session
    },
  },
//   database : "postgresql://postgres:1234@localhost:5432/multitenant"
})

export {handler as POST,handler as GET}
