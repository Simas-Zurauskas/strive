import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import UserModel, { User } from '@/lib/mongo/models/UserModel';
import _ from 'lodash';
import mongoDb from '@/lib/mongo/db';
import CreditModel from '@/lib/mongo/models/CreditModel';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        await mongoDb();

        const user = await UserModel.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.user = user;

        // Track OAuth provider in the token
        if (account.provider === 'google') {
          token.provider = 'google';
        }
      }
      return token;
    },
    async session({ session, token }) {
      try {
        await mongoDb();
        const dbOperation = async () => {
          let user: User | null = await UserModel.findOne({
            email: session.user.email,
          }).lean();

          if (!user) {
            // New user from OAuth providers only (not credentials signup)
            user = await UserModel.create({
              email: session.user.email,
              name: session.user.name,
              image: session.user.image,
              emailVerified: true, // Always verified for OAuth
            });

            // Check if credit already exists before creating
            const existingCredit = await CreditModel.findOne({ email: session.user.email });
            if (!existingCredit) {
              await CreditModel.create({
                email: session.user.email,
              });
            }
          } else if (user && !user.emailVerified && token.provider === 'google') {
            // Only auto-verify for Google OAuth logins, not just any Gmail account
            await UserModel.updateOne({ _id: user._id }, { $set: { emailVerified: true } });
            user.emailVerified = true;
          }

          return {
            ...session.user,
            ..._.pick(user, ['_id', 'name', 'email', 'image', 'emailVerified']),
            id: user._id.toString(),
          };
        };

        session.user = await dbOperation();
      } catch (dbError) {
        console.error('Database operation failed or timed out:', dbError);
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth',
    error: '/auth',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};
