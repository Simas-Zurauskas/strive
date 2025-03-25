import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import UserModel, { User } from '@/lib/mongo/models/UserModel';
import _ from 'lodash';
import mongoDb from '@/lib/mongo/db';
import CreditModel from '@/lib/mongo/models/CreditModel';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.user = user;
      }
      return token;
    },
    async session({ session }) {
      try {
        await mongoDb();
        const dbOperation = async () => {
          let user: User | null = await UserModel.findOne({
            email: session.user.email,
          }).lean();
          if (!user) {
            user = await UserModel.create({
              email: session.user.email,
              name: session.user.name,
              image: session.user.image,
            });

            await CreditModel.create({
              email: session.user.email,
            });
          }

          return {
            ...session.user,
            ..._.pick(user, ['_id', 'name', 'email', 'image']),
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

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};
