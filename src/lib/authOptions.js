import CredentialsProvider from 'next-auth/providers/credentials'
import { dbConnect } from '@/lib/dbConnect'
import User from '@/models/user'
import bcrypt from 'bcryptjs'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        try {
          await dbConnect()

          // Find user by email
          const user = await User.findOne({ email: credentials.email })
          if (!user) return null

          // Check password
          const isMatch = await bcrypt.compare(credentials.password, user.password)
          if (!isMatch) return null

          // Return user object
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          }

        } catch (error) {
          console.log('Auth error:', error)
          return null
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
      }
      return session
    }
  },

  pages: {
    signIn: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
}