import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn:  '/giris',
    signOut: '/giris',
    error:   '/giris',
  },
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: 'credentials',
      credentials: {
        identifier: { label: 'E-posta veya Kullanıcı Adı', type: 'text' },
        password:   { label: 'Şifre', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null

        const isEmail = credentials.identifier.includes('@')
        const user = await prisma.user.findFirst({
          where: isEmail
            ? { email: credentials.identifier }
            : { username: credentials.identifier.replace('@', '') },
        })

        if (!user || !user.password) return null

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null

        if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
          throw new Error('Hesabınız askıya alınmıştır.')
        }

        return {
          id:       user.id,
          email:    user.email,
          name:     user.name,
          username: user.username,
          role:     user.role,
          verified: user.verified,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id       = user.id
        token.username = (user as any).username
        token.role     = (user as any).role
        token.verified = (user as any).verified
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id       = token.id as string
        session.user.username = token.username as string
        session.user.role     = token.role as string
        session.user.verified = token.verified as boolean
      }
      return session
    },
  },
}
